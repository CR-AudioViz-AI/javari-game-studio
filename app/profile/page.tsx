'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Trophy,
  Gamepad2,
  Heart,
  Users,
  Star,
  Play,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Twitter,
  Edit3,
  Share2,
  Crown,
  Zap,
  Target,
  Flame,
  Award,
  TrendingUp,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

// Mock user data
const USER = {
  id: 'user_123',
  username: 'StarGamesDev',
  displayName: 'Alex Chen',
  avatar: '👨‍🚀',
  bio: 'Game creator & pixel art enthusiast. Building worlds one game at a time. 🎮✨',
  location: 'San Francisco, CA',
  website: 'https://stargames.dev',
  twitter: '@stargamesdev',
  joinedAt: '2024-06-15',
  isPro: true,
  isVerified: true,
  stats: {
    gamesCreated: 12,
    totalPlays: 1250000,
    followers: 8420,
    following: 156,
    likes: 45000,
    achievements: 24,
  },
  level: 42,
  xp: 8500,
  xpToNext: 10000,
  rank: 'Master Creator',
  streak: 15,
};

const ACHIEVEMENTS = [
  { id: 1, name: 'First Game', desc: 'Publish your first game', icon: '🎮', unlocked: true, rarity: 'common' },
  { id: 2, name: 'Viral Hit', desc: 'Get 100K plays on a game', icon: '🔥', unlocked: true, rarity: 'rare' },
  { id: 3, name: 'Million Plays', desc: 'Reach 1M total plays', icon: '🏆', unlocked: true, rarity: 'legendary' },
  { id: 4, name: 'Fan Favorite', desc: 'Get 10K likes', icon: '❤️', unlocked: true, rarity: 'epic' },
  { id: 5, name: 'Prolific Creator', desc: 'Publish 10 games', icon: '🎯', unlocked: true, rarity: 'rare' },
  { id: 6, name: 'Streak Master', desc: '30-day creation streak', icon: '🔥', unlocked: false, rarity: 'epic' },
  { id: 7, name: 'Community Star', desc: 'Get 5K followers', icon: '⭐', unlocked: true, rarity: 'rare' },
  { id: 8, name: 'Top 10 Creator', desc: 'Reach top 10 weekly', icon: '👑', unlocked: true, rarity: 'legendary' },
];

const USER_GAMES = [
  { id: 1, title: 'Cosmic Runner', plays: 450000, rating: 4.9, thumbnail: '🚀', color: 'from-purple-600 to-blue-600' },
  { id: 2, title: 'Gem Quest Saga', plays: 320000, rating: 4.8, thumbnail: '💎', color: 'from-pink-600 to-red-600' },
  { id: 3, title: 'Dragon Knight', plays: 280000, rating: 4.7, thumbnail: '🐉', color: 'from-orange-600 to-red-600' },
  { id: 4, title: 'Pixel Adventure', plays: 200000, rating: 4.6, thumbnail: '🎮', color: 'from-green-600 to-teal-600' },
];

