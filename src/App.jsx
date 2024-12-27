import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Grid from './components/Grid';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: -webkit-fill-available;
  }

  body {
    width: 100%;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    background: black;
    overscroll-behavior: contain;
    
    @media (max-width: 768px) {
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }
  }

  #root {
    width: 100%;
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Grid />
    </>
  );
}

export default App;
