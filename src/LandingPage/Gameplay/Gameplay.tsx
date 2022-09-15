import styles from './Gameplay.module.scss';
import { cardImageLoad } from '../../Cards/cardsLoad';
import { useContext, useState, useEffect } from 'react';
import { Context } from './../LandingPage';
import pokerCard from './../../pokerCard.mp3';

interface GameplayProps {
   playerInfo: {
      nickName: string;
      roomChannel: string;
   };
   cards: CardsPlayers[];
   setCards: React.Dispatch<React.SetStateAction<CardsPlayers[]>>;
   myTurn?: string;
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
const audio = new Audio(pokerCard);
const Gameplay = ({ playerInfo, cards, setCards }: GameplayProps) => {
   const ourContext = useContext(Context);
   const { nickName, roomChannel } = playerInfo;
   const opponent = cards.find((player) => player.nickName !== nickName)?.nickName;
   const [winnerAnnounce, setWinnerAnnounce] = useState<string>('');

   const fireAction = (event: string) => {
      audio.play();
      ourContext.socket.emit(
         'EVENT_ACTION',
         JSON.stringify({ nickName, roomChannel, actionEvent: event })
      );
   };

   useEffect(() => {
      ourContext.socket.emit('PLAYER_READY', { initialState: true, playerInfo });
   }, []);
   useEffect(() => {
      ourContext.socket.on('playerCards', (data: any) => {
         console.log('playerCards:', data);
         let cardsPlayerIncoming: CardsPlayers[] = JSON.parse(data.payload);
         setCards(cardsPlayerIncoming);
      });

      ourContext.socket.on('GAME_FINISHED', (data: any) => {
         let gameWinner = data.payload;
         console.log('FIRED', gameWinner.message);

         setWinnerAnnounce(` ${gameWinner.players[0].nickName} ${gameWinner.message}`);
      });
   }, [ourContext.socket]);

   return (
      <div className={styles.gameContainer}>
         <div className={styles.upperBanner}>
            <h4 className={styles.roomName}>{`Room: ${roomChannel}`}</h4>
            <h4 className={styles.roomName}>{`Opponent: ${
               typeof opponent === 'undefined' ? 'no-one' : opponent
            }`}</h4>
            <p className={styles.nickStyle}>{`Nickname: ${nickName}`}</p>
         </div>

         {cards.find((player) => player.nickName === nickName)?.myTurn === 'YES' ? (
            <div className={styles.controls}>
               <button onClick={fireAction.bind(1, 'HIT')} className={styles.hitButton}>
                  {'HIT'}
               </button>
               <button onClick={fireAction.bind(1, 'STAY')} className={styles.stayButton}>
                  {'STAY'}
               </button>
            </div>
         ) : cards.find((player) => player.nickName === nickName)?.myTurn === 'NO' ? (
            <div className={styles.middleMessage}>
               <h3>{'Waiting for your opponent ...'}</h3>
            </div>
         ) : cards.find((player) => player.nickName === nickName)?.myTurn === 'NO_MORE' &&
           cards.find((player) => player.nickName !== nickName)?.myTurn != 'YES' ? (
            <div className={styles.middleMessage}>
               <h3>{'Game ended'}</h3>
               <h3>{winnerAnnounce}</h3>
            </div>
         ) : cards.find((player) => player.nickName === nickName)?.myTurn === 'NO_MORE' &&
           cards.find((player) => player.nickName !== nickName)?.myTurn === 'YES' ? (
            <div className={styles.middleMessage}>
               <h3>{'Waiting for your opponent ...'}</h3>
            </div>
         ) : (
            ''
         )}
         <div className={styles.theOpponentContainer}>
            <div className={styles.Deck}>
               {cards
                  .find((player) => player.nickName !== nickName)
                  ?.cards.map(({ cardID }: Card) => {
                     return (
                        <img
                           className={styles.oponentCard}
                           src={cardImageLoad(cardID)}
                           alt={'Player card blackjack'}
                        />
                     );
                  })}
            </div>
         </div>
         <div className={styles.uRcenterOfUniverse}>
            <div className={styles.Deck}>
               {cards
                  .find((player) => player.nickName === nickName)
                  ?.cards.map(({ cardID }: Card) => {
                     return (
                        <img
                           className={styles.card}
                           src={cardImageLoad(cardID)}
                           alt={'Player card blackjack'}
                        />
                     );
                  })}
            </div>
         </div>
      </div>
   );
};

export default Gameplay;
