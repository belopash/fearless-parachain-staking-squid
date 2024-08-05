import {assertNotNull} from '@subsquid/substrate-processor'
import assert from 'assert'
import {UnknownVersionError} from '../../../../../utils/errors'
import {storage} from '../../../types'
import {BlockHeader} from '../../../../fields'

export const CandidateInfo = {
    async getMany(
        block: BlockHeader,
        addresses: string[]
    ): Promise<(ParachainStaking.CandidateState | undefined)[] | undefined> {

        if (!storage.parachainStaking.candidateInfo.isExists(block)) return CandidateState.getMany(block, addresses)

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
        const topDelegations: (ParachainStaking.Delegation[] | undefined)[] =
            await storage.parachainStaking.topDelegations.at(block, async (s, v) => {
                switch (v) {
                    case 'v1201':
                        return (await s.getMany(addresses)).map(r => r?.delegations)
                    default:
                        throw new UnknownVersionError(v)
                }
            })

        assert(storage.parachainStaking.bottomDelegations.isExists(block))
        const bottomDelegations: (ParachainStaking.Delegation[] | undefined)[] =
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
        block: BlockHeader,
        addresses: string[]
    ): Promise<(ParachainStaking.CandidateState | undefined)[] | undefined> {

        if (!storage.parachainStaking.candidateState.isExists(block)) return CollatorState2.getMany(block, addresses)

        const states: (ParachainStaking.CandidateState | undefined)[] =
            await storage.parachainStaking.candidateState.at(block, async (s, v) => {
                switch (v) {
                    case 'v1001':
                        return await s.getMany(addresses)
                    default:
                        throw new UnknownVersionError(v)
                }
            })

        return states
    },
}

/**
 * @deprecated use CandidateState
 */
export const CollatorState2 = {
    async getMany(
        block: BlockHeader,
        addresses: string[]
    ): Promise<(ParachainStaking.CandidateState | undefined)[] | undefined> {

        if (!storage.parachainStaking.collatorState2.isExists(block)) return undefined

        const states: (ParachainStaking.CandidateState | undefined)[] =
            await storage.parachainStaking.collatorState2.at(block, async (s, v) => {
                switch (v) {
                    case 'v900':
                        return (await s.getMany(addresses)).map(state => {
                            return state == null
                                ? undefined
                                : {
                                    bond: state.bond,
                                    topDelegations: state.topNominators,
                                    bottomDelegations: state.bottomNominators,
                                  }    
                        })
                    default:
                        throw new UnknownVersionError(v)
                }

            }) 

        return states
    },
}
