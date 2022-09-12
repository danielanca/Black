type Card = {
    cardID: string;
    cardValue: number;
};
type CardsPlayers = {
    socketID: string;
    nickName: string;
    cards: Card[];
};
export interface PlayerProps {
    nickName: string;
    roomChannel: string;
}

export interface ConnectionProps {
    responseMessage: string;
    [key: string]: any;
}

export interface WelcomeProps {
    eventHandler: (event: ConnectionProps) => void;
    setPlayerData: React.Dispatch<React.SetStateAction<PlayerProps>>;
    playerData: PlayerProps;
    cards: CardsPlayers[];
    setCards: React.Dispatch<React.SetStateAction<CardsPlayers[]>>;
}
