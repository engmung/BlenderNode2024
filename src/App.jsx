import React from 'react';
import Grid from './components/Grid';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <>
      <GlobalStyles />
      <Grid 
        frontColor="#000000"   // 앞면의 기본 색상
        randomRange={20}      // 앞면의 명도 변화 범위
      />
    </>
  );
}

export default App;
