import { useContext } from 'react'
import './lobbyModal.css'
import { tradeMessageInitialState, tradingContext } from '../../context/TradingContext'


const LobbyModal = () => {
    const {tradeMessage,setTradeMessage}=useContext(tradingContext)
  return (
    <div className='lobby-modal'>
        <h1>{tradeMessage?.reason}</h1>
        {tradeMessage?.username? <p>{tradeMessage?.username} {tradeMessage.description}</p>: <p>{tradeMessage?.description}</p>}
        <button onClick={()=>{
            setTradeMessage((prev)=>({...prev,dismissed:true}))
            setTimeout(()=>{
                setTradeMessage(tradeMessageInitialState)
            },300)
        }}>Dismiss</button>
    </div>
  )
}

export default LobbyModal