import {UnknownVersionError} from '../../../../../utils/errors'
import {ParachainStakingRoundStorage} from '../../../types/storage'
import {ChainContext, Block} from '../../../types/support'

export const Round = {
    async get(ctx: ChainContext, block: Block): Promise<ParachainStaking.Round | undefined> {
        const psrs = new ParachainStakingRoundStorage(ctx, block)
        if (!psrs.isExists) return undefined

        if (psrs.isV49) {
            return await psrs.asV49.get()
        } else {
            throw new UnknownVersionError(psrs)
        }
    },
}
