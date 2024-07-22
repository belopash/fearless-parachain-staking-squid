import {sts, Result, Option, Bytes, BitSequence} from './support'

export const NominatorAdded: sts.Type<NominatorAdded> = sts.closedEnum(() => {
    return  {
        AddedToBottom: sts.unit(),
        AddedToTop: sts.enumStruct({
            newTotal: sts.bigint(),
        }),
    }
})

export type NominatorAdded = NominatorAdded_AddedToBottom | NominatorAdded_AddedToTop

export interface NominatorAdded_AddedToBottom {
    __kind: 'AddedToBottom'
}

export interface NominatorAdded_AddedToTop {
    __kind: 'AddedToTop'
    newTotal: bigint
}

export const H160 = sts.bytes()
