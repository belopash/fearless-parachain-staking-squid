import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v900 from '../v900'
import * as v1001 from '../v1001'
import * as v1201 from '../v1201'
import * as v1502 from '../v1502'
import * as v2801 from '../v2801'

export const collatorCommission =  {
    /**
     *  Commission percent taken off of rewards for all collators
     */
    v900: new StorageType('ParachainStaking.CollatorCommission', 'Default', [], v900.Perbill) as CollatorCommissionV900,
}

/**
 *  Commission percent taken off of rewards for all collators
 */
export interface CollatorCommissionV900  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v900.Perbill
    get(block: Block): Promise<(v900.Perbill | undefined)>
}

export const round =  {
    /**
     *  Current round index and next round scheduled transition
     */
    v900: new StorageType('ParachainStaking.Round', 'Default', [], v900.RoundInfo) as RoundV900,
    /**
     *  Current round index and next round scheduled transition
     */
    v2801: new StorageType('ParachainStaking.Round', 'Default', [], v2801.RoundInfo) as RoundV2801,
}

/**
 *  Current round index and next round scheduled transition
 */
export interface RoundV900  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v900.RoundInfo
    get(block: Block): Promise<(v900.RoundInfo | undefined)>
}

/**
 *  Current round index and next round scheduled transition
 */
export interface RoundV2801  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v2801.RoundInfo
    get(block: Block): Promise<(v2801.RoundInfo | undefined)>
}

export const nominatorState2 =  {
    /**
     *  Get nominator state associated with an account if account is nominating else None
     */
    v900: new StorageType('ParachainStaking.NominatorState2', 'Optional', [v900.H160], v900.Nominator2) as NominatorState2V900,
    /**
     *  DEPRECATED in favor of DelegatorState
     *  Get nominator state associated with an account if account is nominating else None
     */
    v1001: new StorageType('ParachainStaking.NominatorState2', 'Optional', [v1001.AccountId20], v1001.Nominator2) as NominatorState2V1001,
}

/**
 *  Get nominator state associated with an account if account is nominating else None
 */
export interface NominatorState2V900  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v900.H160): Promise<(v900.Nominator2 | undefined)>
    getMany(block: Block, keys: v900.H160[]): Promise<(v900.Nominator2 | undefined)[]>
    getKeys(block: Block): Promise<v900.H160[]>
    getKeys(block: Block, key: v900.H160): Promise<v900.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v900.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v900.H160): AsyncIterable<v900.H160[]>
    getPairs(block: Block): Promise<[k: v900.H160, v: (v900.Nominator2 | undefined)][]>
    getPairs(block: Block, key: v900.H160): Promise<[k: v900.H160, v: (v900.Nominator2 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v900.H160, v: (v900.Nominator2 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v900.H160): AsyncIterable<[k: v900.H160, v: (v900.Nominator2 | undefined)][]>
}

/**
 *  DEPRECATED in favor of DelegatorState
 *  Get nominator state associated with an account if account is nominating else None
 */
export interface NominatorState2V1001  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1001.AccountId20): Promise<(v1001.Nominator2 | undefined)>
    getMany(block: Block, keys: v1001.AccountId20[]): Promise<(v1001.Nominator2 | undefined)[]>
    getKeys(block: Block): Promise<v1001.AccountId20[]>
    getKeys(block: Block, key: v1001.AccountId20): Promise<v1001.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v1001.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block, key: v1001.AccountId20): AsyncIterable<v1001.AccountId20[]>
    getPairs(block: Block): Promise<[k: v1001.AccountId20, v: (v1001.Nominator2 | undefined)][]>
    getPairs(block: Block, key: v1001.AccountId20): Promise<[k: v1001.AccountId20, v: (v1001.Nominator2 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v1001.AccountId20, v: (v1001.Nominator2 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v1001.AccountId20): AsyncIterable<[k: v1001.AccountId20, v: (v1001.Nominator2 | undefined)][]>
}

export const collatorState2 =  {
    /**
     *  Get collator state associated with an account if account is collating else None
     */
    v900: new StorageType('ParachainStaking.CollatorState2', 'Optional', [v900.H160], v900.Collator2) as CollatorState2V900,
}

/**
 *  Get collator state associated with an account if account is collating else None
 */
export interface CollatorState2V900  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v900.H160): Promise<(v900.Collator2 | undefined)>
    getMany(block: Block, keys: v900.H160[]): Promise<(v900.Collator2 | undefined)[]>
    getKeys(block: Block): Promise<v900.H160[]>
    getKeys(block: Block, key: v900.H160): Promise<v900.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v900.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v900.H160): AsyncIterable<v900.H160[]>
    getPairs(block: Block): Promise<[k: v900.H160, v: (v900.Collator2 | undefined)][]>
    getPairs(block: Block, key: v900.H160): Promise<[k: v900.H160, v: (v900.Collator2 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v900.H160, v: (v900.Collator2 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v900.H160): AsyncIterable<[k: v900.H160, v: (v900.Collator2 | undefined)][]>
}

export const selectedCandidates =  {
    /**
     *  The collator candidates selected for the current round
     */
    v900: new StorageType('ParachainStaking.SelectedCandidates', 'Default', [], sts.array(() => v900.H160)) as SelectedCandidatesV900,
}

/**
 *  The collator candidates selected for the current round
 */
export interface SelectedCandidatesV900  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v900.H160[]
    get(block: Block): Promise<(v900.H160[] | undefined)>
}

