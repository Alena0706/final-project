import React from 'react';
import { BrowserRouter } from 'react-router';
import AppRouter from './router/AppRouter';

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
