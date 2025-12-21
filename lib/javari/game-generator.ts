// =============================================================================
// JAVARI AI GAME GENERATOR ENGINE
// =============================================================================
// The brain that turns plain English into complete, playable games
// =============================================================================

import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export interface GameDesign {
  id: string;
  title: string;
  description: string;
  type: GameType;
  subtype?: string;
  mechanics: GameMechanic[];
  artStyle: ArtStyle;
  difficulty: Difficulty;
  audience: Audience;
  features: GameFeature[];
  levels?: number;
  hasMultiplayer?: boolean;
  hasSaveSystem?: boolean;
  estimatedPlayTime?: string;
}

export type GameType = 
  | 'platformer'
  | 'puzzle'
  | 'shooter'
  | 'racing'
  | 'rpg'
  | 'strategy'
  | 'sports'
  | 'simulation'
  | 'adventure'
  | 'fighting'
  | 'rhythm'
  | 'card'
  | 'board'
  | 'idle'
  | 'educational';

export type GameMechanic =
  | 'jumping'
  | 'shooting'
  | 'collecting'
  | 'matching'
  | 'building'
  | 'crafting'
  | 'upgrading'
  | 'combat'
  | 'puzzle-solving'
  | 'racing'
  | 'turn-based'
  | 'real-time'
  | 'stealth'
  | 'exploration';

export type ArtStyle =
  | 'pixel'
  | 'cartoon'
  | 'realistic'
  | 'minimalist'
  | 'hand-drawn'
  | 'retro'
  | 'neon'
  | 'cute'
  | 'dark'
  | 'fantasy';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export type Audience = 'kids' | 'teens' | 'adults' | 'all-ages';

export type GameFeature =
  | 'leaderboards'
  | 'achievements'
  | 'multiplayer'
  | 'save-system'
  | 'story-mode'
  | 'endless-mode'
  | 'boss-battles'
  | 'power-ups'
  | 'character-selection'
  | 'level-editor'
  | 'daily-challenges'
  | 'tournaments';

export interface GeneratedGame {
  id: string;
  design: GameDesign;
  code: string;
  assets: GeneratedAssets;
  config: GameConfig;
  createdAt: Date;
}

export interface GeneratedAssets {
  sprites: Asset[];
  backgrounds: Asset[];
  sounds: Asset[];
  music: Asset[];
  ui: Asset[];
}

export interface Asset {
  id: string;
  type: 'sprite' | 'background' | 'sound' | 'music' | 'ui';
  name: string;
  url: string;
  metadata?: Record<string, any>;
}

export interface GameConfig {
  physics: {
    gravity: number;
    friction: number;
  };
  player: {
    speed: number;
    jumpForce: number;
    health: number;
  };
  difficulty: {
    enemySpeed: number;
    enemyDamage: number;
    scoreMultiplier: number;
  };
  controls: {
    keyboard: boolean;
    touch: boolean;
    gamepad: boolean;
  };
}

// =============================================================================
// GAME TEMPLATES
// =============================================================================

