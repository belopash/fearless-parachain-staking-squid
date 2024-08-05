import {sts, Block, Bytes, Option, Result, EventType, event as event_, RuntimeCtx} from '../support'
import * as v900 from '../v900'
import * as v1001 from '../v1001'
import * as v1300 from '../v1300'
import * as v1901 from '../v1901'

export const newRound = event_('ParachainStaking.NewRound', {
    /**
     * Starting Block, Round, Number of Collators Selected, Total Balance
     */
    v900: sts.tuple([sts.number(), sts.number(), sts.number(), sts.bigint()]),
    /**
     * Started new round.
     */
    v1300: sts.struct({
        startingBlock: sts.number(),
        round: sts.number(),
        selectedCollatorsNumber: sts.number(),
        totalBalance: sts.bigint(),
    }),
})

export const joinedCollatorCandidates = event_('ParachainStaking.JoinedCollatorCandidates', {
    /**
     * Account, Amount Locked, New Total Amt Locked
     */
    v900: sts.tuple([v900.H160, sts.bigint(), sts.bigint()]),
    /**
     * Account joined the set of collator candidates.
     */
    v1300: sts.struct({
        account: v1300.AccountId20,
        amountLocked: sts.bigint(),
        newTotalAmtLocked: sts.bigint(),
    }),
})

export const collatorBondedMore = event_('ParachainStaking.CollatorBondedMore', {
    /**
     * Collator Account, Old Bond, New Bond
     */
    v900: sts.tuple([v900.H160, sts.bigint(), sts.bigint()]),
})

export const collatorBondedLess = event_('ParachainStaking.CollatorBondedLess', {
    /**
     * Collator Account, Old Bond, New Bond
     */
    v900: sts.tuple([v900.H160, sts.bigint(), sts.bigint()]),
})

export const collatorLeft = event_('ParachainStaking.CollatorLeft', {
    /**
     * Account, Amount Unlocked, New Total Amt Locked
     */
    v900: sts.tuple([v900.H160, sts.bigint(), sts.bigint()]),
})

export const nominationIncreased = event_('ParachainStaking.NominationIncreased', {
    v900: sts.tuple([v900.H160, v900.H160, sts.bigint(), sts.boolean()]),
})

export const nominationDecreased = event_('ParachainStaking.NominationDecreased', {
    v900: sts.tuple([v900.H160, v900.H160, sts.bigint(), sts.boolean()]),
})

export const nominatorLeft = event_('ParachainStaking.NominatorLeft', {
    /**
     * Nominator, Amount Unstaked
     */
    v900: sts.tuple([v900.H160, sts.bigint()]),
})

export const nomination = event_('ParachainStaking.Nomination', {
    /**
     * Nominator, Amount Locked, Collator, Nominator Position with New Total Counted if in Top
     */
    v900: sts.tuple([v900.H160, sts.bigint(), v900.H160, v900.NominatorAdded]),
})

export const nominatorLeftCollator = event_('ParachainStaking.NominatorLeftCollator', {
    /**
     * Nominator, Collator, Amount Unstaked, New Total Amt Staked for Collator
     */
    v900: sts.tuple([v900.H160, v900.H160, sts.bigint(), sts.bigint()]),
})

export const rewarded = event_('ParachainStaking.Rewarded', {
    /**
     * Paid the account (nominator or collator) the balance as liquid rewards
     */
    v900: sts.tuple([v900.H160, sts.bigint()]),
    /**
     * Paid the account (delegator or collator) the balance as liquid rewards.
     */
    v1300: sts.struct({
        account: v1300.AccountId20,
        rewards: sts.bigint(),
    }),
})

export const candidateBondedMore = event_('ParachainStaking.CandidateBondedMore', {
    /**
     * Candidate, Amount, New Bond Total
     */
    v1001: sts.tuple([v1001.AccountId20, sts.bigint(), sts.bigint()]),
    /**
     * Сandidate has increased a self bond.
     */
    v1300: sts.struct({
        candidate: v1300.AccountId20,
        amount: sts.bigint(),
        newTotalBond: sts.bigint(),
    }),
})

