import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface Delegations {
    delegations: Bond[]
    total: bigint
}

export interface Bond {
    owner: AccountId20
    amount: bigint
}

export const Delegations: sts.Type<Delegations> = sts.struct(() => {
    return  {
        delegations: sts.array(() => Bond),
        total: sts.bigint(),
    }
})

export const Bond: sts.Type<Bond> = sts.struct(() => {
    return  {
        owner: AccountId20,
        amount: sts.bigint(),
    }
})

export type AccountId20 = Bytes

export interface CandidateMetadata {
    bond: bigint
    delegationCount: number
    totalCounted: bigint
    lowestTopDelegationAmount: bigint
    highestBottomDelegationAmount: bigint
    lowestBottomDelegationAmount: bigint
    topCapacity: CapacityStatus
    bottomCapacity: CapacityStatus
    request?: (CandidateBondLessRequest | undefined)
    status: CollatorStatus
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
    value: number
}

export interface CandidateBondLessRequest {
    amount: bigint
    whenExecutable: number
}

export type CapacityStatus = CapacityStatus_Empty | CapacityStatus_Full | CapacityStatus_Partial

export interface CapacityStatus_Empty {
    __kind: 'Empty'
}

export interface CapacityStatus_Full {
    __kind: 'Full'
}

export interface CapacityStatus_Partial {
    __kind: 'Partial'
}

export const CandidateMetadata: sts.Type<CandidateMetadata> = sts.struct(() => {
    return  {
        bond: sts.bigint(),
        delegationCount: sts.number(),
        totalCounted: sts.bigint(),
        lowestTopDelegationAmount: sts.bigint(),
        highestBottomDelegationAmount: sts.bigint(),
        lowestBottomDelegationAmount: sts.bigint(),
        topCapacity: CapacityStatus,
        bottomCapacity: CapacityStatus,
        request: sts.option(() => CandidateBondLessRequest),
        status: CollatorStatus,
    }
})

export const CollatorStatus: sts.Type<CollatorStatus> = sts.closedEnum(() => {
    return  {
        Active: sts.unit(),
        Idle: sts.unit(),
        Leaving: sts.number(),
    }
})

export const CandidateBondLessRequest: sts.Type<CandidateBondLessRequest> = sts.struct(() => {
    return  {
        amount: sts.bigint(),
        whenExecutable: sts.number(),
    }
})

export const CapacityStatus: sts.Type<CapacityStatus> = sts.closedEnum(() => {
    return  {
        Empty: sts.unit(),
        Full: sts.unit(),
        Partial: sts.unit(),
    }
})

export const AccountId20 = sts.bytes()
