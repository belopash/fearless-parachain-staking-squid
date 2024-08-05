import {UnknownVersionError} from '../../../../utils/errors'
import {parachainStaking} from '../../types/events'
import {Event} from '../../../fields'

export const NewRound = {
    names: {'ParachainStaking.NewRound': true} as const,
    decode(event: Event): ParachainStaking.NewRound {
        return parachainStaking.newRound.at(event.block, (e, v) => {
            switch (v) {
                case 'v1300': {
                    return e.decode(event)
                }
                case 'v900': {
                    const [startingBlock, round, selectedCollatorsNumber, totalBalance] = e.decode(event)
                    return {startingBlock, round, selectedCollatorsNumber, totalBalance}
                }
                default:
                    throw new UnknownVersionError(event)
            }
        })
    },
}

export const JoinedCollatorCandidates = {
    names: {'ParachainStaking.JoinedCollatorCandidates': true} as const,
    decode(event: Event): ParachainStaking.CandidateBondedMore {
        return parachainStaking.joinedCollatorCandidates.at(event.block, (e, v) => {
            switch (v) {
                case 'v1300': {
                    const {account, amountLocked, newTotalAmtLocked} = e.decode(event)
                    return {
                        account,
                        amount: amountLocked,
                        newTotal: newTotalAmtLocked,
                    }
                }
                case 'v900': {
                    const [account, amount, newTotal] = e.decode(event)
                    return {
                        account,
                        amount,
                        newTotal,
                    }
                }
                default:
                    throw new UnknownVersionError(event)
            }
        })
    },
}

export const CollatorBondedLess = {
    names: {'ParachainStaking.CollatorBondedLess': true} as const,
    decode(event: Event): ParachainStaking.CandidateBondedLess {
        return parachainStaking.collatorBondedLess.at(event.block, (e, v) => {
            switch (v) {
                case 'v900': {
                    const [account, amount, newTotal] = e.decode(event)
                    return {
                        account,
                        amount,
                        newTotal,
                    }
                }
                default:
                    throw new UnknownVersionError(event)
            }
        })
    },
}

export const CandidateBondedLess = {
    names: {'ParachainStaking.CandidateBondedLess': true, ...CollatorBondedLess.names} as const,
    decode(event: Event): ParachainStaking.CandidateBondedLess {
        if (event.name in CollatorBondedLess.names) {
            return CollatorBondedLess.decode(event)
        } else {
            return parachainStaking.candidateBondedLess.at(event.block, (e, v) => {
                switch (v) {
                    case 'v1300': {
                        const {candidate: account, amount, newBond: newTotal} = e.decode(event)
                        return {
                            account,
                            amount,
                            newTotal,
                        }
                    }
                    case 'v1001': {
                        const [account, amount, newTotal] = e.decode(event)
                        return {
                            account,
                            amount,
                            newTotal,
                        }
                    }
                    default:
                        throw new UnknownVersionError(event)
                }
            })
        }
    },
} as const

export const CollatorBondedMore = {
    names: {'ParachainStaking.CollatorBondedMore': true} as const,
    decode(event: Event): ParachainStaking.CandidateBondedLess {
        return parachainStaking.collatorBondedMore.at(event.block, (e, v) => {
            switch (v) {
                case 'v900': {
                    const [account, amount, newTotal] = e.decode(event)
                    return {
                        account,
                        amount,
                        newTotal,
                    }
                }
                default:
                    throw new UnknownVersionError(event)
            }
        })
    },
}

export const CandidateBondedMore = {
    names: {'ParachainStaking.CandidateBondedMore': true, ...CollatorBondedMore.names} as const,
    decode(event: Event): ParachainStaking.CandidateBondedLess {
        if (event.name in CollatorBondedMore.names) {
            return CollatorBondedMore.decode(event)
        } else {
            return parachainStaking.candidateBondedMore.at(event.block, (e, v) => {
                switch (v) {
                    case 'v1300': {
                        const {candidate: account, amount, newTotalBond: newTotal} = e.decode(event)
                        return {
                            account,
                            amount,
                            newTotal,
                        }
                    }
                    case 'v1001': {
                        const [account, amount, newTotal] = e.decode(event)
                        return {
                            account,
                            amount,
                            newTotal,
                        }
                    }
                    default:
                        throw new UnknownVersionError(event)
                }
            })
        }
    },
}

export const Nomination = {
    names: {'ParachainStaking.Nomination': true} as const,
    decode(event: Event): ParachainStaking.DelegationIncreased {
        return parachainStaking.nomination.at(event.block, (e, v) => {
            switch (v) {
                case 'v900': {
                    const [account, amount, candidate] = e.decode(event)
                    return {
                        account,
                        amount,
                        candidate,
                    }
                }
                default:
                    throw new UnknownVersionError(event)
            }
        })
    },
}

