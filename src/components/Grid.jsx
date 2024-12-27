import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GridCell from './GridCell';
import CenterCell from './CenterCell';

const GridContainer = styled.div`
  width: 100%;
  min-height: calc(var(--vh, 1vh) * 100);
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;


const GridWrapper = styled.div`
  display: grid;
  gap: 0.05px;
  background: red;
  aspect-ratio: 2/1;
  width: min(90vw, calc(var(--vh, 1vh) * 180));
  
  @media (max-width: 768px) {
    width: min(95vw, calc(var(--vh, 1vh) * 190));
    aspect-ratio: 1/2;
  }
  
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(4, 1fr);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(8, 1fr);
  }
`;

const calculateDistance = (from, to) => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  // 모바일 레이아웃 (4x8)
  if (isMobile) {
    const fromRow = Math.floor(from / 4);
    const fromCol = from % 4;
    const toRow = Math.floor(to / 4);
    const toCol = to % 4;
    
    return Math.sqrt(
      Math.pow(toRow - fromRow, 2) + 
      Math.pow(toCol - fromCol, 2)
    );
  }
  
  // 데스크톱 레이아웃 (8x4)
  const fromRow = Math.floor(from / 8);
  const fromCol = from % 8;
  const toRow = Math.floor(to / 8);
  const toCol = to % 8;
  
  return Math.sqrt(
    Math.pow(toRow - fromRow, 2) + 
    Math.pow(toCol - fromCol, 2)
  );
};

const Grid = ({ 
  frontColor = '#000000', 
  randomRange = 5
}) => {
  const [flippedCells, setFlippedCells] = useState(new Set());
  const [isExpanding, setIsExpanding] = useState(false);
  const [isAllFlipped, setIsAllFlipped] = useState(false);
  const [clickedCell, setClickedCell] = useState(null);
  const [centerFlipped, setCenterFlipped] = useState(false);
  const [imagePositions, setImagePositions] = useState([]);

  useEffect(() => {
    setFlippedCells(new Set());
    setIsAllFlipped(false);
  }, []);

  useEffect(() => {
    const initializeImagePositions = () => {
      const totalCells = 32;
      const availableImages = Array.from({ length: 28 }, (_, i) => i + 1); // 1-28 이미지
      const newPositions = new Array(totalCells).fill(null);
      
      // 중앙 타일 위치 확인
      const centerPositions = window.matchMedia('(max-width: 768px)').matches
        ? [9, 10, 13, 23]  // 모바일
        : [9, 10, 17, 20];  // 데스크톱
      
      // 사용 가능한 셀 위치 수집
      const availableCells = [];
      for (let i = 0; i < totalCells; i++) {
        if (!centerPositions.includes(i)) {
          availableCells.push(i);
        }
      }
      
      // Fisher-Yates 셔플 알고리즘으로 이미지 랜덤 배치
      const shuffledImages = [...availableImages];
      for (let i = shuffledImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
      }
      
      // 랜덤하게 섞은 이미지를 사용 가능한 셀에 배치
      availableCells.forEach((cellIndex, i) => {
        newPositions[cellIndex] = shuffledImages[i];
      });
      
      setImagePositions(newPositions);
    };

    initializeImagePositions();
  }, []); // 컴포넌트 마운트 시에만 실행

  const expandWave = (currentFlipped, isReversing = false) => {
    const distances = new Map();
    const maxDistance = Math.sqrt(32);
    
    Array.from({ length: 32 }).forEach((_, i) => {
      if (!isCenterCell(i)) {
        distances.set(i, calculateDistance(clickedCell, i));
      }
    });

    const sortedCells = Array.from(distances.entries())
      .sort((a, b) => a[1] - b[1]);

    sortedCells.forEach(([cellIndex, distance], index) => {
      setTimeout(() => {
        setFlippedCells(prev => {
          const updated = new Set(prev);
          if (isReversing) {
            updated.delete(cellIndex);
          } else {
            updated.add(cellIndex);
          }
          return updated;
        });
      }, distance * 100); // 거리에 비례하여 딜레이 적용
    });

    setTimeout(() => {
      setIsExpanding(false);
      setIsAllFlipped(!isReversing);
    }, maxDistance * 100 + 100);
  };

  const handleCellClick = (index) => {
    if (isExpanding) return;
    
    setClickedCell(index);
    setIsExpanding(true);
    setCenterFlipped(!centerFlipped);

    if (isAllFlipped) {
      expandWave(new Set([index]), true);
    } else {
      expandWave(new Set([index]));
    }
  };

  const isCenterCell = (i) => {
    // 모바일에서는 다른 위치에 배치
    if (window.matchMedia('(max-width: 768px)').matches) {
      return [9, 10, 13, 23].includes(i);  // 모든 타일 한칸씩 아래로
    }
    return [9, 10, 17, 20].includes(i);  // 데스크톱 레이아웃
  };

  const getCenterCellContent = (i) => {
    // 모바일 레이아웃
    if (window.matchMedia('(max-width: 768px)').matches) {
      if (i === 9) return { 
        number: '20',
        isFlippable: true 
      };
      if (i === 10) return { 
        number: '24',
        isFlippable: true 
      };
      if (i === 13) return { 
        isFlippable: true,
        content: {
          front: {
            title: '@dodand3d',
            subtitle: '3D Artist / Developer',
            link: 'https://instagram.com/dodand3d'
          },
          back: {
            title: 'Created with',
            subtitle: 'Blender3D'
          }
        }
      };
      if (i === 23) return {
        isFlippable: true,
        content: {
          front: {
            title: 'click!'
          },
          back: {
            title: 'More Works',
            description: 'Click to see more',
            link: 'https://www.notion.so/yc2313/165135cce23e80d0a77effed82149963?v=fa1cd24faf9d485088bed1faa26f5fae'
          }
        }
      };
    }
    
    // 데스크톱 레이아웃
    if (i === 9) return { 
      number: '20',
      isFlippable: true 
    };
    if (i === 10) return { 
      number: '24',
      isFlippable: true 
    };
    if (i === 17) return { 
      isFlippable: true,
      content: {
        front: {
          title: '@dodand3d',
          subtitle: '3D Artist / Developer',
          link: 'https://instagram.com/dodand3d'
        },
        back: {
          title: 'Created with',
          subtitle: 'Blender3D'
        }
      }
    };
    if (i === 20) return {
      isFlippable: true,
      content: {
        front: {
          title: 'click!'
        },
        back: {
          title: 'More Works',
          description: 'Click to see more',
          link: 'https://www.notion.so/yc2313/165135cce23e80d0a77effed82149963?v=fa1cd24faf9d485088bed1faa26f5fae'
        }
      }
    };
    return { number: '' };
  };

  const getImageNumber = (index) => {
    if (isCenterCell(index)) return null;
    return imagePositions[index];
  };

  const getImageUrl = (index) => {
    const imageNumber = getImageNumber(index);
    if (!imageNumber) return null;
    return `/images/scene${imageNumber}.webp`;
  };

  const getDelay = (index) => {
    if (!clickedCell) return 0;
    return calculateDistance(clickedCell, index) * 100;
  };

  return (
    <GridContainer>
      <GridWrapper>
        {Array.from({ length: 32 }, (_, i) => {
          const isFlipped = flippedCells.has(i);
          const imageNum = getImageNumber(i);
          const imageUrl = getImageUrl(i);
          
          if (isCenterCell(i)) {
            const content = getCenterCellContent(i);
            return (
              <CenterCell 
                key={i}
                number={content.number}
                content={content.content}
                $isFlippable={content.isFlippable}
                $isFlipped={centerFlipped && content.isFlippable}
                onClick={() => handleCellClick(i)}
              />
            );
          }

          return (
            <GridCell
              key={i}
              index={i}
              isFlipped={isFlipped}
              imageNum={imageNum}
              imageUrl={imageUrl}
              onClick={() => handleCellClick(i)}
              delay={getDelay(i)}
              frontColor={frontColor}
              randomRange={randomRange}
            />
          );
        })}
      </GridWrapper>
   
    </GridContainer>
  );
};

export default Grid;
