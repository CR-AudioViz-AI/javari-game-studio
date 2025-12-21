'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Cookie, Zap, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  cps: number; // Cookies per second
  owned: number;
  emoji: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: 'cookies' | 'cps' | 'clicks';
  unlocked: boolean;
  emoji: string;
}

const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'cursor', name: 'Cursor', description: 'Auto-clicks once every 10 seconds', baseCost: 15, costMultiplier: 1.15, cps: 0.1, owned: 0, emoji: '👆' },
  { id: 'grandma', name: 'Grandma', description: 'A nice grandma to bake more cookies', baseCost: 100, costMultiplier: 1.15, cps: 1, owned: 0, emoji: '👵' },
  { id: 'farm', name: 'Cookie Farm', description: 'Grows cookie plants', baseCost: 1100, costMultiplier: 1.15, cps: 8, owned: 0, emoji: '🌾' },
  { id: 'mine', name: 'Cookie Mine', description: 'Mines cookies from the depths', baseCost: 12000, costMultiplier: 1.15, cps: 47, owned: 0, emoji: '⛏️' },
  { id: 'factory', name: 'Cookie Factory', description: 'Mass produces cookies', baseCost: 130000, costMultiplier: 1.15, cps: 260, owned: 0, emoji: '🏭' },
  { id: 'bank', name: 'Cookie Bank', description: 'Generates cookies from interest', baseCost: 1400000, costMultiplier: 1.15, cps: 1400, owned: 0, emoji: '🏦' },
  { id: 'temple', name: 'Cookie Temple', description: 'Full of cookie worshippers', baseCost: 20000000, costMultiplier: 1.15, cps: 7800, owned: 0, emoji: '🛕' },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', name: 'First Cookie', description: 'Click your first cookie', requirement: 1, type: 'cookies', unlocked: false, emoji: '🎯' },
  { id: 'hundred', name: 'Cookie Collector', description: 'Bake 100 cookies', requirement: 100, type: 'cookies', unlocked: false, emoji: '🥉' },
  { id: 'thousand', name: 'Cookie Hoarder', description: 'Bake 1,000 cookies', requirement: 1000, type: 'cookies', unlocked: false, emoji: '🥈' },
  { id: 'million', name: 'Cookie Millionaire', description: 'Bake 1,000,000 cookies', requirement: 1000000, type: 'cookies', unlocked: false, emoji: '🥇' },
  { id: 'clicker', name: 'Dedicated Clicker', description: 'Click 100 times', requirement: 100, type: 'clicks', unlocked: false, emoji: '👆' },
  { id: 'cps1', name: 'Automation Begin', description: 'Reach 1 CPS', requirement: 1, type: 'cps', unlocked: false, emoji: '⚡' },
  { id: 'cps10', name: 'Cookie Stream', description: 'Reach 10 CPS', requirement: 10, type: 'cps', unlocked: false, emoji: '🌊' },
  { id: 'cps100', name: 'Cookie River', description: 'Reach 100 CPS', requirement: 100, type: 'cps', unlocked: false, emoji: '🏞️' },
];

