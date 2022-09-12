import { useState } from 'react';
export const usePlayerState = () => {
    const [playerData, setPlayerData] = useState();

    return [playerData, setPlayerData];
};
