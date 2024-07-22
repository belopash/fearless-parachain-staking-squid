import assert from 'assert'
import {SubstrateBatchProcessor, assertNotNull} from '@subsquid/substrate-processor'
import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Candidate, Delegator, RoundData, processRounds} from '../../core/round'
import {StakingData, processStaking} from '../../core/staking'
import {ParachainStaking} from './api'
import config from './config'
import {BatchContext, DEFAULT_SELECTION} from '../fields'

const database = new TypeormDatabase()
const processor = new SubstrateBatchProcessor()
    .setGateway(config.gateway)
    .setRpcEndpoint(config.chain)
    .addEvent({name: ['ParachainStaking.NewRound']})
    .addEvent({name: ['ParachainStaking.Rewarded']})
    .addEvent({name: ['ParachainStaking.CollatorBondedLess']})
    .addEvent({name: ['ParachainStaking.CandidateBondedLess']})
    .addEvent({name: ['ParachainStaking.CollatorBondedMore']})
    .addEvent({name: ['ParachainStaking.CandidateBondedMore']})
    .addEvent({name: ['ParachainStaking.Nomination']})
    .addEvent({name: ['ParachainStaking.Delegation']})
    .addEvent({name: ['ParachainStaking.NominationIncreased']})
    .addEvent({name: ['ParachainStaking.DelegationIncreased']})
    .addEvent({name: ['ParachainStaking.NominationDecreased']})
    .addEvent({name: ['ParachainStaking.DelegationDecreased']})
    .addEvent({name: ['ParachainStaking.DelegationRevoked']})
    .addEvent({name: ['ParachainStaking.Compounded']})
    .addEvent({name: ['ParachainStaking.JoinedCollatorCandidates']})
    .setFields(DEFAULT_SELECTION)

processor.run(database, async (ctx) => {
    const roundsData = await getRoundsData(ctx)
    await processRounds(ctx, roundsData)

    const stakingData = await getStakingData(ctx)
    await processStaking(ctx, {
        stakingData,
        rewardPaymentDelay: ParachainStaking.constants.RewardPaymentDelay.get(ctx),
        startRoundIndex: await getStartRound(ctx),
    })
})

async function getRoundsData(ctx: BatchContext): Promise<RoundData[]> {
    const roundsData: RoundData[] = []

    for (const {header: block, events} of ctx.blocks) {
        for (const event of events) {
            if (event.name === 'ParachainStaking.NewRound') {
                const e = ParachainStaking.events.NewRound.decode(event)

                const candidateIds = await ParachainStaking.storage.SelectedCandidates.get(ctx, block)
                assert(candidateIds != null)

                const candidateStates = await ParachainStaking.storage.CandidateInfo.getMany(ctx, block, candidateIds)
                assert(candidateStates != null)

                const delegatorIds: string[] = []
                const selectedCandidates: Candidate[] = []
                for (let i = 0; i < candidateIds.length; i++) {
                    const id = candidateIds[i]
                    const state = assertNotNull(candidateStates[i])

                    delegatorIds.push(...state.topDelegations.map((d) => d.owner))
                    delegatorIds.push(...state.bottomDelegations.map((d) => d.owner))

                    selectedCandidates.push({
                        id,
                        state: {
                            bond: state.bond,
                            delegations: [
                                ...state.topDelegations.map((d) => ({
                                    owner: d.owner,
                                    amount: d.amount,
                                })),
                                ...state.bottomDelegations.map((d) => ({
                                    owner: d.owner,
                                    amount: d.amount,
                                })),
                            ],
                        },
                    })
                }

                const delegatorStates = await ParachainStaking.storage.DelegatorState.getMany(ctx, block, delegatorIds)
                assert(delegatorStates != null)

                const candidateDelegators: Delegator[] = []
                for (let i = 0; i < delegatorIds.length; i++) {
                    const id = delegatorIds[i]
                    const state = assertNotNull(delegatorStates[i])
                    candidateDelegators.push({
                        id,
                        state: {
                            total: state.total,
                            delegations: state.delegations.map((d) => ({
                                owner: d.owner,
                                amount: d.amount,
                            })),
                        },
                    })
                }

                const collatorComission = await ParachainStaking.storage.CollatorComission.get(ctx, block)
                assert(collatorComission != null)

                roundsData.push({
                    index: e.round,
                    timestamp: new Date(block.timestamp ?? 0),
                    startedAt: e.startingBlock,
                    collatorsCount: selectedCandidates.length,
                    total: e.totalBalance,
                    selectedCandidates,
                    candidateDelegators,
                    collatorComission,
                })
            }
        }
    }

    return roundsData
}

