import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const rewardPaymentDelay =  {
    /**
     *  Number of rounds after which block authors are rewarded
     */
    v900: new ConstantType(
        'ParachainStaking.RewardPaymentDelay',
        sts.number()
    ),
}
