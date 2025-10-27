import anime from 'animejs';
import { useEffect, useRef } from 'react';

export const useAnime = () => {
  const animatePieceMove = (fromSquare: string, toSquare: string) => {
    anime({
      targets: `.piece-${fromSquare}`,
      translateX: [
        { value: getTranslateX(fromSquare, toSquare), duration: 500 }
      ],
      translateY: [
        { value: getTranslateY(fromSquare, toSquare), duration: 500 }
      ],
      easing: 'easeOutQuad'
    });
  };

  const animateBoardHighlight = (squares: string[]) => {
    squares.forEach(square => {
      anime({
        targets: `.square-${square}`,
        backgroundColor: '#f6f669',
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
  };

  const animateCheck = (kingSquare: string) => {
    anime({
      targets: `.square-${kingSquare}`,
      backgroundColor: ['#ff6b6b', '#f6f669'],
      duration: 600,
      loop: true,
      direction: 'alternate'
    });
  };

  return { animatePieceMove, animateBoardHighlight, animateCheck };
};

const getTranslateX = (from: string, to: string) => {
  const fromFile = from.charCodeAt(0) - 97;
  const toFile = to.charCodeAt(0) - 97;
  return (toFile - fromFile) * 100;
};

const getTranslateY = (from: string, to: string) => {
  const fromRank = 8 - parseInt(from[1]);
  const toRank = 8 - parseInt(to[1]);
  return (toRank - fromRank) * 100;
};
