import React from 'react';
import GameController from './components/game/GameController';
import LanguageSwitcher from './components/game/LanguageSwitcher';

const App: React.FC = () => {
    return (
        <>
            <LanguageSwitcher />
            <GameController />
        </>
    );
};

export default App;