export const candidateBondedLess = event_('ParachainStaking.CandidateBondedLess', {
    /**
     * Candidate, Amount, New Bond
     */
    v1001: sts.tuple([v1001.AccountId20, sts.bigint(), sts.bigint()]),
    /**
     * Сandidate has decreased a self bond.
     */
    v1300: sts.struct({
        candidate: v1300.AccountId20,
        amount: sts.bigint(),
        newBond: sts.bigint(),
    }),
})

export const candidateLeft = event_('ParachainStaking.CandidateLeft', {
    /**
     * Ex-Candidate, Amount Unlocked, New Total Amt Locked
     */
    v1001: sts.tuple([v1001.AccountId20, sts.bigint(), sts.bigint()]),
    /**
     * Candidate has left the set of candidates.
     */
    v1300: sts.struct({
        exCandidate: v1300.AccountId20,
        unlockedAmount: sts.bigint(),
        newTotalAmtLocked: sts.bigint(),
    }),
})

export const delegationIncreased = event_('ParachainStaking.DelegationIncreased', {
    v1001: sts.tuple([v1001.AccountId20, v1001.AccountId20, sts.bigint(), sts.boolean()]),
    v1300: sts.struct({
        delegator: v1300.AccountId20,
        candidate: v1300.AccountId20,
        amount: sts.bigint(),
        inTop: sts.boolean(),
    }),
})

export const delegationDecreased = event_('ParachainStaking.DelegationDecreased', {
    v1001: sts.tuple([v1001.AccountId20, v1001.AccountId20, sts.bigint(), sts.boolean()]),
    v1300: sts.struct({
        delegator: v1300.AccountId20,
        candidate: v1300.AccountId20,
        amount: sts.bigint(),
        inTop: sts.boolean(),
    }),
})

export const delegatorLeft = event_('ParachainStaking.DelegatorLeft', {
    /**
     * Delegator, Amount Unstaked
     */
    v1001: sts.tuple([v1001.AccountId20, sts.bigint()]),
    /**
     * Delegator has left the set of delegators.
     */
    v1300: sts.struct({
        delegator: v1300.AccountId20,
        unstakedAmount: sts.bigint(),
    }),
})

export const delegationRevoked = event_('ParachainStaking.DelegationRevoked', {
    /**
     * Delegator, Candidate, Amount Unstaked
     */
    v1001: sts.tuple([v1001.AccountId20, v1001.AccountId20, sts.bigint()]),
    /**
     * Delegation revoked.
     */
    v1300: sts.struct({
        delegator: v1300.AccountId20,
        candidate: v1300.AccountId20,
        unstakedAmount: sts.bigint(),
    }),
})

export const delegation = event_('ParachainStaking.Delegation', {
    /**
     * Delegator, Amount Locked, Candidate, Delegator Position with New Total Counted if in Top
     */
    v1001: sts.tuple([v1001.AccountId20, sts.bigint(), v1001.AccountId20, v1001.DelegatorAdded]),
    /**
     * New delegation (increase of the existing one).
     */
    v1300: sts.struct({
        delegator: v1300.AccountId20,
        lockedAmount: sts.bigint(),
        candidate: v1300.AccountId20,
        delegatorPosition: v1300.DelegatorAdded,
    }),
    /**
     * New delegation (increase of the existing one).
     */
    v1901: sts.struct({
        delegator: v1901.AccountId20,
        lockedAmount: sts.bigint(),
        candidate: v1901.AccountId20,
        delegatorPosition: v1901.DelegatorAdded,
        autoCompound: v1901.Percent,
    }),
})

export const delegatorLeftCandidate = event_('ParachainStaking.DelegatorLeftCandidate', {
    /**
     * Delegator, Candidate, Amount Unstaked, New Total Amt Staked for Candidate
     */
    v1001: sts.tuple([v1001.AccountId20, v1001.AccountId20, sts.bigint(), sts.bigint()]),
    /**
     * Delegation from candidate state has been remove.
     */
    v1300: sts.struct({
        delegator: v1300.AccountId20,
        candidate: v1300.AccountId20,
        unstakedAmount: sts.bigint(),
        totalCandidateStaked: sts.bigint(),
    }),
})

export const compounded = event_('ParachainStaking.Compounded', {
    /**
     * Compounded a portion of rewards towards the delegation.
     */
    v1901: sts.struct({
        candidate: v1901.AccountId20,
        delegator: v1901.AccountId20,
        amount: sts.bigint(),
    }),
})
