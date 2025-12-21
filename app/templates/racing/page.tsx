'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

// Game constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const ROAD_WIDTH = 300;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;
const LANE_COUNT = 3;

interface Obstacle {
  x: number;
  y: number;
  type: 'car' | 'truck' | 'cone';
  lane: number;
  color: string;
}

interface PowerUp {
  x: number;
  y: number;
  type: 'boost' | 'shield' | 'coin';
}

export default function RacingTemplate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const gameStateRef = useRef({
    playerX: CANVAS_WIDTH / 2,
    playerLane: 1,
    targetLane: 1,
    obstacles: [] as Obstacle[],
    powerUps: [] as PowerUp[],
    roadOffset: 0,
    speed: 5,
    maxSpeed: 15,
    score: 0,
    distance: 0,
    coins: 0,
    isGameOver: false,
    isPaused: false,
    hasShield: false,
    shieldEnd: 0,
    isBoosting: false,
    boostEnd: 0,
    keys: { left: false, right: false },
    lastObstacle: 0,
    obstacleInterval: 60,
  });

  const getLaneX = (lane: number): number => {
    const roadLeft = (CANVAS_WIDTH - ROAD_WIDTH) / 2;
    const laneWidth = ROAD_WIDTH / LANE_COUNT;
    return roadLeft + laneWidth * lane + laneWidth / 2;
  };

  const startGame = useCallback(() => {
    const state = gameStateRef.current;
    state.playerLane = 1;
    state.targetLane = 1;
    state.playerX = getLaneX(1);
    state.obstacles = [];
    state.powerUps = [];
    state.roadOffset = 0;
    state.speed = 5;
    state.score = 0;
    state.distance = 0;
    state.coins = 0;
    state.isGameOver = false;
    state.isPaused = false;
    state.hasShield = false;
    state.isBoosting = false;
    state.lastObstacle = 0;

    setScore(0);
    setDistance(0);
    setCoins(0);
    setSpeed(5);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const state = gameStateRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        state.keys.left = true;
        if (state.targetLane > 0) state.targetLane--;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        state.keys.right = true;
        if (state.targetLane < LANE_COUNT - 1) state.targetLane++;
      }
      if (e.key === 'p' || e.key === 'Escape') {
        state.isPaused = !state.isPaused;
        setIsPaused(state.isPaused);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') state.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') state.keys.right = false;
    };

    // Touch controls
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      
      if (x < CANVAS_WIDTH / 2 && state.targetLane > 0) {
        state.targetLane--;
      } else if (x >= CANVAS_WIDTH / 2 && state.targetLane < LANE_COUNT - 1) {
        state.targetLane++;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart);

    const spawnObstacle = () => {
      const lane = Math.floor(Math.random() * LANE_COUNT);
      const types: Array<'car' | 'truck' | 'cone'> = ['car', 'car', 'car', 'truck', 'cone'];
      const type = types[Math.floor(Math.random() * types.length)];
      const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'];
      
      state.obstacles.push({
        x: getLaneX(lane),
        y: -CAR_HEIGHT,
        type,
        lane,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    const spawnPowerUp = () => {
      if (Math.random() > 0.02) return;
      
      const lane = Math.floor(Math.random() * LANE_COUNT);
      const types: Array<'boost' | 'shield' | 'coin'> = ['coin', 'coin', 'coin', 'boost', 'shield'];
      
      state.powerUps.push({
        x: getLaneX(lane),
        y: -30,
        type: types[Math.floor(Math.random() * types.length)],
      });
    };

    const checkCollision = (obj: { x: number; y: number }, width: number, height: number): boolean => {
      const playerY = CANVAS_HEIGHT - 100;
      return (
        Math.abs(obj.x - state.playerX) < (CAR_WIDTH + width) / 2 &&
        Math.abs(obj.y - playerY) < (CAR_HEIGHT + height) / 2
      );
    };

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
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw road
      const roadLeft = (CANVAS_WIDTH - ROAD_WIDTH) / 2;
      ctx.fillStyle = '#333344';
      ctx.fillRect(roadLeft, 0, ROAD_WIDTH, CANVAS_HEIGHT);

      // Road edges (neon glow effect)
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffff';
      ctx.beginPath();
      ctx.moveTo(roadLeft, 0);
      ctx.lineTo(roadLeft, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(roadLeft + ROAD_WIDTH, 0);
      ctx.lineTo(roadLeft + ROAD_WIDTH, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw lane markers (animated)
      state.roadOffset = (state.roadOffset + state.speed) % 60;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([30, 30]);
      
      for (let i = 1; i < LANE_COUNT; i++) {
        const x = roadLeft + (ROAD_WIDTH / LANE_COUNT) * i;
        ctx.beginPath();
        ctx.moveTo(x, -60 + state.roadOffset);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Update player position (smooth lane change)
      const targetX = getLaneX(state.targetLane);
      state.playerX += (targetX - state.playerX) * 0.15;

      // Update speed
      state.speed = Math.min(state.maxSpeed, 5 + state.distance / 1000);
      if (state.isBoosting && now < state.boostEnd) {
        state.speed *= 1.5;
      } else {
        state.isBoosting = false;
      }

      // Spawn obstacles
      state.lastObstacle++;
      const spawnRate = Math.max(30, 60 - Math.floor(state.distance / 500));
      if (state.lastObstacle >= spawnRate) {
        spawnObstacle();
        state.lastObstacle = 0;
      }

      // Spawn power-ups
      spawnPowerUp();

      // Update and draw obstacles
      state.obstacles = state.obstacles.filter(obs => {
        obs.y += state.speed;

        // Draw obstacle
        if (obs.type === 'cone') {
          ctx.fillStyle = '#ff8800';
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y - 15);
          ctx.lineTo(obs.x - 12, obs.y + 15);
          ctx.lineTo(obs.x + 12, obs.y + 15);
          ctx.closePath();
          ctx.fill();
        } else {
          const height = obs.type === 'truck' ? CAR_HEIGHT * 1.3 : CAR_HEIGHT;
          ctx.fillStyle = obs.color;
          ctx.fillRect(obs.x - CAR_WIDTH / 2, obs.y - height / 2, CAR_WIDTH, height);
          // Windshield
          ctx.fillStyle = '#333';
          ctx.fillRect(obs.x - CAR_WIDTH / 2 + 5, obs.y - height / 2 + 10, CAR_WIDTH - 10, 15);
          // Taillights
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(obs.x - CAR_WIDTH / 2, obs.y + height / 2 - 8, 8, 6);
          ctx.fillRect(obs.x + CAR_WIDTH / 2 - 8, obs.y + height / 2 - 8, 8, 6);
        }

        // Check collision
        if (checkCollision(obs, obs.type === 'cone' ? 24 : CAR_WIDTH, obs.type === 'truck' ? CAR_HEIGHT * 1.3 : CAR_HEIGHT)) {
          if (state.hasShield && now < state.shieldEnd) {
            state.hasShield = false;
            return false; // Destroy obstacle
          } else {
            state.isGameOver = true;
            setGameOver(true);
            if (state.score > highScore) {
              setHighScore(state.score);
            }
          }
        }

        return obs.y < CANVAS_HEIGHT + 50;
      });

      // Update and draw power-ups
      state.powerUps = state.powerUps.filter(pu => {
        pu.y += state.speed;

        // Draw power-up
        ctx.beginPath();
        ctx.arc(pu.x, pu.y, 15, 0, Math.PI * 2);
        
        if (pu.type === 'coin') {
          ctx.fillStyle = '#ffd700';
          ctx.fill();
          ctx.fillStyle = '#b8860b';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('$', pu.x, pu.y + 5);
        } else if (pu.type === 'boost') {
          ctx.fillStyle = '#00ff00';
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('⚡', pu.x, pu.y + 5);
        } else {
          ctx.fillStyle = '#00ffff';
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🛡', pu.x, pu.y + 5);
        }

        // Check collection
        if (checkCollision(pu, 30, 30)) {
          if (pu.type === 'coin') {
            state.coins++;
            state.score += 50;
            setCoins(state.coins);
          } else if (pu.type === 'boost') {
            state.isBoosting = true;
            state.boostEnd = now + 3000;
          } else {
            state.hasShield = true;
            state.shieldEnd = now + 5000;
          }
          return false;
        }

        return pu.y < CANVAS_HEIGHT + 30;
      });

      // Draw player car
      const playerY = CANVAS_HEIGHT - 100;
      
      // Shield effect
      if (state.hasShield && now < state.shieldEnd) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(state.playerX, playerY, CAR_WIDTH, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Boost effect
      if (state.isBoosting) {
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(state.playerX - 10, playerY + CAR_HEIGHT / 2);
        ctx.lineTo(state.playerX, playerY + CAR_HEIGHT / 2 + 20 + Math.random() * 10);
        ctx.lineTo(state.playerX + 10, playerY + CAR_HEIGHT / 2);
        ctx.fill();
      }

      // Car body
      ctx.fillStyle = '#ff00ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff00ff';
      ctx.fillRect(state.playerX - CAR_WIDTH / 2, playerY - CAR_HEIGHT / 2, CAR_WIDTH, CAR_HEIGHT);
      ctx.shadowBlur = 0;

      // Windshield
      ctx.fillStyle = '#333';
      ctx.fillRect(state.playerX - CAR_WIDTH / 2 + 5, playerY - CAR_HEIGHT / 2 + 10, CAR_WIDTH - 10, 20);

      // Headlights
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(state.playerX - CAR_WIDTH / 2, playerY - CAR_HEIGHT / 2, 8, 8);
      ctx.fillRect(state.playerX + CAR_WIDTH / 2 - 8, playerY - CAR_HEIGHT / 2, 8, 8);

      // Update score and distance
      state.distance += state.speed;
      state.score = Math.floor(state.distance / 10) + state.coins * 50;
      setScore(state.score);
      setDistance(Math.floor(state.distance));
      setSpeed(Math.floor(state.speed));

      // Draw HUD
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${state.score}`, 10, 30);
      ctx.fillText(`Distance: ${Math.floor(state.distance)}m`, 10, 55);
      ctx.fillText(`🪙 ${state.coins}`, 10, 80);

      ctx.textAlign = 'right';
      ctx.fillText(`Speed: ${Math.floor(state.speed * 10)}km/h`, CANVAS_WIDTH - 10, 30);

      // Power-up indicators
      if (state.isBoosting) {
        ctx.fillStyle = '#00ff00';
        ctx.textAlign = 'left';
        ctx.fillText('⚡ BOOST!', 10, 105);
      }
      if (state.hasShield && now < state.shieldEnd) {
        ctx.fillStyle = '#00ffff';
        ctx.textAlign = 'left';
        ctx.fillText('🛡️ SHIELD', 10, state.isBoosting ? 130 : 105);
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
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
          <div className="text-sm text-gray-400">Template: Racing</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Game Info */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">🏎️ Neon Racer</h1>
          <p className="text-gray-400">Dodge traffic and collect coins in this endless neon racing game!</p>
        </div>

        {/* Game Container */}
        <div className="flex justify-center mb-6">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
            {!isPlaying ? (
              <div 
                className="flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-black"
                style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
              >
                <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
                  NEON RACER
                </h2>
                <p className="text-gray-400 mb-8 text-center px-4">
                  Dodge cars • Collect coins • Go fast!
                </p>
                
                <button
                  onClick={startGame}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  <Play className="w-6 h-6" />
                  START RACE
                </button>

                <div className="mt-8 text-left bg-black/30 p-4 rounded-lg text-sm">
                  <h3 className="font-bold mb-2">Controls:</h3>
                  <p>← → or A/D - Change lanes</p>
                  <p>Tap left/right on mobile</p>
                  <p>P - Pause</p>
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

                {isPaused && !gameOver && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold mb-4">PAUSED</h2>
                      <p className="text-gray-400">Press P to resume</p>
                    </div>
                  </div>
                )}

                {gameOver && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-red-400 mb-4">CRASH!</h2>
                      <p className="text-2xl mb-2">Score: {score}</p>
                      <p className="text-lg text-gray-400 mb-2">Distance: {distance}m</p>
                      <p className="text-lg text-yellow-400 mb-6">🪙 {coins} coins</p>
                      <button
                        onClick={startGame}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors"
                      >
                        Race Again
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
            <div className="text-2xl mb-2">🪙</div>
            <div className="font-semibold text-yellow-400">Coins</div>
            <div className="text-sm text-gray-400">+50 points each</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-green-400">Boost</div>
            <div className="text-sm text-gray-400">Speed boost for 3 sec</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <div className="font-semibold text-cyan-400">Shield</div>
            <div className="text-sm text-gray-400">Survive one crash</div>
          </div>
        </div>

        {/* Customize CTA */}
        <div className="p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-2">Make it yours!</h3>
          <p className="text-gray-400 mb-4">
            Add new cars, change themes, or create different tracks with Javari AI.
          </p>
          <Link
            href="/create/chat?template=racing"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors"
          >
            Customize with AI
          </Link>
        </div>
      </div>
    </div>
  );
}
