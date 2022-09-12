

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
}