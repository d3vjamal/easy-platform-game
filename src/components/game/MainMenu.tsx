import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../state/gameStore';

const MainMenu: React.FC = () => {
    const { t } = useTranslation();
    const setGameState = useGameStore((state) => state.setGameState);

    return (
        <div className="card space-y-lg">
            <h1>{t('gameTitle')}</h1>
            <p>{t('gameSubtitle')}</p>
            <button
                onClick={() => setGameState('themeSelect')}
                className="btn btn-primary"
            >
                {t('startAdventure')}
            </button>
            <div className="controls-info">
                <p>{t('controlsArrow')}</p>
                <p>{t('controlsJump')}</p>
                <p>{t('controlsDefeat')}</p>
            </div>
        </div>
    );
};

export default MainMenu;