import {
    DataHandlerContext,
    Event as _Event,
    Block as _Block,
    BlockHeader as _BlockHeader
} from '@subsquid/substrate-processor'
import {Store} from '@subsquid/typeorm-store'

export const DEFAULT_SELECTION = {
    block: {
        timestamp: true,
    },
    event: {
        args: true,
    },
} as const

export type BatchContext = DataHandlerContext<Store, typeof DEFAULT_SELECTION>
export type Event = _Event<typeof DEFAULT_SELECTION>
export type BlockHeader = _BlockHeader<typeof DEFAULT_SELECTION>