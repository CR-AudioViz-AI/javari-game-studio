'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  Play, 
  ExternalLink,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  gameReady?: boolean;
  templateId?: string;
  suggestions?: string[];
}

// Quick prompts for inspiration
const QUICK_PROMPTS = [
  "A platformer where a cat collects fish",
  "Space shooter with power-ups and boss battles",
  "Match-3 puzzle game with gems and combos",
  "Racing game with neon cars and boosts",
  "Zombie survival endless runner",
  "Educational math quiz for kids",
  "Fantasy RPG with turn-based combat",
  "Cookie clicker with upgrades",
];

// Game type cards
const GAME_TYPES = [
  { id: 'platformer', type: 'Platformer', icon: '🎮', desc: 'Jump and collect' },
  { id: 'match3', type: 'Puzzle', icon: '💎', desc: 'Match and score' },
  { id: 'shooter', type: 'Shooter', icon: '🚀', desc: 'Blast enemies' },
  { id: 'racing', type: 'Racing', icon: '🏎️', desc: 'Speed through' },
  { id: 'endless-runner', type: 'Runner', icon: '🏃', desc: 'Run forever' },
  { id: 'quiz', type: 'Quiz', icon: '🧠', desc: 'Test knowledge' },
  { id: 'rpg', type: 'RPG', icon: '⚔️', desc: 'Battle & level' },
  { id: 'tower-defense', type: 'Tower Defense', icon: '🏰', desc: 'Defend waves' },
  { id: 'idle', type: 'Idle', icon: '🍪', desc: 'Click & upgrade' },
  { id: 'card-game', type: 'Cards', icon: '🃏', desc: 'Build decks' },
];

function ChatContent() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedGameId, setGeneratedGameId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with template if provided
  useEffect(() => {
    if (templateParam) {
      const templateName = GAME_TYPES.find(t => t.id === templateParam)?.type || templateParam;
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `👋 Hi! I see you want to customize the **${templateName}** template!

I can help you personalize this game. What changes would you like to make?

Here are some ideas:
• Change the theme (space, underwater, fantasy)
• Modify colors and art style
• Add new features or power-ups
• Adjust difficulty
• Change characters or objects

Just describe what you want, and I'll make it happen!`,
        timestamp: new Date(),
        templateId: templateParam,
        suggestions: [
          'Make it space-themed',
          'Add more power-ups',
          'Change to pixel art style',
        ],
      }]);
      setShowQuickStart(false);
    } else {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `👋 Hi! I'm **Javari**, your AI game creator!

Tell me about the game you want to build. Be as simple or detailed as you like:

**Simple:** "A platformer where a bunny hops"
**Detailed:** "An RPG with turn-based combat and a fantasy story"

What would you like to create? 🎮`,
        timestamp: new Date(),
        suggestions: QUICK_PROMPTS.slice(0, 3),
      }]);
    }
  }, [templateParam]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = async (content: string = input) => {
    if (!content.trim() || isLoading) return;

    setShowQuickStart(false);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          templateId: templateParam || messages.find(m => m.templateId)?.templateId,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        gameReady: data.gameReady,
        templateId: data.templateId,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If game is ready, start generation animation
      if (data.gameReady && data.templateId) {
        setIsGenerating(true);
        setTimeout(() => {
          setGeneratedGameId(data.templateId);
          setIsGenerating(false);
          
          // Add completion message
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `🎉 **Your game is ready!**

I've created your customized game based on the **${GAME_TYPES.find(t => t.id === data.templateId)?.type || data.templateId}** template.

Click the "Play Game" button below to try it out! 

Want to make more changes? Just tell me what you'd like to adjust.`,
            timestamp: new Date(),
            gameReady: true,
            templateId: data.templateId,
          }]);
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble processing that. Could you try again?',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick start game type selection
  const handleQuickStart = (gameType: typeof GAME_TYPES[0]) => {
    setShowQuickStart(false);
    sendMessage(`I want to create a ${gameType.type.toLowerCase()} game`);
  };

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/50 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/create/template"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Templates
          </Link>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-bold">Javari AI</span>
          </div>

          <Link
            href="/create/chat"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New
          </Link>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-y-auto">
        {/* Quick start game selector */}
        <AnimatePresence>
          {showQuickStart && messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <h2 className="text-center text-lg text-gray-400 mb-4">Or pick a game type to start:</h2>
              <div className="grid grid-cols-5 gap-3">
                {GAME_TYPES.map(game => (
                  <button
                    key={game.id}
                    onClick={() => handleQuickStart(game)}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl transition-all group"
                  >
                    <div className="text-3xl mb-2">{game.icon}</div>
                    <div className="text-sm font-medium">{game.type}</div>
                    <div className="text-xs text-gray-500">{game.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 backdrop-blur-sm'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Javari</span>
                  </div>
                )}
                
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                  {message.content.split('\n').map((line, i) => {
                    let formattedLine = line;
                    formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
                    return (
                      <p 
                        key={i} 
                        className="mb-1"
                        dangerouslySetInnerHTML={{ __html: formattedLine }}
                      />
                    );
                  })}
                </div>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(suggestion)}
                        className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-full text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Play game button */}
                {message.gameReady && message.templateId && (
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/templates/${message.templateId}`}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg font-semibold transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Play Game
                    </Link>
                    <Link
                      href={`/templates/${message.templateId}`}
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Javari is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Game generation animation */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center my-8"
            >
              <div className="p-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-500/30 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-6xl mb-4"
                >
                  🎮
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Building Your Game...</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    ✅ Generating game mechanics...
                  </motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    ✅ Creating visual assets...
                  </motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                    ✅ Adding sound effects...
                  </motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                    ⏳ Finalizing...
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 p-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your game idea..."
              rows={1}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-2">
            Javari AI can make mistakes. Games are generated from templates.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatCreatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
