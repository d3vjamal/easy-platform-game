import type { PlatformConfig } from '../types';

export const createFallbackLevel = (theme: string, difficulty: number) => {
    const platforms: PlatformConfig[] = [
        { x: 50, y: 400, width: 100, height: 20, type: 'normal' }
    ];

    // Generate more complex platform layouts
    const platformCount = 15 + difficulty * 3;
    let lastX = 150;
    for (let i = 1; i < platformCount; i++) {
        const gap = 80 + Math.random() * 60;
        const x = lastX + gap;
        const yVariation = Math.sin(i * 0.3) * 120 + Math.cos(i * 0.7) * 80;
        const y = 350 + yVariation;

        const typeChance = Math.random();
        let type = 'normal';

        if (typeChance > 0.8) type = 'moving';
        else if (typeChance > 0.65) type = 'bouncy';
        else if (typeChance > 0.5) type = 'disappearing';
        else if (typeChance > 0.35) type = 'ice';

        platforms.push({
            x: x,
            y: Math.max(100, Math.min(500, y)),
            width: 60 + Math.random() * 40,
            height: 15 + Math.random() * 10,
            type,
            movementRange: type === 'moving' ? 80 + Math.random() * 40 : undefined,
            movementSpeed: type === 'moving' ? 1 + difficulty * 0.3 : undefined,
            movementDirection: type === 'moving' ? Math.random() > 0.5 ? 'horizontal' : 'vertical' : undefined
        });

        lastX = x;
    }

    // Generate enemies with varied types
    const enemies = [];
    const enemyCount = 3 + difficulty;
    for (let i = 0; i < enemyCount; i++) {
        const types = ['walker', 'flyer', 'jumper', 'shooter'];
        const type = types[Math.floor(Math.random() * types.length)];
        enemies.push({
            x: 200 + i * 150 + Math.random() * 100,
            y: type === 'flyer' ? 150 + Math.random() * 200 : 350,
            type,
            patrolRange: 100 + Math.random() * 50,
            speed: 1 + difficulty * 0.2
        });
    }

    // More collectibles with variety
    const collectibles = [];
    const collectibleCount = 10 + difficulty * 2;
    for (let i = 0; i < collectibleCount; i++) {
        collectibles.push({
            x: 100 + i * 80 + Math.random() * 40,
            y: 150 + Math.random() * 300,
            type: Math.random() > 0.7 ? 'powerup' : 'gem',
            value: Math.random() > 0.9 ? 50 : 10
        });
    }

    // Varied obstacles
    const obstacles = [];
    const obstacleCount = 2 + Math.floor(difficulty / 2);
    for (let i = 0; i < obstacleCount; i++) {
        const types = ['spike', 'laser', 'saw', 'fireball'];
        obstacles.push({
            x: 250 + i * 200 + Math.random() * 100,
            y: 380 + Math.random() * 100,
            type: types[Math.floor(Math.random() * types.length)],
            width: 30 + Math.random() * 20,
            height: 20 + Math.random() * 10
        });
    }

    return {
        platforms,
        enemies,
        collectibles,
        obstacles,
        theme: {
            backgroundColor: '#1a1a2e',
            platformColor: '#16213e',
            accentColor: '#e94560',
            particleEffect: 'sparkle'
        },
        levelName: `${theme} - Level`,
        levelDescription: `Navigate the challenging ${theme.toLowerCase()}`
    };
};

export const generateLevel = async (theme: string, level: number) => {
    // This is a placeholder for the actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(createFallbackLevel(theme, level));
        }, 1000);
    });
};