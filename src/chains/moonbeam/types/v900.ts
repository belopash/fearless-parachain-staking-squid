import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface Collator2 {
    id: H160
    bond: bigint
    nominators: H160[]
    topNominators: Bond[]
    bottomNominators: Bond[]
    totalCounted: bigint
    totalBacking: bigint
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

export interface Bond {
    owner: H160
    amount: bigint
}

export const Collator2: sts.Type<Collator2> = sts.struct(() => {
    return  {
        id: H160,
        bond: sts.bigint(),
        nominators: sts.array(() => H160),
        topNominators: sts.array(() => Bond),
        bottomNominators: sts.array(() => Bond),
        totalCounted: sts.bigint(),
        totalBacking: sts.bigint(),
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

export const Bond: sts.Type<Bond> = sts.struct(() => {
    return  {
        owner: H160,
        amount: sts.bigint(),
    }
})

export type H160 = Bytes

export interface Nominator2 {
    nominations: Bond[]
    revocations: H160[]
    total: bigint
    scheduledRevocationsCount: number
    scheduledRevocationsTotal: bigint
    status: NominatorStatus
}

export type NominatorStatus = NominatorStatus_Active | NominatorStatus_Leaving

export interface NominatorStatus_Active {
    __kind: 'Active'
}

export interface NominatorStatus_Leaving {
    __kind: 'Leaving'
    value: number
}

export const Nominator2: sts.Type<Nominator2> = sts.struct(() => {
    return  {
        nominations: sts.array(() => Bond),
        revocations: sts.array(() => H160),
        total: sts.bigint(),
        scheduledRevocationsCount: sts.number(),
        scheduledRevocationsTotal: sts.bigint(),
        status: NominatorStatus,
    }
})

export const NominatorStatus: sts.Type<NominatorStatus> = sts.closedEnum(() => {
    return  {
        Active: sts.unit(),
        Leaving: sts.number(),
    }
})

export interface RoundInfo {
    current: number
    first: number
    length: number
}

export const RoundInfo: sts.Type<RoundInfo> = sts.struct(() => {
    return  {
        current: sts.number(),
        first: sts.number(),
        length: sts.number(),
    }
})

export type Perbill = number

export const Perbill = sts.number()

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
