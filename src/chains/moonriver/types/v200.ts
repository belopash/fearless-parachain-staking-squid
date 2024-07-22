import {sts, Result, Option, Bytes, BitSequence} from './support'

export const RoundIndex = sts.number()

export type AccountId = Bytes

export interface Nominator2 {
    nominations: Bond[]
    revocations: AccountId[]
    total: Balance
    scheduledRevocationsCount: number
    scheduledRevocationsTotal: Balance
    status: NominatorStatus
}

export type NominatorStatus = NominatorStatus_Active | NominatorStatus_Leaving

export interface NominatorStatus_Active {
    __kind: 'Active'
}

export interface NominatorStatus_Leaving {
    __kind: 'Leaving'
    value: RoundIndex
}

export type RoundIndex = number

export type Balance = bigint

export interface Bond {
    owner: AccountId
    amount: Balance
}

export const Nominator2: sts.Type<Nominator2> = sts.struct(() => {
    return  {
        nominations: sts.array(() => Bond),
        revocations: sts.array(() => AccountId),
        total: Balance,
        scheduledRevocationsCount: sts.number(),
        scheduledRevocationsTotal: Balance,
        status: NominatorStatus,
    }
})

export const NominatorStatus: sts.Type<NominatorStatus> = sts.closedEnum(() => {
    return  {
        Active: sts.unit(),
        Leaving: RoundIndex,
    }
})

export const Balance = sts.bigint()

export const Bond: sts.Type<Bond> = sts.struct(() => {
    return  {
        owner: AccountId,
        amount: Balance,
    }
})

export const AccountId = sts.bytes()
