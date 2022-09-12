import io from 'socket.io-client';
import { useEffect, useState, useContext, createContext } from 'react';
import { PlayerProps, WelcomeProps } from './../../PropTypes/types';
import { setCookie, getCookie } from '../../SendRequest/functions';
import { Context } from '../LandingPage';
import styles from './Welcome.module.scss';

interface playersListProps {
    nickName: string;
    channelRoom: string;
}
type Card = {
    cardID: string;
    cardValue: number;
};
type CardsPlayers = {
    socketID: string;
    nickName: string;
    cards: Card[];
};
const getExistingNickName = () => {
    let credentialsSaved = getCookie('blackJackDaniel');
    if (credentialsSaved) {
        console.log('Credentials in Cookie:', credentialsSaved);
        var { nickName } = JSON.parse(credentialsSaved);
        return nickName;
    } else {
        return '';
    }
};
const getExistingRoomChannel = () => {
    let credentialsSaved = getCookie('blackJackDaniel');
    if (credentialsSaved) {
        console.log('Credentials in Cookie:', credentialsSaved);
        var { roomChannel } = JSON.parse(credentialsSaved);
        return roomChannel;
    } else {
        return '';
    }
};
const Welcome = ({ eventHandler, playerData, setPlayerData, cards, setCards }: WelcomeProps) => {
    const ourContext = useContext(Context);

    const [playersOnLabel, setPlayersOnLabel] = useState<playersListProps[]>([]);

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setPlayerData((playerData) => ({ ...playerData, [name]: value }));
    };

    useEffect(() => {
        ourContext.socket.emit('howManyPlayers');
        console.log('[Welcome] => howManyPlayers useEffect credentials:', playerData);
    }, []);

    useEffect(() => {
        ourContext.socket.on('playerCards', (data: any) => {
            console.log('playerCards:', data);
            let cardsPlayerIncoming: CardsPlayers[] = JSON.parse(data.payload);

            console.log('DA DA from WELCOME', JSON.stringify(data));
            setCards(cardsPlayerIncoming);
        });
    }, [ourContext.socket]);

    useEffect(() => {
        ourContext.socket.on('roomJoinStatus', (data: any) => {
            if (data.message === 'ENTER_ROOM') {
                console.log('[Welcome] => roomJoinStatus to EventHandler:', data);
                setCookie(
                    'blackJackDaniel',
                    JSON.stringify({
                        nickName: data.nickName,
                        roomChannel: data.roomChannel
                    })
                );

                eventHandler({
                    responseMessage: data.message,
                    nickName: data.nickName,
                    roomChannel: data.roomChannel
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

        console.log(
            '[Welcome] -> WE RECEIVED SIGNAL TO CONNECT TO ROOM and have playerData',
            playerData
        );
    }, [ourContext.socket]);

    useEffect(() => {
        console.log(`  [Welcome] PlayerData changed!`, playerData);
    }, [playerData]);

    useEffect(() => {
        if (getExistingNickName() !== '') {
            setPlayerData((playerData) => ({ ...playerData, nickName: getExistingNickName() }));
        }
        if (getExistingRoomChannel() !== '') {
            setPlayerData((playerData) => ({
                ...playerData,
                roomChannel: getExistingRoomChannel()
            }));
        }
    }, []);

    const joinRoom = () => {
        if (playerData.roomChannel !== '' && playerData.nickName !== '') {
            ourContext.socket.emit('joinRoom', {
                roomChannel: playerData.roomChannel,
                nickName: playerData.nickName
            });
        } else {
            console.log('THERE IS NO ROOM SPECIFICATION');
        }
    };

    const getPlayers = () => {
        ourContext.socket.emit('howManyPlayers');
    };
    return (
        <>
            <h2>{'Welcome to BlackJack Game!'} </h2>
            <label htmlFor="nameInput">{'NickName'}</label>
            <input
                className={styles.inputNickname}
                value={playerData.nickName}
                onChange={inputHandler}
                name="nickName"
                type={'input'}
            />
            <label htmlFor="roomInput">{'Room Channel:'}</label>
            <label
                className={styles.detailsText}
                htmlFor="roomInput">{`(if room doesn't exist, it will be created)`}</label>
            <input
                className={styles.inputNickname}
                value={playerData.roomChannel}
                onChange={inputHandler}
                name="roomChannel"
                type={'input'}
            />
            <button onClick={joinRoom} className={styles.createTableBtn}>
                {'JoinChannel'}
            </button>
            {/* <button onClick={sendMessage} className={styles.joinTableBtn}>{'Join channel'}</button> */}

            <button onClick={getPlayers} className={styles.joinTableBtn}>
                {'Get players'}
            </button>
            <div className={styles.onlineList}>
                <p>{`Players online:`}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Nickname</th>
                            <th>Channel #</th>
                        </tr>
                        {playersOnLabel.map((item) => (
                            <tr>
                                <td>{item.nickName}</td>
                                <td>{item.channelRoom}</td>
                            </tr>
                        ))}
                    </thead>
                </table>
            </div>
        </>
    );
};

export default Welcome;
