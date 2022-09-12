import styles from './Gameplay.module.scss';
import { cardImageLoad } from '../../Cards/cardsLoad';
import { useContext, useState, useEffect } from 'react';
import { Context } from './../LandingPage';

interface GameplayProps {
    playerInfo: {
        nickName: string;
        roomChannel: string;
    };
}

const Gameplay = ({ playerInfo }: GameplayProps) => {
    const ourContext = useContext(Context);
    const { nickName, roomChannel } = playerInfo;

    console.log('GAMEPLAY:', nickName);
    const [cards, setCards] = useState([
        { cardID: '9-H', cardValue: 9 },
        { cardID: '4-H', cardValue: 9 }
    ]);

    const [gameplayStatus, setGameplayStatus] = useState();

    const hitAction = () => {};

    const stayAction = () => {};

    useEffect(() => {
        ourContext.socket.emit('PLAYER_READY', { initialState: true, playerInfo });
    }, []);
    useEffect(() => {
        ourContext.socket.on('SERVER_INCOMING', (data: any) => {
            if (data.message === 'CARD_INCOMING') {
                setCards(data.card);
            }
        });
    }, [ourContext.socket]);

    return (
        <div className={styles.gameContainer}>
            <div className={styles.upperBanner}>
                <h4 className={styles.roomName}>{`Room: ${roomChannel}`}</h4>
                <p className={styles.nickStyle}>{`Nickname: ${nickName}`}</p>
            </div>

            <div className={styles.controls}>
                <button className={styles.hitButton}>{'HIT'}</button>
                <button className={styles.stayButton}>{'STAY'}</button>
            </div>
            <div className={styles.uRcenterOfUniverse}>
                <div className={styles.myDeck}>
                    {cards.map((item) => {
                        return (
                            <img
                                className={styles.card}
                                src={cardImageLoad(item.cardID)}
                                alt={item.cardID}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Gameplay;
