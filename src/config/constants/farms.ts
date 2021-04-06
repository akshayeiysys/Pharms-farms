import contracts from './contracts'

import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    risk: 5,
    lpSymbol: 'PHARM-BUSD LP',
    lpAddresses: {
      97: '0x09EE68A8B66572aCDf46ba669b8570e2453c0910',
      56: '0x37948281522432ff12c98315e2c9819a6da7b686',
    },
    tokenSymbol: 'PHARM',
    tokenAddresses: {
      97: '0x7233DB5d48020C97fF4B154E914B0Eb5616FfB86',
      56: '0x50dF85A6E3635B8A69b16978f31a888541f95D23',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 1,
    risk: 5,
    lpSymbol: 'PHARM-BNB LP',
    lpAddresses: {
      97: '0x56ea40258740D13d22b0a4a136095aC7F8a918E7',
      56: '0xb1C35c1F15299ABCF9728c5e4349D24581AdEa36',
    },
    tokenSymbol: 'PHARM',
    tokenAddresses: {
      97: '0x7233DB5d48020C97fF4B154E914B0Eb5616FfB86',
      56: '0x50dF85A6E3635B8A69b16978f31a888541f95D23',
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 2,
    risk: 3,
    lpSymbol: 'BNB-BUSD LP',
    lpAddresses: {
      97: '0x575Cb459b6E6B8187d3Ef9a25105D64011874820',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
    },
    tokenSymbol: 'BNB',
    tokenAddresses: {
      97: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 3,
    risk: 1,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '0x4B0598Ecf9924ce4b910179D40D29835a90f2226',
      56: '0xc15fa3e22c912a276550f3e5fe3b0deb87b55acd',
    },
    tokenSymbol: 'USDT',
    tokenAddresses: {
      97: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
      56: '0x55d398326f99059ff775485246999027b3197955',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 4,
    risk: 5,
    isTokenOnly: true,
    lpSymbol: 'PHARM',
    lpAddresses: {
      97: '0x09EE68A8B66572aCDf46ba669b8570e2453c0910',
      56: '0x37948281522432ff12c98315e2c9819a6da7b686', // PHARM-BUSD LP
    },
    tokenSymbol: 'PHARM',
    tokenAddresses: {
      97: '0x7233DB5d48020C97fF4B154E914B0Eb5616FfB86',
      56: '0x50dF85A6E3635B8A69b16978f31a888541f95D23',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 5,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'BUSD',
    lpAddresses: {
      97: '0x09EE68A8B66572aCDf46ba669b8570e2453c0910',
      56: '0x37948281522432ff12c98315e2c9819a6da7b686', // PHARM-BUSD LP (BUSD-BUSD will ignore)
    },
    tokenSymbol: 'BUSD',
    tokenAddresses: {
      97: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 6,
    risk: 3,
    isTokenOnly: true,
    lpSymbol: 'WBNB',
    lpAddresses: {
      97: '0x575Cb459b6E6B8187d3Ef9a25105D64011874820',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f', // BNB-BUSD LP
    },
    tokenSymbol: 'WBNB',
    tokenAddresses: {
      97: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
]

// const farms: FarmConfig[] = [
//   {
//     pid: 0,
//     risk: 5,
//     lpSymbol: 'PHARM-BUSD LP',
//     lpAddresses: {
//         97: '',
//         56: '0x37948281522432ff12c98315e2c9819a6da7b686',
//     },
//     tokenSymbol: 'PHARM',
//     tokenAddresses: {
//         97: '',
//         56: '0x50dF85A6E3635B8A69b16978f31a888541f95D23',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 1,
//     risk: 5,
//     lpSymbol: 'PHARM-BNB LP',
//     lpAddresses: {
//         97: '',
//         56: '0xb1C35c1F15299ABCF9728c5e4349D24581AdEa36',
//     },
//     tokenSymbol: 'PHARM',
//     tokenAddresses: {
//         97: '',
//         56: '0x50dF85A6E3635B8A69b16978f31a888541f95D23',
//     },
//     quoteTokenSymbol: QuoteToken.BNB,
//     quoteTokenAdresses: contracts.wbnb,
// },
// {
//     pid: 2,
//     risk: 3,
//     lpSymbol: 'BNB-BUSD LP',
//     lpAddresses: {
//         97: '',
//         56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
//     },
//     tokenSymbol: 'BNB',
//     tokenAddresses: {
//         97: '',
//         56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 3,
//     risk: 1,
//     lpSymbol: 'USDT-BUSD LP',
//     lpAddresses: {
//         97: '',
//         56: '0xc15fa3e22c912a276550f3e5fe3b0deb87b55acd',
//     },
//     tokenSymbol: 'USDT',
//     tokenAddresses: {
//         97: '',
//         56: '0x55d398326f99059ff775485246999027b3197955',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 4,
//     risk: 2,
//     lpSymbol: 'BTCB-BNB LP',
//     lpAddresses: {
//         97: '',
//         56: '0x7561eee90e24f3b348e1087a005f78b4c8453524',
//     },
//     tokenSymbol: 'BTCB',
//     tokenAddresses: {
//         97: '',
//         56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
//     },
//     quoteTokenSymbol: QuoteToken.BNB,
//     quoteTokenAdresses: contracts.wbnb,
// },
// {
//     pid: 5,
//     risk: 2,
//     lpSymbol: 'ETH-BNB LP',
//     lpAddresses: {
//         97: '',
//         56: '0x70d8929d04b60af4fb9b58713ebcf18765ade422',
//     },
//     tokenSymbol: 'ETH',
//     tokenAddresses: {
//         97: '',
//         56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
//     },
//     quoteTokenSymbol: QuoteToken.BNB,
//     quoteTokenAdresses: contracts.wbnb,
// },
// {
//     pid: 6,
//     risk: 1,
//     lpSymbol: 'DAI-BUSD LP',
//     lpAddresses: {
//         97: '',
//         56: '0x3ab77e40340ab084c3e23be8e5a6f7afed9d41dc',
//     },
//     tokenSymbol: 'DAI',
//     tokenAddresses: {
//         97: '',
//         56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 7,
//     risk: 1,
//     lpSymbol: 'USDC-BUSD LP',
//     lpAddresses: {
//         97: '',
//         56: '0x680dd100e4b394bda26a59dd5c119a391e747d18',
//     },
//     tokenSymbol: 'USDC',
//     tokenAddresses: {
//         97: '',
//         56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 8,
//     risk: 3,
//     lpSymbol: 'DOT-BNB LP',
//     lpAddresses: {
//         97: '',
//         56: '0xbcd62661a6b1ded703585d3af7d7649ef4dcdb5c',
//     },
//     tokenSymbol: 'DOT',
//     tokenAddresses: {
//         97: '',
//         56: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
//     },
//     quoteTokenSymbol: QuoteToken.BNB,
//     quoteTokenAdresses: contracts.wbnb,
// },
// {
//     pid: 9,
//     risk: 4,
//     lpSymbol: 'CAKE-BUSD LP',
//     lpAddresses: {
//         97: '',
//         56: '0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458',
//     },
//     tokenSymbol: 'CAKE',
//     tokenAddresses: {
//         97: '',
//         56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 10,
//     risk: 4,
//     lpSymbol: 'CAKE-BNB LP',
//     lpAddresses: {
//         97: '',
//         56: '0xa527a61703d82139f8a06bc30097cc9caa2df5a6',
//     },
//     tokenSymbol: 'CAKE',
//     tokenAddresses: {
//         97: '',
//         56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
//     },
//     quoteTokenSymbol: QuoteToken.BNB,
//     quoteTokenAdresses: contracts.wbnb,
// },
// {
//     pid: 11,
//     risk: 5,
//     isTokenOnly: true,
//     lpSymbol: 'PHARM',
//     lpAddresses: {
//         97: '',
//         56: '0x37948281522432ff12c98315e2c9819a6da7b686', // PHARM-BUSD LP
//     },
//     tokenSymbol: 'PHARM',
//     tokenAddresses: {
//         97: '',
//         56: '0x50dF85A6E3635B8A69b16978f31a888541f95D23',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 12,
//     risk: 1,
//     isTokenOnly: true,
//     lpSymbol: 'BUSD',
//     lpAddresses: {
//         97: '',
//         56: '0x37948281522432ff12c98315e2c9819a6da7b686', // PHARM-BUSD LP (BUSD-BUSD will ignore)
//     },
//     tokenSymbol: 'BUSD',
//     tokenAddresses: {
//         97: '',
//         56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 13,
//     risk: 3,
//     isTokenOnly: true,
//     lpSymbol: 'WBNB',
//     lpAddresses: {
//         97: '',
//         56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f', // BNB-BUSD LP
//     },
//     tokenSymbol: 'WBNB',
//     tokenAddresses: {
//         97: '',
//         56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 14,
//     risk: 1,
//     isTokenOnly: true,
//     lpSymbol: 'USDT',
//     lpAddresses: {
//         97: '',
//         56: '0xc15fa3e22c912a276550f3e5fe3b0deb87b55acd', // USDT-BUSD LP
//     },
//     tokenSymbol: 'USDT',
//     tokenAddresses: {
//         97: '',
//         56: '0x55d398326f99059ff775485246999027b3197955',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 15,
//     risk: 2,
//     isTokenOnly: true,
//     lpSymbol: 'BTCB',
//     lpAddresses: {
//         97: '',
//         56: '0xb8875e207ee8096a929d543c9981c9586992eacb', // BTCB-BUSD LP
//     },
//     tokenSymbol: 'BTCB',
//     tokenAddresses: {
//         97: '',
//         56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 16,
//     risk: 2,
//     isTokenOnly: true,
//     lpSymbol: 'ETH',
//     lpAddresses: {
//         97: '',
//         56: '0xd9a0d1f5e02de2403f68bb71a15f8847a854b494', // ETH-BUSD LP
//     },
//     tokenSymbol: 'ETH',
//     tokenAddresses: {
//         97: '',
//         56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 17,
//     risk: 1,
//     isTokenOnly: true,
//     lpSymbol: 'DAI',
//     lpAddresses: {
//         97: '',
//         56: '0x3ab77e40340ab084c3e23be8e5a6f7afed9d41dc', // DAI-BUSD LP
//     },
//     tokenSymbol: 'DAI',
//     tokenAddresses: {
//         97: '',
//         56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 18,
//     risk: 1,
//     isTokenOnly: true,
//     lpSymbol: 'USDC',
//     lpAddresses: {
//         97: '',
//         56: '0x680dd100e4b394bda26a59dd5c119a391e747d18', // USDC-BUSD LP
//     },
//     tokenSymbol: 'USDC',
//     tokenAddresses: {
//         97: '',
//         56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 19,
//     risk: 3,
//     isTokenOnly: true,
//     lpSymbol: 'DOT',
//     lpAddresses: {
//         97: '',
//         56: '0x54c1ec2f543966953f2f7564692606ea7d5a184e', // DOT-BUSD LP
//     },
//     tokenSymbol: 'DOT',
//     tokenAddresses: {
//         97: '',
//         56: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 20,
//     risk: 4,
//     isTokenOnly: true,
//     lpSymbol: 'CAKE',
//     lpAddresses: {
//         97: '',
//         56: '0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458', // CAKE-BUSD LP
//     },
//     tokenSymbol: 'CAKE',
//     tokenAddresses: {
//         97: '',
//         56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 21,
//     risk: 3,
//     isTokenOnly: true,
//     lpSymbol: 'BSCX',
//     lpAddresses: {
//         97: '',
//         56: '0xa32a983a64ce21834221aa0ad1f1533907553136', // BSCX-BUSD LP
//     },
//     tokenSymbol: 'BSCX',
//     tokenAddresses: {
//         97: '',
//         56: '0x5ac52ee5b2a633895292ff6d8a89bb9190451587',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 22,
//     risk: 3,
//     isTokenOnly: true,
//     lpSymbol: 'LTC',
//     lpAddresses: {
//         97: '',
//         56: '0x921ca483796889C77Af03518B222c2Bcf4371114', // LTC-BUSD LP
//     },
//     tokenSymbol: 'LTC',
//     tokenAddresses: {
//         97: '',
//         56: '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 23,
//     risk: 3,
//     isTokenOnly: true,
//     lpSymbol: 'DOGE',
//     lpAddresses: {
//         97: '',
//         56: '0x1Efcb446bFa553A2EB2fff99c9F76962be6ECAC3', // DOGE-BUSD LP
//     },
//     tokenSymbol: 'DOGE',
//     tokenAddresses: {
//         97: '',
//         56: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// },
// {
//     pid: 24,
//     risk: 3,
//     isTokenOnly: true,
//     lpSymbol: 'ADA',
//     lpAddresses: {
//         97: '',
//         56: '0xF35145e28e1dd67055221739D8554E0b5C7Adcd5', // ADA-BUSD LP
//     },
//     tokenSymbol: 'ADA',
//     tokenAddresses: {
//         97: '',
//         56: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
//     },
//     quoteTokenSymbol: QuoteToken.BUSD,
//     quoteTokenAdresses: contracts.busd,
// }
// ]

export default farms
