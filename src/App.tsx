import React from 'react';
import GameController from './components/game/GameController';
import LanguageSwitcher from './components/game/LanguageSwitcher';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';

const App: React.FC = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <LanguageSwitcher />
            <GameController />
        </I18nextProvider>
    );
};

export default App;