export default function IdleTemplate() {
  const [cookies, setCookies] = useState(0);
  const [totalCookies, setTotalCookies] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [upgrades, setUpgrades] = useState(INITIAL_UPGRADES);
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Calculate CPS
  const cps = upgrades.reduce((sum, u) => sum + u.cps * u.owned, 0);

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
  };

  // Get upgrade cost
  const getUpgradeCost = (upgrade: Upgrade): number => {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
  };

  // Handle cookie click
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCookies(prev => prev + 1);
    setTotalCookies(prev => prev + 1);
    setClicks(prev => prev + 1);

    // Add click effect
    const effectId = Date.now();
    setClickEffects(prev => [...prev, { id: effectId, x, y }]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(e => e.id !== effectId));
    }, 1000);
  };

  // Buy upgrade
  const buyUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const cost = getUpgradeCost(upgrade);
    if (cookies < cost) return;

    setCookies(prev => prev - cost);
    setUpgrades(prev => prev.map(u => 
      u.id === upgradeId ? { ...u, owned: u.owned + 1 } : u
    ));
  };

  // Auto-generate cookies
  useEffect(() => {
    const interval = setInterval(() => {
      if (cps > 0) {
        setCookies(prev => prev + cps / 10);
        setTotalCookies(prev => prev + cps / 10);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [cps]);

  // Check achievements
  useEffect(() => {
    setAchievements(prev => prev.map(ach => {
      if (ach.unlocked) return ach;

      let value = 0;
      if (ach.type === 'cookies') value = totalCookies;
      if (ach.type === 'cps') value = cps;
      if (ach.type === 'clicks') value = clicks;

      if (value >= ach.requirement) {
        setNewAchievement(ach);
        setTimeout(() => setNewAchievement(null), 3000);
        return { ...ach, unlocked: true };
      }
      return ach;
    }));
  }, [totalCookies, cps, clicks]);

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-orange-900 to-amber-900">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/create/template"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <div className="text-sm text-gray-400">Template: Idle/Clicker</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">🍪 Cookie Empire</h1>
          <p className="text-amber-200/70">Click cookies, buy upgrades, build an empire!</p>
        </div>

        {/* Achievement notification */}
        <AnimatePresence>
          {newAchievement && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 p-4 bg-yellow-500 text-black rounded-xl shadow-lg flex items-center gap-3"
            >
              <Award className="w-6 h-6" />
              <div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div className="text-sm">{newAchievement.emoji} {newAchievement.name}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - Cookie Clicker */}
          <div>
            {/* Stats */}
            <div className="p-4 bg-black/20 rounded-xl mb-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-amber-300">{formatNumber(cookies)}</div>
                <div className="text-amber-200/70">cookies</div>
              </div>
              <div className="flex justify-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-amber-300 font-bold">{formatNumber(cps)}</div>
                  <div className="text-amber-200/50">per second</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-300 font-bold">{formatNumber(totalCookies)}</div>
                  <div className="text-amber-200/50">total baked</div>
                </div>
              </div>
            </div>

            {/* Big Cookie */}
            <div className="relative flex justify-center mb-6">
              <motion.button
                onClick={handleClick}
                whileTap={{ scale: 0.95 }}
                className="relative w-48 h-48 text-[150px] leading-none cursor-pointer hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all"
              >
                🍪
              </motion.button>

              {/* Click effects */}
              <AnimatePresence>
                {clickEffects.map(effect => (
                  <motion.div
                    key={effect.id}
                    initial={{ opacity: 1, y: 0, x: effect.x - 100, scale: 1 }}
                    animate={{ opacity: 0, y: -50, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute pointer-events-none text-xl font-bold text-yellow-300"
                    style={{ left: effect.x, top: effect.y }}
                  >
                    +1
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Achievements */}
            <div className="p-4 bg-black/20 rounded-xl">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Achievements ({unlockedAchievements}/{achievements.length})
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={`p-2 rounded-lg text-center text-2xl ${
                      ach.unlocked ? 'bg-yellow-500/20' : 'bg-black/30 opacity-50'
                    }`}
                    title={`${ach.name}: ${ach.description}`}
                  >
                    {ach.emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Upgrades */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Upgrades
            </h2>

            {upgrades.map(upgrade => {
              const cost = getUpgradeCost(upgrade);
              const canAfford = cookies >= cost;

              return (
                <motion.button
                  key={upgrade.id}
                  onClick={() => buyUpgrade(upgrade.id)}
                  disabled={!canAfford}
                  whileHover={canAfford ? { scale: 1.02 } : {}}
                  whileTap={canAfford ? { scale: 0.98 } : {}}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    canAfford 
                      ? 'bg-amber-700/50 hover:bg-amber-600/50 cursor-pointer' 
                      : 'bg-black/30 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{upgrade.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{upgrade.name}</span>
                        <span className="text-amber-300">{upgrade.owned}</span>
                      </div>
                      <div className="text-sm text-amber-200/70">{upgrade.description}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-green-400">+{upgrade.cps} CPS each</span>
                        <span className={`text-sm ${canAfford ? 'text-yellow-300' : 'text-red-400'}`}>
                          🍪 {formatNumber(cost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Customize CTA */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-2">Create your own idle game!</h3>
          <p className="text-gray-400 mb-4">
            Change the theme, add prestige systems, or create unique upgrades with Javari AI.
          </p>
          <Link
            href="/create/chat?template=idle"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors"
          >
            Customize with AI
          </Link>
        </div>
      </div>
    </div>
  );
}
