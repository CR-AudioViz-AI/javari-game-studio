'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  TrendingUp,
  Star,
  Play,
  Heart,
  Eye,
  Download,
  Crown,
  Sparkles,
  Gamepad2,
  Clock,
  ChevronRight,
  Trophy
} from 'lucide-react';

// Mock published games data
const FEATURED_GAMES = [
  {
    id: 'cosmic-runner',
    title: 'Cosmic Runner',
    creator: 'StarGamesDev',
    creatorAvatar: '👨‍🚀',
    thumbnail: '🚀',
    type: 'Endless Runner',
    plays: 125000,
    rating: 4.9,
    likes: 8500,
    featured: true,
    new: false,
    color: 'from-purple-600 to-blue-600',
  },
  {
    id: 'gem-quest',
    title: 'Gem Quest Saga',
    creator: 'PuzzleMaster',
    creatorAvatar: '💎',
    thumbnail: '💎',
    type: 'Match-3',
    plays: 98000,
    rating: 4.8,
    likes: 6200,
    featured: true,
    new: false,
    color: 'from-pink-600 to-red-600',
  },
  {
    id: 'dragon-knight',
    title: 'Dragon Knight RPG',
    creator: 'EpicQuests',
    creatorAvatar: '🐉',
    thumbnail: '⚔️',
    type: 'RPG',
    plays: 87000,
    rating: 4.7,
    likes: 5800,
    featured: true,
    new: true,
    color: 'from-orange-600 to-red-600',
  },
];

