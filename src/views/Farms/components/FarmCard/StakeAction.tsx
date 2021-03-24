import React from 'react'
import Modal from 'react-modal';
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  depositFeeBP?: number
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background              : 'rgb(254 253 254)',
    padding                 : '40px',
    borderRadius        :'30px',
    border:'2px solid #75dfee',
    boxShadow:'-1px 2px 13px 0px #75dfee'
  }
};

const StakeAction: React.FC<FarmCardActionsProps> = ({ stakedBalance, tokenBalance, tokenName, pid, depositFeeBP}) => {
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)
  const [modalIsOpen,setIsOpen] = React.useState(false);

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  const renderStakingButtons = () => {

    const openModal = ()=> {
      setIsOpen(true);
    }
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
      // subtitle.style.color = '#f00';
    }
   
    function closeModal(){
      setIsOpen(false);
    }
  
    // async function Ok(){
      
    //  {onPresentWithdraw}
    // }

    return rawStakedBalance === 0 ? (
      <Button onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={openModal}  mr="6px">
          <MinusIcon color="primary" />
        </IconButton>
        <IconButton variant="tertiary" onClick={onPresentDeposit}>
          <AddIcon color="primary" />
        </IconButton>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
 
          
          {/* <button type="button" onClick={closeModal}>X</button> */}
          <div style={{fontSize:'22px',color:'rgb(117 223 238)',width:'550px',textAlign:'center',lineHeight:'35px',letterSpacing:'0.6px'}}>AS YOU ARE STILL IN 11 DAY THRESHOLD REMOVING TOKENS FROM POOL WILL BURN 25% OF STAKE</div>
          <form>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'20px'}}>
            <button style={{background:'#49c6d8',border:'none',padding:'10px 30px',color:'#fff',marginRight:'15px',cursor:'pointer'}} type="button"  onClick={closeModal}>Cancel</button>
            <button style={{background:'#49c6d8',border:'none',padding:'10px 30px',color:'#fff',marginRight:'15px',cursor:'pointer'}}type="button" onClick={onPresentWithdraw}>Ok</button>
            </div>
          </form>
        </Modal>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
