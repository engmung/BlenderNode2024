import React from 'react';
import styled from 'styled-components';

const GridLinesWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
  }

  &::before {
    top: 0;
    height: 100%;
    width: 1px;
    left: calc(50% - min(calc(100vh * 2), 100vw) / 2);
    box-shadow: ${Array.from({ length: 9 }, (_, i) => 
      `calc(min(calc(100vh * 2), 100vw) / 8 * ${i}) 0 rgba(255, 255, 255, 0.3)`
    ).join(',')};
  }

  &::after {
    left: 0;
    width: 100%;
    height: 1px;
    top: calc(50% - min(calc(100vw / 2), 100vh) / 2);
    box-shadow: ${Array.from({ length: 5 }, (_, i) => 
      `0 calc(min(calc(100vw / 2), 100vh) / 4 * ${i}) rgba(255, 255, 255, 0.3)`
    ).join(',')};
  }

  @media (max-width: 768px) {
    &::before {
      left: calc(50% - min(100vw, calc(100vh / 2)) / 2);
      box-shadow: ${Array.from({ length: 5 }, (_, i) => 
        `calc(min(100vw, calc(100vh / 2)) / 4 * ${i}) 0 rgba(255, 255, 255, 0.3)`
      ).join(',')};
    }

    &::after {
      top: calc(50% - min(calc(100vw * 2), 100vh) / 2);
      box-shadow: ${Array.from({ length: 9 }, (_, i) => 
        `0 calc(min(calc(100vw * 2), 100vh) / 8 * ${i}) rgba(255, 255, 255, 0.3)`
      ).join(',')};
    }
  }
`;

const GridLines = () => {
  return <GridLinesWrapper />;
};

export default GridLines;