async function getStartRound(ctx: BatchContext) {
    const round = await ParachainStaking.storage.Round.get(ctx, ctx.blocks[0].header)
    assert(round != null)
    return round.current
}

async function getStakingData(ctx: BatchContext): Promise<StakingData[]> {
    const stakingData: StakingData[] = []

    for (const {header: block, events} of ctx.blocks) {
        for (const event of events) {
            switch (event.name) {
                case 'ParachainStaking.JoinedCollatorCandidates': {
                    const e = ParachainStaking.events.JoinedCollatorCandidates.decode(event)
                    stakingData.push({
                        __kind: 'Bond',
                        id: event.id,
                        timestamp: new Date(block.timestamp ?? 0),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: e.account,
                        newTotal: e.newTotal,
                        isUnstake: false,
                    })
                    break
                }
                case 'ParachainStaking.CollatorBondedLess':
                case 'ParachainStaking.CandidateBondedLess': {
                    const e = ParachainStaking.events.CandidateBondedLess.decode(event)
                    stakingData.push({
                        __kind: 'Bond',
                        id: event.id,
                        timestamp: new Date(block.timestamp ?? 0),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: e.account,
                        newTotal: e.newTotal,
                        isUnstake: true,
                    })
                    break
                }
                case 'ParachainStaking.CollatorBondedMore':
                case 'ParachainStaking.CandidateBondedMore': {
                    const e = ParachainStaking.events.CandidateBondedMore.decode(event)
                    stakingData.push({
                        __kind: 'Bond',
                        id: event.id,
                        timestamp: new Date(block.timestamp ?? 0),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: e.account,
                        newTotal: e.newTotal,
                        isUnstake: false,
                    })
                    break
                }
                case 'ParachainStaking.Nomination':
                case 'ParachainStaking.Delegation': {
                    const e = ParachainStaking.events.Delegation.decode(event)
                    stakingData.push({
                        __kind: 'Delegation',
                        id: event.id,
                        timestamp: new Date(block.timestamp ?? 0),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: e.account,
                        candidateId: e.candidate,
                        isUnstake: false,
                    })
                    break
                }
                case 'ParachainStaking.NominationDecreased':
                case 'ParachainStaking.DelegationDecreased': {
                    const e = ParachainStaking.events.DelegationDecreased.decode(event)
                    stakingData.push({
                        __kind: 'Delegation',
                        id: event.id,
                        timestamp: new Date(block.timestamp ?? 0),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: e.account,
                        candidateId: e.candidate,
                        isUnstake: true,
                    })
                    break
                }
                case 'ParachainStaking.NominationIncreased':
                case 'ParachainStaking.DelegationIncreased': {
                    const e = ParachainStaking.events.DelegationIncreased.decode(event)
                    stakingData.push({
                        __kind: 'Delegation',
                        id: event.id,
                        timestamp: new Date(block.timestamp ?? 0),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: e.account,
                        candidateId: e.candidate,
                        isUnstake: false,
                    })
                    break
                }
                case 'ParachainStaking.DelegationRevoked': {
                    const e = ParachainStaking.events.DelegationRevoked.decode(event)
                    stakingData.push({
                        __kind: 'Delegation',
                        id: event.id,
                        timestamp: new Date(block.timestamp ?? 0),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: e.account,
                        candidateId: e.candidate,
                        isUnstake: true,
                    })
                    break
                }
                case 'ParachainStaking.Rewarded': {
                    const e = ParachainStaking.events.Rewarded.decode(event)
                    stakingData.push({
                        __kind: 'Reward',
                        id: event.id,
                        timestamp: new Date(block.timestamp ?? 0),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: e.account,
                    })
                    break
                }
                case 'ParachainStaking.Compounded': {
                    const e = ParachainStaking.events.Compounded.decode(event)
                    stakingData.push({
                        __kind: 'Compound',
                        id: event.id,
                        timestamp: new Date(block.timestamp ?? 0),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: e.account,
                    })
                    break
                }
            }
        }
    }

    return stakingData
}

