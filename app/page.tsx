'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Wand2, 
  Mic, 
  MessageSquare, 
  Layout, 
  Upload,
  Play,
  Users,
  TrendingUp,
  Star,
  Zap,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

// Featured games showcase
const FEATURED_GAMES = [
  {
    id: 'dragon-quest',
    title: 'Dragon Quest Adventure',
    creator: 'GameMaster_Pro',
    plays: 45000,
    rating: 4.8,
    image: '/games/dragon-quest.png',
    category: 'RPG',
  },
  {
    id: 'speed-racer',
    title: 'Neon Speed Racer',
    creator: 'RacingFan2025',
    plays: 32000,
    rating: 4.6,
    image: '/games/speed-racer.png',
    category: 'Racing',
  },
  {
    id: 'puzzle-master',
    title: 'Puzzle Master 3000',
    creator: 'BrainTeaser',
    plays: 28000,
    rating: 4.9,
    image: '/games/puzzle-master.png',
    category: 'Puzzle',
  },
  {
    id: 'zombie-survival',
    title: 'Zombie Apocalypse',
    creator: 'HorrorGamer',
    plays: 56000,
    rating: 4.7,
    image: '/games/zombie.png',
    category: 'Action',
  },
];

// Game categories
const CATEGORIES = [
  { name: 'Platformer', icon: '🎮', count: 2500, color: 'from-blue-500 to-cyan-500' },
  { name: 'Puzzle', icon: '🧩', count: 1800, color: 'from-purple-500 to-pink-500' },
  { name: 'RPG', icon: '⚔️', count: 1200, color: 'from-red-500 to-orange-500' },
  { name: 'Racing', icon: '🏎️', count: 900, color: 'from-green-500 to-emerald-500' },
  { name: 'Shooter', icon: '🔫', count: 1500, color: 'from-yellow-500 to-amber-500' },
  { name: 'Strategy', icon: '♟️', count: 800, color: 'from-indigo-500 to-violet-500' },
  { name: 'Sports', icon: '⚽', count: 600, color: 'from-teal-500 to-cyan-500' },
  { name: 'Educational', icon: '📚', count: 400, color: 'from-pink-500 to-rose-500' },
];

// Creation methods
const CREATION_METHODS = [
  {
    id: 'voice',
    title: 'Voice Create',
    description: 'Speak your game idea and watch it come to life',
    icon: Mic,
    color: 'from-red-500 to-pink-500',
    href: '/create/voice',
  },
  {
    id: 'chat',
    title: 'Chat with Javari',
    description: 'Describe your game in a conversation with our AI',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    href: '/create/chat',
  },
  {
    id: 'template',
    title: 'Start from Template',
    description: 'Choose from 50+ professional templates',
    icon: Layout,
    color: 'from-green-500 to-emerald-500',
    href: '/create/template',
  },
  {
    id: 'upload',
    title: 'Upload Design Doc',
    description: 'Upload your game design and we\'ll build it',
    icon: Upload,
    color: 'from-purple-500 to-violet-500',
    href: '/create/upload',
  },
];

export default function HomePage() {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Powered by Javari AI • 11 AI Brains</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Describe Your Dream Game.
              <br />
              <span className="text-4xl md:text-6xl">We Build It.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              From simple kid games to complex multiplayer experiences.
              Just describe what you want in plain English.
              <span className="text-purple-400 font-semibold"> No coding required.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/create/chat"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                <Wand2 className="w-5 h-5" />
                Start Creating Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-semibold text-lg transition-all"
              >
                <Play className="w-5 h-5" />
                Browse Games
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white">10,000+</div>
                <div className="text-gray-400">Games Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-gray-400">Templates</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">5,000+</div>
                <div className="text-gray-400">Creators</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">70%</div>
                <div className="text-gray-400">Revenue Share</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Creation Methods */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Four Ways to Create</h2>
            <p className="text-xl text-gray-400">Choose the method that works best for you</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREATION_METHODS.map((method, i) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={method.href}
                  className="block p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <method.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                  <p className="text-gray-400">{method.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Every Genre Imaginable</h2>
            <p className="text-xl text-gray-400">Build platformers, RPGs, puzzles, racing games, and more</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/marketplace/${cat.name.toLowerCase()}`}
                  className={`block p-6 bg-gradient-to-br ${cat.color} rounded-2xl hover:scale-105 transition-transform`}
                >
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <div className="font-semibold text-lg">{cat.name}</div>
                  <div className="text-white/70 text-sm">{cat.count.toLocaleString()} games</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Games</h2>
              <p className="text-gray-400">Top games created by our community</p>
            </div>
            <Link
              href="/marketplace"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_GAMES.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                <Link
                  href={`/play/${game.id}`}
                  className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all"
                >
                  {/* Game thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-purple-900 to-blue-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gamepad2 className="w-12 h-12 text-white/30" />
                    </div>
                    {hoveredGame === game.id && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="px-4 py-2 bg-purple-600 rounded-lg font-semibold flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Play Now
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs">
                      {game.category}
                    </div>
                  </div>

                  {/* Game info */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{game.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">by {game.creator}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        {game.rating}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Users className="w-4 h-4" />
                        {(game.plays / 1000).toFixed(1)}K
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">From idea to playable game in minutes</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Describe Your Game',
                description: 'Tell Javari AI what kind of game you want. Be as simple or detailed as you like.',
                icon: MessageSquare,
              },
              {
                step: '2',
                title: 'AI Builds It',
                description: 'Javari generates code, graphics, sounds, levels - everything your game needs.',
                icon: Wand2,
              },
              {
                step: '3',
                title: 'Play & Publish',
                description: 'Test your game instantly. Publish to the marketplace and start earning.',
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center relative">
                    <item.icon className="w-10 h-10 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 translate-x-1/2 w-16">
                    <ArrowRight className="w-8 h-8 text-purple-500/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Revenue */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Earn Money From Your Games</h2>
            <p className="text-xl text-gray-300 mb-8">
              Get <span className="text-yellow-400 font-bold">70% revenue share</span> on every play.
              Popular creators earn $1,000+ per month.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Your Game Plays', value: '10,000', sub: 'monthly plays' },
                { label: 'Credits per Play', value: '2', sub: 'average' },
                { label: 'Your Earnings', value: '$1,120', sub: 'per month' },
              ].map((stat) => (
                <div key={stat.label} className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                  <div className="text-sm text-purple-400">{stat.sub}</div>
                </div>
              ))}
            </div>

            <Link
              href="/create/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Start Earning Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your Dream Game?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of creators building amazing games with Javari AI.
              No coding. No experience. Just your imagination.
            </p>
            <Link
              href="/create/chat"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-semibold text-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              <Wand2 className="w-6 h-6" />
              Create Your First Game Free
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
