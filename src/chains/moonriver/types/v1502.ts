import {sts, Result, Option, Bytes, BitSequence} from './support'

export type AccountId20 = Bytes

export interface Delegator {
    id: AccountId20
    delegations: Bond[]
    total: bigint
    lessTotal: bigint
    status: DelegatorStatus
}

export type DelegatorStatus = DelegatorStatus_Active | DelegatorStatus_Leaving

export interface DelegatorStatus_Active {
    __kind: 'Active'
}

export interface DelegatorStatus_Leaving {
    __kind: 'Leaving'
    value: number
}

export interface Bond {
    owner: AccountId20
    amount: bigint
}

export const Delegator: sts.Type<Delegator> = sts.struct(() => {
    return  {
        id: AccountId20,
        delegations: sts.array(() => Bond),
        total: sts.bigint(),
        lessTotal: sts.bigint(),
        status: DelegatorStatus,
    }
})

export const DelegatorStatus: sts.Type<DelegatorStatus> = sts.closedEnum(() => {
    return  {
        Active: sts.unit(),
        Leaving: sts.number(),
    }
})

export const Bond: sts.Type<Bond> = sts.struct(() => {
    return  {
        owner: AccountId20,
        amount: sts.bigint(),
    }
})

export const AccountId20 = sts.bytes()
