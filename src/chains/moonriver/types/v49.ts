import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface Collator {
    id: AccountId
    bond: Balance
    nominators: Bond[]
    total: Balance
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

export const Collator: sts.Type<Collator> = sts.struct(() => {
    return  {
        id: AccountId,
        bond: Balance,
        nominators: sts.array(() => Bond),
        total: Balance,
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

export const Bond: sts.Type<Bond> = sts.struct(() => {
    return  {
        owner: AccountId,
        amount: Balance,
    }
})

export const Balance = sts.bigint()

export type AccountId = Bytes

export interface Nominator {
    nominations: Bond[]
    total: Balance
}

export const Nominator: sts.Type<Nominator> = sts.struct(() => {
    return  {
        nominations: sts.array(() => Bond),
        total: Balance,
    }
})

export interface RoundInfo {
    current: RoundIndex
    first: BlockNumber
    length: number
}

export type BlockNumber = number

export const RoundInfo: sts.Type<RoundInfo> = sts.struct(() => {
    return  {
        current: RoundIndex,
        first: BlockNumber,
        length: sts.number(),
    }
})

export type Perbill = number

export const Perbill = sts.number()

export const AccountId = sts.bytes()

export const BalanceOf = sts.bigint()

export const RoundIndex = sts.number()

export const BlockNumber = sts.number()
