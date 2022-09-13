import image from './../media/cards/2-C.png';

export const cardImageLoad = (cardIDName: string) => {
    let cardID = document.createElement('img');
    cardID.src = 'cards/' + cardIDName + '.png';
    return cardID.src;
};