const ALL_GAMES = [
  ...FEATURED_GAMES,
  {
    id: 'neon-drift',
    title: 'Neon Drift Racing',
    creator: 'SpeedDemon',
    creatorAvatar: '🏎️',
    thumbnail: '🏎️',
    type: 'Racing',
    plays: 56000,
    rating: 4.6,
    likes: 3200,
    featured: false,
    new: true,
    color: 'from-cyan-600 to-blue-600',
  },
  {
    id: 'tower-siege',
    title: 'Tower Siege',
    creator: 'StrategyKing',
    creatorAvatar: '🏰',
    thumbnail: '🏰',
    type: 'Tower Defense',
    plays: 45000,
    rating: 4.5,
    likes: 2800,
    featured: false,
    new: false,
    color: 'from-green-600 to-teal-600',
  },
  {
    id: 'brain-quiz',
    title: 'Brain Quiz Master',
    creator: 'QuizWhiz',
    creatorAvatar: '🧠',
    thumbnail: '🧠',
    type: 'Quiz',
    plays: 78000,
    rating: 4.4,
    likes: 4100,
    featured: false,
    new: false,
    color: 'from-yellow-600 to-orange-600',
  },
  {
    id: 'pixel-jump',
    title: 'Pixel Jump Adventure',
    creator: 'RetroGamer',
    creatorAvatar: '🎮',
    thumbnail: '🎮',
    type: 'Platformer',
    plays: 34000,
    rating: 4.3,
    likes: 1900,
    featured: false,
    new: true,
    color: 'from-indigo-600 to-purple-600',
  },
  {
    id: 'card-legends',
    title: 'Card Legends Battle',
    creator: 'DeckMaster',
    creatorAvatar: '🃏',
    thumbnail: '🃏',
    type: 'Card Game',
    plays: 29000,
    rating: 4.6,
    likes: 2100,
    featured: false,
    new: false,
    color: 'from-slate-600 to-gray-600',
  },
  {
    id: 'cookie-tycoon',
    title: 'Cookie Tycoon',
    creator: 'IdleKing',
    creatorAvatar: '🍪',
    thumbnail: '🍪',
    type: 'Idle',
    plays: 156000,
    rating: 4.7,
    likes: 9200,
    featured: false,
    new: false,
    color: 'from-amber-600 to-yellow-600',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Games', icon: '🎮', count: ALL_GAMES.length },
  { id: 'platformer', name: 'Platformer', icon: '🏃', count: 1 },
  { id: 'puzzle', name: 'Puzzle', icon: '💎', count: 1 },
  { id: 'shooter', name: 'Shooter', icon: '🚀', count: 0 },
  { id: 'racing', name: 'Racing', icon: '🏎️', count: 1 },
  { id: 'rpg', name: 'RPG', icon: '⚔️', count: 1 },
  { id: 'strategy', name: 'Strategy', icon: '🏰', count: 1 },
  { id: 'idle', name: 'Idle', icon: '🍪', count: 1 },
  { id: 'quiz', name: 'Quiz', icon: '🧠', count: 1 },
  { id: 'card', name: 'Card', icon: '🃏', count: 1 },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'new' | 'rating'>('popular');

  const filteredGames = ALL_GAMES.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           game.type.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.plays - a.plays;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'new') return (b.new ? 1 : 0) - (a.new ? 1 : 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/30 to-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Gamepad2 className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold">Game Studio</span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games or creators..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/create/chat"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Create Game
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Games */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              Featured Games
            </h2>
            <Link href="/marketplace/featured" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_GAMES.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/play/${game.id}`}>
                  <div className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                    {/* Thumbnail */}
                    <div className={`h-48 bg-gradient-to-br ${game.color} flex items-center justify-center relative`}>
                      <span className="text-8xl group-hover:scale-110 transition-transform">
                        {game.thumbnail}
                      </span>
                      {game.new && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 rounded-full text-xs font-bold">
                          NEW
                        </span>
                      )}
                      <span className="absolute top-3 right-3 px-2 py-1 bg-yellow-500/90 rounded-full text-xs font-bold text-black flex items-center gap-1">
                        <Crown className="w-3 h-3" /> Featured
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-1">{game.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <span>{game.creatorAvatar}</span>
                        <span>{game.creator}</span>
                        <span className="text-gray-600">•</span>
                        <span>{game.type}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Play className="w-4 h-4 text-green-400" />
                            {formatNumber(game.plays)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {game.rating}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-red-400">
                          <Heart className="w-4 h-4" />
                          {formatNumber(game.likes)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-xs opacity-60">({cat.count})</span>
              </button>
            ))}
          </div>
        </section>

        {/* Sort & Filter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {selectedCategory === 'all' ? 'All Games' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
            <span className="text-gray-400 font-normal ml-2">({filteredGames.length})</span>
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            {(['popular', 'new', 'rating'] as const).map(sort => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  sortBy === sort ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {sort === 'popular' && <><TrendingUp className="w-4 h-4 inline mr-1" />Popular</>}
                {sort === 'new' && <><Clock className="w-4 h-4 inline mr-1" />New</>}
                {sort === 'rating' && <><Star className="w-4 h-4 inline mr-1" />Top Rated</>}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {filteredGames.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/play/${game.id}`}>
                <div className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all hover:scale-[1.02]">
                  {/* Thumbnail */}
                  <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center relative`}>
                    <span className="text-5xl group-hover:scale-110 transition-transform">
                      {game.thumbnail}
                    </span>
                    {game.new && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-500 rounded-full text-xs font-bold">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-bold truncate">{game.title}</h3>
                    <p className="text-sm text-gray-400 truncate">{game.creator}</p>

                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {formatNumber(game.plays)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        {game.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">No games found</h3>
            <p className="text-gray-400 mb-6">Try a different search or category</p>
            <Link
              href="/create/chat"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold"
            >
              <Sparkles className="w-5 h-5" />
              Be the first to create one!
            </Link>
          </div>
        )}

        {/* Top Creators */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Top Creators This Week
          </h2>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { name: 'StarGamesDev', avatar: '👨‍🚀', games: 12, plays: 450000, earnings: '$1,250' },
              { name: 'PuzzleMaster', avatar: '💎', games: 8, plays: 320000, earnings: '$890' },
              { name: 'IdleKing', avatar: '🍪', games: 5, plays: 280000, earnings: '$720' },
              { name: 'EpicQuests', avatar: '🐉', games: 3, plays: 190000, earnings: '$480' },
              { name: 'SpeedDemon', avatar: '🏎️', games: 7, plays: 156000, earnings: '$390' },
            ].map((creator, i) => (
              <div key={creator.name} className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                <div className="text-3xl mb-2">{creator.avatar}</div>
                <h3 className="font-bold">{creator.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{creator.games} games</p>
                <div className="text-sm">
                  <span className="text-green-400">{formatNumber(creator.plays)} plays</span>
                </div>
                <div className="text-sm text-yellow-400 font-bold mt-1">
                  {creator.earnings} earned
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  #{i + 1} this week
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 p-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-500/30 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Game?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of creators building and monetizing games. 
            Earn 70% of all revenue from your games!
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/create/chat"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start Creating
            </Link>
            <Link
              href="/creators"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold"
            >
              Learn More
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