export const delegatorState =  {
    /**
     *  Get delegator state associated with an account if account is delegating else None
     */
    v1001: new StorageType('ParachainStaking.DelegatorState', 'Optional', [v1001.AccountId20], v1001.Delegator) as DelegatorStateV1001,
    /**
     *  Get delegator state associated with an account if account is delegating else None
     */
    v1502: new StorageType('ParachainStaking.DelegatorState', 'Optional', [v1502.AccountId20], v1502.Delegator) as DelegatorStateV1502,
}

/**
 *  Get delegator state associated with an account if account is delegating else None
 */
export interface DelegatorStateV1001  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1001.AccountId20): Promise<(v1001.Delegator | undefined)>
    getMany(block: Block, keys: v1001.AccountId20[]): Promise<(v1001.Delegator | undefined)[]>
    getKeys(block: Block): Promise<v1001.AccountId20[]>
    getKeys(block: Block, key: v1001.AccountId20): Promise<v1001.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v1001.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block, key: v1001.AccountId20): AsyncIterable<v1001.AccountId20[]>
    getPairs(block: Block): Promise<[k: v1001.AccountId20, v: (v1001.Delegator | undefined)][]>
    getPairs(block: Block, key: v1001.AccountId20): Promise<[k: v1001.AccountId20, v: (v1001.Delegator | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v1001.AccountId20, v: (v1001.Delegator | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v1001.AccountId20): AsyncIterable<[k: v1001.AccountId20, v: (v1001.Delegator | undefined)][]>
}

/**
 *  Get delegator state associated with an account if account is delegating else None
 */
export interface DelegatorStateV1502  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1502.AccountId20): Promise<(v1502.Delegator | undefined)>
    getMany(block: Block, keys: v1502.AccountId20[]): Promise<(v1502.Delegator | undefined)[]>
    getKeys(block: Block): Promise<v1502.AccountId20[]>
    getKeys(block: Block, key: v1502.AccountId20): Promise<v1502.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v1502.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block, key: v1502.AccountId20): AsyncIterable<v1502.AccountId20[]>
    getPairs(block: Block): Promise<[k: v1502.AccountId20, v: (v1502.Delegator | undefined)][]>
    getPairs(block: Block, key: v1502.AccountId20): Promise<[k: v1502.AccountId20, v: (v1502.Delegator | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v1502.AccountId20, v: (v1502.Delegator | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v1502.AccountId20): AsyncIterable<[k: v1502.AccountId20, v: (v1502.Delegator | undefined)][]>
}

export const candidateState =  {
    /**
     *  Get collator candidate state associated with an account if account is a candidate else None
     */
    v1001: new StorageType('ParachainStaking.CandidateState', 'Optional', [v1001.AccountId20], v1001.CollatorCandidate) as CandidateStateV1001,
}

/**
 *  Get collator candidate state associated with an account if account is a candidate else None
 */
export interface CandidateStateV1001  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1001.AccountId20): Promise<(v1001.CollatorCandidate | undefined)>
    getMany(block: Block, keys: v1001.AccountId20[]): Promise<(v1001.CollatorCandidate | undefined)[]>
    getKeys(block: Block): Promise<v1001.AccountId20[]>
    getKeys(block: Block, key: v1001.AccountId20): Promise<v1001.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v1001.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block, key: v1001.AccountId20): AsyncIterable<v1001.AccountId20[]>
    getPairs(block: Block): Promise<[k: v1001.AccountId20, v: (v1001.CollatorCandidate | undefined)][]>
    getPairs(block: Block, key: v1001.AccountId20): Promise<[k: v1001.AccountId20, v: (v1001.CollatorCandidate | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v1001.AccountId20, v: (v1001.CollatorCandidate | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v1001.AccountId20): AsyncIterable<[k: v1001.AccountId20, v: (v1001.CollatorCandidate | undefined)][]>
}

export const candidateInfo =  {
    /**
     *  Get collator candidate info associated with an account if account is candidate else None
     */
    v1201: new StorageType('ParachainStaking.CandidateInfo', 'Optional', [v1201.AccountId20], v1201.CandidateMetadata) as CandidateInfoV1201,
}

/**
 *  Get collator candidate info associated with an account if account is candidate else None
 */
export interface CandidateInfoV1201  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1201.AccountId20): Promise<(v1201.CandidateMetadata | undefined)>
    getMany(block: Block, keys: v1201.AccountId20[]): Promise<(v1201.CandidateMetadata | undefined)[]>
    getKeys(block: Block): Promise<v1201.AccountId20[]>
    getKeys(block: Block, key: v1201.AccountId20): Promise<v1201.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v1201.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block, key: v1201.AccountId20): AsyncIterable<v1201.AccountId20[]>
    getPairs(block: Block): Promise<[k: v1201.AccountId20, v: (v1201.CandidateMetadata | undefined)][]>
    getPairs(block: Block, key: v1201.AccountId20): Promise<[k: v1201.AccountId20, v: (v1201.CandidateMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v1201.AccountId20, v: (v1201.CandidateMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v1201.AccountId20): AsyncIterable<[k: v1201.AccountId20, v: (v1201.CandidateMetadata | undefined)][]>
}

export const topDelegations =  {
    /**
     *  Top delegations for collator candidate
     */
    v1201: new StorageType('ParachainStaking.TopDelegations', 'Optional', [v1201.AccountId20], v1201.Delegations) as TopDelegationsV1201,
}

/**
 *  Top delegations for collator candidate
 */
export interface TopDelegationsV1201  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1201.AccountId20): Promise<(v1201.Delegations | undefined)>
    getMany(block: Block, keys: v1201.AccountId20[]): Promise<(v1201.Delegations | undefined)[]>
    getKeys(block: Block): Promise<v1201.AccountId20[]>
    getKeys(block: Block, key: v1201.AccountId20): Promise<v1201.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v1201.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block, key: v1201.AccountId20): AsyncIterable<v1201.AccountId20[]>
    getPairs(block: Block): Promise<[k: v1201.AccountId20, v: (v1201.Delegations | undefined)][]>
    getPairs(block: Block, key: v1201.AccountId20): Promise<[k: v1201.AccountId20, v: (v1201.Delegations | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v1201.AccountId20, v: (v1201.Delegations | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v1201.AccountId20): AsyncIterable<[k: v1201.AccountId20, v: (v1201.Delegations | undefined)][]>
}

export const bottomDelegations =  {
    /**
     *  Bottom delegations for collator candidate
     */
    v1201: new StorageType('ParachainStaking.BottomDelegations', 'Optional', [v1201.AccountId20], v1201.Delegations) as BottomDelegationsV1201,
}

/**
 *  Bottom delegations for collator candidate
 */
export interface BottomDelegationsV1201  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1201.AccountId20): Promise<(v1201.Delegations | undefined)>
    getMany(block: Block, keys: v1201.AccountId20[]): Promise<(v1201.Delegations | undefined)[]>
    getKeys(block: Block): Promise<v1201.AccountId20[]>
    getKeys(block: Block, key: v1201.AccountId20): Promise<v1201.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v1201.AccountId20[]>
    getKeysPaged(pageSize: number, block: Block, key: v1201.AccountId20): AsyncIterable<v1201.AccountId20[]>
    getPairs(block: Block): Promise<[k: v1201.AccountId20, v: (v1201.Delegations | undefined)][]>
    getPairs(block: Block, key: v1201.AccountId20): Promise<[k: v1201.AccountId20, v: (v1201.Delegations | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v1201.AccountId20, v: (v1201.Delegations | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v1201.AccountId20): AsyncIterable<[k: v1201.AccountId20, v: (v1201.Delegations | undefined)][]>
}
