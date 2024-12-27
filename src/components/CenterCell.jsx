import React from 'react';
import styled from 'styled-components';

const CellWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: ${props => props.$isFlippable ? 'pointer' : 'default'};
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => `rotateY(${props.$isFlipped ? 180 : 0}deg)`};
`;

const CellContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  background: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const CellBack = styled(CellContent)`
  transform: rotateY(180deg);
`;

const NumberContainer = styled.div`
  font-size: min(5vw, 10vh);
  font-weight: 900;
  user-select: none;
  
  @media (max-width: 768px) {
    font-size: min(10vw, 20vh);
    font-family: 'Archivo Black', sans-serif;
    letter-spacing: -0.02em;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: min(1.2vw, 2.4vh);
  text-align: center;
  line-height: 1.4;
  user-select: none;
  
  @media (max-width: 768px) {
    font-size: min(2.4vw, 4.8vh);
    gap: 0.3rem;
  }
  
  .title {
    font-weight: 700;
    font-size: min(1.6vw, 3.2vh);
    
    @media (max-width: 768px) {
      font-size: min(3.2vw, 6.4vh);
    }
    
    color: ${props => props.$isLink ? '#ff4444' : 'white'};
    text-decoration: none;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  .subtitle {
    font-weight: 400;
    opacity: 0.8;
    font-size: 0.9em;
    margin-top: 0.2rem;
    
    @media (max-width: 768px) {
      margin-top: 0.2rem;
    }
  }

  .description {
    font-size: 0.85em;
    opacity: 0.7;
    margin-top: 0.4rem;
    
    @media (max-width: 768px) {
      margin-top: 0.2rem;
    }
  }
`;

const Number = styled.div`
  font-size: ${props => props.isMobile ? '3rem' : '2.5rem'};
  font-weight: ${props => props.isMobile ? '900' : '700'};
  color: white;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
    font-weight: 900;
  }
`;

const CenterCell = ({ number, content, $isFlippable, $isFlipped, onClick }) => {
  if (number) {
    return (
      <CellWrapper onClick={onClick} $isFlippable={$isFlippable}>
        <CellContent>
          <NumberContainer>{number}</NumberContainer>
        </CellContent>
      </CellWrapper>
    );
  }

  const handleClick = () => {
    onClick?.();
    if (content?.front?.link && !$isFlipped) {
      window.open(content.front.link, '_blank');
    } else if (content?.back?.link && $isFlipped) {
      window.open(content.back.link, '_blank');
    }
  };

  return (
    <CellWrapper $isFlipped={$isFlipped} onClick={handleClick} $isFlippable={$isFlippable}>
      <CellContent>
        <TextContainer $isLink={content?.front?.link}>
          <div className="title">
            {content?.front?.title}
          </div>
          {content?.front?.subtitle && (
            <div className="subtitle">
              {content?.front?.subtitle}
            </div>
          )}
          {content?.front?.description && (
            <div className="description">
              {content?.front?.description}
            </div>
          )}
        </TextContainer>
      </CellContent>
      <CellBack>
        <TextContainer $isLink={content?.back?.link}>
          <div className="title">
            {content?.back?.title}
          </div>
          {content?.back?.subtitle && (
            <div className="subtitle">
              {content?.back?.subtitle}
            </div>
          )}
          {content?.back?.description && (
            <div className="description">
              {content?.back?.description}
            </div>
          )}
        </TextContainer>
      </CellBack>
    </CellWrapper>
  );
};

export default CenterCell;
