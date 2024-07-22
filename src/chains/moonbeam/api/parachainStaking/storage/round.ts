import {UnknownVersionError} from '../../../../../utils/errors'
import {parachainStaking} from '../../../types/storage'
import {BatchContext, BlockHeader} from '../../../../fields'

export const Round = {
    async get(ctx: BatchContext, block: BlockHeader): Promise<ParachainStaking.Round | undefined> {
        const psrs = new ParachainStakingRoundStorage(ctx, block)
        if (!psrs.isExists) return undefined

        if (psrs.isV900) {
            return await psrs.asV900.get()
        } else {
            throw new UnknownVersionError(psrs)
        }
    },
}

export const CollatorComission = {
    async get(ctx: BatchContext, block: BlockHeader): Promise<number | undefined> {
        const psrs = new ParachainStakingCollatorCommissionStorage(ctx, block)
        if (!psrs.isExists) return undefined

        if (psrs.isV900) {
            return await psrs.asV900.get()
        } else {
            throw new UnknownVersionError(psrs)
        }
    },
}
