import {UnknownVersionError} from '../../../../utils/errors'
import {
    ParachainStakingCandidateBondedLessEvent,
    ParachainStakingCandidateBondedMoreEvent,
    ParachainStakingCollatorBondedLessEvent,
    ParachainStakingCollatorBondedMoreEvent,
    ParachainStakingDelegationDecreasedEvent,
    ParachainStakingDelegationEvent,
    ParachainStakingDelegationIncreasedEvent,
    ParachainStakingDelegationRevokedEvent,
    ParachainStakingNewRoundEvent,
    ParachainStakingNominationDecreasedEvent,
    ParachainStakingNominationEvent,
    ParachainStakingNominationIncreasedEvent,
    ParachainStakingRewardedEvent,
} from '../../types/events'
import {ChainContext, Event} from '../../types/support'

export const NewRound = {
    names: {'ParachainStaking.NewRound': true} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.NewRound {
        const e = new ParachainStakingNewRoundEvent(ctx, event)
        if (e.isV49) {
            const [startingBlock, round, selectedCollatorsNumber, totalBalance] = e.asV49
            return {startingBlock, round, selectedCollatorsNumber, totalBalance}
        } else if (e.isV1300) {
            return e.asV1300
        } else {
            throw new UnknownVersionError(e)
        }
    },
}

export const CollatorBondedLess = {
    names: {'ParachainStaking.CollatorBondedLess': true} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.CandidateBondedLess {
        const e = new ParachainStakingCollatorBondedLessEvent(ctx, event)
        if (e.isV49) {
            const [account, amount, newTotal] = e.asV49
            return {
                account,
                amount,
                newTotal,
            }
        } else {
            throw new UnknownVersionError(e)
        }
    },
}

export const CandidateBondedLess = {
    names: {'ParachainStaking.CandidateBondedLess': true, ...CollatorBondedLess.names} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.CandidateBondedLess {
        if (event.name in CollatorBondedLess.names) {
            return CollatorBondedLess.decode(ctx, event)
        } else {
            const e = new ParachainStakingCandidateBondedLessEvent(ctx, event)
            if (e.isV1001) {
                const [account, amount, newTotal] = e.asV1001
                return {
                    account,
                    amount,
                    newTotal,
                }
            } else if (e.isV1300) {
                const {candidate: account, amount, newBond: newTotal} = e.asV1300
                return {
                    account,
                    amount,
                    newTotal,
                }
            }
            throw new UnknownVersionError(e)
        }
    },
} as const

export const CollatorBondedMore = {
    names: {'ParachainStaking.CollatorBondedMore': true} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.CandidateBondedLess {
        const e = new ParachainStakingCollatorBondedMoreEvent(ctx, event)
        if (e.isV49) {
            const [account, amount, newTotal] = e.asV49
            return {
                account,
                amount,
                newTotal,
            }
        } else {
            throw new UnknownVersionError(e)
        }
    },
}

export const CandidateBondedMore = {
    names: {'ParachainStaking.CandidateBondedMore': true, ...CollatorBondedMore.names} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.CandidateBondedLess {
        if (event.name in CollatorBondedMore.names) {
            return CollatorBondedMore.decode(ctx, event)
        } else {
            const e = new ParachainStakingCandidateBondedMoreEvent(ctx, event)
            if (e.isV1001) {
                const [account, amount, newTotal] = e.asV1001
                return {
                    account,
                    amount,
                    newTotal,
                }
            } else if (e.isV1300) {
                const {candidate: account, amount, newTotalBond: newTotal} = e.asV1300
                return {
                    account,
                    amount,
                    newTotal,
                }
            } else {
                throw new UnknownVersionError(e)
            }
        }
    },
}

export const Nomination = {
    names: {'ParachainStaking.Nomination': true} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.DelegationIncreased {
        const e = new ParachainStakingNominationEvent(ctx, event)
        if (e.isV49) {
            const [account, amount, candidate] = e.asV49
            return {
                account,
                amount,
                candidate,
            }
        } else if (e.isV53) {
            const [account, amount, candidate] = e.asV53
            return {
                account,
                amount,
                candidate,
            }
        } else if (e.isV155) {
            const [account, amount, candidate] = e.asV155
            return {
                account,
                amount,
                candidate,
            }
        } else if (e.isV900) {
            const [account, amount, candidate] = e.asV900
            return {
                account,
                amount,
                candidate,
            }
        }
        throw new UnknownVersionError(e)
    },
}

