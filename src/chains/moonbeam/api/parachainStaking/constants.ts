import {UnknownVersionError} from '../../../../utils/errors'
import {constants} from '../../types'
import {BlockHeader} from '../../../fields'

export const RewardPaymentDelay = {
    get(block: BlockHeader): number {

        if (!constants.parachainStaking.rewardPaymentDelay.isExists(block)) return 2

        return constants.parachainStaking.rewardPaymentDelay.at(block, (c, v) => {
            switch (v) {
                case 'v900':
                    return c
                default:
                    throw new UnknownVersionError(v)
            }
        })
    }
}