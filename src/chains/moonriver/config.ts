const config = {
    chainName: 'moonriver',
    prefix: '',
    gateway: 'https://v2.archive.subsquid.io/network/moonriver-substrate',
    chain: {
        url: process.env.MOONRIVER_CHAIN_NODE || 'wss://wss.api.moonriver.moonbeam.network',
        rateLimit: 10,
    },
}

export default config
