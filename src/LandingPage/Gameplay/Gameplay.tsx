import styles from './Gameplay.module.scss';
import { cardImageLoad } from '../../Cards/cardsLoad';
import { useContext, useState, useEffect } from 'react';
import { Context } from './../LandingPage';
import pokerCard from './../../pokerCard.mp3';
import { GameplayProps, CardsPlayers, Card } from '../../PropTypes/types';
import { strings } from '../../constants/strings';
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
      ourContext.socket.on('playerCards', (data: any) => {
         console.log('playerCards:', data);
         if (typeof data.restart !== 'undefined') {
         }
         let cardsPlayerIncoming: CardsPlayers[] = JSON.parse(data.payload);
         setCards(cardsPlayerIncoming);
      });

      ourContext.socket.on('GAME_FINISHED', (data: any) => {
         let gameWinner = data.payload;
         setWinnerAnnounce(` ${gameWinner.players[0].nickName} ${gameWinner.message}`);
      });
   }, [ourContext.socket]);

   const restartGameRequest = () => {
      ourContext.socket.emit('restartGame', {
         requestNickname: playerInfo.nickName,
         requestChannel: playerInfo.roomChannel,
      });
   };

   return (
      <div className={styles.gameContainer}>
         <div className={styles.upperBanner}>
            <h4 className={styles.roomName}>{`Room: ${roomChannel}`}</h4>
            <h4 className={styles.roomName}>{`Opponent: ${
               typeof opponent === 'undefined' ? 'no-one' : opponent
            }`}</h4>
            <p className={styles.nickStyle}>{`${strings.nickName} ${nickName}`}</p>
         </div>

         {cards.find((player) => player.nickName === nickName)?.myTurn === 'YES' ? (
            <div className={styles.controls}>
               <button onClick={fireAction.bind(1, 'HIT')} className={styles.hitButton}>
                  {strings.buttonsAction.hit}
               </button>
               <button onClick={fireAction.bind(1, 'STAY')} className={styles.stayButton}>
                  {strings.buttonsAction.stand}
               </button>
            </div>
         ) : cards.find((player) => player.nickName === nickName)?.myTurn === 'NO' ? (
            <div className={styles.middleMessage}>
               <h3>{strings.waitForOpponent}</h3>
            </div>
         ) : cards.find((player) => player.nickName === nickName)?.myTurn === 'NO_MORE' &&
           cards.find((player) => player.nickName !== nickName)?.myTurn != 'YES' ? (
            <div className={styles.middleMessage}>
               <h3>{'Game ended'}</h3>
               <h3>{winnerAnnounce}</h3>
               <button onClick={restartGameRequest} className={styles.restartButton}>
                  {'Restart'}
               </button>
            </div>
         ) : cards.find((player) => player.nickName === nickName)?.myTurn === 'NO_MORE' &&
           cards.find((player) => player.nickName !== nickName)?.myTurn === 'YES' ? (
            <div className={styles.middleMessage}>
               <h3>{strings.waitForOpponent}</h3>
            </div>
         ) : cards.find((player) => player.nickName === nickName)?.myTurn ===
           'NO_EXCEEDED' ? (
            <div className={styles.middleMessage}>
               <h3 style={{ color: 'red' }}>{strings.cardsExceeded}</h3>
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
