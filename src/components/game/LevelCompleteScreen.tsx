import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../state/gameStore';
import { Zap } from 'lucide-react';

const LevelCompleteScreen: React.FC = () => {
    const { t } = useTranslation();
    const { score, nextLevel } = useGameStore();

    return (
        <div className="card space-y-lg">
            <Zap className="level-complete-icon" />
            <h2>{t('levelComplete')}</h2>
            <div>
                <p className="score-label">{t('scoreLabel', { score })}</p>
            </div>
            <button
                onClick={nextLevel}
                className="btn btn-primary"
            >
                {t('nextLevel')}
            </button>
        </div>
    );
};

export default LevelCompleteScreen;