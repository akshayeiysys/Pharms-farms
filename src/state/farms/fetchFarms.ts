import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import { QuoteToken } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchFarms = async () => {
  try{
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAdress = farmConfig.lpAddresses[CHAIN_ID]
      const calls = [
        // Balance of token in the LP contract
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: farmConfig.isTokenOnly ? farmConfig.tokenAddresses[CHAIN_ID] : lpAdress,
          name: 'balanceOf',
          params: [getMasterChefAddress()],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: 'decimals',
        },
      ]

      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals
      ] = await multicall(erc20, calls)

      let tokenAmount;
      let lpTotalInQuoteToken;
      let tokenPriceVsQuote;
      if(farmConfig.isTokenOnly){
        tokenAmount = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals));
        if(farmConfig.tokenSymbol === QuoteToken.BUSD && farmConfig.quoteTokenSymbol === QuoteToken.BUSD){
          tokenPriceVsQuote = new BigNumber(1);
        }else{
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP));
        }
        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote);
      }else{
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

        // Total value in staking in quote token value
        lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(18))
          .times(new BigNumber(2))
          .times(lpTokenRatio)

        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
        const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatio)

        if(tokenAmount.comparedTo(0) > 0){
          tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount);
        }else{
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP));
        }
      }

      const [info, totalAllocPoint, eggPerBlock] = await multicall(masterchefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
        {
          address: getMasterChefAddress(),
          name: 'eggPerBlock',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        // quoteTokenAmount: quoteTokenAmount,
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        poolWeight: poolWeight.toNumber(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        depositFeeBP: info.depositFeeBP,
        eggPerBlock: new BigNumber(eggPerBlock).toNumber(),
      }
    }),
  )
  console.log(data,"data====>>.")
  return data
  }catch{
    return [
      {
          "pid": 0,
          "risk": 5,
          "lpSymbol": "PHARM-BUSD LP",
          "lpAddresses": {
              "56": "0x19e7cbecdd23a16dfa5573df54d98f7caae03019",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "PHARM",
          "tokenAddresses": {
              "56": "0xf952fc3ca7325cc27d15885d37117676d25bfda6",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "170653.39967037776681749387097356552240520798029645661971683269388871529568573026892733397750746949169975",
          "lpTotalInQuoteToken": "34366847.14883093056132920502025147032846826267297320599997794738632824371082074603061508224004420984629404",
          "tokenPriceVsQuote": "100.69194992661013890713528486607965052724914176337856068244418125812978919506392134",
          "poolWeight": 0.3076923076923077,
          "multiplier": "40X",
          "depositFeeBP": 0,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 1,
          "risk": 5,
          "lpSymbol": "PHARM-BNB LP",
          "lpAddresses": {
              "56": "0xd1b59d11316e87c3a0a069e80f590ba35cd8d8d3",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "PHARM",
          "tokenAddresses": {
              "56": "0xf952fc3ca7325cc27d15885d37117676d25bfda6",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BNB",
          "quoteTokenAdresses": {
              "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
              "97": ""
          },
          "tokenAmount": "119094.5543941149291806867610117911655103409344846266344140162172051231333680397320086289689143141191722",
          "lpTotalInQuoteToken": "102674.3596898726669392144206157708723733170257531337245211317243083900130157411495337817795025940257668",
          "tokenPriceVsQuote": "0.43106236138260546692036021231700176019673585936948228420456090287150912236147528",
          "poolWeight": 0.18461538461538463,
          "multiplier": "24X",
          "depositFeeBP": 0,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 2,
          "risk": 3,
          "lpSymbol": "BNB-BUSD LP",
          "lpAddresses": {
              "56": "0x1b96b92314c44b159149f7e0303511fb2fc4774f",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "BNB",
          "tokenAddresses": {
              "56": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "24582.11911558187826944495196696899925661286711182810597106070074855510671094135879440788642641858606298",
          "lpTotalInQuoteToken": "11455693.77909300620628966216798355517530678491130818652420032126304260616952702194097856195358423297545248",
          "tokenPriceVsQuote": "233.00867035160489341217521559663933117929213150110138878704167829924121357564479104",
          "poolWeight": 0.038461538461538464,
          "multiplier": "5X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 3,
          "risk": 1,
          "lpSymbol": "USDT-BUSD LP",
          "lpAddresses": {
              "56": "0xc15fa3e22c912a276550f3e5fe3b0deb87b55acd",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "USDT",
          "tokenAddresses": {
              "56": "0x55d398326f99059ff775485246999027b3197955",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "6234380.974396543160321223285831082683494907760264634223008140163300217761713039542528102604723650808965",
          "lpTotalInQuoteToken": "12452769.64068335447010590713637308093951679209136599765708320998526866607276033361726635633627051707476668",
          "tokenPriceVsQuote": "0.99871741010250983051057237298295664724074950864842432876752081240477627870378591",
          "poolWeight": 0.03076923076923077,
          "multiplier": "4X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 4,
          "risk": 2,
          "lpSymbol": "BTCB-BNB LP",
          "lpAddresses": {
              "56": "0x7561eee90e24f3b348e1087a005f78b4c8453524",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "BTCB",
          "tokenAddresses": {
              "56": "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BNB",
          "quoteTokenAdresses": {
              "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
              "97": ""
          },
          "tokenAmount": "145.7288440724696167873826762912968738942019148048553735017899167465250637695816433867902969685143413",
          "lpTotalInQuoteToken": "62716.62869600934044809536135306763422173841154428406558264362819750831791777638426359714703158562976638",
          "tokenPriceVsQuote": "215.18261911423978822979887606916084765283938978599406867146168857820153056078740644",
          "poolWeight": 0.046153846153846156,
          "multiplier": "6X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 5,
          "risk": 2,
          "lpSymbol": "ETH-BNB LP",
          "lpAddresses": {
              "56": "0x70d8929d04b60af4fb9b58713ebcf18765ade422",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "ETH",
          "tokenAddresses": {
              "56": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BNB",
          "quoteTokenAdresses": {
              "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
              "97": ""
          },
          "tokenAmount": "4408.46755279546055461485174343811084925915347735998966477066802306154259810019057799571862706038636688",
          "lpTotalInQuoteToken": "65045.24892625980089749304210043406816516068263916650872861346054784286355746059341152089096663638278992",
          "tokenPriceVsQuote": "7.37730834437171392422393944223520369093366189189950206904066688486713131406218425",
          "poolWeight": 0.046153846153846156,
          "multiplier": "6X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 6,
          "risk": 1,
          "lpSymbol": "DAI-BUSD LP",
          "lpAddresses": {
              "56": "0x3ab77e40340ab084c3e23be8e5a6f7afed9d41dc",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "DAI",
          "tokenAddresses": {
              "56": "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "6263862.0325363902030649477289285865129695912446820728854194257725717582832727941206549868424993535987595",
          "lpTotalInQuoteToken": "12513161.0222416150572424633293993623189375147166082954602134364379146625005553490964375275995891028282591",
          "tokenPriceVsQuote": "0.99883753483429867161585183513073080357324039404762138593699414968673584352315561",
          "poolWeight": 0.03076923076923077,
          "multiplier": "4X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 7,
          "risk": 1,
          "lpSymbol": "USDC-BUSD LP",
          "lpAddresses": {
              "56": "0x680dd100e4b394bda26a59dd5c119a391e747d18",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "USDC",
          "tokenAddresses": {
              "56": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "6071825.5725067403856313957306771007783682849900131407572653266278576645323320776584915087984897236727774",
          "lpTotalInQuoteToken": "12157240.35168548296168323834386156173157155649150711911303901096189845043048400974367812484549559330568224",
          "tokenPriceVsQuote": "1.00111903796557778216096791118097252152357774373097091444804654090546014697136746",
          "poolWeight": 0.03076923076923077,
          "multiplier": "4X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 9,
          "risk": 3,
          "lpSymbol": "DOT-BNB LP",
          "lpAddresses": {
              "56": "0xbcd62661a6b1ded703585d3af7d7649ef4dcdb5c",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "DOT",
          "tokenAddresses": {
              "56": "0x7083609fce4d1d8dc0c979aab8c869ea2c873402",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BNB",
          "quoteTokenAdresses": {
              "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
              "97": ""
          },
          "tokenAmount": "196973.39060914646070060207332381689296303428460684072028482090176873179238544643345339163750305901465665",
          "lpTotalInQuoteToken": "57433.3249479526867077319825459542759166708756610928233955725471009818102013442469889884127875549053982",
          "tokenPriceVsQuote": "0.1457895525135103448904270762140894693227263983127005422120385345150869723548357",
          "poolWeight": 0.046153846153846156,
          "multiplier": "6X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 10,
          "risk": 4,
          "lpSymbol": "CAKE-BUSD LP",
          "lpAddresses": {
              "56": "0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "CAKE",
          "tokenAddresses": {
              "56": "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "141452.9692892346607686507975810220624373678430837724391802151570393356043084895408929368189216521853295",
          "lpTotalInQuoteToken": "3187913.0498045017838124534760412095851581092597594489511360137728598034341230331552655965757824650379738",
          "tokenPriceVsQuote": "11.26845574830615903267708545485770009826583350876709808915810890679592589980970449",
          "poolWeight": 0.015384615384615385,
          "multiplier": "2X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 11,
          "risk": 4,
          "lpSymbol": "CAKE-BNB LP",
          "lpAddresses": {
              "56": "0xa527a61703d82139f8a06bc30097cc9caa2df5a6",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "CAKE",
          "tokenAddresses": {
              "56": "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BNB",
          "quoteTokenAdresses": {
              "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
              "97": ""
          },
          "tokenAmount": "204795.50885117748818341150454255770595621734092206094278087711494955728168804992974274083674511516693225",
          "lpTotalInQuoteToken": "19828.43910359945739352279871452963899374083240381134159165298972103248201283737793838058363960220927912",
          "tokenPriceVsQuote": "0.04841033676673191408837675312824872107594062850788864017438779662880026459781405",
          "poolWeight": 0.015384615384615385,
          "multiplier": "2X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 12,
          "risk": 5,
          "isTokenOnly": true,
          "lpSymbol": "PHARM",
          "lpAddresses": {
              "56": "0x19e7cbecdd23a16dfa5573df54d98f7caae03019",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "PHARM",
          "tokenAddresses": {
              "56": "0xf952fc3ca7325cc27d15885d37117676d25bfda6",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "300899.386950370895463287",
          "lpTotalInQuoteToken": "30298146.00375443447622865167003637305886990035824799799437282919956061164982271934796770139291897822584458",
          "tokenPriceVsQuote": "100.69194992661013890713528486607965052724914176337856068244418125812978919506392134",
          "poolWeight": 0.07692307692307693,
          "multiplier": "10X",
          "depositFeeBP": 0,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 13,
          "risk": 1,
          "isTokenOnly": true,
          "lpSymbol": "BUSD",
          "lpAddresses": {
              "56": "0x19e7cbecdd23a16dfa5573df54d98f7caae03019",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "BUSD",
          "tokenAddresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "7304948.047032584967250147",
          "lpTotalInQuoteToken": "7304948.047032584967250147",
          "tokenPriceVsQuote": "1",
          "poolWeight": 0.015384615384615385,
          "multiplier": "2X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 14,
          "risk": 3,
          "isTokenOnly": true,
          "lpSymbol": "WBNB",
          "lpAddresses": {
              "56": "0x1b96b92314c44b159149f7e0303511fb2fc4774f",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "WBNB",
          "tokenAddresses": {
              "56": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "47273.236141871361493399",
          "lpTotalInQuoteToken": "11015073.89663487840757738394570754652155832338609675928924136041679577470046295332744032393441496969434496",
          "tokenPriceVsQuote": "233.00867035160489341217521559663933117929213150110138878704167829924121357564479104",
          "poolWeight": 0.023076923076923078,
          "multiplier": "3X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 15,
          "risk": 1,
          "isTokenOnly": true,
          "lpSymbol": "USDT",
          "lpAddresses": {
              "56": "0xc15fa3e22c912a276550f3e5fe3b0deb87b55acd",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "USDT",
          "tokenAddresses": {
              "56": "0x55d398326f99059ff775485246999027b3197955",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "3764490.910184997583303159",
          "lpTotalInQuoteToken": "3759662.61217440073241444462919893220611805419684842220389743807940633193204594151196483243817501656268969",
          "tokenPriceVsQuote": "0.99871741010250983051057237298295664724074950864842432876752081240477627870378591",
          "poolWeight": 0.007692307692307693,
          "multiplier": "1X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 16,
          "risk": 2,
          "isTokenOnly": true,
          "lpSymbol": "BTCB",
          "lpAddresses": {
              "56": "0xb8875e207ee8096a929d543c9981c9586992eacb",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "BTCB",
          "tokenAddresses": {
              "56": "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "232.927352995440064107",
          "lpTotalInQuoteToken": "11688419.75016436173440812129169117861655474456582695835249869377698020944794452844150682018710764532837267",
          "tokenPriceVsQuote": "50180.53740727127813134753114216816001110377296265139683006147770816849149332249237881",
          "poolWeight": 0.015384615384615385,
          "multiplier": "2X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 17,
          "risk": 2,
          "isTokenOnly": true,
          "lpSymbol": "ETH",
          "lpAddresses": {
              "56": "0xd9a0d1f5e02de2403f68bb71a15f8847a854b494",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "ETH",
          "tokenAddresses": {
              "56": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "4931.802345972091516886",
          "lpTotalInQuoteToken": "8468727.41667227989117477577700046036920343487240113834669526871502879626552792342145529013651315605163048",
          "tokenPriceVsQuote": "1717.16683325496017612393436473144450249888151305160932988577566255580800827883671868",
          "poolWeight": 0.015384615384615385,
          "multiplier": "2X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 18,
          "risk": 1,
          "isTokenOnly": true,
          "lpSymbol": "DAI",
          "lpAddresses": {
              "56": "0x3ab77e40340ab084c3e23be8e5a6f7afed9d41dc",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "DAI",
          "tokenAddresses": {
              "56": "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "3223253.712655055728876858",
          "lpTotalInQuoteToken": "3219506.79249387674761290902445162829268761941413809467559349691017719080288418901391489092124586126187338",
          "tokenPriceVsQuote": "0.99883753483429867161585183513073080357324039404762138593699414968673584352315561",
          "poolWeight": 0.007692307692307693,
          "multiplier": "1X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 19,
          "risk": 1,
          "isTokenOnly": true,
          "lpSymbol": "USDC",
          "lpAddresses": {
              "56": "0x680dd100e4b394bda26a59dd5c119a391e747d18",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "USDC",
          "tokenAddresses": {
              "56": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "3208194.659152877926002777",
          "lpTotalInQuoteToken": "3211784.75077743386878395562921806140789266495765183610687019015627780396360541924568712844149682744743642",
          "tokenPriceVsQuote": "1.00111903796557778216096791118097252152357774373097091444804654090546014697136746",
          "poolWeight": 0.007692307692307693,
          "multiplier": "1X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 20,
          "risk": 3,
          "isTokenOnly": true,
          "lpSymbol": "DOT",
          "lpAddresses": {
              "56": "0x54c1ec2f543966953f2f7564692606ea7d5a184e",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "DOT",
          "tokenAddresses": {
              "56": "0x7083609fce4d1d8dc0c979aab8c869ea2c873402",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "157495.90224766817463817",
          "lpTotalInQuoteToken": "5363744.845524188671011112120578639333825190522912574565102585440027048477770587213521472924543581186036",
          "tokenPriceVsQuote": "34.0564088904960844401577030968531646532490775652197494673625244605514366399751508",
          "poolWeight": 0.015384615384615385,
          "multiplier": "2X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 21,
          "risk": 4,
          "isTokenOnly": true,
          "lpSymbol": "CAKE",
          "lpAddresses": {
              "56": "0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "CAKE",
          "tokenAddresses": {
              "56": "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "346751.808482664046260992",
          "lpTotalInQuoteToken": "3907357.40953203202870669562973569922718128120450978076227941991580445483594135353877404281165090093425408",
          "tokenPriceVsQuote": "11.26845574830615903267708545485770009826583350876709808915810890679592589980970449",
          "poolWeight": 0.007692307692307693,
          "multiplier": "1X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 22,
          "risk": 3,
          "isTokenOnly": true,
          "lpSymbol": "BSCX",
          "lpAddresses": {
              "56": "0xa32a983a64ce21834221aa0ad1f1533907553136",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "BSCX",
          "tokenAddresses": {
              "56": "0x5ac52ee5b2a633895292ff6d8a89bb9190451587",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BUSD",
          "quoteTokenAdresses": {
              "56": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
              "97": ""
          },
          "tokenAmount": "90056.393121750658913909",
          "lpTotalInQuoteToken": "2065261.30758404839337136469208927030325951277264713341670735240928608258966570316383600772403234253518857",
          "tokenPriceVsQuote": "22.93297828164118428242163704478775952369924132233508034313362232232382823378661573",
          "poolWeight": 0.007692307692307693,
          "multiplier": "1X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      },
      {
          "pid": 23,
          "risk": 3,
          "isTokenOnly": true,
          "lpSymbol": "AUTO",
          "lpAddresses": {
              "56": "0x4d0228ebeb39f6d2f29ba528e2d15fc9121ead56",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "tokenSymbol": "AUTO",
          "tokenAddresses": {
              "56": "0xa184088a740c695e156f91f5cc086a06bb78b827",
              "97": "0xDcE45b2dc62239DD09D6ED97Eefb9276C634602c"
          },
          "quoteTokenSymbol": "BNB",
          "quoteTokenAdresses": {
              "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
              "97": ""
          },
          "tokenAmount": "1649.276313340035955018",
          "lpTotalInQuoteToken": "15929.82455045494595558976772886972358184809048420366075995700309136962115990611390280790900252742168462",
          "tokenPriceVsQuote": "9.65867539696524401777049636214215215507262850981094075257716119878696790993156859",
          "poolWeight": 0.007692307692307693,
          "multiplier": "1X",
          "depositFeeBP": 400,
          "eggPerBlock": 1000000000000000000
      }
  ]
  }
  
}

export default fetchFarms
