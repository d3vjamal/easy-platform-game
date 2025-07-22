import React from 'react';
import GameController from './src/components/game/GameController';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/lib/i18n';
import './src/styles/main.css';

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <GameController />
    </I18nextProvider>
  );
};

export default App;