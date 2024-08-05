import {UnknownVersionError} from '../../../../../utils/errors'
import {storage} from '../../../types'
import {BlockHeader} from '../../../../fields'

export const Round = {
    async get(block: BlockHeader): Promise<ParachainStaking.Round | undefined> {

        if (!storage.parachainStaking.round.isExists(block)) return undefined

        return await storage.parachainStaking.round.at(block, async (s, v) => {
            switch (v) {
                case 'v900':
                case 'v2801':
                    return await s.get()
                default:
                    throw new UnknownVersionError(v)
            }
        })
    },
}

export const CollatorComission = {
    async get(block: BlockHeader): Promise<number | undefined> {

        if (!storage.parachainStaking.collatorCommission.isExists(block)) return undefined

        return await storage.parachainStaking.collatorCommission.at(block, async (s, v) => {
             switch (v) {
                case 'v900':
                    return await s.get()
                default:
                    throw new UnknownVersionError(v)
             }
        })
    }
}
