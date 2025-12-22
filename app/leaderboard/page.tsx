'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy,
  Crown,
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Heart,
  Gamepad2,
  Users,
  Calendar,
  ChevronRight,
  Sparkles,
  Flame,
  Zap
} from 'lucide-react';

const TOP_CREATORS = [
  { rank: 1, name: 'StarGamesDev', avatar: '👨‍🚀', games: 12, plays: 1250000, followers: 8420, change: 0, isPro: true },
  { rank: 2, name: 'PuzzleMaster', avatar: '💎', games: 8, plays: 980000, followers: 6200, change: 1, isPro: true },
  { rank: 3, name: 'IdleKing', avatar: '🍪', games: 5, plays: 890000, followers: 5100, change: -1, isPro: false },
  { rank: 4, name: 'EpicQuests', avatar: '🐉', games: 6, plays: 720000, followers: 4800, change: 2, isPro: true },
  { rank: 5, name: 'SpeedDemon', avatar: '🏎️', games: 9, plays: 650000, followers: 3900, change: 0, isPro: false },
  { rank: 6, name: 'RetroGamer', avatar: '🎮', games: 15, plays: 580000, followers: 3400, change: -1, isPro: false },
  { rank: 7, name: 'QuizWhiz', avatar: '🧠', games: 4, plays: 520000, followers: 2800, change: 3, isPro: true },
  { rank: 8, name: 'StrategyKing', avatar: '🏰', games: 7, plays: 480000, followers: 2500, change: -2, isPro: false },
  { rank: 9, name: 'CardMaster', avatar: '🃏', games: 3, plays: 420000, followers: 2200, change: 1, isPro: false },
  { rank: 10, name: 'PixelPro', avatar: '👾', games: 11, plays: 380000, followers: 1900, change: 0, isPro: true },
];

const TOP_GAMES = [
  { rank: 1, title: 'Cosmic Runner', creator: 'StarGamesDev', plays: 450000, rating: 4.9, thumbnail: '🚀', change: 0 },
  { rank: 2, title: 'Cookie Empire', creator: 'IdleKing', plays: 380000, rating: 4.8, thumbnail: '🍪', change: 2 },
  { rank: 3, title: 'Gem Quest Saga', creator: 'PuzzleMaster', plays: 320000, rating: 4.8, thumbnail: '💎', change: -1 },
  { rank: 4, title: 'Dragon Knight RPG', creator: 'EpicQuests', plays: 280000, rating: 4.7, thumbnail: '🐉', change: 1 },
  { rank: 5, title: 'Neon Drift Racing', creator: 'SpeedDemon', plays: 240000, rating: 4.6, thumbnail: '🏎️', change: -1 },
  { rank: 6, title: 'Brain Quiz Master', creator: 'QuizWhiz', plays: 210000, rating: 4.5, thumbnail: '🧠', change: 3 },
  { rank: 7, title: 'Tower Siege', creator: 'StrategyKing', plays: 180000, rating: 4.5, thumbnail: '🏰', change: 0 },
  { rank: 8, title: 'Card Legends', creator: 'CardMaster', plays: 150000, rating: 4.6, thumbnail: '🃏', change: -2 },
  { rank: 9, title: 'Pixel Jump Pro', creator: 'PixelPro', plays: 130000, rating: 4.4, thumbnail: '🎮', change: 1 },
  { rank: 10, title: 'Retro Blaster', creator: 'RetroGamer', plays: 110000, rating: 4.3, thumbnail: '👾', change: 0 },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
  return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
};

const getChangeIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
  if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-gray-500" />;
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'creators' | 'games'>('creators');
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.1, 0.15]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold">Leaderboards</h1>
              </div>
              <p className="text-gray-400">See who's dominating the Game Studio</p>
            </div>

            <Link
              href="/create/chat"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Create Your Game
            </Link>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Tabs & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex bg-white/5 rounded-xl p-1">
            {(['creators', 'games'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'creators' ? '👑 Top Creators' : '🎮 Top Games'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {(['weekly', 'monthly', 'alltime'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white/10 text-white'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {range === 'weekly' ? 'This Week' : range === 'monthly' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="flex justify-center gap-4 mb-12">
          {(activeTab === 'creators' ? TOP_CREATORS : TOP_GAMES).slice(0, 3).map((item, i) => {
            const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd
            const actualIndex = podiumOrder[i];
            const data = (activeTab === 'creators' ? TOP_CREATORS : TOP_GAMES)[actualIndex];
            const isFirst = actualIndex === 0;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`relative ${isFirst ? 'order-2 -mt-8' : i === 0 ? 'order-1' : 'order-3'}`}
              >
                <div className={`p-6 rounded-2xl border text-center ${
                  isFirst 
                    ? 'bg-gradient-to-b from-yellow-500/20 to-orange-500/10 border-yellow-500/30 w-56' 
                    : 'bg-white/5 border-white/10 w-48'
                }`}>
                  {/* Crown for #1 */}
                  {isFirst && (
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2"
                    >
                      <Crown className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
                    </motion.div>
                  )}

                  {/* Rank Badge */}
                  <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    actualIndex === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' :
                    actualIndex === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black' :
                    'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                  }`}>
                    {actualIndex + 1}
                  </div>

                  {/* Avatar/Thumbnail */}
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl ${
                    isFirst ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30' : 'bg-white/10'
                  }`}>
                    {activeTab === 'creators' 
                      ? (data as typeof TOP_CREATORS[0]).avatar 
                      : (data as typeof TOP_GAMES[0]).thumbnail}
                  </div>

                  {/* Info */}
                  <h3 className="font-bold text-lg mb-1 truncate">
                    {activeTab === 'creators' 
                      ? (data as typeof TOP_CREATORS[0]).name 
                      : (data as typeof TOP_GAMES[0]).title}
                  </h3>
                  
                  {activeTab === 'creators' ? (
                    <>
                      <p className="text-sm text-gray-400 mb-3">
                        {(data as typeof TOP_CREATORS[0]).games} games
                      </p>
                      <div className="text-2xl font-bold text-green-400">
                        {formatNumber((data as typeof TOP_CREATORS[0]).plays)}
                      </div>
                      <p className="text-xs text-gray-500">total plays</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-400 mb-3">
                        by {(data as typeof TOP_GAMES[0]).creator}
                      </p>
                      <div className="text-2xl font-bold text-green-400">
                        {formatNumber((data as typeof TOP_GAMES[0]).plays)}
                      </div>
                      <p className="text-xs text-gray-500">plays</p>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold">
              {activeTab === 'creators' ? 'All Creators' : 'All Games'}
            </h2>
          </div>

          <div className="divide-y divide-white/5">
            {(activeTab === 'creators' ? TOP_CREATORS : TOP_GAMES).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                {activeTab === 'creators' ? (
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 flex justify-center">
                      {getRankIcon((item as typeof TOP_CREATORS[0]).rank)}
                    </div>

                    {/* Change */}
                    <div className="w-8">
                      {getChangeIcon((item as typeof TOP_CREATORS[0]).change)}
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-2xl">
                        {(item as typeof TOP_CREATORS[0]).avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{(item as typeof TOP_CREATORS[0]).name}</span>
                          {(item as typeof TOP_CREATORS[0]).isPro && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black">
                              PRO
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {(item as typeof TOP_CREATORS[0]).games} games • {formatNumber((item as typeof TOP_CREATORS[0]).followers)} followers
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="font-bold text-green-400">{formatNumber((item as typeof TOP_CREATORS[0]).plays)}</div>
                      <p className="text-xs text-gray-500">plays</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 flex justify-center">
                      {getRankIcon((item as typeof TOP_GAMES[0]).rank)}
                    </div>

                    {/* Change */}
                    <div className="w-8">
                      {getChangeIcon((item as typeof TOP_GAMES[0]).change)}
                    </div>

                    {/* Thumbnail & Title */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-2xl">
                        {(item as typeof TOP_GAMES[0]).thumbnail}
                      </div>
                      <div>
                        <span className="font-bold">{(item as typeof TOP_GAMES[0]).title}</span>
                        <p className="text-sm text-gray-500">by {(item as typeof TOP_GAMES[0]).creator}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{(item as typeof TOP_GAMES[0]).rating}</span>
                    </div>

                    {/* Plays */}
                    <div className="text-right w-24">
                      <div className="font-bold text-green-400">{formatNumber((item as typeof TOP_GAMES[0]).plays)}</div>
                      <p className="text-xs text-gray-500">plays</p>
                    </div>

                    {/* Play Button */}
                    <Link
                      href={`/play/${i}`}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Play
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-500/30 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-orange-400" />
            <h2 className="text-3xl font-bold">Ready to climb the ranks?</h2>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Create your first game and start your journey to the top of the leaderboard!
          </p>
          <Link
            href="/create/chat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-bold text-lg"
          >
            <Sparkles className="w-5 h-5" />
            Start Creating Now
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
