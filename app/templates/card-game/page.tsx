'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, Swords, Shield, Heart, Zap, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Card {
  id: number;
  name: string;
  type: 'attack' | 'defense' | 'heal' | 'special';
  cost: number;
  value: number;
  description: string;
  emoji: string;
}

interface Player {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  block: number;
  hand: Card[];
  deck: Card[];
  discard: Card[];
}

const CARD_TEMPLATES: Omit<Card, 'id'>[] = [
  { name: 'Strike', type: 'attack', cost: 1, value: 6, description: 'Deal 6 damage', emoji: '⚔️' },
  { name: 'Heavy Blow', type: 'attack', cost: 2, value: 12, description: 'Deal 12 damage', emoji: '🔨' },
  { name: 'Quick Slash', type: 'attack', cost: 0, value: 3, description: 'Deal 3 damage', emoji: '🗡️' },
  { name: 'Defend', type: 'defense', cost: 1, value: 5, description: 'Gain 5 block', emoji: '🛡️' },
  { name: 'Iron Wall', type: 'defense', cost: 2, value: 12, description: 'Gain 12 block', emoji: '🏰' },
  { name: 'Heal', type: 'heal', cost: 1, value: 5, description: 'Restore 5 HP', emoji: '💚' },
  { name: 'Greater Heal', type: 'heal', cost: 2, value: 12, description: 'Restore 12 HP', emoji: '💖' },
  { name: 'Rage', type: 'special', cost: 2, value: 8, description: 'Deal 8 damage twice', emoji: '😤' },
  { name: 'Vampiric Strike', type: 'special', cost: 2, value: 6, description: 'Deal 6, heal 3', emoji: '🧛' },
];

const ENEMIES = [
  { name: 'Slime', maxHp: 30, damage: 6, emoji: '🟢' },
  { name: 'Goblin', maxHp: 40, damage: 8, emoji: '👺' },
  { name: 'Skeleton', maxHp: 35, damage: 10, emoji: '💀' },
  { name: 'Orc', maxHp: 60, damage: 12, emoji: '👹' },
  { name: 'Dragon', maxHp: 100, damage: 15, emoji: '🐉' },
];

