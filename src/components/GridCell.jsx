import React, { useMemo } from 'react';
import styled from 'styled-components';

const CellWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => `rotateY(${props.$isFlipped ? 180 : 0}deg)`};
  transition-delay: ${props => props.$delay}ms;
`;

const CellContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
`;

const CellFront = styled(CellContent)`
  background: ${props => props.$randomizedColor};
`;

const CellBack = styled(CellContent)`
  transform: rotateY(180deg);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

// 색상 밝기 조절 함수
const adjustBrightness = (color, amount) => {
  const hex = color.replace('#', '');
  const rgb = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (rgb >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((rgb >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (rgb & 0xff) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

const GridCell = ({ 
  isFlipped, 
  imageNum, 
  onClick, 
  delay = 0,
  frontColor = '#1a1a1a',
  randomRange = 5,
  index
}) => {
  const randomizedColor = useMemo(() => {
    const randomAmount = Math.floor((Math.random() - 0.5) * randomRange);
    return adjustBrightness(frontColor, randomAmount);
  }, [frontColor, randomRange, index]);

  return (
    <CellWrapper $isFlipped={isFlipped} onClick={onClick} $delay={delay}>
      <CellFront $randomizedColor={randomizedColor} />
      <CellBack>
        <img 
          src={`/src/assets/images/scene${imageNum}.webp`} 
          alt={`Scene ${imageNum}`}
          loading="lazy"
        />
      </CellBack>
    </CellWrapper>
  );
};

export default GridCell;
