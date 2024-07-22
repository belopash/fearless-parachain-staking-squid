namespace ParachainStaking {
    export type Delegation = {
        owner: string
        amount: bigint
    }

    export type CandidateState = {
        bond: bigint
        topDelegations: Delegation[]
        bottomDelegations: Delegation[]
    }

    export interface DelegatorState {
        total: bigint
        delegations: {
            owner: string
            amount: bigint
        }[]
    }

    export type Round = {
        current: number
    }

    export type NewRound = {
        startingBlock: number
        round: number
        selectedCollatorsNumber: number
        totalBalance: bigint
    }

    export type CandidateBondedLess = {
        account: string
        amount: bigint
        newTotal: bigint
    }

    export type CandidateBondedMore = {
        account: string
        amount: bigint
        newTotal: bigint
    }

    export type DelegationIncreased = {
        account: string
        amount: bigint
        candidate: string
    }

    export type DelegationDecreased = {
        account: string
        amount: bigint
        candidate: string
    }

    export type Rewarded = {
        account: string
        amount: bigint
    }
}
