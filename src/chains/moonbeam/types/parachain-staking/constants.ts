import {sts, Block, Bytes, Option, Result, ConstantType, constant as constant_, RuntimeCtx} from '../support'

export const rewardPaymentDelay = constant_('ParachainStaking.RewardPaymentDelay', {
    /**
     *  Number of rounds after which block authors are rewarded
     */
    v900: sts.number(),
})
