import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router';
import { store, persistor } from '../store/store';

type Props = {
  children: React.JSX.Element;
};

export default function AppProvider({ children }: Props): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
