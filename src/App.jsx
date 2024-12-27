import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Grid from './components/Grid';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  :root {
    --vh: 1vh;
  }

  html {
    height: 100%;
    
    @media (min-width: 769px) {
      overflow: hidden;
    }
  }

  body {
    width: 100%;
    height: 100%;
    background: black;
    
    @media (min-width: 769px) {
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    
    @media (max-width: 768px) {
      min-height: calc(var(--vh, 1vh) * 100);
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  }

  #root {
    width: 100%;
    height: 100%;
    
    @media (max-width: 768px) {
      min-height: calc(var(--vh, 1vh) * 100);
    }
  }
`;

function App() {
  React.useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    
    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <>
      <GlobalStyle />
      <Grid />
    </>
  );
}

export default App;
