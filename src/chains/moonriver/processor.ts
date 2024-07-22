import assert from 'assert'
import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor, assertNotNull} from '@subsquid/substrate-processor'
import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Candidate, Delegator, RoundData, processRounds} from '../../core/round'
import {StakingData, processStaking} from '../../core/staking'
import {encodeAddress, ParachainStaking} from './api'
import config from './config'
import {DEFAULT_SELECTION} from '../fields'

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

type Item = BatchProcessorItem<typeof processor>

async function getRoundsData(ctx: BatchContext<unknown, Item>): Promise<RoundData[]> {
    const roundsData: RoundData[] = []

    for (const {header: block, items} of ctx.blocks) {
        for (const item of items) {
            if (item.kind !== 'event') continue

            if (item.name === 'ParachainStaking.NewRound') {
                const e = ParachainStaking.events.NewRound.decode(ctx, item.event)

                const candidateIds = await ParachainStaking.storage.SelectedCandidates.get(ctx, block)
                assert(candidateIds != null)

                const candidateStates = await ParachainStaking.storage.CandidateInfo.getMany(ctx, block, candidateIds)
                assert(candidateStates != null)

                const delegatorIds: Uint8Array[] = []
                const selectedCandidates: Candidate[] = []
                for (let i = 0; i < candidateIds.length; i++) {
                    const id = encodeAddress(candidateIds[i])
                    const state = assertNotNull(candidateStates[i])

                    delegatorIds.push(...state.topDelegations.map((d) => d.owner))
                    delegatorIds.push(...state.bottomDelegations.map((d) => d.owner))

                    selectedCandidates.push({
                        id,
                        state: {
                            bond: state.bond,
                            delegations: [
                                ...state.topDelegations.map((d) => ({
                                    owner: encodeAddress(d.owner),
                                    amount: d.amount,
                                })),
                                ...state.bottomDelegations.map((d) => ({
                                    owner: encodeAddress(d.owner),
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
                    const id = encodeAddress(delegatorIds[i])
                    const state = assertNotNull(delegatorStates[i])
                    candidateDelegators.push({
                        id,
                        state: {
                            total: state.total,
                            delegations: state.delegations.map((d) => ({
                                owner: encodeAddress(d.owner),
                                amount: d.amount,
                            })),
                        },
                    })
                }

                const collatorComission = await ParachainStaking.storage.CollatorComission.get(ctx, block)
                assert(collatorComission != null)

                roundsData.push({
                    index: e.round,
                    timestamp: new Date(block.timestamp),
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

async function getStartRound(ctx: BatchContext<unknown, unknown>) {
    const round = await ParachainStaking.storage.Round.get(ctx, ctx.blocks[0].header)
    assert(round != null)
    return round.current
}

async function getStakingData(ctx: BatchContext<unknown, Item>): Promise<StakingData[]> {
    const stakingData: StakingData[] = []

    for (const {header: block, items} of ctx.blocks) {
        for (const item of items) {
            if (item.kind !== 'event') continue

            switch (item.name) {
                case 'ParachainStaking.JoinedCollatorCandidates': {
                    const e = ParachainStaking.events.JoinedCollatorCandidates.decode(ctx, item.event)
                    stakingData.push({
                        __kind: 'Bond',
                        id: item.event.id,
                        timestamp: new Date(block.timestamp),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: encodeAddress(e.account),
                        newTotal: e.newTotal,
                        isUnstake: false,
                    })
                    break
                }
                case 'ParachainStaking.CollatorBondedLess':
                case 'ParachainStaking.CandidateBondedLess': {
                    const e = ParachainStaking.events.CandidateBondedLess.decode(ctx, item.event)
                    stakingData.push({
                        __kind: 'Bond',
                        id: item.event.id,
                        timestamp: new Date(block.timestamp),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: encodeAddress(e.account),
                        newTotal: e.newTotal,
                        isUnstake: true,
                    })
                    break
                }
                case 'ParachainStaking.CollatorBondedMore':
                case 'ParachainStaking.CandidateBondedMore': {
                    const e = ParachainStaking.events.CandidateBondedMore.decode(ctx, item.event)
                    stakingData.push({
                        __kind: 'Bond',
                        id: item.event.id,
                        timestamp: new Date(block.timestamp),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: encodeAddress(e.account),
                        newTotal: e.newTotal,
                        isUnstake: false,
                    })
                    break
                }
                case 'ParachainStaking.Nomination':
                case 'ParachainStaking.Delegation': {
                    const e = ParachainStaking.events.Delegation.decode(ctx, item.event)
                    stakingData.push({
                        __kind: 'Delegation',
                        id: item.event.id,
                        timestamp: new Date(block.timestamp),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: encodeAddress(e.account),
                        candidateId: encodeAddress(e.candidate),
                        isUnstake: false,
                    })
                    break
                }
                case 'ParachainStaking.NominationDecreased':
                case 'ParachainStaking.DelegationDecreased': {
                    const e = ParachainStaking.events.DelegationDecreased.decode(ctx, item.event)
                    stakingData.push({
                        __kind: 'Delegation',
                        id: item.event.id,
                        timestamp: new Date(block.timestamp),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: encodeAddress(e.account),
                        candidateId: encodeAddress(e.candidate),
                        isUnstake: true,
                    })
                    break
                }
                case 'ParachainStaking.NominationIncreased':
                case 'ParachainStaking.DelegationIncreased': {
                    const e = ParachainStaking.events.DelegationIncreased.decode(ctx, item.event)
                    stakingData.push({
                        __kind: 'Delegation',
                        id: item.event.id,
                        timestamp: new Date(block.timestamp),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: encodeAddress(e.account),
                        candidateId: encodeAddress(e.candidate),
                        isUnstake: false,
                    })
                    break
                }
                case 'ParachainStaking.DelegationRevoked': {
                    const e = ParachainStaking.events.DelegationRevoked.decode(ctx, item.event)
                    stakingData.push({
                        __kind: 'Delegation',
                        id: item.event.id,
                        timestamp: new Date(block.timestamp),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: encodeAddress(e.account),
                        candidateId: encodeAddress(e.candidate),
                        isUnstake: true,
                    })
                    break
                }
                case 'ParachainStaking.Rewarded': {
                    const e = ParachainStaking.events.Rewarded.decode(ctx, item.event)
                    stakingData.push({
                        __kind: 'Reward',
                        id: item.event.id,
                        timestamp: new Date(block.timestamp),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: encodeAddress(e.account),
                    })
                    break
                }
                case 'ParachainStaking.Compounded': {
                    const e = ParachainStaking.events.Compounded.decode(ctx, item.event)
                    stakingData.push({
                        __kind: 'Compound',
                        id: item.event.id,
                        timestamp: new Date(block.timestamp),
                        blockNumber: block.height,
                        amount: e.amount,
                        accountId: encodeAddress(e.account),
                    })
                    break
                }
            }
        }
    }

    return stakingData
}
