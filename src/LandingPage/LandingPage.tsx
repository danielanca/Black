import io from 'socket.io-client';
import { useEffect, useState, useContext, createContext } from 'react';
import styles from './LandingPage.module.scss';
import { ConnectionProps } from './../PropTypes/types';
import { sendCreateTableRequest } from '../SendRequest/transmit';
import Gameplay from './Gameplay/Gameplay';
import Welcome from './Welcome/Welcome';

interface PlayerProps {
   nickName: string;
   roomChannel: string;
}
interface GameplayProps {
   playerInfo: {
      nickName: string;
      roomChannel: string;
   };
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
const socket = io('http://localhost:8999');

export const Context = createContext({ socket });

const LandingPage = () => {
   const [playerData, setPlayerData] = useState<PlayerProps>({
      nickName: '',
      roomChannel: '',
   });
   const [message, setMessage] = useState<string>('No message yet');
   const [gamePlay, setGamePlay] = useState<boolean>(false);
   const [cards, setCards] = useState<CardsPlayers[]>([]);
   const [myTurn, setMyTurn] = useState<'YES' | 'NO'>('NO');

   useEffect(() => {
      socket.on('receive_message', (data) => {
         setMessage(data.message);
      });

      socket.on('roomJoinStatus', (data) => {
         setMessage(data.message);
         if (data.message === 'ENTER_ROOM') {
            setGamePlay(true);
         }
      });

      socket.on('GameplayRestart', (data: any) => {
         setGamePlay(false);
      });

      // socket.on('playerCards', (data: any) => {
      //     // console.log('playerCards:', data);
      //     let cardsPlayerIncoming: CardsPlayers[] = JSON.parse(data.payload);

      //     // console.log('[LANDING] PLAYER DATA:', playerData);
      //     cardsPlayerIncoming.find((player) => player.nickName === playerData.nickName);
      //     if (typeof cardsPlayerIncoming != 'undefined') {
      //         let theTurn = cardsPlayerIncoming.find(
      //             (player) => player.nickName === playerData.nickName
      //         )?.myTurn;

      //          );
      //         // setMyTurn(theTurn === 'YES' ? 'YES' : 'NO');
      //         console.log('THE TURN IS:', theTurn);
      //         // setMyTurn(instanceof theTurn != undefined ? theTurn : 'NO');
      //     }

      //     console.log('DA DA:', cardsPlayerIncoming);
      //     setCards(cardsPlayerIncoming);
      // });
   }, [socket]);

   const setData = (data: ConnectionProps) => {
      let { nickName, roomChannel, responseMessage } = data;
      // console.log('[LandingPage] -> setData:', data);
      if (responseMessage === 'ENTER_ROOM') {
         setPlayerData({ nickName, roomChannel });
         setGamePlay(true);

         // console.log('[LandingPage] -> setData and ENTER_ROOM event', playerData);
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
