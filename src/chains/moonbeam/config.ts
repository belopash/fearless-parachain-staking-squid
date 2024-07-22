const config = {
    chainName: 'moonbeam',
    prefix: '',
    gateway: 'https://v2.archive.subsquid.io/network/moonbeam-substrate',
    chain: {
        url: process.env.MOONBEAM_CHAIN_NODE || 'wss://wss.api.moonbeam.network',
        rateLimit: 10,
    },
    typesBundle: 'moonbeam',
}

export default config
