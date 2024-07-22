import {UnknownVersionError} from '../../../../utils/errors'
import {parachainStaking} from '../../types/events'
import {Event} from '../../../fields'

export const NewRound = {
    names: {'ParachainStaking.NewRound': true} as const,
    decode(event: Event): ParachainStaking.NewRound {
        if (parachainStaking.newRound.v900.is(event)) {
            const [startingBlock, round, selectedCollatorsNumber, totalBalance] =
                parachainStaking.newRound.v900.decode(event)
            return {startingBlock, round, selectedCollatorsNumber, totalBalance}
        } else if (parachainStaking.newRound.v1300.is(event)) {
            return parachainStaking.newRound.v1300.decode(event)
        } else {
            throw new UnknownVersionError(event)
        }
    },
}

export const JoinedCollatorCandidates = {
    names: {'ParachainStaking.JoinedCollatorCandidates': true} as const,
    decode(event: Event): ParachainStaking.CandidateBondedMore {
        if (parachainStaking.joinedCollatorCandidates.v900.is(event)) {
            const [account, amount, newTotal] =
                parachainStaking.joinedCollatorCandidates.v900.decode(event)
            return {
                account,
                amount,
                newTotal,
            }
        } else if (parachainStaking.joinedCollatorCandidates.v1300.is(event)) {
            const {account, amountLocked, newTotalAmtLocked} =
                parachainStaking.joinedCollatorCandidates.v1300.decode(event)
            return {
                account,
                amount: amountLocked,
                newTotal: newTotalAmtLocked,
            }
        } else {
            throw new UnknownVersionError(event)
        }
    },
}

export const CollatorBondedLess = {
    names: {'ParachainStaking.CollatorBondedLess': true} as const,
    decode(event: Event): ParachainStaking.CandidateBondedLess {
        if (parachainStaking.collatorBondedLess.v900.is(event)) {
            const [account, amount, newTotal] =
                parachainStaking.collatorBondedLess.v900.decode(event)
            return {
                account,
                amount,
                newTotal,
            }
        } else {
            throw new UnknownVersionError(event)
        }
    },
}

export const CandidateBondedLess = {
    names: {'ParachainStaking.CandidateBondedLess': true, ...CollatorBondedLess.names} as const,
    decode(event: Event): ParachainStaking.CandidateBondedLess {
        if (event.name in CollatorBondedLess.names) {
            return CollatorBondedLess.decode(event)
        } else {
            if (parachainStaking.candidateBondedLess.v1001.is(event)) {
                const [account, amount, newTotal] =
                    parachainStaking.candidateBondedLess.v1001.decode(event)
                return {
                    account,
                    amount,
                    newTotal,
                }
            } else if (parachainStaking.candidateBondedLess.v1300.is(event)) {
                const {candidate: account, amount, newBond: newTotal} =
                    parachainStaking.candidateBondedLess.v1300.decode(event)
                return {
                    account,
                    amount,
                    newTotal,
                }
            }
            throw new UnknownVersionError(event)
        }
    },
} as const

export const CollatorBondedMore = {
    names: {'ParachainStaking.CollatorBondedMore': true} as const,
    decode(event: Event): ParachainStaking.CandidateBondedLess {
        if (parachainStaking.collatorBondedMore.v900.is(event)) {
            const [account, amount, newTotal] =
                parachainStaking.collatorBondedMore.v900.decode(event)
            return {
                account,
                amount,
                newTotal,
            }
        } else {
            throw new UnknownVersionError(event)
        }
    },
}

export const CandidateBondedMore = {
    names: {'ParachainStaking.CandidateBondedMore': true, ...CollatorBondedMore.names} as const,
    decode(event: Event): ParachainStaking.CandidateBondedLess {
        if (event.name in CollatorBondedMore.names) {
            return CollatorBondedMore.decode(event)
        } else {
            if (parachainStaking.candidateBondedMore.v1001.is(event)) {
                const [account, amount, newTotal] =
                    parachainStaking.candidateBondedMore.v1001.decode(event)
                return {
                    account,
                    amount,
                    newTotal,
                }
            } else if (parachainStaking.candidateBondedMore.v1300.is(event)) {
                const {candidate: account, amount, newTotalBond: newTotal} =
                    parachainStaking.candidateBondedMore.v1300.decode(event)
                return {
                    account,
                    amount,
                    newTotal,
                }
            } else {
                throw new UnknownVersionError(event)
            }
        }
    },
}

export const Nomination = {
    names: {'ParachainStaking.Nomination': true} as const,
    decode(event: Event): ParachainStaking.DelegationIncreased {
        if (parachainStaking.nomination.v900.is(event)) {
            const [account, amount, candidate] =
                parachainStaking.nomination.v900.decode(event)
            return {
                account,
                amount,
                candidate,
            }
        } else {
            throw new UnknownVersionError(event)
        }
    },
}