const GAME_TEMPLATES: Record<GameType, string> = {
  platformer: `
// Platformer Game Template
class PlatformerGame extends Phaser.Scene {
  constructor() {
    super({ key: 'PlatformerGame' });
  }

  preload() {
    // Load assets
    this.load.image('player', '/assets/player.png');
    this.load.image('platform', '/assets/platform.png');
    this.load.image('coin', '/assets/coin.png');
    this.load.image('enemy', '/assets/enemy.png');
    this.load.image('background', '/assets/background.png');
  }

  create() {
    // Background
    this.add.image(400, 300, 'background');

    // Platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'platform');
    this.platforms.create(50, 250, 'platform');
    this.platforms.create(750, 220, 'platform');

    // Player
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Coins
    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    // Physics
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.coins, this.platforms);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Score
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
  }
}
  `,

  puzzle: `
// Puzzle Game Template (Match-3)
class PuzzleGame extends Phaser.Scene {
  constructor() {
    super({ key: 'PuzzleGame' });
    this.gridSize = 8;
    this.tileSize = 64;
    this.colors = ['red', 'blue', 'green', 'yellow', 'purple'];
  }

  create() {
    this.grid = [];
    this.selectedTile = null;
    this.score = 0;

    // Create grid
    for (let row = 0; row < this.gridSize; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.gridSize; col++) {
        const color = Phaser.Math.RND.pick(this.colors);
        const tile = this.createTile(col, row, color);
        this.grid[row][col] = tile;
      }
    }

    // Score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Check for initial matches
    this.checkMatches();
  }

  createTile(col, row, color) {
    const x = col * this.tileSize + this.tileSize / 2 + 100;
    const y = row * this.tileSize + this.tileSize / 2 + 100;
    
    const tile = this.add.rectangle(x, y, this.tileSize - 4, this.tileSize - 4, this.getColorHex(color));
    tile.setInteractive();
    tile.color = color;
    tile.gridX = col;
    tile.gridY = row;

    tile.on('pointerdown', () => this.selectTile(tile));

    return tile;
  }

  getColorHex(color) {
    const colors = {
      red: 0xff0000,
      blue: 0x0000ff,
      green: 0x00ff00,
      yellow: 0xffff00,
      purple: 0x800080
    };
    return colors[color];
  }

  selectTile(tile) {
    if (this.selectedTile === null) {
      this.selectedTile = tile;
      tile.setStrokeStyle(4, 0xffffff);
    } else {
      if (this.isAdjacent(this.selectedTile, tile)) {
        this.swapTiles(this.selectedTile, tile);
      }
      this.selectedTile.setStrokeStyle(0);
      this.selectedTile = null;
    }
  }

  isAdjacent(tile1, tile2) {
    const dx = Math.abs(tile1.gridX - tile2.gridX);
    const dy = Math.abs(tile1.gridY - tile2.gridY);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }

  swapTiles(tile1, tile2) {
    // Swap in grid
    const tempColor = tile1.color;
    tile1.color = tile2.color;
    tile2.color = tempColor;

    // Update visuals
    tile1.fillColor = this.getColorHex(tile1.color);
    tile2.fillColor = this.getColorHex(tile2.color);

    // Check for matches
    this.time.delayedCall(100, () => this.checkMatches());
  }

  checkMatches() {
    // Check horizontal matches
    // Check vertical matches
    // Remove matches and drop tiles
    // Add score
  }
}
  `,

  shooter: `
// Shooter Game Template
class ShooterGame extends Phaser.Scene {
  constructor() {
    super({ key: 'ShooterGame' });
  }

  create() {
    // Player
    this.player = this.physics.add.sprite(400, 550, 'player');
    this.player.setCollideWorldBounds(true);

    // Bullets group
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true
    });

    // Enemies group
    this.enemies = this.physics.add.group();

    // Spawn enemies periodically
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Score
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Collisions
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.gameOver, null, this);
  }

  update() {
    // Movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }

    // Shooting
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.shoot();
    }
  }

  shoot() {
    const bullet = this.bullets.get(this.player.x, this.player.y - 20);
    if (bullet) {
      bullet.fire();
    }
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(50, 750);
    const enemy = this.enemies.create(x, 0, 'enemy');
    enemy.setVelocityY(100);
  }

  hitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
  }

  gameOver() {
    this.scene.restart();
  }
}
  `,

  racing: `// Racing game template...`,
  rpg: `// RPG game template...`,
  strategy: `// Strategy game template...`,
  sports: `// Sports game template...`,
  simulation: `// Simulation game template...`,
  adventure: `// Adventure game template...`,
  fighting: `// Fighting game template...`,
  rhythm: `// Rhythm game template...`,
  card: `// Card game template...`,
  board: `// Board game template...`,
  idle: `// Idle game template...`,
  educational: `// Educational game template...`,
};

// =============================================================================
// JAVARI GAME GENERATOR CLASS
// =============================================================================

export class JavariGameGenerator {
  // Analyze user input and extract game design
  async analyzeInput(input: string): Promise<Partial<GameDesign>> {
    const lowerInput = input.toLowerCase();
    
    // Detect game type
    const type = this.detectGameType(lowerInput);
    
    // Detect mechanics
    const mechanics = this.detectMechanics(lowerInput);
    
    // Detect art style
    const artStyle = this.detectArtStyle(lowerInput);
    
    // Detect difficulty
    const difficulty = this.detectDifficulty(lowerInput);
    
    // Detect audience
    const audience = this.detectAudience(lowerInput);
    
    // Detect features
    const features = this.detectFeatures(lowerInput);

    return {
      type,
      mechanics,
      artStyle,
      difficulty,
      audience,
      features,
    };
  }

