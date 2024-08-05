import {UnknownVersionError} from '../../../../../utils/errors'
import {storage} from '../../../types'
import {BlockHeader} from '../../../../fields'

export const SelectedCandidates = {
    async get(block: BlockHeader): Promise<string[] | undefined> {

        if (!storage.parachainStaking.selectedCandidates.isExists(block)) return undefined

        return await storage.parachainStaking.selectedCandidates.at(block, async (s, v) => {
            switch (v) {
                case 'v900':
                    return await s.get()
                default:
                    throw new UnknownVersionError(v)
            }
        })
    },
}
