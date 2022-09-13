import styles from './Gameplay.module.scss';
import { cardImageLoad } from '../../Cards/cardsLoad';
import { useContext, useState, useEffect } from 'react';
import { Context } from './../LandingPage';

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

const Gameplay = ({ playerInfo, cards, setCards }: GameplayProps) => {
    const ourContext = useContext(Context);
    const { nickName, roomChannel } = playerInfo;
    const opponent = cards.find((player) => player.nickName !== nickName)?.nickName;
    const [myTurn, setMyTurn] = useState<'YES' | 'NO'>('NO');
    console.log('GAMEPLAY:', nickName);
    console.log('myTurn:', myTurn);

    const fireAction = (event: string) => {
        ourContext.socket.emit(
            'EVENT_ACTION',
            JSON.stringify({ nickName, roomChannel, actionEvent: event })
        );
    };

    useEffect(() => {
        ourContext.socket.emit('PLAYER_READY', { initialState: true, playerInfo });
    }, []);
    useEffect(() => {
        ourContext.socket.on('SERVER_INCOMING', (data: any) => {
            if (data.message === 'CARD_INCOMING') {
                setCards(data.card);
            }
        });

        ourContext.socket.on('playerCards', (data: any) => {
            console.log('playerCards:', data);
            let cardsPlayerIncoming: CardsPlayers[] = JSON.parse(data.payload);
            // if (typeof cardsPlayerIncoming != 'undefined') {
            //     let theTurn = cardsPlayerIncoming.find((player) => player.nickName === nickName)
            //         ?.myTurn;

            //     console.log('THE TURN IS:', theTurn, nickName);
            //     if (typeof theTurn != 'undefined') {
            //         setMyTurn('YES');
            //     }
            // }

            // console.log('DA DA from WELCOME', JSON.stringify(data));
            setCards(cardsPlayerIncoming);
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
