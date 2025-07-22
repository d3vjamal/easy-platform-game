import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../state/gameStore';
import { Palette } from 'lucide-react';
import type { Theme } from '../../types';

interface ThemeSelectorProps {
    onGenerateLevel: () => void;
    themes: Theme[];
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onGenerateLevel, themes }) => {
    const { t } = useTranslation();
    const { customTheme, setTheme, setCustomTheme } = useGameStore();
    const [isCustomizing, setIsCustomizing] = useState(false);

    return (
        <div className="card space-y-lg">
            <h2>{t('chooseTheme')}</h2>
            <p>{t('levelDifficulty', { level: useGameStore.getState().level, difficulty: useGameStore.getState().level === 1 ? 1 : Math.min(useGameStore.getState().level + 1, 10) })}</p>

            <div className="theme-grid">
                {themes.map((t_theme) => (
                    <button
                        key={t_theme.name}
                        onClick={() => {
                            setTheme(t_theme.name);
                            onGenerateLevel();
                        }}
                        className="theme-card"
                        style={{ '--theme-color': t_theme.color } as React.CSSProperties}
                    >
                        <div className="theme-card-icon">
                            {t_theme.icon}
                        </div>
                        <span className="theme-card-name">{t_theme.name}</span>
                    </button>
                ))}
                <button
                    onClick={() => setIsCustomizing(true)}
                    className="theme-card"
                >
                    <div className="theme-card-icon">
                        <Palette className="w-8 h-8" />
                    </div>
                    <span className="theme-card-name">{t('customTheme')}</span>
                </button>
            </div>

            {isCustomizing && (
                <div className="custom-theme-form">
                    <p>{t('enterCustomTheme')}</p>
                    <input
                        type="text"
                        placeholder={t('customPlaceholder')}
                        value={customTheme}
                        onChange={(e) => setCustomTheme(e.target.value)}
                        className="form-control"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && customTheme.trim()) {
                                onGenerateLevel();
                            }
                        }}
                    />
                    <button
                        onClick={() => customTheme.trim() && onGenerateLevel()}
                        disabled={!customTheme.trim()}
                        className="btn btn-primary"
                    >
                        {t('generateLevel', { theme: customTheme || 'Custom' })}
                    </button>
                    <div className="custom-theme-tips">
                        <p>{t('customTip1')}</p>
                        <p>{t('customTip2')}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;