export const Delegation = {
    names: {'ParachainStaking.Delegation': true, ...Nomination.names} as const,
    decode(event: Event): ParachainStaking.DelegationIncreased {
        if (event.name in Nomination.names) {
            return Nomination.decode(event)
        } else {
            return parachainStaking.delegation.at(event.block, (e, v) => {
                switch (v) {
                    case 'v1901': {
                        const {delegator: account, lockedAmount: amount, candidate} = e.decode(event)
                        return {
                            account,
                            amount,
                            candidate,
                        }
                    }
                    case 'v1300': {
                        const {delegator: account, lockedAmount: amount, candidate} = e.decode(event)
                        return {
                            account,
                            amount,
                            candidate,
                        }
                    }
                    case 'v1001': {
                        const [account, amount, candidate] = e.decode(event)
                        return {
                            account,
                            amount,
                            candidate,
                        }
                    }
                    default:
                        throw new UnknownVersionError(event)
                }
            })
        }
    },
}

export const NominationIncreased = {
    names: {'ParachainStaking.NominationIncreased': true} as const,
    decode(event: Event): ParachainStaking.DelegationIncreased {
        return parachainStaking.nominationIncreased.at(event.block, (e, v) => {
            switch (v) {
                case 'v900': {
                    const [account, candidate, amount] = e.decode(event)
                    return {
                        account,
                        amount,
                        candidate,
                    }
                }
                default:
                    throw new UnknownVersionError(event)
            }
        })
    },
}

export const DelegationIncreased = {
    names: {'ParachainStaking.DelegationIncreased': true, ...NominationIncreased.names} as const,
    decode(event: Event): ParachainStaking.DelegationIncreased {
        if (event.name in NominationIncreased.names) {
            return NominationIncreased.decode(event)
        } else {
            return parachainStaking.delegationIncreased.at(event.block, (e, v) => {
                switch (v) {
                    case 'v1300': {
                        const {delegator: account, amount: amount, candidate} = e.decode(event)
                        return {
                            account,
                            amount,
                            candidate,
                        }
                    }
                    case 'v1001': {
                        const [account, candidate, amount] = e.decode(event)
                        return {
                            account,
                            amount,
                            candidate,
                        }
                    }
                    default:
                        throw new UnknownVersionError(event)
                }
            })
        }
    },
}

export const NominationDecreased = {
    names: {'ParachainStaking.NominationDecreased': true} as const,
    decode(event: Event): ParachainStaking.DelegationDecreased {
        return parachainStaking.nominationDecreased.at(event.block, (e, v) => {
            switch (v) {
                case 'v900': {
                    const [account, candidate, amount] = e.decode(event)
                    return {
                        account,
                        amount,
                        candidate,
                    }
                }
                default:
                    throw new UnknownVersionError(event)
            }
        })
    },
}

export const DelegationDecreased = {
    names: {'ParachainStaking.DelegationDecreased': true, ...NominationDecreased.names} as const,
    decode(event: Event): ParachainStaking.DelegationDecreased {
        if (event.name in NominationDecreased.names) {
            return NominationDecreased.decode(event)
        } else {
            return parachainStaking.delegationDecreased.at(event.block, (e, v) => {
                switch (v) {
                    case 'v1300': {
                        const {delegator: account, amount: amount, candidate} = e.decode(event)
                        return {
                            account,
                            amount,
                            candidate,
                        }
                    }
                    case 'v1001': {
                        const [account, candidate, amount] = e.decode(event)
                        return {
                            account,
                            amount,
                            candidate,
                        }
                    }
                    default:
                        throw new UnknownVersionError(event)
                }
            })
        }
    },
}

export const DelegationRevoked = {
    names: {'ParachainStaking.DelegationRevoked': true} as const,
    decode(event: Event): ParachainStaking.DelegationDecreased {
        return parachainStaking.delegationRevoked.at(event.block, (e, v) => {
            switch (v) {
                case 'v1300': {
                    const {delegator: account, unstakedAmount: amount, candidate} = e.decode(event)
                    return {
                        account,
                        amount,
                        candidate,
                    }
                }
                case 'v1001': {
                    const [account, candidate, amount] = e.decode(event)
                    return {
                        account,
                        amount,
                        candidate,
                    }
                }
                default:
                    throw new UnknownVersionError(event)
            }
        })
    },
}

export const Rewarded = {
    names: {'ParachainStaking.Rewarded': true} as const,
    decode(event: Event) {
        return parachainStaking.rewarded.at(event.block, (e, v) => {
            switch (v) {
                case 'v1300': {
                    const {account, rewards: amount} = e.decode(event)
                    return {
                        account,
                        amount,
                    }
                }
                case 'v900': {
                    const [account, amount] = e.decode(event)
                    return {
                        account,
                        amount,
                    }
                }
                default:
                    throw new UnknownVersionError(event)
            }
        })
    },
}

export const Compounded = {
    decode(event: Event) {
        return parachainStaking.compounded.at(event.block, (e, v) => {
            switch (v) {
                case 'v1901': {
                    const {delegator: account, amount} = e.decode(event)
                    return {
                        account,
                        amount,
                    }
                }
                default:
                    throw new UnknownVersionError(event)
            }
        })
    },
}
