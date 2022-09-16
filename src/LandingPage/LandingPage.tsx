import io from 'socket.io-client';
import { useEffect, useState, createContext } from 'react';
import { ConnectionProps } from './../PropTypes/types';
import Gameplay from './Gameplay/Gameplay';
import Welcome from './Welcome/Welcome';
interface PlayerProps {
   nickName: string;
   roomChannel: string;
}

type Card = {
   cardID: string;
   cardValue: number;
};
type CardsPlayers = {
   socketID: string;
   nickName: string;
   cards: Card[];
   dealer?: string;
   myTurn?: string;
};
const socket = io('https://blackjackdanielback.herokuapp.com');

export const Context = createContext({ socket });

const LandingPage = () => {
   const [playerData, setPlayerData] = useState<PlayerProps>({
      nickName: '',
      roomChannel: '',
   });

   const [gamePlay, setGamePlay] = useState<boolean>(false);
   const [cards, setCards] = useState<CardsPlayers[]>([]);
   const [myTurn, setMyTurn] = useState<'YES' | 'NO'>('NO');

   useEffect(() => {
      socket.on('roomJoinStatus', (data) => {
         if (data.message === 'ENTER_ROOM') {
            setGamePlay(true);
         }
      });

      socket.on('GameplayRestart', (data: any) => {
         setGamePlay(false);
      });
   }, [socket]);

   const setData = (data: ConnectionProps) => {
      let { nickName, roomChannel, responseMessage } = data;
      if (responseMessage === 'ENTER_ROOM') {
         setPlayerData({ nickName, roomChannel });
         setGamePlay(true);
      } else {
         setPlayerData({ nickName, roomChannel });
      }
   };

   return (
      <>
         <Context.Provider value={{ socket }}>
            {!gamePlay ? (
               <Welcome
                  playerData={playerData}
                  setPlayerData={setPlayerData}
                  eventHandler={setData}
                  cards={cards}
                  setCards={setCards}
               />
            ) : (
               <Gameplay
                  cards={cards}
                  setCards={setCards}
                  playerInfo={{
                     nickName: playerData.nickName,
                     roomChannel: playerData.roomChannel,
                  }}
                  myTurn={myTurn}
               />
            )}
         </Context.Provider>
      </>
   );
};

export default LandingPage;
