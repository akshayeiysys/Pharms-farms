import React, { useState } from 'react'
import Modal from 'react-modal'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'
import useStake from '../../../../hooks/useStake'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgb(254 253 254)',
    padding: '40px',
    borderRadius: '30px',
    border: '2px solid #75dfee',
    boxShadow: '-1px 2px 13px 0px #75dfee',
  },
}
const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  // const [modalIsOpen,setIsOpen] = React.useState(false);
  const { onReward } = useHarvest(pid)
  const { onStake } = useStake(pid)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()
  let subtitle

  // const openModal = ()=> {
  //   setIsOpen(true);
  // }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  // function closeModal(){
  //   setIsOpen(false);
  // }

  // async function Ok(){
  //   setIsOpen(false);
  //   setPendingTx(true)
  //   await onReward()
  //   setPendingTx(false)

  // }

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      <BalanceAndCompound>
        {pid === 12 ? (
          <Button
            disabled={rawEarningsBalance === 0 || pendingTx}
            size="sm"
            variant="secondary"
            marginBottom="15px"
            onClick={async () => {
              setPendingTx(true)
              await onStake(rawEarningsBalance.toString())
              setPendingTx(false)
            }}
          >
            {TranslateString(999, 'Compound')}
          </Button>
        ) : null}
        <Button
          disabled={rawEarningsBalance === 0 || pendingTx}
          // onClick={openModal}

          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          {TranslateString(999, 'Harvest')}
        </Button>
      </BalanceAndCompound>
      {/* <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
 
          
          
          <div style={{fontSize:'22px',color:'rgb(117 223 238)',width:'550px',textAlign:'center',lineHeight:'35px',letterSpacing:'0.6px'}}>AS YOU ARE STILL IN 11 DAY THRESHOLD REMOVING TOKENS FROM POOL WILL BURN 25% OF STAKE</div>
          <form>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'20px'}}>
            <button style={{background:'#49c6d8',border:'none',padding:'10px 30px',color:'#fff',marginRight:'15px',cursor:'pointer'}} type="button"  onClick={closeModal}>Cancel</button>
            <button style={{background:'#49c6d8',border:'none',padding:'10px 30px',color:'#fff',marginRight:'15px',cursor:'pointer'}}type="button" onClick={Ok}>Ok</button>
            </div>
          </form>
        </Modal> */}
    </Flex>
  )
}

export default HarvestAction