const ACTIVITY = [
  { type: 'game', action: 'published', title: 'Cosmic Runner 2', time: '2 hours ago' },
  { type: 'achievement', action: 'unlocked', title: 'Million Plays', time: '1 day ago' },
  { type: 'follow', action: 'followed', title: 'PuzzleMaster', time: '2 days ago' },
  { type: 'like', action: 'liked', title: 'Space Defender X', time: '3 days ago' },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-orange-500',
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'games' | 'achievements' | 'activity'>('games');
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header Banner */}
      <div className="relative h-64 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, '-20%'],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}

        {/* Level Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${(USER.xp / USER.xpToNext) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 -mt-24">
        {/* Profile Card */}
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 p-1">
                  <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center text-6xl">
                    {USER.avatar}
                  </div>
                </div>
                
                {/* Pro Badge */}
                {USER.isPro && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Level Badge */}
                <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-sm font-bold shadow-lg">
                  Lv.{USER.level}
                </div>
              </motion.div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold">{USER.displayName}</h1>
                    {USER.isVerified && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-sm text-yellow-400">
                      {USER.rank}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-1">@{USER.username}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                      isFollowing 
                        ? 'bg-white/10 hover:bg-white/20 border border-white/20' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 my-4 max-w-xl">{USER.bio}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {USER.location}
                </span>
                <a href={USER.website} className="flex items-center gap-1 text-purple-400 hover:text-purple-300">
                  <LinkIcon className="w-4 h-4" />
                  {USER.website.replace('https://', '')}
                </a>
                <a href={`https://twitter.com/${USER.twitter.replace('@', '')}`} className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                  <Twitter className="w-4 h-4" />
                  {USER.twitter}
                </a>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(USER.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              {/* Streak */}
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-xl">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="font-bold text-orange-400">{USER.streak} day streak!</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-6 gap-4 mt-8 pt-8 border-t border-white/10">
            {[
              { label: 'Games', value: USER.stats.gamesCreated, icon: Gamepad2, color: 'text-purple-400' },
              { label: 'Total Plays', value: formatNumber(USER.stats.totalPlays), icon: Play, color: 'text-green-400' },
              { label: 'Followers', value: formatNumber(USER.stats.followers), icon: Users, color: 'text-blue-400' },
              { label: 'Following', value: USER.stats.following, icon: Users, color: 'text-gray-400' },
              { label: 'Likes', value: formatNumber(USER.stats.likes), icon: Heart, color: 'text-red-400' },
              { label: 'Achievements', value: USER.stats.achievements, icon: Trophy, color: 'text-yellow-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(['games', 'achievements', 'activity'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all capitalize ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Games Tab */}
          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {USER_GAMES.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/play/${game.id}`}>
                    <div className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all hover:scale-[1.02]">
                      <div className={`h-40 bg-gradient-to-br ${game.color} flex items-center justify-center relative`}>
                        <span className="text-7xl group-hover:scale-110 transition-transform">{game.thumbnail}</span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold">{game.title}</h3>
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Play className="w-4 h-4" />
                            {formatNumber(game.plays)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {game.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-4 gap-4"
            >
              {ACHIEVEMENTS.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative p-6 rounded-2xl border text-center transition-all ${
                    ach.unlocked
                      ? 'bg-white/5 border-white/10 hover:border-white/30'
                      : 'bg-black/30 border-white/5 opacity-50'
                  }`}
                >
                  {ach.unlocked && (
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${rarityColors[ach.rarity as keyof typeof rarityColors]}`}>
                      {ach.rarity}
                    </div>
                  )}
                  <div className="text-4xl mb-3">{ach.icon}</div>
                  <h3 className="font-bold mb-1">{ach.name}</h3>
                  <p className="text-xs text-gray-500">{ach.desc}</p>
                  {!ach.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                      <span className="text-2xl">🔒</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {ACTIVITY.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className={`p-3 rounded-xl ${
                    item.type === 'game' ? 'bg-purple-500/20' :
                    item.type === 'achievement' ? 'bg-yellow-500/20' :
                    item.type === 'follow' ? 'bg-blue-500/20' :
                    'bg-red-500/20'
                  }`}>
                    {item.type === 'game' && <Gamepad2 className="w-5 h-5 text-purple-400" />}
                    {item.type === 'achievement' && <Trophy className="w-5 h-5 text-yellow-400" />}
                    {item.type === 'follow' && <Users className="w-5 h-5 text-blue-400" />}
                    {item.type === 'like' && <Heart className="w-5 h-5 text-red-400" />}
                  </div>
                  <div className="flex-1">
                    <p>
                      <span className="capitalize">{item.action}</span>{' '}
                      <span className="font-bold">{item.title}</span>
                    </p>
                    <p className="text-sm text-gray-500">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
