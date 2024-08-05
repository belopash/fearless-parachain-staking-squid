import {UnknownVersionError} from '../../../../../utils/errors'
import {storage} from '../../../types'
import {BlockHeader} from '../../../../fields'

export const DelegatorState = {
    async getMany(
        block: BlockHeader,
        addresses: string[]
    ): Promise<(ParachainStaking.DelegatorState | undefined)[] | undefined> {

        if (!storage.parachainStaking.delegatorState.isExists(block)) return NominatorState2.getMany(block, addresses)
 
        const states: (ParachainStaking.DelegatorState | undefined)[] =
            await storage.parachainStaking.delegatorState.at(block, async (s, v) => {
                switch (v) {
                    case 'v1001':
                    case 'v1502':
                        return await s.getMany(addresses)
                    default:
                        throw new UnknownVersionError(v)
                }
            })

        return states
    },
}

/**
 * @deprecated use DelegatorState
 */
export const NominatorState2 = {
    async getMany(
        block: BlockHeader,
        addresses: string[]
    ): Promise<(ParachainStaking.DelegatorState | undefined)[] | undefined> {

        if (!storage.parachainStaking.nominatorState2.isExists(block)) return undefined

        const states: (ParachainStaking.DelegatorState | undefined)[] =
            await storage.parachainStaking.nominatorState2.at(block, async (s, v) => {
                switch (v) {
                    case 'v900':
                        return (await s.getMany(addresses)).map(state => {
                            return state == null
                                ? undefined
                                : {
                                      total: state.total,
                                      delegations: state.nominations,
                                  }
                        })
                    case 'v1001':
                        return await s.getMany(addresses)
                    default:
                        throw new UnknownVersionError(v)
                }
            })

        return states
    },
}
