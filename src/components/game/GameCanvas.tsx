import React, { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../state/gameStore';
import {
    GRAVITY,
    JUMP_FORCE,
    MOVE_SPEED,
    PLAYER_SIZE
} from '../../constants';
import type {
    GameRefs,
    Particle,
    Platform,
    Enemy,
    Collectible,
    Obstacle,
} from '../../types';

const GameCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const {
        gameState,
        levelData,
        setGameState,
        incrementScore,
        decrementLives,
        lives,
        runId,
    } = useGameStore();

    const gameRefs = useRef<GameRefs>({
        player: {
            x: 50,
            y: 300,
            vx: 0,
            vy: 0,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            grounded: false,
            jumpCount: 0,
            hasDoubleJump: false,
            invulnerable: false,
        },
        camera: { x: 0, y: 0 },
        particles: [],
        collectedItems: new Set(),
        defeatedEnemies: new Set(),
        keys: {},
        platformStates: new Map(),
        enemyStates: new Map(),
        time: 0,
        jumpPressed: false,
    });


    // function to create particles with different types and colorsdfsd



    const createParticle = (x: number, y: number, type: string, color: string | null = null) => {
        const particle: Particle = {
            x,
            y,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * -5 - 2,
            life: 1,
            type,
            size: Math.random() * 4 + 2,
            color: color || levelData?.theme.accentColor || '#ffffff',
        };
        gameRefs.current.particles.push(particle);
    };

    const updateGame = useCallback(() => {
        if (gameState !== 'playing' || !levelData) return;

        const canvas = canvasRef.current;
        if (!canvas || canvas.height === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const game = gameRefs.current;
        const { player, camera, particles, keys } = game;
        game.time++;

        // Clear canvas
        ctx.fillStyle = levelData.theme.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw background pattern
        ctx.save();
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = levelData.theme.accentColor;
            ctx.beginPath();
            ctx.arc(
                (i * 100 + game.time * 0.5) % (canvas.width + 100) - 50,
                Math.sin(i + game.time * 0.01) * 50 + canvas.height / 2,
                20 + Math.sin(i) * 10,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        ctx.restore();

        // Update player physics
        if (keys['ArrowLeft'] || keys['a']) {
            player.vx = -MOVE_SPEED;
        } else if (keys['ArrowRight'] || keys['d']) {
            player.vx = MOVE_SPEED;
        } else {
            player.vx *= 0.8;
        }

        // Enhanced jump mechanics
        if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && (player.grounded || (player.hasDoubleJump && player.jumpCount < 2))) {
            if (!game.jumpPressed) {
                player.vy = JUMP_FORCE;
                player.jumpCount++;
                game.jumpPressed = true;
                createParticle(player.x + player.width / 2, player.y + player.height, 'jump');
            }
        } else {
            game.jumpPressed = false;
        }

        // Apply gravity
        player.vy += GRAVITY;
        player.vy = Math.min(player.vy, 20);

        // Update position
        player.x += player.vx;
        player.y += player.vy;

        // Smooth camera follow with lookahead
        const targetCameraX = Math.max(0, player.x - canvas.width / 2 + player.vx * 10);
        camera.x += (targetCameraX - camera.x) * 0.1;

        // Platform collision
        player.grounded = false;
        levelData.platforms.forEach((platform: Platform, index: number) => {
            let platformX = platform.x;
            let platformY = platform.y;

            // Handle moving platforms
            if (platform.type === 'moving' && platform.movementRange) {
                if (!game.platformStates.has(index)) {
                    game.platformStates.set(index, { offset: 0, direction: 1 });
                }
                const state = game.platformStates.get(index);
                if (platform.movementSpeed) {
                    state.offset += platform.movementSpeed * state.direction;
                }
                if (Math.abs(state.offset) > platform.movementRange) {
                    state.direction *= -1;
                }

                if (platform.movementDirection === 'vertical') {
                    platformY += state.offset;
                } else {
                    platformX += state.offset;
                }
            }

            // Check collision
            if (player.x < platformX + platform.width &&
                player.x + player.width > platformX &&
                player.y < platformY + platform.height &&
                player.y + player.height > platformY) {

                // Landing on platform
                if (player.vy > 0 && player.y < platformY) {
                    player.y = platformY - player.height;
                    player.vy = 0;
                    player.grounded = true;
                    player.jumpCount = 0;

                    // Ice platform - slippery
                    if (platform.type === 'ice') {
                        player.vx *= 1.02;
                    }

                    // Bouncy platform
                    if (platform.type === 'bouncy') {
                        player.vy = JUMP_FORCE * 1.5;
                        createParticle(platformX + platform.width / 2, platformY, 'bounce', '#ffeb3b');
                    }

                    // Disappearing platform
                    if (platform.type === 'disappearing') {
                        const stateKey = `disappear-${index}`;
                        if (!game.platformStates.has(stateKey)) {
                            game.platformStates.set(stateKey, { triggered: true, timer: 0 });
                        }
                        const state = game.platformStates.get(stateKey);
                        state.timer++;
                        if (state.timer > 30) {
                            platform.opacity = Math.max(0, 1 - (state.timer - 30) / 30);
                            if (state.timer > 60) {
                                const idx = levelData.platforms.indexOf(platform);
                                if (idx > -1) {
                                    levelData.platforms.splice(idx, 1);
                                    game.platformStates.delete(stateKey);
                                }
                            }
                        }
                    }
                }
            }

            // Draw platform
            ctx.save();
            ctx.translate(-camera.x, 0);
            ctx.globalAlpha = platform.opacity || 1;

            let color = levelData.theme.platformColor;
            if (platform.type === 'ice') {
                color = '#e0ffff';
            } else if (platform.type === 'bouncy') {
                color = levelData.theme.accentColor;
            } else if (platform.type === 'disappearing') {
                color = `${levelData.theme.platformColor}88`;
            }

            ctx.fillStyle = color;
            ctx.fillRect(platformX, platformY, platform.width, platform.height);

            // Platform details
            if (platform.type === 'moving') {
                ctx.fillStyle = levelData.theme.accentColor;
                ctx.fillRect(platformX + platform.width / 2 - 5, platformY + 5, 10, 5);
            }

            ctx.restore();
        });

        // Update and draw enemies
        levelData.enemies.forEach((enemy: Enemy, index: number) => {
            if (game.defeatedEnemies.has(index)) return;

            const state = game.enemyStates.get(index) || { x: enemy.x, y: enemy.y, vx: 1, vy: 0, time: 0 };
            state.time++;

            // Enemy AI
            switch (enemy.type) {
                case 'walker':
                    state.x += enemy.speed * state.vx;
                    if (Math.abs(state.x - enemy.x) > enemy.patrolRange) {
                        state.vx *= -1;
                    }
                    break;
                case 'flyer':
                    state.x = enemy.x + Math.sin(state.time * 0.02) * enemy.patrolRange;
                    state.y = enemy.y + Math.cos(state.time * 0.03) * 30;
                    break;
                case 'jumper':
                    state.x += enemy.speed * state.vx;
                    if (Math.abs(state.x - enemy.x) > enemy.patrolRange) {
                        state.vx *= -1;
                    }
                    if (state.time % 60 === 0) {
                        state.vy = -10;
                    }
                    state.vy += 0.5;
                    state.y += state.vy;
                    state.y = Math.min(state.y, enemy.y);
                    break;
                case 'shooter':
                    state.x = enemy.x + Math.sin(state.time * 0.01) * 20;
                    if (state.time % 90 === 0) {
                        // Create projectile particle effect
                        createParticle(state.x, state.y, 'projectile', '#ff0000');
                    }
                    break;
            }

            game.enemyStates.set(index, state);

            // Check collision with player
            if (!player.invulnerable &&
                Math.abs(player.x + player.width / 2 - state.x) < 25 &&
                Math.abs(player.y + player.height / 2 - state.y) < 25) {

                // Player defeats enemy by jumping on it
                if (player.vy > 0 && player.y < state.y) {
                    game.defeatedEnemies.add(index);
                    incrementScore(25);
                    player.vy = JUMP_FORCE * 0.7;
                    createParticle(state.x, state.y, 'defeat', '#ff5722');
                } else {
                    // Player takes damage
                    decrementLives();
                    if (useGameStore.getState().lives <= 0) {
                        setGameState('gameOver');
                    } else {
                        player.invulnerable = true;
                        setTimeout(() => { player.invulnerable = false; }, 2000);
                        createParticle(player.x + player.width / 2, player.y + player.height / 2, 'damage', '#f44336');
                    }
                }
            }

            // Draw enemy with theme-specific appearance
            ctx.save();
            ctx.translate(-camera.x, 0);
            ctx.globalAlpha = player.invulnerable && state.time % 10 < 5 ? 0.5 : 1;

            // Different shapes based on theme
            const enemyColor = '#ff5252';
            ctx.fillStyle = enemyColor;

            if (enemy.type === 'flyer') {
                // Flying enemy shape
                ctx.beginPath();
                ctx.moveTo(state.x, state.y - 10);
                ctx.lineTo(state.x - 15, state.y + 10);
                ctx.lineTo(state.x + 15, state.y + 10);
                ctx.closePath();
                ctx.fill();
            } else if (enemy.type === 'jumper') {
                // Jumping enemy with legs
                ctx.fillRect(state.x - 10, state.y - 15, 20, 20);
                ctx.fillRect(state.x - 8, state.y + 5, 6, 8);
                ctx.fillRect(state.x + 2, state.y + 5, 6, 8);
            } else if (enemy.type === 'shooter') {
                // Shooter enemy with gun shape
                ctx.beginPath();
                ctx.arc(state.x, state.y, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(state.x + 10, state.y - 3, 12, 6);
            } else {
                // Walker enemy
                ctx.fillRect(state.x - 12, state.y - 12, 24, 24);
            }

            // Draw theme name label
            if (enemy.themeName) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(enemy.themeName, state.x, state.y - 20);
            }

            ctx.restore();
        });

        // Collect items
        levelData.collectibles.forEach((item: Collectible, index: number) => {
            if (game.collectedItems.has(index)) return;

            const dist = Math.sqrt(
                Math.pow(player.x + player.width / 2 - item.x, 2) +
                Math.pow(player.y + player.height / 2 - item.y, 2)
            );

            if (dist < 30) {
                game.collectedItems.add(index);
                incrementScore(item.value || 10);

                if (item.type === 'powerup') {
                    player.hasDoubleJump = true;
                    createParticle(item.x, item.y, 'powerup', '#4caf50');
                } else {
                    createParticle(item.x, item.y, 'collect', '#ffd700');
                }
            }

            // Draw collectible
            if (!game.collectedItems.has(index)) {
                ctx.save();
                ctx.translate(-camera.x, 0);

                const bounce = Math.sin(game.time * 0.05 + index) * 5;

                if (item.type === 'gem') {
                    // Draw gem shape
                    ctx.fillStyle = '#ffd700';
                    ctx.beginPath();
                    ctx.moveTo(item.x, item.y - 10 + bounce);
                    ctx.lineTo(item.x - 8, item.y + bounce);
                    ctx.lineTo(item.x, item.y + 10 + bounce);
                    ctx.lineTo(item.x + 8, item.y + bounce);
                    ctx.closePath();
                    ctx.fill();

                    // Inner shine
                    ctx.fillStyle = '#ffff99';
                    ctx.beginPath();
                    ctx.moveTo(item.x, item.y - 5 + bounce);
                    ctx.lineTo(item.x - 4, item.y + bounce);
                    ctx.lineTo(item.x, item.y + 5 + bounce);
                    ctx.lineTo(item.x + 4, item.y + bounce);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Powerup orb
                    ctx.fillStyle = '#4caf50';
                    ctx.beginPath();
                    ctx.arc(item.x, item.y + bounce, 12, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '16px bold sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('P', item.x, item.y + 5 + bounce);
                }

                // Draw theme name label
                if (item.themeName) {
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 2;
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.strokeText(item.themeName, item.x, item.y + 25 + bounce);
                    ctx.fillText(item.themeName, item.x, item.y + 25 + bounce);
                }

                ctx.restore();
            }
        });

        // Draw obstacles
        levelData.obstacles.forEach((obstacle: Obstacle) => {
            ctx.save();
            ctx.translate(-camera.x, 0);

            // Draw obstacle based on type
            if (obstacle.type === 'spike') {
                ctx.fillStyle = '#9e9e9e';
                ctx.beginPath();
                for (let i = 0; i < obstacle.width / 10; i++) {
                    ctx.moveTo(obstacle.x + i * 10, obstacle.y + obstacle.height);
                    ctx.lineTo(obstacle.x + i * 10 + 5, obstacle.y);
                    ctx.lineTo(obstacle.x + i * 10 + 10, obstacle.y + obstacle.height);
                }
                ctx.fill();
            } else if (obstacle.type === 'laser') {
                // Animated laser beam
                ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(game.time * 0.1) * 0.3})`;
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                ctx.strokeStyle = '#ff0000';
                ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else if (obstacle.type === 'saw') {
                // Rotating saw
                ctx.save();
                ctx.translate(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
                ctx.rotate(game.time * 0.1);
                ctx.fillStyle = '#808080';
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    ctx.lineTo(Math.cos(angle) * obstacle.width / 2, Math.sin(angle) * obstacle.height / 2);
                    ctx.lineTo(Math.cos(angle + 0.2) * obstacle.width / 3, Math.sin(angle + 0.2) * obstacle.height / 3);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            } else if (obstacle.type === 'fireball') {
                // Animated fireball
                ctx.fillStyle = '#ff6347';
                ctx.beginPath();
                ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2,
                    Math.min(obstacle.width, obstacle.height) / 2, 0, Math.PI * 2);
                ctx.fill();
                // Flame effect
                ctx.fillStyle = '#ffa500';
                ctx.beginPath();
                ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2,
                    Math.min(obstacle.width, obstacle.height) / 3, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = '#ff5722';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }

            // Draw theme name label
            if (obstacle.themeName) {
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.strokeText(obstacle.themeName, obstacle.x + obstacle.width / 2, obstacle.y - 5);
                ctx.fillText(obstacle.themeName, obstacle.x + obstacle.width / 2, obstacle.y - 5);
            }

            // Check collision
            if (!player.invulnerable &&
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y) {
                decrementLives();
                if (useGameStore.getState().lives <= 0) {
                    setGameState('gameOver');
                } else {
                    player.invulnerable = true;
                    setTimeout(() => { player.invulnerable = false; }, 2000);
                    player.x = 50;
                    player.y = 300;
                    createParticle(player.x + player.width / 2, player.y + player.height / 2, 'damage', '#f44336');
                }
            }

            ctx.restore();
        });

        // Check win condition
        if (player.x > 1100) {
            setGameState('levelComplete');
        }

        // Draw player
        ctx.save();
        ctx.translate(-camera.x, 0);
        ctx.globalAlpha = player.invulnerable && game.time % 10 < 5 ? 0.5 : 1;

        // Player body
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Player details
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(player.x + 5, player.y + 5, 5, 5);
        ctx.fillRect(player.x + 20, player.y + 5, 5, 5);
        ctx.fillRect(player.x + 10, player.y + 15, 10, 5);

        // Double jump indicator
        if (player.hasDoubleJump) {
            ctx.fillStyle = '#4caf50';
            ctx.beginPath();
            ctx.arc(player.x + player.width / 2, player.y - 10, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // Update and draw particles
        particles.forEach((particle: Particle, index: number) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.3;
            particle.life -= 0.02;

            if (particle.life <= 0) {
                particles.splice(index, 1);
                return;
            }

            ctx.save();
            ctx.translate(-camera.x, 0);
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;

            // Different particle effects based on type
            if (particle.type === 'sparkle' || particle.type === 'stars') {
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate(game.time * 0.1);
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                ctx.restore();
            } else if (particle.type === 'snow') {
                // Snowflake pattern
                ctx.strokeStyle = particle.color;
                ctx.lineWidth = 1;
                for (let i = 0; i < 6; i++) {
                    ctx.save();
                    ctx.translate(particle.x, particle.y);
                    ctx.rotate((i / 6) * Math.PI * 2);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, particle.size);
                    ctx.stroke();
                    ctx.restore();
                }
            } else if (particle.type === 'sand' || particle.type === 'dust') {
                // Sand/dust particles
                ctx.fillRect(particle.x, particle.y, particle.size / 2, particle.size / 2);
            } else if (particle.type === 'leaves') {
                // Leaf shape
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.life * Math.PI);
                ctx.beginPath();
                ctx.ellipse(0, 0, particle.size, particle.size / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else if (particle.type === 'embers') {
                // Glowing ember
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ff6347';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Default circular particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        // Environmental particles
        if (Math.random() < 0.1) {
            const particleType = levelData.theme.particleEffect;
            createParticle(
                camera.x + Math.random() * canvas.width,
                particleType === 'snow' || particleType === 'leaves' ? 0 : Math.random() * canvas.height,
                particleType
            );
        }

        // Keep player in bounds
        if (player.y > canvas.height) {
            decrementLives();
            if (useGameStore.getState().lives <= 0) {
                setGameState('gameOver');
            } else {
                player.x = 50;
                player.y = 300;
                player.vx = 0;
                player.vy = 0;
                player.hasDoubleJump = false;
            }
        }

        // Draw UI
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 200, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px sans-serif';
        ctx.fillText(`Score: ${useGameStore.getState().score}`, 20, 30);

        // Progress bar
        const progress = Math.min(player.x / 1100, 1);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(canvas.width - 210, 10, 200, 20);
        ctx.fillStyle = levelData.theme.accentColor;
        ctx.fillRect(canvas.width - 210, 10, 200 * progress, 20);

    }, [gameState, levelData, lives, setGameState, incrementScore, decrementLives]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            gameRefs.current.keys[e.key] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            gameRefs.current.keys[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const gameLoop = () => {
            updateGame();
            animationRef.current = requestAnimationFrame(gameLoop);
        };

        if (gameState === 'playing') {
            animationRef.current = requestAnimationFrame(gameLoop);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [updateGame, gameState, runId]);

    useEffect(() => {
        // Reset game state when a new run starts
        gameRefs.current = {
            player: {
                x: 50,
                y: 300,
                vx: 0,
                vy: 0,
                width: PLAYER_SIZE,
                height: PLAYER_SIZE,
                grounded: false,
                jumpCount: 0,
                hasDoubleJump: false,
                invulnerable: false,
            },
            camera: { x: 0, y: 0 },
            particles: [],
            collectedItems: new Set(),
            defeatedEnemies: new Set(),
            keys: {},
            platformStates: new Map(),
            enemyStates: new Map(),
            time: 0,
            jumpPressed: false,
        };
    }, [runId]);

    return <canvas ref={canvasRef} className="game-canvas" />;
};

export default GameCanvas;