'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 40;
const BULLET_SIZE = 8;
const ENEMY_SIZE = 36;
const POWERUP_SIZE = 24;

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  vx?: number;
  vy?: number;
}

interface Bullet extends Entity {
  id: number;
}

interface Enemy extends Entity {
  id: number;
  type: 'basic' | 'fast' | 'tank';
  health: number;
  points: number;
}

interface PowerUp extends Entity {
  id: number;
  type: 'rapid' | 'shield' | 'bomb';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function ShooterTemplate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Game state refs (for animation loop)
  const gameStateRef = useRef({
    player: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 80, width: PLAYER_SIZE, height: PLAYER_SIZE },
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    powerUps: [] as PowerUp[],
    particles: [] as Particle[],
    keys: { left: false, right: false, up: false, down: false, space: false },
    lastShot: 0,
    shootDelay: 150,
    rapidFire: false,
    rapidFireEnd: 0,
    shield: false,
    shieldEnd: 0,
    score: 0,
    lives: 3,
    level: 1,
    enemySpawnTimer: 0,
    nextId: 0,
    isGameOver: false,
    isPaused: false,
  });

  // Start game
  const startGame = useCallback(() => {
    const state = gameStateRef.current;
    state.player = { x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2, y: CANVAS_HEIGHT - 80, width: PLAYER_SIZE, height: PLAYER_SIZE };
    state.bullets = [];
    state.enemies = [];
    state.powerUps = [];
    state.particles = [];
    state.score = 0;
    state.lives = 3;
    state.level = 1;
    state.enemySpawnTimer = 0;
    state.isGameOver = false;
    state.isPaused = false;
    state.rapidFire = false;
    state.shield = false;
    
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  }, []);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const state = gameStateRef.current;

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') state.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') state.keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w') state.keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's') state.keys.down = true;
      if (e.key === ' ') { state.keys.space = true; e.preventDefault(); }
      if (e.key === 'p' || e.key === 'Escape') {
        state.isPaused = !state.isPaused;
        setIsPaused(state.isPaused);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') state.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') state.keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w') state.keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's') state.keys.down = false;
      if (e.key === ' ') state.keys.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Spawn enemy
    const spawnEnemy = () => {
      const types: Array<'basic' | 'fast' | 'tank'> = ['basic', 'basic', 'basic', 'fast', 'tank'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const enemy: Enemy = {
        id: state.nextId++,
        x: Math.random() * (CANVAS_WIDTH - ENEMY_SIZE),
        y: -ENEMY_SIZE,
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
        vx: (Math.random() - 0.5) * 2,
        vy: type === 'fast' ? 4 : type === 'tank' ? 1.5 : 2,
        type,
        health: type === 'tank' ? 3 : 1,
        points: type === 'tank' ? 30 : type === 'fast' ? 15 : 10,
      };
      
      state.enemies.push(enemy);
    };

    // Spawn power-up
    const spawnPowerUp = () => {
      if (Math.random() > 0.02) return; // 2% chance per frame
      
      const types: Array<'rapid' | 'shield' | 'bomb'> = ['rapid', 'shield', 'bomb'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      state.powerUps.push({
        id: state.nextId++,
        x: Math.random() * (CANVAS_WIDTH - POWERUP_SIZE),
        y: -POWERUP_SIZE,
        width: POWERUP_SIZE,
        height: POWERUP_SIZE,
        vy: 2,
        type,
      });
    };

    // Create explosion
    const createExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 10; i++) {
        state.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 30,
          color,
        });
      }
    };

    // Collision detection
    const checkCollision = (a: Entity, b: Entity) => {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    };

    // Game loop
    const gameLoop = () => {
      if (state.isGameOver) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      if (state.isPaused) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      const now = Date.now();

      // Clear canvas
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw stars background
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 50; i++) {
        const x = (i * 37 + now / 50) % CANVAS_WIDTH;
        const y = (i * 53 + now / 30) % CANVAS_HEIGHT;
        ctx.fillRect(x, y, 1, 1);
      }

      // Player movement
      const speed = 6;
      if (state.keys.left) state.player.x -= speed;
      if (state.keys.right) state.player.x += speed;
      if (state.keys.up) state.player.y -= speed;
      if (state.keys.down) state.player.y += speed;

      // Keep player in bounds
      state.player.x = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_SIZE, state.player.x));
      state.player.y = Math.max(CANVAS_HEIGHT / 2, Math.min(CANVAS_HEIGHT - PLAYER_SIZE, state.player.y));

      // Shooting
      const shootDelay = state.rapidFire ? 80 : 150;
      if (state.keys.space && now - state.lastShot > shootDelay) {
        state.bullets.push({
          id: state.nextId++,
          x: state.player.x + PLAYER_SIZE / 2 - BULLET_SIZE / 2,
          y: state.player.y,
          width: BULLET_SIZE,
          height: BULLET_SIZE * 2,
          vy: -12,
        });
        state.lastShot = now;
      }

      // Check power-up timers
      if (state.rapidFire && now > state.rapidFireEnd) {
        state.rapidFire = false;
      }
      if (state.shield && now > state.shieldEnd) {
        state.shield = false;
      }

      // Spawn enemies
      state.enemySpawnTimer++;
      const spawnRate = Math.max(30, 90 - state.level * 10);
      if (state.enemySpawnTimer >= spawnRate) {
        spawnEnemy();
        state.enemySpawnTimer = 0;
      }

      // Spawn power-ups
      spawnPowerUp();

      // Update bullets
      state.bullets = state.bullets.filter(bullet => {
        bullet.y += bullet.vy!;
        return bullet.y > -BULLET_SIZE;
      });

      // Update enemies
      state.enemies = state.enemies.filter(enemy => {
        enemy.x += enemy.vx!;
        enemy.y += enemy.vy!;

        // Bounce off walls
        if (enemy.x <= 0 || enemy.x >= CANVAS_WIDTH - ENEMY_SIZE) {
          enemy.vx! *= -1;
        }

        // Check collision with player
        if (checkCollision(enemy, state.player) && !state.shield) {
          createExplosion(state.player.x + PLAYER_SIZE / 2, state.player.y + PLAYER_SIZE / 2, '#ff4444');
          state.lives--;
          setLives(state.lives);
          
          // Brief invincibility
          state.shield = true;
          state.shieldEnd = now + 2000;

          if (state.lives <= 0) {
            state.isGameOver = true;
            setGameOver(true);
            if (state.score > highScore) {
              setHighScore(state.score);
            }
          }
          return false;
        }

        return enemy.y < CANVAS_HEIGHT;
      });

      // Update power-ups
      state.powerUps = state.powerUps.filter(powerUp => {
        powerUp.y += powerUp.vy!;

        if (checkCollision(powerUp, state.player)) {
          if (powerUp.type === 'rapid') {
            state.rapidFire = true;
            state.rapidFireEnd = now + 5000;
          } else if (powerUp.type === 'shield') {
            state.shield = true;
            state.shieldEnd = now + 5000;
          } else if (powerUp.type === 'bomb') {
            // Destroy all enemies
            state.enemies.forEach(enemy => {
              createExplosion(enemy.x + ENEMY_SIZE / 2, enemy.y + ENEMY_SIZE / 2, '#ff8800');
              state.score += enemy.points;
            });
            state.enemies = [];
            setScore(state.score);
          }
          return false;
        }

        return powerUp.y < CANVAS_HEIGHT;
      });

      // Bullet-enemy collisions
      state.bullets = state.bullets.filter(bullet => {
        let hit = false;
        state.enemies = state.enemies.filter(enemy => {
          if (checkCollision(bullet, enemy)) {
            enemy.health--;
            hit = true;
            if (enemy.health <= 0) {
              createExplosion(enemy.x + ENEMY_SIZE / 2, enemy.y + ENEMY_SIZE / 2, 
                enemy.type === 'tank' ? '#ff8800' : '#ffff00');
              state.score += enemy.points;
              setScore(state.score);

              // Level up every 500 points
              const newLevel = Math.floor(state.score / 500) + 1;
              if (newLevel > state.level) {
                state.level = newLevel;
                setLevel(newLevel);
              }

              return false;
            }
          }
          return true;
        });
        return !hit;
      });

      // Update particles
      state.particles = state.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        return particle.life > 0;
      });

      // Draw player (spaceship)
      ctx.fillStyle = state.shield ? '#00ffff' : '#4a90d9';
      ctx.beginPath();
      ctx.moveTo(state.player.x + PLAYER_SIZE / 2, state.player.y);
      ctx.lineTo(state.player.x, state.player.y + PLAYER_SIZE);
      ctx.lineTo(state.player.x + PLAYER_SIZE, state.player.y + PLAYER_SIZE);
      ctx.closePath();
      ctx.fill();

      // Shield effect
      if (state.shield) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(state.player.x + PLAYER_SIZE / 2, state.player.y + PLAYER_SIZE / 2, PLAYER_SIZE, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Engine glow
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(state.player.x + PLAYER_SIZE / 2 - 5, state.player.y + PLAYER_SIZE, 10, 8 + Math.random() * 5);

      // Draw bullets
      ctx.fillStyle = state.rapidFire ? '#00ff00' : '#ffff00';
      state.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      // Draw enemies
      state.enemies.forEach(enemy => {
        ctx.fillStyle = enemy.type === 'tank' ? '#ff4400' : enemy.type === 'fast' ? '#ff00ff' : '#ff4444';
        ctx.beginPath();
        ctx.moveTo(enemy.x + ENEMY_SIZE / 2, enemy.y + ENEMY_SIZE);
        ctx.lineTo(enemy.x, enemy.y);
        ctx.lineTo(enemy.x + ENEMY_SIZE, enemy.y);
        ctx.closePath();
        ctx.fill();

        // Health bar for tanks
        if (enemy.type === 'tank' && enemy.health < 3) {
          ctx.fillStyle = '#333';
          ctx.fillRect(enemy.x, enemy.y - 8, ENEMY_SIZE, 4);
          ctx.fillStyle = '#00ff00';
          ctx.fillRect(enemy.x, enemy.y - 8, (ENEMY_SIZE * enemy.health) / 3, 4);
        }
      });

      // Draw power-ups
      state.powerUps.forEach(powerUp => {
        const colors = { rapid: '#00ff00', shield: '#00ffff', bomb: '#ff0000' };
        const symbols = { rapid: '⚡', shield: '🛡️', bomb: '💣' };
        
        ctx.fillStyle = colors[powerUp.type];
        ctx.beginPath();
        ctx.arc(powerUp.x + POWERUP_SIZE / 2, powerUp.y + POWERUP_SIZE / 2, POWERUP_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(symbols[powerUp.type], powerUp.x + POWERUP_SIZE / 2, powerUp.y + POWERUP_SIZE / 2 + 4);
      });

      // Draw particles
      state.particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / 30;
        ctx.fillRect(particle.x, particle.y, 4, 4);
      });
      ctx.globalAlpha = 1;

      // Draw HUD
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${state.score}`, 10, 30);
      ctx.fillText(`Level: ${state.level}`, 10, 55);

      // Lives
      ctx.fillText('Lives: ', CANVAS_WIDTH - 150, 30);
      for (let i = 0; i < state.lives; i++) {
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH - 80 + i * 25 + 8, CANVAS_HEIGHT - 585);
        ctx.lineTo(CANVAS_WIDTH - 80 + i * 25, CANVAS_HEIGHT - 575);
        ctx.lineTo(CANVAS_WIDTH - 80 + i * 25 + 16, CANVAS_HEIGHT - 575);
        ctx.closePath();
        ctx.fill();
      }

      // Power-up indicators
      if (state.rapidFire) {
        ctx.fillStyle = '#00ff00';
        ctx.fillText('⚡ RAPID FIRE', 10, 80);
      }
      if (state.shield) {
        ctx.fillStyle = '#00ffff';
        ctx.fillText('🛡️ SHIELD', 10, 105);
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, highScore]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/create/template"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Templates
          </Link>
          <div className="text-sm text-gray-400">
            Template: Space Shooter
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Game Info */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">🚀 Galactic Defender</h1>
          <p className="text-gray-400">Defend Earth from the alien invasion!</p>
        </div>

        {/* Game Container */}
        <div className="flex justify-center mb-6">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
            {!isPlaying ? (
              // Start Screen
              <div 
                className="flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-black"
                style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
              >
                <h2 className="text-5xl font-bold mb-4">🚀 GALACTIC DEFENDER</h2>
                <p className="text-xl text-gray-400 mb-8">
                  Destroy enemies • Collect power-ups • Survive!
                </p>
                
                <button
                  onClick={startGame}
                  className="flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg mb-8"
                >
                  <Play className="w-6 h-6" />
                  START MISSION
                </button>

                <div className="text-left bg-black/30 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Controls:</h3>
                  <p>↑ ↓ ← → or WASD - Move</p>
                  <p>SPACE - Shoot</p>
                  <p>P or ESC - Pause</p>
                </div>

                {highScore > 0 && (
                  <p className="mt-4 text-yellow-400">High Score: {highScore}</p>
                )}
              </div>
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="block"
                />

                {/* Pause Overlay */}
                {isPaused && !gameOver && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold mb-4">PAUSED</h2>
                      <p className="text-gray-400">Press P or ESC to resume</p>
                    </div>
                  </div>
                )}

                {/* Game Over Overlay */}
                {gameOver && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-red-400 mb-4">GAME OVER</h2>
                      <p className="text-2xl mb-2">Final Score: {score}</p>
                      <p className="text-xl text-yellow-400 mb-6">Level Reached: {level}</p>
                      <button
                        onClick={startGame}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        {isPlaying && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Power-ups Guide */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-green-400">Rapid Fire</div>
            <div className="text-sm text-gray-400">Shoot faster for 5 seconds</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <div className="font-semibold text-cyan-400">Shield</div>
            <div className="text-sm text-gray-400">Invincible for 5 seconds</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <div className="text-2xl mb-2">💣</div>
            <div className="font-semibold text-red-400">Bomb</div>
            <div className="text-sm text-gray-400">Destroys all enemies</div>
          </div>
        </div>

        {/* Customize CTA */}
        <div className="p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-2">Make it epic!</h3>
          <p className="text-gray-400 mb-4">
            Add boss battles, new weapons, or change to a different theme with Javari AI.
          </p>
          <Link
            href="/create/chat?template=shooter"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors"
          >
            Customize with AI
          </Link>
        </div>
      </div>
    </div>
  );
}
