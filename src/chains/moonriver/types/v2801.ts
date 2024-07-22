import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface RoundInfo {
    current: number
    first: number
    length: number
    firstSlot: bigint
}

export const RoundInfo: sts.Type<RoundInfo> = sts.struct(() => {
    return  {
        current: sts.number(),
        first: sts.number(),
        length: sts.number(),
        firstSlot: sts.bigint(),
    }
})
