import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../state/gameStore';
import { Skull } from 'lucide-react';

const GameOverScreen: React.FC = () => {
    const { t } = useTranslation();
    const { score, level, theme, retryLevel, resetGame } = useGameStore();

    return (
        <div className="card space-y-lg">
            <Skull className="game-over-icon" />
            <h2 className="game-over-title">{t('gameOver')}</h2>
            <p className="score-label">{t('scoreLabel', { score })}</p>
            <p className="level-info">{t('levelLabel', { level })} - {theme}</p>
            <div className="space-y-md">
                <button
                    onClick={retryLevel}
                    className="btn btn-primary"
                >
                    {t('retryLevel')}
                </button>
                <button
                    onClick={resetGame}
                    className="btn btn-secondary"
                >
                    {t('backToMenu')}
                </button>
            </div>
        </div>
    );
};

export default GameOverScreen;