  // Generate complete game from design
  async generateGame(design: GameDesign): Promise<GeneratedGame> {
    const id = uuidv4();

    // Generate code based on template
    const code = this.generateCode(design);

    // Generate assets
    const assets = await this.generateAssets(design);

    // Generate config
    const config = this.generateConfig(design);

    return {
      id,
      design,
      code,
      assets,
      config,
      createdAt: new Date(),
    };
  }

  // Generate clarifying questions
  generateQuestions(partialDesign: Partial<GameDesign>): string[] {
    const questions: string[] = [];

    if (!partialDesign.artStyle) {
      questions.push('What art style do you prefer? (pixel art, cartoon, realistic, minimalist)');
    }

    if (!partialDesign.difficulty) {
      questions.push('How challenging should the game be? (easy, medium, hard)');
    }

    if (!partialDesign.features || partialDesign.features.length === 0) {
      questions.push('Any special features? (leaderboards, achievements, multiplayer, story mode)');
    }

    return questions;
  }

  // Private methods

  private detectGameType(input: string): GameType {
    const typeKeywords: Record<GameType, string[]> = {
      platformer: ['platformer', 'jumping', 'mario', 'side-scrolling', 'platform'],
      puzzle: ['puzzle', 'match', 'tetris', 'sudoku', 'brain', 'logic'],
      shooter: ['shooter', 'shoot', 'gun', 'space invaders', 'bullet'],
      racing: ['racing', 'race', 'car', 'driving', 'speed'],
      rpg: ['rpg', 'role-playing', 'quest', 'adventure', 'level up', 'inventory'],
      strategy: ['strategy', 'tower defense', 'civilization', 'building', 'resource'],
      sports: ['sports', 'soccer', 'football', 'basketball', 'tennis', 'golf'],
      simulation: ['simulation', 'sim', 'management', 'city builder', 'farming'],
      adventure: ['adventure', 'exploration', 'story', 'narrative'],
      fighting: ['fighting', 'combat', 'versus', 'battle', 'street fighter'],
      rhythm: ['rhythm', 'music', 'dancing', 'beat'],
      card: ['card', 'poker', 'solitaire', 'deck'],
      board: ['board', 'chess', 'checkers', 'dice'],
      idle: ['idle', 'clicker', 'incremental', 'cookie'],
      educational: ['educational', 'learning', 'math', 'quiz', 'teaching'],
    };

    for (const [type, keywords] of Object.entries(typeKeywords)) {
      if (keywords.some(kw => input.includes(kw))) {
        return type as GameType;
      }
    }

    return 'platformer'; // Default
  }

  private detectMechanics(input: string): GameMechanic[] {
    const mechanics: GameMechanic[] = [];
    const mechanicKeywords: Record<GameMechanic, string[]> = {
      jumping: ['jump', 'hop', 'leap'],
      shooting: ['shoot', 'fire', 'gun', 'bullet'],
      collecting: ['collect', 'gather', 'pick up', 'coins'],
      matching: ['match', 'combine', 'connect'],
      building: ['build', 'construct', 'create'],
      crafting: ['craft', 'make', 'combine items'],
      upgrading: ['upgrade', 'level up', 'improve'],
      combat: ['fight', 'attack', 'battle', 'combat'],
      'puzzle-solving': ['puzzle', 'solve', 'logic'],
      racing: ['race', 'speed', 'fast'],
      'turn-based': ['turn', 'turn-based'],
      'real-time': ['real-time', 'action'],
      stealth: ['stealth', 'sneak', 'hide'],
      exploration: ['explore', 'discover', 'open world'],
    };

    for (const [mechanic, keywords] of Object.entries(mechanicKeywords)) {
      if (keywords.some(kw => input.includes(kw))) {
        mechanics.push(mechanic as GameMechanic);
      }
    }

    return mechanics.length > 0 ? mechanics : ['collecting', 'jumping'];
  }

  private detectArtStyle(input: string): ArtStyle {
    const styleKeywords: Record<ArtStyle, string[]> = {
      pixel: ['pixel', '8-bit', '16-bit', 'retro pixel'],
      cartoon: ['cartoon', 'animated', 'colorful'],
      realistic: ['realistic', 'real', '3d', 'photorealistic'],
      minimalist: ['minimalist', 'simple', 'clean'],
      'hand-drawn': ['hand-drawn', 'sketchy', 'artistic'],
      retro: ['retro', 'old-school', 'classic'],
      neon: ['neon', 'cyberpunk', 'futuristic'],
      cute: ['cute', 'kawaii', 'adorable', 'kids'],
      dark: ['dark', 'horror', 'scary', 'gothic'],
      fantasy: ['fantasy', 'magical', 'medieval'],
    };

    for (const [style, keywords] of Object.entries(styleKeywords)) {
      if (keywords.some(kw => input.includes(kw))) {
        return style as ArtStyle;
      }
    }

    return 'cartoon'; // Default
  }

