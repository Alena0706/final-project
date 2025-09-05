import React from 'react';
import { BrowserRouter } from 'react-router';
import AppRouter from './AppRouter/AppRouter';

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
