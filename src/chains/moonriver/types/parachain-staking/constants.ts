import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v200 from '../v200'

export const rewardPaymentDelay =  {
    /**
     *  Number of rounds after which block authors are rewarded
     */
    v200: new ConstantType(
        'ParachainStaking.RewardPaymentDelay',
        v200.RoundIndex
    ),
}
