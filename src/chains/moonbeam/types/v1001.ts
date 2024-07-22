import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface CollatorCandidate {
    id: AccountId20
    bond: bigint
    delegators: AccountId20[]
    topDelegations: Bond[]
    bottomDelegations: Bond[]
    totalCounted: bigint
    totalBacking: bigint
    request?: (CandidateBondLessRequest | undefined)
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
    value: number
}

export interface CandidateBondLessRequest {
    amount: bigint
    whenExecutable: number
}

export interface Bond {
    owner: AccountId20
    amount: bigint
}

export const CollatorCandidate: sts.Type<CollatorCandidate> = sts.struct(() => {
    return  {
        id: AccountId20,
        bond: sts.bigint(),
        delegators: sts.array(() => AccountId20),
        topDelegations: sts.array(() => Bond),
        bottomDelegations: sts.array(() => Bond),
        totalCounted: sts.bigint(),
        totalBacking: sts.bigint(),
        request: sts.option(() => CandidateBondLessRequest),
        state: CollatorStatus,
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

export const Bond: sts.Type<Bond> = sts.struct(() => {
    return  {
        owner: AccountId20,
        amount: sts.bigint(),
    }
})

export interface Delegator {
    id: AccountId20
    delegations: Bond[]
    total: bigint
    requests: PendingDelegationRequests
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

export interface PendingDelegationRequests {
    revocationsCount: number
    requests: [AccountId20, DelegationRequest][]
    lessTotal: bigint
}

export interface DelegationRequest {
    collator: AccountId20
    amount: bigint
    whenExecutable: number
    action: DelegationChange
}

export type DelegationChange = DelegationChange_Decrease | DelegationChange_Revoke

export interface DelegationChange_Decrease {
    __kind: 'Decrease'
}

export interface DelegationChange_Revoke {
    __kind: 'Revoke'
}

export const Delegator: sts.Type<Delegator> = sts.struct(() => {
    return  {
        id: AccountId20,
        delegations: sts.array(() => Bond),
        total: sts.bigint(),
        requests: PendingDelegationRequests,
        status: DelegatorStatus,
    }
})

export const DelegatorStatus: sts.Type<DelegatorStatus> = sts.closedEnum(() => {
    return  {
        Active: sts.unit(),
        Leaving: sts.number(),
    }
})

export const PendingDelegationRequests: sts.Type<PendingDelegationRequests> = sts.struct(() => {
    return  {
        revocationsCount: sts.number(),
        requests: sts.array(() => sts.tuple(() => [AccountId20, DelegationRequest])),
        lessTotal: sts.bigint(),
    }
})

export const DelegationRequest: sts.Type<DelegationRequest> = sts.struct(() => {
    return  {
        collator: AccountId20,
        amount: sts.bigint(),
        whenExecutable: sts.number(),
        action: DelegationChange,
    }
})

export const DelegationChange: sts.Type<DelegationChange> = sts.closedEnum(() => {
    return  {
        Decrease: sts.unit(),
        Revoke: sts.unit(),
    }
})

export type AccountId20 = Bytes

export interface Nominator2 {
    delegations: Bond[]
    revocations: AccountId20[]
    total: bigint
    scheduledRevocationsCount: number
    scheduledRevocationsTotal: bigint
    status: DelegatorStatus
}

export const Nominator2: sts.Type<Nominator2> = sts.struct(() => {
    return  {
        delegations: sts.array(() => Bond),
        revocations: sts.array(() => AccountId20),
        total: sts.bigint(),
        scheduledRevocationsCount: sts.number(),
        scheduledRevocationsTotal: sts.bigint(),
        status: DelegatorStatus,
    }
})

export const DelegatorAdded: sts.Type<DelegatorAdded> = sts.closedEnum(() => {
    return  {
        AddedToBottom: sts.unit(),
        AddedToTop: sts.enumStruct({
            newTotal: sts.bigint(),
        }),
    }
})

export type DelegatorAdded = DelegatorAdded_AddedToBottom | DelegatorAdded_AddedToTop

export interface DelegatorAdded_AddedToBottom {
    __kind: 'AddedToBottom'
}

export interface DelegatorAdded_AddedToTop {
    __kind: 'AddedToTop'
    newTotal: bigint
}

export const AccountId20 = sts.bytes()
