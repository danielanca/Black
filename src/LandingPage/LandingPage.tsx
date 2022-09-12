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
const socket = io('http://localhost:9001');

export const Context = createContext({ socket });

const LandingPage = () => {
    const [playerData, setPlayerData] = useState<PlayerProps>({ nickName: '', roomChannel: '' });
    const [message, setMessage] = useState<string>('No message yet');
    const [gamePlay, setGamePlay] = useState<boolean>(false);

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
    }, [socket]);

    useEffect(() => {
        console.log('[LandingPage] PlayerData changed!', playerData);
    }, [playerData]);

    const setData = (data: ConnectionProps) => {
        let { nickName, roomChannel, responseMessage } = data;
        console.log('[LandingPage] -> setData:', data);
        if (responseMessage === 'ENTER_ROOM') {
            setPlayerData({ nickName, roomChannel });
            setGamePlay(true);

            console.log('[LandingPage] -> setData and ENTER_ROOM event', playerData);
        } else {
            setPlayerData({ nickName, roomChannel });
        }
    };

    return (
        <>
            <Context.Provider value={{ socket }}>
                {!gamePlay ? (
                    <Welcome eventHandler={setData} />
                ) : (
                    <Gameplay
                        playerInfo={{
                            nickName: playerData.nickName,
                            roomChannel: playerData.roomChannel
                        }}
                    />
                )}
            </Context.Provider>
        </>
    );
};

export default LandingPage;
