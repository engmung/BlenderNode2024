import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GridCell from './GridCell';
import GridLines from './GridLines';
import CenterCell from './CenterCell';

const GridContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
`;

const GridInner = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(4, 1fr);
  width: min(calc(100vh * 2), 100vw);
  height: min(calc(100vw / 2), 100vh);
  position: relative;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(8, 1fr);
    width: min(100vw, calc(100vh / 2));
    height: min(calc(100vw * 2), 100vh);
  }
`;

const calculateDistance = (index1, index2) => {
  const row1 = Math.floor(index1 / 8);
  const col1 = index1 % 8;
  const row2 = Math.floor(index2 / 8);
  const col2 = index2 % 8;
  return Math.sqrt(Math.pow(row1 - row2, 2) + Math.pow(col1 - col2, 2));
};

const Grid = ({ 
  frontColor = '#1a1a1a', 
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

    sortedCells.forEach(([cellIndex, distance]) => {
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
      }, 0);
    });

    setTimeout(() => {
      setIsExpanding(false);
      setIsAllFlipped(!isReversing);
    }, 600);
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

  const getImageNumber = (i) => {
    return imagePositions[i];
  };

  const getDelay = (index) => {
    if (!clickedCell) return 0;
    return calculateDistance(clickedCell, index) * 100;
  };

  return (
    <GridContainer>
      <GridInner>
        {Array.from({ length: 32 }, (_, i) => {
          const isFlipped = flippedCells.has(i);
          const imageNum = getImageNumber(i);
          
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
              onClick={() => handleCellClick(i)}
              delay={getDelay(i)}
              frontColor={frontColor}
              randomRange={randomRange}
            />
          );
        })}
      </GridInner>
      <GridLines />
    </GridContainer>
  );
};

export default Grid;