export default function CardGameTemplate() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'victory' | 'defeat'>('menu');
  const [player, setPlayer] = useState<Player>({
    hp: 50, maxHp: 50, energy: 3, maxEnergy: 3, block: 0, hand: [], deck: [], discard: [],
  });
  const [enemy, setEnemy] = useState({ ...ENEMIES[0], hp: ENEMIES[0].maxHp });
  const [battleNum, setBattleNum] = useState(0);
  const [turn, setTurn] = useState(1);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const createDeck = useCallback((): Card[] => {
    let id = 0;
    const deck: Card[] = [];
    for (let i = 0; i < 5; i++) deck.push({ ...CARD_TEMPLATES[0], id: id++ });
    for (let i = 0; i < 4; i++) deck.push({ ...CARD_TEMPLATES[3], id: id++ });
    deck.push({ ...CARD_TEMPLATES[5], id: id++ });
    return deck.sort(() => Math.random() - 0.5);
  }, []);

  const drawCards = useCallback((p: Player, count: number): Player => {
    const newPlayer = { ...p, hand: [...p.hand], deck: [...p.deck], discard: [...p.discard] };
    for (let i = 0; i < count; i++) {
      if (newPlayer.deck.length === 0) {
        newPlayer.deck = newPlayer.discard.sort(() => Math.random() - 0.5);
        newPlayer.discard = [];
      }
      if (newPlayer.deck.length > 0) newPlayer.hand.push(newPlayer.deck.pop()!);
    }
    return newPlayer;
  }, []);

  const startGame = () => {
    const deck = createDeck();
    let newPlayer: Player = { hp: 50, maxHp: 50, energy: 3, maxEnergy: 3, block: 0, hand: [], deck, discard: [] };
    newPlayer = drawCards(newPlayer, 5);
    setPlayer(newPlayer);
    setEnemy({ ...ENEMIES[0], hp: ENEMIES[0].maxHp });
    setBattleNum(0);
    setTurn(1);
    setMessage('Your turn! Play cards or end turn.');
    setGameState('playing');
  };

  const playCard = (card: Card) => {
    if (isAnimating || player.energy < card.cost) return;
    setIsAnimating(true);

    setTimeout(() => {
      let newPlayer = { ...player };
      let newEnemy = { ...enemy };
      let msg = '';

      newPlayer.hand = newPlayer.hand.filter(c => c.id !== card.id);
      newPlayer.discard.push(card);
      newPlayer.energy -= card.cost;

      switch (card.type) {
        case 'attack':
          newEnemy.hp -= card.value;
          msg = `${card.name} deals ${card.value} damage!`;
          break;
        case 'defense':
          newPlayer.block += card.value;
          msg = `${card.name} grants ${card.value} block!`;
          break;
        case 'heal':
          const healAmount = Math.min(card.value, newPlayer.maxHp - newPlayer.hp);
          newPlayer.hp += healAmount;
          msg = `${card.name} restores ${healAmount} HP!`;
          break;
        case 'special':
          if (card.name === 'Rage') {
            newEnemy.hp -= card.value * 2;
            msg = `${card.name} deals ${card.value * 2} total damage!`;
          } else {
            newEnemy.hp -= card.value;
            newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + 3);
            msg = `${card.name} deals ${card.value} and heals 3!`;
          }
          break;
      }

      setMessage(msg);
      setPlayer(newPlayer);
      setEnemy(newEnemy);
      setIsAnimating(false);

      if (newEnemy.hp <= 0) setTimeout(() => handleVictory(), 500);
    }, 300);
  };

  const endTurn = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    let newPlayer = { ...player };
    const damage = Math.max(0, enemy.damage - newPlayer.block);
    newPlayer.block = 0;
    newPlayer.hp -= damage;

    setMessage(damage > 0 ? `${enemy.name} attacks for ${damage} damage!` : 'Block absorbed the attack!');

    setTimeout(() => {
      if (newPlayer.hp <= 0) { setGameState('defeat'); return; }

      newPlayer.energy = newPlayer.maxEnergy;
      newPlayer.discard = [...newPlayer.discard, ...newPlayer.hand];
      newPlayer.hand = [];
      newPlayer = drawCards(newPlayer, 5);

      setPlayer(newPlayer);
      setTurn(prev => prev + 1);
      setMessage('Your turn!');
      setIsAnimating(false);
    }, 1000);
  };

  const handleVictory = () => {
    const nextBattle = battleNum + 1;
    if (nextBattle >= ENEMIES.length) { setGameState('victory'); return; }

    const newCard = { ...CARD_TEMPLATES[Math.floor(Math.random() * CARD_TEMPLATES.length)], id: Date.now() };
    let newPlayer = { ...player };
    newPlayer.deck = [...newPlayer.deck, ...newPlayer.discard, ...newPlayer.hand, newCard].sort(() => Math.random() - 0.5);
    newPlayer.discard = [];
    newPlayer.hand = [];
    newPlayer.block = 0;
    newPlayer.energy = newPlayer.maxEnergy;
    newPlayer = drawCards(newPlayer, 5);
    newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + 10);

    setBattleNum(nextBattle);
    setEnemy({ ...ENEMIES[nextBattle], hp: ENEMIES[nextBattle].maxHp });
    setPlayer(newPlayer);
    setTurn(1);
    setMessage(`Victory! ${newCard.name} added to deck!`);
  };

  const cardColors = {
    attack: 'from-red-600 to-red-800',
    defense: 'from-blue-600 to-blue-800',
    heal: 'from-green-600 to-green-800',
    special: 'from-purple-600 to-purple-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
      <div className="border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/create/template" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />Back
          </Link>
          <div className="text-sm text-gray-400">Template: Card Game</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              <div className="text-6xl mb-4">🃏</div>
              <h1 className="text-4xl font-bold mb-4">Card Battle</h1>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Defeat 5 enemies with strategic card combat!</p>
              <button onClick={startGame} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-xl mx-auto hover:scale-105 transition-transform">
                <Swords className="w-6 h-6" />START BATTLE
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-400">Battle {battleNum + 1}/5 • Turn {turn}</div>
                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /><span className="font-bold">{player.energy}/{player.maxEnergy}</span></div>
              </div>

              <div className="text-center mb-6 p-6 bg-red-900/20 rounded-xl">
                <div className="text-6xl mb-2">{enemy.emoji}</div>
                <h2 className="text-2xl font-bold">{enemy.name}</h2>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1"><Heart className="w-5 h-5 text-red-400" /><span>{enemy.hp}/{enemy.maxHp}</span></div>
                  <div className="flex items-center gap-1 text-orange-400"><Swords className="w-5 h-5" /><span>Intends: {enemy.damage}</span></div>
                </div>
                <div className="mt-3 h-3 bg-gray-700 rounded-full overflow-hidden max-w-xs mx-auto">
                  <motion.div className="h-full bg-red-500" animate={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
                </div>
              </div>

              <div className="text-center mb-4 p-3 bg-black/30 rounded-lg"><p className="text-amber-300">{message}</p></div>

              <div className="flex justify-center gap-6 mb-6">
                <div className="flex items-center gap-2"><Heart className="w-5 h-5 text-red-400" /><span className="font-bold">{player.hp}/{player.maxHp}</span></div>
                <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400" /><span className="font-bold">{player.block}</span></div>
                <div className="text-sm text-gray-400">Deck: {player.deck.length} | Discard: {player.discard.length}</div>
              </div>

              <div className="flex justify-center gap-3 mb-6 flex-wrap">
                {player.hand.map((card, i) => (
                  <motion.button key={card.id} onClick={() => playCard(card)} disabled={player.energy < card.cost || isAnimating}
                    initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                    whileHover={player.energy >= card.cost ? { y: -10, scale: 1.05 } : {}}
                    className={`w-28 p-3 rounded-xl bg-gradient-to-b ${cardColors[card.type]} ${player.energy < card.cost ? 'opacity-50' : 'cursor-pointer'}`}>
                    <div className="text-2xl mb-1">{card.emoji}</div>
                    <div className="text-xs font-bold">{card.name}</div>
                    <div className="text-xs text-white/70 mt-1">{card.description}</div>
                    <div className="mt-2 flex items-center justify-center gap-1"><Zap className="w-3 h-3 text-yellow-300" /><span className="text-xs">{card.cost}</span></div>
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center">
                <button onClick={endTurn} disabled={isAnimating} className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold disabled:opacity-50">End Turn</button>
              </div>
            </motion.div>
          )}

          {gameState === 'victory' && (
            <motion.div key="victory" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h1 className="text-4xl font-bold text-yellow-400 mb-4">Victory!</h1>
              <p className="text-gray-400 mb-8">You defeated all 5 enemies!</p>
              <button onClick={startGame} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-lg mx-auto">
                <RotateCcw className="w-5 h-5" />Play Again
              </button>
            </motion.div>
          )}

          {gameState === 'defeat' && (
            <motion.div key="defeat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-6xl mb-4">💀</div>
              <h1 className="text-4xl font-bold text-red-400 mb-4">Defeat</h1>
              <p className="text-gray-400 mb-4">Battles Won: {battleNum}</p>
              <button onClick={startGame} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-lg mx-auto">
                <RotateCcw className="w-5 h-5" />Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === 'menu' && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-2">Create your own card game!</h3>
            <p className="text-gray-400 mb-4">Add new cards, enemies, or mechanics with Javari AI.</p>
            <Link href="/create/chat?template=card-game" className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold">Customize with AI</Link>
          </div>
        )}
      </div>
    </div>
  );
}