export const Delegation = {
    names: {'ParachainStaking.Delegation': true, ...Nomination.names} as const,
    decode(event: Event): ParachainStaking.DelegationIncreased {
        if (event.name in Nomination.names) {
            return Nomination.decode(event)
        } else {
            if (parachainStaking.delegation.v1001.is(event)) {
                const [account, amount, candidate] =
                    parachainStaking.delegation.v1001.decode(event)
                return {
                    account,
                    amount,
                    candidate,
                }
            } else if (parachainStaking.delegation.v1300.is(event)) {
                const {delegator: account, lockedAmount: amount, candidate} =
                    parachainStaking.delegation.v1300.decode(event)
                return {
                    account,
                    amount,
                    candidate,
                }
            } else if (parachainStaking.delegation.v1901.is(event)) {
                const {delegator: account, lockedAmount: amount, candidate} =
                    parachainStaking.delegation.v1901.decode(event)
                return {
                    account,
                    amount,
                    candidate,
                }
            } else {
                throw new UnknownVersionError(event)
            }
        }
    },
}

export const NominationIncreased = {
    names: {'ParachainStaking.NominationIncreased': true} as const,
    decode(event: Event): ParachainStaking.DelegationIncreased {
        if (parachainStaking.nominationIncreased.v900.is(event)) {
            const [account, candidate, amount] =
                parachainStaking.nominationIncreased.v900.decode(event)
            return {
                account,
                amount,
                candidate,
            }
        } else {
            throw new UnknownVersionError(event)
        }
    },
}

export const DelegationIncreased = {
    names: {'ParachainStaking.DelegationIncreased': true, ...NominationIncreased.names} as const,
    decode(event: Event): ParachainStaking.DelegationIncreased {
        if (event.name in NominationIncreased.names) {
            return NominationIncreased.decode(event)
        } else {
            if (parachainStaking.delegationIncreased.v1001.is(event)) {
                const [account, candidate, amount] =
                    parachainStaking.delegationIncreased.v1001.decode(event)
                return {
                    account,
                    amount,
                    candidate,
                }
            } else if (parachainStaking.delegationIncreased.v1300.is(event)) {
                const {delegator: account, amount: amount, candidate} =
                    parachainStaking.delegationIncreased.v1300.decode(event)
                return {
                    account,
                    amount,
                    candidate,
                }
            }
            throw new UnknownVersionError(event)
        }
    },
}

export const NominationDecreased = {
    names: {'ParachainStaking.NominationDecreased': true} as const,
    decode(event: Event): ParachainStaking.DelegationDecreased {
        if (parachainStaking.nominationDecreased.v900.is(event)) {
            const [account, candidate, amount] =
                parachainStaking.nominationDecreased.v900.decode(event)
            return {
                account,
                amount,
                candidate,
            }
        } else {
            throw new UnknownVersionError(event)
        }
    },
}

export const DelegationDecreased = {
    names: {'ParachainStaking.DelegationDecreased': true, ...NominationDecreased.names} as const,
    decode(event: Event): ParachainStaking.DelegationDecreased {
        if (event.name in NominationDecreased.names) {
            return NominationDecreased.decode(event)
        } else {
            if (parachainStaking.delegationDecreased.v1001.is(event)) {
                const [account, candidate, amount] =
                    parachainStaking.delegationDecreased.v1001.decode(event)
                return {
                    account,
                    amount,
                    candidate,
                }
            } else if (parachainStaking.delegationDecreased.v1300.is(event)) {
                const {delegator: account, amount: amount, candidate} =
                    parachainStaking.delegationDecreased.v1300.decode(event)
                return {
                    account,
                    amount,
                    candidate,
                }
            } else {
                throw new UnknownVersionError(event)
            }
        }
    },
}

export const DelegationRevoked = {
    names: {'ParachainStaking.DelegationRevoked': true} as const,
    decode(event: Event): ParachainStaking.DelegationDecreased {
        if (parachainStaking.delegationRevoked.v1001.is(event)) {
            const [account, candidate, amount] =
                parachainStaking.delegationRevoked.v1001.decode(event)
            return {
                account,
                amount,
                candidate,
            }
        } else if (parachainStaking.delegationRevoked.v1300.is(event)) {
            const {delegator: account, unstakedAmount: amount, candidate} =
                parachainStaking.delegationRevoked.v1300.decode(event)
            return {
                account,
                amount,
                candidate,
            }
        }
        throw new UnknownVersionError(event)
    },
}

export const Rewarded = {
    names: {'ParachainStaking.Rewarded': true} as const,
    decode(event: Event) {
        if (parachainStaking.rewarded.v900.is(event)) {
            const [account, amount] =
                parachainStaking.rewarded.v900.decode(event)
            return {
                account,
                amount,
            }
        } else if (parachainStaking.rewarded.v1300.is(event)) {
            const {account, rewards: amount} =
                parachainStaking.rewarded.v1300.decode(event)
            return {
                account,
                amount,
            }
        } else {
            throw new UnknownVersionError(event)
        }
    },
}

export const Compounded = {
    decode(event: Event) {
        if (parachainStaking.compounded.v1901.is(event)) {
            const {delegator: account, amount} =
                parachainStaking.compounded.v1901.decode(event)
            return {
                account,
                amount,
            }
        } else {
            throw new UnknownVersionError(event)
        }
    },
}
