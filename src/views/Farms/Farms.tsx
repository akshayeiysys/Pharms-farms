import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Image, Heading } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import FarmTabButtons from './components/FarmTabButtons'
import Divider from './components/Divider'



import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'


export interface FarmsProps{
  tokenMode?: boolean
}


  // start table code

// interface ItemProps{
//   isDisplyflex?: boolean;
// }
// const RowCard = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: row;
//   background: #fff;
//   max-height: 100px;
//   border-radius: 10px;
// `;
// const RowCardFirst =styled.div`
// width:100%;
// background:rgb(250, 249, 250);
// display:flex;
// align-items:center;
// justify-content:center;
// padding:10px 0px;
// `;
// const ChildCardFirst=styled.div`
// width:300px;
// display:flex;
// flex-direction:column;

// line-height:28px;
// `;

// const ChildCardSecond=styled.div<ItemProps>`
// width: 400px;
// padding: 20px;
// display:${props=> props.isDisplyflex ? 'flex': 'block'};
// justify-content:space-between;
// border-radius: 14px;
// border: 2px solid rgb(238, 234, 244);
// margin:0px 40px;
// }
// `;
// const ChildCardThird=styled.div`
// width:500px;
// border: 2px solid rgb(238, 234, 244);
// padding:20px;
// border-radius:14px;
// `;


// const ChildCardThirdFirst=styled.button`
// width: 100%;
//     padding: 14px;
//     border: none;
//     background: rgb(117, 223, 238);
//     border-radius: 20px;
//     color: #fff;
//     font-size: 16px;
//     margin-top:10px;
// `;
// const ChildCard = styled.div`
// min-height: 100px;
//  width: 100%;
// display:flex;
// align-items:center;
// `;

// const ChildCardSecondSubFirst= styled.div`
// display:flex;
// flex-direction:column;
// line-height:16px;
// font-size:12px;
// color:rgb(117, 223, 238);

// `;
// const ChildCardSecondSubSecond = styled.button`
// padding: 10px 40px;
//     border-radius: 20px;
//     border: none;
// `;

// const ChildBorder = styled.div`
// border:1px solid rgb(238, 234, 244);
// width:100px;
// border-radius:20px;
// text-align:center;
// margin-top:10px;

// `;





// end table code


const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const {tokenMode} = farmsProps;

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh() 
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stakedOnly, setStakedOnly] = useState(false)

  const activeFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === '0X')

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      // const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   return farm
        // }
        const cakeRewardPerBlock = new BigNumber(farm.eggPerBlock || 1).times(new BigNumber(farm.poolWeight)) .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = cakePrice.times(cakeRewardPerYear);

        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice);
        }

        if(totalValue.comparedTo(0) > 0){
          apy = apy.div(totalValue);
        }

        return { ...farm, apy }
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [bnbPrice, account, cakePrice, ethereum],
  )

  return (
    <Page>
      <Heading as="h1" size="lg" color="primary" mb="50px" style={{ textAlign: 'center' }}>
        {
          tokenMode ?
            TranslateString(10002, 'Stake tokens to earn EGG')
            :
          TranslateString(320, 'Stake LP tokens to earn EGG')
        }
      </Heading>
      <Heading as="h2" color="secondary" mb="50px" style={{ textAlign: 'center' }}>
        {TranslateString(10000, 'Deposit Fee will be used to buyback EGG')}
      </Heading>

      
      {/* start row card */}
  
  {/* <RowCard>
   <ChildCard style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
  <Image src="/images/egg/cake-bnb.svg" alt="illustration" width={60} height={10} responsive />
  <p>gsgsgsg</p>
  </ChildCard>
 
  <ChildCard>
    <p style={{textAlign:'center'}}>APR</p>
    <p style={{textAlign:'center'}}>109.11%</p>
  </ChildCard>
   <ChildCard>
    <p style={{textAlign:'center'}}>Liquidity</p>
    <p style={{textAlign:'center'}}>$4,035,860</p>
    </ChildCard>
     <ChildCard>
    <p style={{textAlign:'center'}}>Multiplier</p>
    <p style={{textAlign:'center'}}>2x</p>
    </ChildCard> 
    <ChildCard >
    <p style={{textAlign:'center'}}>Multiplier</p>
    <p style={{textAlign:'center'}}>2x</p>
    </ChildCard>
    </RowCard>

    
<RowCardFirst>
<ChildCardFirst>

<a style={{color:'rgb(117, 223, 238)'}} href="https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md">Get CAKE-BNB LP</a>
<a style={{color:'rgb(117, 223, 238)'}}href="https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md">View Contract </a>
<a style={{color:'rgb(117, 223, 238)'}}href="https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md">See Pair Info </a>
<ChildBorder>
<p>Core</p>
</ChildBorder>
</ChildCardFirst>
<ChildCardSecond isDisplyflex>
<ChildCardSecondSubFirst>
<p style={{fontSize:'14px'}}>CAKE EARNED</p>
<p style={{fontSize:'14px'}}>?</p>
<p style={{fontSize:'14px'}}>~0.000USD</p>
</ChildCardSecondSubFirst>
<ChildCardSecondSubSecond>
Harvest
</ChildCardSecondSubSecond>


</ChildCardSecond>
<ChildCardSecond>
<p style={{fontSize:'12px',color:'rgb(117,223,238)'}}>START FARMING</p>
<ChildCardThirdFirst>
Unlock Wallet
</ChildCardThirdFirst>


</ChildCardSecond>
</RowCardFirst> */}


{/* end row card */}




      <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly}/>
      <div>
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
            {stakedOnly ? farmsList(stakedOnlyFarms, false) : farmsList(activeFarms, false)}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsList(inactiveFarms, true)}
          </Route>
        </FlexLayout>
      </div>
      <Image src="/images/egg/8.png" alt="illustration" width={1352} height={587} responsive />
    </Page>
  )
}

export default Farms
