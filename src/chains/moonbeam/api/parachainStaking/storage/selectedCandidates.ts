import {UnknownVersionError} from '../../../../../utils/errors'
import {parachainStaking} from '../../../types/storage'
import {BatchContext, BlockHeader} from '../../../../fields'

export const SelectedCandidates = {
    async get(ctx: BatchContext, block: BlockHeader): Promise<Uint8Array[] | undefined> {
        const psscs = new ParachainStakingSelectedCandidatesStorage(ctx, block)
        if (!psscs.isExists) return undefined

        if (psscs.isV900) {
            return await psscs.asV900.get()
        } else {
            throw new UnknownVersionError(psscs)
        }
    },
}
