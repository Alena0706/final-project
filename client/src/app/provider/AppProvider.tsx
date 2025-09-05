import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from '../store/store';

type Props = {
  children: React.JSX.Element;
};

export default function AppProvider({ children }: Props): React.JSX.Element {
  return (
    <BrowserRouter>
      <Provider store={store}>{children}</Provider>
    </BrowserRouter>
  );
}
