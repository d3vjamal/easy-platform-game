export interface Player {
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    grounded: boolean;
    jumpCount: number;
    hasDoubleJump: boolean;
    invulnerable: boolean;
}

export interface Camera {
    x: number;
    y: number;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    type: string;
    size: number;
    color: string;
}

export interface Platform {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    movementRange?: number;
    movementSpeed?: number;
    movementDirection?: 'horizontal' | 'vertical';
    opacity?: number;
}

export interface Enemy {
    x: number;
    y: number;
    type: string;
    themeName: string;
    patrolRange: number;
    speed: number;
}

export interface Collectible {
    x: number;
    y: number;
    type: string;
    themeName: string;
    value: number;
}

export interface Obstacle {
    x: number;
    y: number;
    type: string;
    themeName: string;
    width: number;
    height: number;
    movePattern?: 'static' | 'rotating' | 'oscillating';
}

export interface Keys {
    [key: string]: boolean;
}

export interface GameRefs {
    player: Player;
    camera: Camera;
    particles: Particle[];
    collectedItems: Set<number>;
    defeatedEnemies: Set<number>;
    keys: Keys;
    platformStates: Map<any, any>;
    enemyStates: Map<any, any>;
    time: number;
    jumpPressed?: boolean;
}
export interface Theme {
    name: string;
    icon: React.ReactNode;
    color: string;
}
export interface PlatformConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    movementRange?: number;
    movementSpeed?: number;
    movementDirection?: 'horizontal' | 'vertical';
}