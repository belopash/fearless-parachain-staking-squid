import {assertNotNull} from '@subsquid/substrate-processor'
import assert from 'assert'
import {UnknownVersionError} from '../../../../../utils/errors'
import {storage} from '../../../types'
import {BatchContext, BlockHeader} from '../../../../fields'

export const CandidateInfo = {
    async getMany(
        ctx: BatchContext,
        block: BlockHeader,
        addresses: string[]
    ): Promise<(ParachainStaking.CandidateState | undefined)[] | undefined> {
        
        
        if (!storage.parachainStaking.candidateInfo.isExists(block)) return CandidateState.getMany(ctx, block, addresses)
        const bonds: (bigint | undefined)[] =
            await storage.parachainStaking.candidateInfo.at(block, async (s, v) => {
                switch (v) {
                    case 'v1201':
                        return (await s.getMany(addresses)).map(r => r?.bond)
                    default:
                        throw new UnknownVersionError(v)
                }
            })

        assert(storage.parachainStaking.topDelegations.isExists(block))
        let topDelegations: (ParachainStaking.Delegation[] | undefined)[] =
            await storage.parachainStaking.topDelegations.at(block, async (s, v) => {
                switch (v) {
                    case 'v1201':
                        return (await s.getMany(addresses)).map(r => r?.delegations)
                    default:
                        throw new UnknownVersionError(v)
                }
            })

        assert(storage.parachainStaking.bottomDelegations.isExists(block))
        let bottomDelegations: (ParachainStaking.Delegation[] | undefined)[] =
            await storage.parachainStaking.bottomDelegations.at(block, async (s, v) => {
                switch (v) {
                    case 'v1201':
                        return (await s.getMany(addresses)).map(r => r?.delegations)
                    default:
                        throw new UnknownVersionError(v)
                }
            })

        const states: (ParachainStaking.CandidateState | undefined)[] = []
        for (let i = 0; i < addresses.length; i++) {
            if (bonds[i] == null) {
                states.push(undefined)
            } else {
                states.push({
                    bond: assertNotNull(bonds[i]),
                    topDelegations: assertNotNull(topDelegations[i]),
                    bottomDelegations: assertNotNull(bottomDelegations[i]),
                })
            }
        }

        return states
    },
}

/**
 * @deprecated use CandidateInfo
 */
export const CandidateState = {
    async getMany(
        ctx: BatchContext,
        block: BlockHeader,
        addresses: string[]
    ): Promise<(ParachainStaking.CandidateState | undefined)[] | undefined> {
        const pscss = new ParachainStakingCandidateStateStorage(ctx, block)
        if (!pscss.isExists) return CollatorState2.getMany(ctx, block, addresses)

        let states: (ParachainStaking.CandidateState | undefined)[]
        if (pscss.isV1001) {
            states = await pscss.asV1001.getMany(addresses)
        } else {
            throw new UnknownVersionError(pscss)
        }

        return states
    },
}

/**
 * @deprecated use CandidateState
 */
export const CollatorState2 = {
    async getMany(
        ctx: BatchContext,
        block: BlockHeader,
        addresses: string[]
    ): Promise<(ParachainStaking.CandidateState | undefined)[] | undefined> {
        const pscs2s = new ParachainStakingCollatorState2Storage(ctx, block)
        if (!pscs2s.isExists) return undefined

        let states: (ParachainStaking.CandidateState | undefined)[] = []
        if (pscs2s.isV900) {
            const r = await pscs2s.asV900.getMany(addresses)
            for (let state of r) {
                states.push(
                    state == null
                        ? undefined
                        : {
                              bond: state.bond,
                              topDelegations: state.topNominators,
                              bottomDelegations: state.bottomNominators,
                          }
                )
            }
        } else {
            throw new UnknownVersionError(pscs2s)
        }

        return states
    },
}
