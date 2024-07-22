import {sts, Result, Option, Bytes, BitSequence} from './support'

export type AccountId = Bytes

export interface Collator2 {
    id: AccountId
    bond: Balance
    nominators: AccountId[]
    topNominators: Bond[]
    bottomNominators: Bond[]
    totalCounted: Balance
    totalBacking: Balance
    state: CollatorStatus
}

export type CollatorStatus = CollatorStatus_Active | CollatorStatus_Idle | CollatorStatus_Leaving

export interface CollatorStatus_Active {
    __kind: 'Active'
}

export interface CollatorStatus_Idle {
    __kind: 'Idle'
}

export interface CollatorStatus_Leaving {
    __kind: 'Leaving'
    value: RoundIndex
}

export type RoundIndex = number

export interface Bond {
    owner: AccountId
    amount: Balance
}

export type Balance = bigint

export const Collator2: sts.Type<Collator2> = sts.struct(() => {
    return  {
        id: AccountId,
        bond: Balance,
        nominators: sts.array(() => AccountId),
        topNominators: sts.array(() => Bond),
        bottomNominators: sts.array(() => Bond),
        totalCounted: Balance,
        totalBacking: Balance,
        state: CollatorStatus,
    }
})

export const CollatorStatus: sts.Type<CollatorStatus> = sts.closedEnum(() => {
    return  {
        Active: sts.unit(),
        Idle: sts.unit(),
        Leaving: RoundIndex,
    }
})

export const RoundIndex = sts.number()

export const Bond: sts.Type<Bond> = sts.struct(() => {
    return  {
        owner: AccountId,
        amount: Balance,
    }
})

export const Balance = sts.bigint()

export const NominatorAdded: sts.Type<NominatorAdded> = sts.closedEnum(() => {
    return  {
        AddedToBottom: sts.unit(),
        AddedToTop: Balance,
    }
})

export type NominatorAdded = NominatorAdded_AddedToBottom | NominatorAdded_AddedToTop

export interface NominatorAdded_AddedToBottom {
    __kind: 'AddedToBottom'
}

export interface NominatorAdded_AddedToTop {
    __kind: 'AddedToTop'
    value: Balance
}

export const BalanceOf = sts.bigint()

export const AccountId = sts.bytes()
