import assert from 'assert'
import {In, MoreThanOrEqual} from 'typeorm'
import {BatchContext} from '@subsquid/substrate-processor'
import {Store} from '@subsquid/typeorm-store'
import {HistoryElement, Reward, Round, RoundCollator, Staker} from '../model'
import {splitIntoBatches, toEntityMap} from '../utils/misc'
import {createStaker} from './entities'

type BondData = {
    __kind: 'Bond'
    id: string
    timestamp: Date
    blockNumber: number
    accountId: string
    amount: bigint
    newTotal: bigint
    isUnstake: boolean
}

type DelegationData = {
    __kind: 'Delegation'
    id: string
    timestamp: Date
    blockNumber: number
    accountId: string
    amount: bigint
    candidateId: string
    isUnstake: boolean
}

type RewardData = {
    __kind: 'Reward'
    id: string
    timestamp: Date
    blockNumber: number
    amount: bigint
    accountId: string
}

export type StakingData = BondData | DelegationData | RewardData

export async function processStaking(
    ctx: BatchContext<Store, unknown>,
    data: {
        startRoundIndex: number
        stakingData: StakingData[]
        rewardPaymentDelay: number
    }
) {
    let {startRoundIndex, stakingData, rewardPaymentDelay} = data
    let roundOffset = rewardPaymentDelay + 4

    let rounds = await ctx.store.find(Round, {
        where: {index: MoreThanOrEqual(startRoundIndex - roundOffset)},
        order: {index: 'ASC'},
    })
    const cachedHeightRound: Record<number, Round> = {}
    const getRound = (height: number) => {
        let r = cachedHeightRound[height]
        if (r == null) {
            for (let i = 0; i < rounds.length; i++) {
                if (i + 1 === rounds.length || rounds[i + 1].startedAt > height) {
                    r = rounds[i]
                    break
                }
            }
            cachedHeightRound[height] = r
        }
        return r
    }

    let stakerIds = new Set<string>()
    let roundCollatorIds = new Set<string>()

    for (let data of stakingData) {
        let round = getRound(data.blockNumber)

        let stakerId = data.accountId
        stakerIds.add(stakerId)

        if (data.__kind === 'Reward') {
            for (let i = rewardPaymentDelay; i <= roundOffset; i++) {
                roundCollatorIds.add(`${round.index - i}-${stakerId}`)
            }
        }
    }

    const stakers = await ctx.store.find(Staker, {where: {id: In([...stakerIds])}}).then(toEntityMap)
    const findRoundCollators = async (ids: string[]) => {
        let r: RoundCollator[] = []
        for (let batch of splitIntoBatches(ids, 2000)) {
            let q = await ctx.store.find(RoundCollator, {where: {id: In(batch)}})
            r.push(...q)
        }
        return r
    }
    const roundCollators = await findRoundCollators([...roundCollatorIds]).then(toEntityMap)

    const historyElements: HistoryElement[] = []
    const rewards: Reward[] = []
    for (let data of stakingData) {
        let round = getRound(data.blockNumber)

        let stakerId = data.accountId
        switch (data.__kind) {
            case 'Bond': {
                let staker = stakers.get(stakerId)
                if (staker == null) {
                    staker = createStaker(stakerId)
                    stakers.set(stakerId, staker)
                }

                staker.role = 'collator'
                staker.activeBond += data.isUnstake ? -data.amount : data.amount

                historyElements.push(
                    new HistoryElement({
                        id: data.id,
                        timestamp: data.timestamp,
                        blockNumber: data.blockNumber,
                        amount: data.amount,
                        type: data.isUnstake ? 1 : 0,
                        round: round,
                        staker: staker,
                    })
                )

                break
            }
            case 'Delegation': {
                let staker = stakers.get(stakerId)
                if (staker == null) {
                    staker = createStaker(stakerId)
                    stakers.set(stakerId, staker)
                }

                staker.role = 'delegator'
                staker.activeBond += data.isUnstake ? -data.amount : data.amount

                historyElements.push(
                    new HistoryElement({
                        id: data.id,
                        timestamp: data.timestamp,
                        blockNumber: data.blockNumber,
                        amount: data.amount,
                        type: data.isUnstake ? 1 : 0,
                        round: round,
                        staker: staker,
                    })
                )

                break
            }
            case 'Reward': {
                const staker = stakers.get(stakerId)
                assert(staker != null)

                staker.totalReward += data.amount
                staker.activeBond += data.amount

                historyElements.push(
                    new HistoryElement({
                        id: data.id,
                        timestamp: data.timestamp,
                        blockNumber: data.blockNumber,
                        amount: data.amount,
                        type: 2,
                        round: round,
                        staker: staker,
                    })
                )

                rewards.push(
                    new Reward({
                        id: data.id,
                        timestamp: data.timestamp,
                        blockNumber: data.blockNumber,
                        round: round.index - 2,
                        amount: data.amount,
                        accountId: stakerId,
                        staker,
                    })
                )

                if (staker.role === 'collator') {
                    const roundCollator = roundCollators.get(`${round.index - 2}-${staker.stashId}`)
                    if (roundCollator == null) {
                        // lets hope he wasn't collator
                    } else {
                        const colStakeShare = roundCollator.ownBond / roundCollator.totalBond
                        const amountDue = Number(data.amount) / (0.2 + 0.5 * Number(colStakeShare))
                        const colRew = 0.2 * amountDue + 0.5 * amountDue * Number(colStakeShare)
                        const colAnnualRew = colRew * Number(1460)
                        roundCollator.apr = colAnnualRew / Number(roundCollator.ownBond)

                        const collatorLastRound = roundCollators.get(`${round.index - roundOffset}-${staker.stashId}`)
                        const lastApr = collatorLastRound?.apr || 0
                        if (collatorLastRound == null || lastApr <= 0) {
                            staker.apr24h = roundCollator.apr / 4
                        } else {
                            const Apr = staker.apr24h || 0
                            const avgApr = Apr * 4
                            if (avgApr > 0) {
                                staker.apr24h = (avgApr - lastApr + roundCollator.apr) / 4
                            } else {
                                let s = 0
                                for (let i = roundOffset - 1; i > rewardPaymentDelay; i--) {
                                    const lrc = roundCollators.get(`${round.index - i}-${staker.stashId}`)
                                    s += lrc?.apr || 0
                                }
                                staker.apr24h = (s + roundCollator.apr) / 4
                            }
                        }
                    }
                }
            }
        }
    }

    await ctx.store.save([...stakers.values()])
    await ctx.store.save([...roundCollators.values()])

    await ctx.store.insert(historyElements)
    await ctx.store.insert(rewards)
}
