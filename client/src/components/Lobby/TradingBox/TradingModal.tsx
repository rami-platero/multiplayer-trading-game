import { lobbyContext } from '../../../context/LobbyContext'
import './tradingModal.css'
import {useContext} from 'react'

const TradingModal = () => {
    const {closeTrade} = useContext(lobbyContext)
  return (
    <div className='trading-modal'>
        <button onClick={closeTrade}>Close Offer</button>
    </div>
  )
}

export default TradingModal