export const Delegation = {
    names: {'ParachainStaking.Delegation': true, ...Nomination.names} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.DelegationIncreased {
        if (event.name in Nomination.names) {
            return Nomination.decode(ctx, event)
        } else {
            const e = new ParachainStakingDelegationEvent(ctx, event)
            if (e.isV1001) {
                const [account, amount, candidate] = e.asV1001
                return {
                    account,
                    amount,
                    candidate,
                }
            } else if (e.isV1300) {
                const {delegator: account, lockedAmount: amount, candidate} = e.asV1300
                return {
                    account,
                    amount,
                    candidate,
                }
            }
            throw new UnknownVersionError(e)
        }
    },
}

export const NominationIncreased = {
    names: {'ParachainStaking.NominationIncreased': true} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.DelegationIncreased {
        const e = new ParachainStakingNominationIncreasedEvent(ctx, event)

        if (e.isV49) {
            const [account, candidate, amount] = e.asV49
            return {
                account,
                amount,
                candidate,
            }
        } else if (e.isV53) {
            const [account, candidate, amount] = e.asV53
            return {
                account,
                amount,
                candidate,
            }
        } else if (e.isV501) {
            const [account, candidate, amount] = e.asV501
            return {
                account,
                amount,
                candidate,
            }
        } else {
            throw new UnknownVersionError(e)
        }
    },
}

export const DelegationIncreased = {
    names: {'ParachainStaking.DelegationIncreased': true, ...NominationIncreased.names} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.DelegationIncreased {
        if (event.name in NominationIncreased.names) {
            return NominationIncreased.decode(ctx, event)
        } else {
            const e = new ParachainStakingDelegationIncreasedEvent(ctx, event)

            if (e.isV1001) {
                const [account, candidate, amount] = e.asV1001
                return {
                    account,
                    amount,
                    candidate,
                }
            } else if (e.isV1300) {
                const {delegator: account, amount: amount, candidate} = e.asV1300
                return {
                    account,
                    amount,
                    candidate,
                }
            }
            throw new UnknownVersionError(e)
        }
    },
}

export const NominationDecreased = {
    names: {'ParachainStaking.NominationDecreased': true} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.DelegationDecreased {
        const e = new ParachainStakingNominationDecreasedEvent(ctx, event)
        if (e.isV49) {
            const [account, candidate, amount] = e.asV49
            return {
                account,
                amount,
                candidate,
            }
        } else if (e.isV53) {
            const [account, candidate, amount] = e.asV53
            return {
                account,
                amount,
                candidate,
            }
        } else if (e.isV501) {
            const [account, candidate, amount] = e.asV501
            return {
                account,
                amount,
                candidate,
            }
        } else {
            throw new UnknownVersionError(e)
        }
    },
}

export const DelegationDecreased = {
    names: {'ParachainStaking.DelegationDecreased': true, ...NominationDecreased.names} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.DelegationDecreased {
        if (event.name in NominationDecreased.names) {
            return NominationDecreased.decode(ctx, event)
        } else {
            const e = new ParachainStakingDelegationDecreasedEvent(ctx, event)
            if (e.isV1001) {
                const [account, candidate, amount] = e.asV1001
                return {
                    account,
                    amount,
                    candidate,
                }
            } else if (e.isV1300) {
                const {delegator: account, amount: amount, candidate} = e.asV1300
                return {
                    account,
                    amount,
                    candidate,
                }
            } else {
                throw new UnknownVersionError(e)
            }
        }
    },
}

export const DelegationRevoked = {
    names: {'ParachainStaking.DelegationRevoked': true} as const,
    decode(ctx: ChainContext, event: Event): ParachainStaking.DelegationDecreased {
        const e = new ParachainStakingDelegationRevokedEvent(ctx, event)
        if (e.isV1001) {
            const [account, candidate, amount] = e.asV1001
            return {
                account,
                amount,
                candidate,
            }
        } else if (e.isV1300) {
            const {delegator: account, unstakedAmount: amount, candidate} = e.asV1300
            return {
                account,
                amount,
                candidate,
            }
        }
        throw new UnknownVersionError(e)
    },
}

export const Rewarded = {
    names: {'ParachainStaking.Rewarded': true} as const,
    decode(ctx: ChainContext, event: Event) {
        const e = new ParachainStakingRewardedEvent(ctx, event)
        if (e.isV49) {
            const [account, amount] = e.asV49
            return {
                account,
                amount,
            }
        } else if (e.isV1300) {
            const {account, rewards: amount} = e.asV1300
            return {
                account,
                amount,
            }
        } else {
            throw new UnknownVersionError(e)
        }
    },
}
