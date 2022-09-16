import { useEffect, useState, useContext } from 'react';
import { WelcomeProps } from './../../PropTypes/types';
import { setCookie, getCookie } from '../../SendRequest/functions';
import { Context } from '../LandingPage';
import styles from './Welcome.module.scss';
import { strings } from '../../constants/strings';
interface playersListProps {
   nickName: string;
   channelRoom: string;
}

const getExistingNickName = () => {
   let credentialsSaved = getCookie('blackJackDaniel');
   if (credentialsSaved) {
      var { nickName } = JSON.parse(credentialsSaved);
      return nickName;
   } else {
      return '';
   }
};
const getExistingRoomChannel = () => {
   let credentialsSaved = getCookie('blackJackDaniel');
   if (credentialsSaved) {
      var { roomChannel } = JSON.parse(credentialsSaved);
      return roomChannel;
   } else {
      return '';
   }
};
const Welcome = ({ eventHandler, playerData, setPlayerData }: WelcomeProps) => {
   const ourContext = useContext(Context);

   const [playersOnLabel, setPlayersOnLabel] = useState<playersListProps[]>([]);

   const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      setPlayerData((playerData) => ({ ...playerData, [name]: value }));
   };

   const pickPlayerToPlay = ({
      friendChannel,
   }: {
      friendName: string;
      friendChannel: string;
   }) => {
      setPlayerData((playerData) => ({ ...playerData, roomChannel: friendChannel }));
      if (playerData.nickName != '') {
         joinRoom();
      } else {
         alert('Please enter your name first');
      }
   };

   useEffect(() => {
      ourContext.socket.emit('howManyPlayers');
   }, []);

   useEffect(() => {
      ourContext.socket.on('roomJoinStatus', (data: any) => {
         if (data.message === 'ENTER_ROOM') {
            console.log('[Welcome] => roomJoinStatus to EventHandler:', data);
            setCookie(
               'blackJackDaniel',
               JSON.stringify({
                  nickName: data.nickName,
                  roomChannel: data.roomChannel,
               })
            );

            eventHandler({
               responseMessage: data.message,
               nickName: data.nickName,
               roomChannel: data.roomChannel,
            });
         }
      });
      ourContext.socket.on('playerList', (data: any) => {
         let array = JSON.parse(data.playersOnline);
         let players: playersListProps[] = [];
         array.forEach((item: any) => {
            players.push({ nickName: item.nickName, channelRoom: item.roomChannel });
         });
         setPlayersOnLabel(players);
      });
   }, [ourContext.socket]);

   useEffect(() => {
      if (getExistingNickName() !== '') {
         setPlayerData((playerData) => ({
            ...playerData,
            nickName: getExistingNickName(),
         }));
      }
      if (getExistingRoomChannel() !== '') {
         setPlayerData((playerData) => ({
            ...playerData,
            roomChannel: getExistingRoomChannel(),
         }));
      }
   }, []);

   const joinRoom = () => {
      setPlayerData((playerData) => ({ ...playerData, nickName: playerData.nickName }));
      if (playerData.roomChannel !== '' && playerData.nickName !== '') {
         ourContext.socket.emit('joinRoom', {
            roomChannel: playerData.roomChannel,
            nickName: playerData.nickName,
         });
      }
   };

   return (
      <>
         <h2>{strings.welcomeMessage} </h2>
         <label htmlFor="nameInput">{strings.nickName}</label>
         <input
            className={styles.inputNickname}
            value={playerData.nickName}
            onChange={inputHandler}
            name="nickName"
            type={'input'}
         />
         <label htmlFor="roomInput">{strings.roomChannel}</label>
         <label
            className={styles.detailsText}
            htmlFor="roomInput"
         >{`(if room doesn't exist, it will be created)`}</label>
         <input
            className={styles.inputNickname}
            value={playerData.roomChannel}
            onChange={inputHandler}
            name="roomChannel"
            type={'input'}
         />
         <button onClick={joinRoom} className={styles.createTableBtn}>
            {strings.joinChannel}
         </button>

         <div className={styles.onlineList}>
            <p>{strings.playersOnline}</p>
            <table className={styles.tableStyle}>
               <thead>
                  <tr>
                     <th style={{ minWidth: '145px' }}>Nickname</th>
                     <th style={{ minWidth: '145px' }}>Channel #</th>
                     <th style={{ minWidth: '145px' }}>Action</th>
                  </tr>
                  {playersOnLabel.map((item) => (
                     <tr>
                        <td style={{ minWidth: '145px' }}>{item.nickName}</td>
                        <td style={{ minWidth: '145px' }}>{item.channelRoom}</td>
                        <td style={{ minWidth: '145px' }}>
                           <button
                              className={styles.joinButton}
                              onClick={pickPlayerToPlay.bind(1, {
                                 friendName: item.nickName,
                                 friendChannel: item.channelRoom,
                              })}
                           >
                              {strings.joinButton}
                           </button>
                        </td>
                     </tr>
                  ))}
               </thead>
            </table>
         </div>
      </>
   );
};

export default Welcome;