  private detectDifficulty(input: string): Difficulty {
    if (input.includes('easy') || input.includes('casual') || input.includes('simple')) {
      return 'easy';
    }
    if (input.includes('hard') || input.includes('challenging') || input.includes('difficult')) {
      return 'hard';
    }
    if (input.includes('extreme') || input.includes('impossible') || input.includes('brutal')) {
      return 'extreme';
    }
    return 'medium';
  }

  private detectAudience(input: string): Audience {
    if (input.includes('kids') || input.includes('children') || input.includes('young')) {
      return 'kids';
    }
    if (input.includes('teens') || input.includes('teenager')) {
      return 'teens';
    }
    if (input.includes('adults') || input.includes('mature')) {
      return 'adults';
    }
    return 'all-ages';
  }

  private detectFeatures(input: string): GameFeature[] {
    const features: GameFeature[] = [];
    const featureKeywords: Record<GameFeature, string[]> = {
      leaderboards: ['leaderboard', 'high score', 'ranking'],
      achievements: ['achievement', 'trophy', 'badge'],
      multiplayer: ['multiplayer', 'co-op', 'online', 'pvp'],
      'save-system': ['save', 'progress', 'continue'],
      'story-mode': ['story', 'campaign', 'narrative'],
      'endless-mode': ['endless', 'infinite', 'survival'],
      'boss-battles': ['boss', 'final battle'],
      'power-ups': ['power-up', 'ability', 'buff'],
      'character-selection': ['character', 'choose', 'select'],
      'level-editor': ['level editor', 'create levels'],
      'daily-challenges': ['daily', 'challenge'],
      tournaments: ['tournament', 'competition'],
    };

    for (const [feature, keywords] of Object.entries(featureKeywords)) {
      if (keywords.some(kw => input.includes(kw))) {
        features.push(feature as GameFeature);
      }
    }

    return features;
  }

  private generateCode(design: GameDesign): string {
    const template = GAME_TEMPLATES[design.type] || GAME_TEMPLATES.platformer;
    
    // Customize template based on design
    let code = template;
    
    // Add features
    if (design.features.includes('leaderboards')) {
      code += '\n// Leaderboard integration\n';
    }
    
    if (design.features.includes('achievements')) {
      code += '\n// Achievement system\n';
    }

    return code;
  }

  private async generateAssets(design: GameDesign): Promise<GeneratedAssets> {
    // In production, this would call AI image/audio generation APIs
    return {
      sprites: [
        { id: '1', type: 'sprite', name: 'player', url: '/assets/player.png' },
        { id: '2', type: 'sprite', name: 'enemy', url: '/assets/enemy.png' },
      ],
      backgrounds: [
        { id: '3', type: 'background', name: 'level1', url: '/assets/bg1.png' },
      ],
      sounds: [
        { id: '4', type: 'sound', name: 'jump', url: '/assets/jump.mp3' },
        { id: '5', type: 'sound', name: 'collect', url: '/assets/collect.mp3' },
      ],
      music: [
        { id: '6', type: 'music', name: 'theme', url: '/assets/theme.mp3' },
      ],
      ui: [
        { id: '7', type: 'ui', name: 'button', url: '/assets/button.png' },
      ],
    };
  }

  private generateConfig(design: GameDesign): GameConfig {
    const difficultyMultiplier = {
      easy: 0.7,
      medium: 1.0,
      hard: 1.3,
      extreme: 1.6,
    };

    const mult = difficultyMultiplier[design.difficulty];

    return {
      physics: {
        gravity: 800,
        friction: 0.8,
      },
      player: {
        speed: 200,
        jumpForce: 400,
        health: design.difficulty === 'easy' ? 5 : design.difficulty === 'hard' ? 2 : 3,
      },
      difficulty: {
        enemySpeed: 100 * mult,
        enemyDamage: 1 * mult,
        scoreMultiplier: mult,
      },
      controls: {
        keyboard: true,
        touch: true,
        gamepad: false,
      },
    };
  }
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const javariGenerator = new JavariGameGenerator();
export default javariGenerator;
