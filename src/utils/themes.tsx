import React from 'react';
import type { TFunction } from 'i18next';
import { Star, Feather, Eye, Moon, Zap, Waves, Flame, Mountain, Gem, Sun, Shield, Heart, Skull, Music, Palette, Cloud, Sparkles } from 'lucide-react';
import type { Theme } from '../types';

export const getThemesForLevel = (level: number, t: TFunction): Theme[] => {
    const themeSets: Theme[][] = [
        // Set 1: Mystical Realms
        [
            { name: t('crystalCaves'), icon: <Star className="w-8 h-8" />, color: '#e94560' },
            { name: t('floatingLibrary'), icon: <Feather className="w-8 h-8" />, color: '#9b59b6' },
            { name: t('mirrorDimension'), icon: <Eye className="w-8 h-8" />, color: '#3498db' },
            { name: t('dreamscape'), icon: <Moon className="w-8 h-8" />, color: '#f39c12' },
            { name: t('timeVortex'), icon: <Zap className="w-8 h-8" />, color: '#e74c3c' }
        ],
        // Set 2: Natural Wonders
        [
            { name: t('bioluminescentDeep'), icon: <Waves className="w-8 h-8" />, color: '#00bcd4' },
            { name: t('volcanicForge'), icon: <Flame className="w-8 h-8" />, color: '#ff6347' },
            { name: t('stormPeaks'), icon: <Mountain className="w-8 h-8" />, color: '#607d8b' },
            { name: t('coralGardens'), icon: <Gem className="w-8 h-8" />, color: '#ff69b4' },
            { name: t('auroraFields'), icon: <Sun className="w-8 h-8" />, color: '#1abc9c' }
        ],
        // Set 3: Fantastical Locations
        [
            { name: t('clockworkCity'), icon: <Shield className="w-8 h-8" />, color: '#795548' },
            { name: t('candyCosmos'), icon: <Heart className="w-8 h-8" />, color: '#ff1493' },
            { name: t('ghostShip'), icon: <Skull className="w-8 h-8" />, color: '#b0bec5' },
            { name: t('musicBoxWorld'), icon: <Music className="w-8 h-8" />, color: '#4caf50' },
            { name: t('paintDimension'), icon: <Palette className="w-8 h-8" />, color: '#ff5722' }
        ],
        // Set 4: Ethereal Spaces
        [
            { name: t('nebulaGardens'), icon: <Cloud className="w-8 h-8" />, color: '#9c27b0' },
            { name: t('prismPalace'), icon: <Gem className="w-8 h-8" />, color: '#00e676' },
            { name: t('shadowRealm'), icon: <Moon className="w-8 h-8" />, color: '#424242' },
            { name: t('starlightSanctuary'), icon: <Sparkles className="w-8 h-8" />, color: '#ffd54f' },
            { name: t('quantumMaze'), icon: <Eye className="w-8 h-8" />, color: '#00acc1' }
        ]
    ];

    return themeSets[(level - 1) % themeSets.length];
};