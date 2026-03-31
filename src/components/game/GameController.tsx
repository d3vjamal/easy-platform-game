import React from 'react';
import { useGameStore } from '../../state/gameStore';
import MainMenu from './MainMenu';
import ThemeSelector from './ThemeSelector';
import GameCanvas from './GameCanvas';
import HUD from './HUD';
import LevelCompleteScreen from './LevelCompleteScreen';
import GameOverScreen from './GameOverScreen';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createFallbackLevel, generateLevel } from '../../utils/level';
import { getThemesForLevel } from '../../utils/themes';

const GameController: React.FC = () => {
    const {
        gameState,
        theme,
        customTheme,
        setGameState,
        setLevelData,
        level,
    } = useGameStore();
    const { t } = useTranslation();
    const handleGenerateLevel = async () => {
        setGameState('generating');
        try {
            const selectedTheme = theme === 'custom' ? customTheme : theme;
            const data = await generateLevel(selectedTheme, level);
            setLevelData(data);
            setGameState('playing');
        } catch (error) {
            console.error('Failed to generate level:', error);
            const selectedTheme = theme === 'custom' ? customTheme : theme;
            const fallbackData = createFallbackLevel(selectedTheme, level);
            setLevelData(fallbackData);
            setGameState('playing');
        }
    };

    const renderGameState = () => {
        switch (gameState) {
            case 'menu':
                return <MainMenu />;
            case 'themeSelect':
                return (
                    <ThemeSelector
                        onGenerateLevel={handleGenerateLevel}
                        themes={getThemesForLevel(level, t)}
                    />
                );
            case 'generating':
                return (
                    <div className="generating-screen">
                        <Sparkles className="w-16 h-16 mx-auto animate-pulse text-yellow-400" />
                        <h2>{t('generatingLevel')}</h2>
                        <p>{t('creatingExperience', { theme: theme === 'custom' ? customTheme : theme })}</p>
                        <p className="text-sm">{t('buildingChallenges')}</p>
                    </div>
                );
            case 'playing':
                return (
                    <div className="game-view">
                        <HUD />
                        <GameCanvas />
                    </div>
                );
            case 'levelComplete':
                return <LevelCompleteScreen />;
            case 'gameOver':
                return <GameOverScreen />;
            default:
                return <MainMenu />;
        }
    };

    return (
        <div className="game-controller">
            {renderGameState()}
        </div>
    );
};

export default GameController;