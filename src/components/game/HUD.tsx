import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../state/gameStore';
import { Heart } from 'lucide-react';

const HUD: React.FC = () => {
    const { t } = useTranslation();
    const { score, lives, level, levelData } = useGameStore();

    return (
        <div className="hud">
            <div className="hud-left">
                <p className="level-label">{t('levelLabel', { level })}</p>
                <p className="level-name">{levelData?.levelName}</p>
                <p className="level-description">{levelData?.levelDescription}</p>
            </div>
            <div className="hud-right">
                <p className="score-label">{t('scoreLabel', { score })}</p>
                <div className="lives">
                    {Array.from({ length: lives }, (_, i) => (
                        <Heart key={i} className="life-icon" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HUD;