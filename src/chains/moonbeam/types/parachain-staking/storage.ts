import {sts, Block, Bytes, Option, Result, StorageType, storage as storage_, RuntimeCtx, GetStorageType} from '../support'
import * as v900 from '../v900'
import * as v1001 from '../v1001'
import * as v1201 from '../v1201'
import * as v1502 from '../v1502'
import * as v2801 from '../v2801'

export const collatorCommission = storage_('ParachainStaking.collatorCommission', {
    /**
     *  Commission percent taken off of rewards for all collators
     */
    v900: {key: [], value: v900.Perbill, modifier: 'Default', isKeyDecodable: true} as const,
})

/**
 *  Commission percent taken off of rewards for all collators
 */
export type CollatorCommissionV900 = GetStorageType<[], v900.Perbill, 'Default', true>

export const round = storage_('ParachainStaking.round', {
    /**
     *  Current round index and next round scheduled transition
     */
    v900: {key: [], value: v900.RoundInfo, modifier: 'Default', isKeyDecodable: true} as const,
    /**
     *  Current round index and next round scheduled transition
     */
    v2801: {key: [], value: v2801.RoundInfo, modifier: 'Default', isKeyDecodable: true} as const,
})

/**
 *  Current round index and next round scheduled transition
 */
export type RoundV900 = GetStorageType<[], v900.RoundInfo, 'Default', true>

/**
 *  Current round index and next round scheduled transition
 */
export type RoundV2801 = GetStorageType<[], v2801.RoundInfo, 'Default', true>

export const nominatorState2 = storage_('ParachainStaking.nominatorState2', {
    /**
     *  Get nominator state associated with an account if account is nominating else None
     */
    v900: {key: [v900.H160], value: v900.Nominator2, modifier: 'Optional', isKeyDecodable: true} as const,
    /**
     *  DEPRECATED in favor of DelegatorState
     *  Get nominator state associated with an account if account is nominating else None
     */
    v1001: {key: [v1001.AccountId20], value: v1001.Nominator2, modifier: 'Optional', isKeyDecodable: true} as const,
})

/**
 *  Get nominator state associated with an account if account is nominating else None
 */
export type NominatorState2V900 = GetStorageType<[key: v900.H160], v900.Nominator2, 'Optional', true>

/**
 *  DEPRECATED in favor of DelegatorState
 *  Get nominator state associated with an account if account is nominating else None
 */
export type NominatorState2V1001 = GetStorageType<[key: v1001.AccountId20], v1001.Nominator2, 'Optional', true>

export const collatorState2 = storage_('ParachainStaking.collatorState2', {
    /**
     *  Get collator state associated with an account if account is collating else None
     */
    v900: {key: [v900.H160], value: v900.Collator2, modifier: 'Optional', isKeyDecodable: true} as const,
})

/**
 *  Get collator state associated with an account if account is collating else None
 */
export type CollatorState2V900 = GetStorageType<[key: v900.H160], v900.Collator2, 'Optional', true>

export const selectedCandidates = storage_('ParachainStaking.selectedCandidates', {
    /**
     *  The collator candidates selected for the current round
     */
    v900: {key: [], value: sts.array(() => v900.H160), modifier: 'Default', isKeyDecodable: true} as const,
})

/**
 *  The collator candidates selected for the current round
 */
export type SelectedCandidatesV900 = GetStorageType<[], v900.H160[], 'Default', true>

export const delegatorState = storage_('ParachainStaking.delegatorState', {
    /**
     *  Get delegator state associated with an account if account is delegating else None
     */
    v1001: {key: [v1001.AccountId20], value: v1001.Delegator, modifier: 'Optional', isKeyDecodable: true} as const,
    /**
     *  Get delegator state associated with an account if account is delegating else None
     */
    v1502: {key: [v1502.AccountId20], value: v1502.Delegator, modifier: 'Optional', isKeyDecodable: true} as const,
})

/**
 *  Get delegator state associated with an account if account is delegating else None
 */
export type DelegatorStateV1001 = GetStorageType<[key: v1001.AccountId20], v1001.Delegator, 'Optional', true>

/**
 *  Get delegator state associated with an account if account is delegating else None
 */
export type DelegatorStateV1502 = GetStorageType<[key: v1502.AccountId20], v1502.Delegator, 'Optional', true>

export const candidateState = storage_('ParachainStaking.candidateState', {
    /**
     *  Get collator candidate state associated with an account if account is a candidate else None
     */
    v1001: {key: [v1001.AccountId20], value: v1001.CollatorCandidate, modifier: 'Optional', isKeyDecodable: true} as const,
})

/**
 *  Get collator candidate state associated with an account if account is a candidate else None
 */
export type CandidateStateV1001 = GetStorageType<[key: v1001.AccountId20], v1001.CollatorCandidate, 'Optional', true>

export const candidateInfo = storage_('ParachainStaking.candidateInfo', {
    /**
     *  Get collator candidate info associated with an account if account is candidate else None
     */
    v1201: {key: [v1201.AccountId20], value: v1201.CandidateMetadata, modifier: 'Optional', isKeyDecodable: true} as const,
})

/**
 *  Get collator candidate info associated with an account if account is candidate else None
 */
export type CandidateInfoV1201 = GetStorageType<[key: v1201.AccountId20], v1201.CandidateMetadata, 'Optional', true>

export const topDelegations = storage_('ParachainStaking.topDelegations', {
    /**
     *  Top delegations for collator candidate
     */
    v1201: {key: [v1201.AccountId20], value: v1201.Delegations, modifier: 'Optional', isKeyDecodable: true} as const,
})

/**
 *  Top delegations for collator candidate
 */
export type TopDelegationsV1201 = GetStorageType<[key: v1201.AccountId20], v1201.Delegations, 'Optional', true>

export const bottomDelegations = storage_('ParachainStaking.bottomDelegations', {
    /**
     *  Bottom delegations for collator candidate
     */
    v1201: {key: [v1201.AccountId20], value: v1201.Delegations, modifier: 'Optional', isKeyDecodable: true} as const,
})

/**
 *  Bottom delegations for collator candidate
 */
export type BottomDelegationsV1201 = GetStorageType<[key: v1201.AccountId20], v1201.Delegations, 'Optional', true>
