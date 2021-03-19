import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'

import ApyButton from './ApyButton'
import CardActionsContainer from './CardActionsContainer'


export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}
 interface ViewCard {
  toggleCard?: boolean
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledCardAccent = styled.div`
  background: linear-gradient(45deg,
  rgba(255, 0, 0, 1) 0%,
  rgba(255, 154, 0, 1) 10%,
  rgba(208, 222, 33, 1) 20%,
  rgba(79, 220, 74, 1) 30%,
  rgba(63, 218, 216, 1) 40%,
  rgba(47, 201, 226, 1) 50%,
  rgba(28, 127, 238, 1) 60%,
  rgba(95, 21, 242, 1) 70%,
  rgba(186, 12, 248, 1) 80%,
  rgba(251, 7, 217, 1) 90%,
  rgba(255, 0, 0, 1) 100%);
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const FCard = styled.div<ViewCard>`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
  min-width: ${(props) => props.toggleCard? "100%": ""};
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`


 // start table code

 interface ItemProps{
  isDisplyflex?: boolean;
  // expanded?: boolean;
}
const RowCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  background: #fff;
  max-height: 100px;
  border-radius: 10px;
`;
const RowCardFirst =styled.div`
width:100%;
background:rgb(250, 249, 250);
display:flex;
align-items:center;
justify-content:center;
padding:10px 0px;
`;
const ChildCardFirst=styled.div`
width:300px;
display:flex;
flex-direction:column;

line-height:28px;
`;

const ChildCardSecond=styled.div<ItemProps>`
width: 400px;
padding: 20px;
display:${props=> props.isDisplyflex ? 'flex': 'block'};
justify-content:space-between;
border-radius: 14px;
border: 2px solid rgb(238, 234, 244);
margin:0px 40px;
}
`;
const ChildCardThird=styled.div`
width:500px;
border: 2px solid rgb(238, 234, 244);
padding:20px;
border-radius:14px;
`;


const ChildCardThirdFirst=styled.button`
width: 100%;
    padding: 14px;
    border: none;
    background: rgb(117, 223, 238);
    border-radius: 20px;
    color: #fff;
    font-size: 16px;
    margin-top:10px;
`;
const ChildCard = styled.div`
min-height: 100px;
 width: 100%;
display:flex;
align-items:center;
`;

const ChildCardSecondSubFirst= styled.div`
display:flex;
flex-direction:column;
line-height:16px;
font-size:12px;
color:rgb(117, 223, 238);

`;
const ChildCardSecondSubSecond = styled.button`
padding: 10px 40px;
    border-radius: 20px;
    border: none;
`;

const ChildBorder = styled.div`
border:1px solid rgb(238, 234, 244);
width:100px;
border-radius:20px;
text-align:center;
margin-top:10px;

`;





// end table code

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
  toggleCard?: boolean
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account,toggleCard }) => {
  const TranslateString = useI18n()

  console.log(toggleCard,"toggleCard")

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const farmImage = farm.isTokenOnly ? farm.tokenSymbol.toLowerCase() : `${farm.tokenSymbol.toLowerCase()}-${farm.quoteTokenSymbol.toLowerCase()}`

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
      return cakePrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = farm.lpSymbol
  const earnLabel = 'PHARM'
  const farmAPY = farm.apy && farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk } = farm

  return (
    <>
  
    
    {toggleCard?
    
      <FCard toggleCard={toggleCard}>
        <div style={{width:'100%',justifyContent:'space-between',display:'flex',alignItems:'center'}}>
        <div style={{width:'30%'}}>
    {farm.tokenSymbol === 'PHARM' && <StyledCardAccent />}
    <CardHeading
      lpLabel={lpLabel}
      multiplier={farm.multiplier}
      risk={risk}
      depositFee={farm.depositFeeBP}
      farmImage={farmImage}
      tokenSymbol={farm.tokenSymbol}
    />
    </div>
    <div style={{width:'20%'}}>
    {!removed && (
      <div style={{alignItems:'center'}}>
        <Text>{TranslateString(352, 'APR')}</Text>
        <Text bold style={{  alignItems: 'center',display:'flex',justifyContent:'center' }}>
          {farm.apy ? (
            <>
              <ApyButton
                lpLabel={lpLabel}
                quoteTokenAdresses={quoteTokenAdresses}
                quoteTokenSymbol={quoteTokenSymbol}
                tokenAddresses={tokenAddresses}
                cakePrice={cakePrice}
                apy={farm.apy}
              />
              <div style={{paddingLeft:"15px"}}>
              {farmAPY}%
              </div>
              
            </>
          ) : (
            <Skeleton height={24} width={80} />
          )}
        </Text>
      </div>
    )}
    </div>
    <div  style={{width:'15%'}}>
      <Text>{TranslateString(318, 'Earn')}</Text>
      <Text bold>{earnLabel}</Text>
    </div>
    <div style={{width:'20%'}}>
      <Text style={{ fontSize: '24px' }}>{TranslateString(10001, 'Deposit Fee')}</Text>
      <Text bold style={{ fontSize: '24px' }}>{(farm.depositFeeBP / 100)}%</Text>
    </div>
    
    
    <div style={{width:'5%'}}>
    <ExpandableSectionButton
      onClick={() => setShowExpandableSection(!showExpandableSection)}
      expanded={showExpandableSection}
    />
   
    </div>
    </div>
    <div style={{width:'100%'}}>
    
      
      <ExpandingWrapper expanded={showExpandableSection}>
      <Divider />
      <div style={{width:'100%',display:'flex',justifyContent:'space-around'}}>
      <div style={{width:'40%'}}>
      <DetailsSection
        removed={removed}
        isTokenOnly={farm.isTokenOnly}
        bscScanAddress={
          farm.isTokenOnly ?
            `https://bscscan.com/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
            :
            `https://bscscan.com/token/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
        }
        totalValueFormated={totalValueFormated}
        lpLabel={lpLabel}
        quoteTokenAdresses={quoteTokenAdresses}
        quoteTokenSymbol={quoteTokenSymbol}
        tokenAddresses={tokenAddresses}
      />
      </div>
      <div style={{width:'40%'}}>
    <CardActionsContainer farm={farm} ethereum={ethereum} account={account} />
    
    </div>
    </div>
    </ExpandingWrapper> 
      
     
    </div >
    
    {/* {!removed && (
      <Flex  alignItems='center'>
        <Text>{TranslateString(352, 'APR')}:</Text>
        <Text bold style={{ display: 'flex', alignItems: 'center' }}>
          {farm.apy ? (
            <>
              <ApyButton
                lpLabel={lpLabel}
                quoteTokenAdresses={quoteTokenAdresses}
                quoteTokenSymbol={quoteTokenSymbol}
                tokenAddresses={tokenAddresses}
                cakePrice={cakePrice}
                apy={farm.apy}
              />
              {farmAPY}%
            </>
          ) : (
            <Skeleton height={24} width={80} />
          )}
        </Text>
      </Flex>
    )}
    <Flex >
      <Text>{TranslateString(318, 'Earn')}:</Text>
      <Text bold>{earnLabel}</Text>
    </Flex>
    <Flex >
      <Text style={{ fontSize: '24px' }}>{TranslateString(10001, 'Deposit Fee')}:</Text>
      <Text bold style={{ fontSize: '24px' }}>{(farm.depositFeeBP / 100)}%</Text>
    </Flex>
    <CardActionsContainer farm={farm} ethereum={ethereum} account={account} />
    <Divider />
    <ExpandableSectionButton
      onClick={() => setShowExpandableSection(!showExpandableSection)}
      expanded={showExpandableSection}
    />
    <ExpandingWrapper expanded={showExpandableSection}>
      <DetailsSection
        removed={removed}
        isTokenOnly={farm.isTokenOnly}
        bscScanAddress={
          farm.isTokenOnly ?
            `https://bscscan.com/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
            :
            `https://bscscan.com/token/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
        }
        totalValueFormated={totalValueFormated}
        lpLabel={lpLabel}
        quoteTokenAdresses={quoteTokenAdresses}
        quoteTokenSymbol={quoteTokenSymbol}
        tokenAddresses={tokenAddresses}
      />
    </ExpandingWrapper> */}
  </FCard>
    :
    <FCard >
    {farm.tokenSymbol === 'PHARM' && <StyledCardAccent />}
    <CardHeading
      lpLabel={lpLabel}
      multiplier={farm.multiplier}
      risk={risk}
      depositFee={farm.depositFeeBP}
      farmImage={farmImage}
      tokenSymbol={farm.tokenSymbol}
    />
    {!removed && (
      <Flex justifyContent='space-between' alignItems='center'>
        <Text>{TranslateString(352, 'APR')}:</Text>
        <Text bold style={{ display: 'flex', alignItems: 'center' }}>
          {farm.apy ? (
            <>
              <ApyButton
                lpLabel={lpLabel}
                quoteTokenAdresses={quoteTokenAdresses}
                quoteTokenSymbol={quoteTokenSymbol}
                tokenAddresses={tokenAddresses}
                cakePrice={cakePrice}
                apy={farm.apy}
              />
              <div style={{paddingLeft:"15px"}}>
              {farmAPY}%
              </div>
              
            </>
          ) : (
            <Skeleton height={24} width={80} />
          )}
        </Text>
      </Flex>
    )}
    <Flex justifyContent='space-between'>
      <Text>{TranslateString(318, 'Earn')}:</Text>
      <Text bold>{earnLabel}</Text>
    </Flex>
    <Flex justifyContent='space-between'>
      <Text style={{ fontSize: '24px' }}>{TranslateString(10001, 'Deposit Fee')}:</Text>
      <Text bold style={{ fontSize: '24px' }}>{(farm.depositFeeBP / 100)}%</Text>
    </Flex>
    <CardActionsContainer farm={farm} ethereum={ethereum} account={account} />
    <Divider />
    <ExpandableSectionButton
      onClick={() => setShowExpandableSection(!showExpandableSection)}
      expanded={showExpandableSection}
    />
    <ExpandingWrapper expanded={showExpandableSection}>
      <DetailsSection
        removed={removed}
        isTokenOnly={farm.isTokenOnly}
        bscScanAddress={
          farm.isTokenOnly ?
            `https://bscscan.com/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
            :
            `https://bscscan.com/token/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
        }
        totalValueFormated={totalValueFormated}
        lpLabel={lpLabel}
        quoteTokenAdresses={quoteTokenAdresses}
        quoteTokenSymbol={quoteTokenSymbol}
        tokenAddresses={tokenAddresses}
      />
    </ExpandingWrapper>
  </FCard>
  }
      
    
</>
    
//   <div>
//   <RowCard>
//   <ChildCard style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
//   {farm.tokenSymbol === 'PHARM' && <StyledCardAccent />}
//       <CardHeading
//         lpLabel={lpLabel}
//         multiplier={farm.multiplier}
//         risk={risk}
//         depositFee={farm.depositFeeBP}
//         farmImage={farmImage}
//         tokenSymbol={farm.tokenSymbol}
//       />
//  </ChildCard>

//  <ChildCard>
//  {!removed && (
//         <Flex justifyContent='space-between' alignItems='center'>
//           <Text>{TranslateString(352, 'APR')}:</Text>
//           <Text bold style={{ display: 'flex', alignItems: 'center' }}>
//             {farm.apy ? (
//               <>
//                 <ApyButton
//                   lpLabel={lpLabel}
//                   quoteTokenAdresses={quoteTokenAdresses}
//                   quoteTokenSymbol={quoteTokenSymbol}
//                   tokenAddresses={tokenAddresses}
//                   cakePrice={cakePrice}
//                   apy={farm.apy}
//                 />
//                 {farmAPY}%
//               </>
//             ) : (
//               <Skeleton height={24} width={80} />
//             )}
//           </Text>
//         </Flex>
//       )}
//  </ChildCard>
//   <ChildCard>
//   <Text>{TranslateString(318, 'Earn')}:</Text>
//         <Text bold>{earnLabel}</Text>
//    </ChildCard>
//     <ChildCard>
//     <Text style={{ fontSize: '24px' }}>{TranslateString(10001, 'Deposit Fee')}:</Text>
//         <Text bold style={{ fontSize: '24px' }}>{(farm.depositFeeBP / 100)}%</Text>
//    </ChildCard> 
//    <CardActionsContainer farm={farm} ethereum={ethereum} account={account} />
   
//    <ExpandableSectionButton
// onClick={() => setShowExpandableSection(!showExpandableSection)}
// expanded={showExpandableSection}
// />
//    </RowCard>


// <RowCardFirst>
// <ChildCardFirst>

// removed={removed}
//           isTokenOnly={farm.isTokenOnly}
//           bscScanAddress={
//             farm.isTokenOnly ?
//               `https://bscscan.com/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
//               :
//               `https://bscscan.com/token/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
//           }
// </ChildCardFirst>
// <ChildCardSecond isDisplyflex expanded={showExpandableSection}>
// totalValueFormated={totalValueFormated}
//           lpLabel={lpLabel}
//           quoteTokenAdresses={quoteTokenAdresses}
//           quoteTokenSymbol={quoteTokenSymbol}
//           tokenAddresses={tokenAddresses}
//         /{'>'}


// </ChildCardSecond>

// </RowCardFirst>

// </div>

  )



  
}

export default FarmCard
