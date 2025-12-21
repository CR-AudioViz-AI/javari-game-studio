'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Loader2, 
  Play, 
  Download,
  Settings,
  Wand2,
  Image,
  Music,
  Gamepad2,
  ChevronRight,
  Check,
  X
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  gamePreview?: GamePreview;
  suggestions?: string[];
}

interface GamePreview {
  id: string;
  title: string;
  type: string;
  status: 'generating' | 'ready' | 'error';
  previewUrl?: string;
}

// Quick prompts for inspiration
const QUICK_PROMPTS = [
  "A platformer game where a cat collects fish",
  "Space shooter with upgrades and boss battles",
  "Match-3 puzzle game with gems and combos",
  "Racing game with power-ups on crazy tracks",
  "Zombie survival game with crafting",
  "Educational math game for kids",
];

// Game type suggestions
const GAME_TYPES = [
  { type: 'Platformer', icon: '🎮', examples: 'Mario, Celeste, Hollow Knight' },
  { type: 'Puzzle', icon: '🧩', examples: 'Tetris, Candy Crush, Portal' },
  { type: 'Shooter', icon: '🔫', examples: 'Space Invaders, Enter the Gungeon' },
  { type: 'Racing', icon: '🏎️', examples: 'Mario Kart, Need for Speed' },
  { type: 'RPG', icon: '⚔️', examples: 'Pokemon, Final Fantasy, Zelda' },
  { type: 'Strategy', icon: '♟️', examples: 'Chess, Tower Defense, Civilization' },
];

export default function ChatCreatorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hi! I'm Javari, your AI game creator assistant.

Tell me about the game you want to build. You can be as simple or detailed as you like:

**Simple:** "A platformer where a bunny hops over obstacles"
**Detailed:** "An RPG with turn-based combat, inventory system, multiple characters, and a fantasy storyline about saving a kingdom"

I'll ask clarifying questions if needed, then build your complete game!

What would you like to create?`,
      timestamp: new Date(),
      suggestions: QUICK_PROMPTS.slice(0, 3),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentGame, setCurrentGame] = useState<GamePreview | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle voice input
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }
    setIsListening(!isListening);
    // Voice recognition logic would go here
  };

  // Send message to Javari
  const sendMessage = async (content: string = input) => {
    if (!content.trim() || isLoading) return;

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
      // Simulate AI response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Determine response based on conversation stage
      const response = generateAIResponse(content, messages.length);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        gamePreview: response.gamePreview,
        suggestions: response.suggestions,
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (response.gamePreview) {
        setCurrentGame(response.gamePreview);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI response (mock - replace with actual API)
  const generateAIResponse = (userInput: string, messageCount: number): {
    content: string;
    gamePreview?: GamePreview;
    suggestions?: string[];
  } => {
    const lowerInput = userInput.toLowerCase();

    // First message - understand game type
    if (messageCount <= 2) {
      return {
        content: `Great choice! 🎮 I understand you want to create: **${userInput}**

Let me ask a few questions to make it exactly how you want:

1. **Art Style:** Do you prefer pixel art, cartoon, realistic, or minimalist graphics?

2. **Difficulty:** Should it be easy (casual fun), medium (some challenge), or hard (for skilled players)?

3. **Length:** Quick sessions (2-5 minutes) or longer gameplay (15+ minutes)?

4. **Special Features:** Any must-have features? (multiplayer, achievements, leaderboards, story mode)

Feel free to answer any or all - I'll fill in sensible defaults for anything you skip!`,
        suggestions: [
          'Pixel art, medium difficulty, quick sessions',
          'Cartoon style, easy, with achievements',
          'Realistic graphics, hard mode, multiplayer',
        ],
      };
    }

    // After preferences - generate game
    if (messageCount <= 4) {
      return {
        content: `Perfect! I've got everything I need. 🚀

**Here's what I'm building:**
- **Game Type:** Platformer Adventure
- **Art Style:** Pixel art with vibrant colors
- **Features:** Progressive difficulty, power-ups, boss battles
- **Levels:** 10 unique levels with different themes
- **Music:** Chiptune soundtrack
- **Controls:** Keyboard + touch support

**Generating your game now...**

This usually takes 30-60 seconds. I'm creating:
✅ Game engine and mechanics
✅ Character sprites and animations
✅ Level designs
✅ Sound effects and music
✅ UI and menus
⏳ Putting it all together...`,
        gamePreview: {
          id: 'game_' + Date.now(),
          title: 'Pixel Adventure',
          type: 'Platformer',
          status: 'generating',
        },
      };
    }

    // Game ready
    return {
      content: `🎉 **Your game is ready!**

**Pixel Adventure** has been created with:
- 10 levels of increasing difficulty
- 5 unique power-ups
- 3 boss battles
- Full sound effects and music
- Touch and keyboard controls
- Save progress support

**What's next?**
- 🎮 **Play Now** - Test your game below
- ✏️ **Customize** - Adjust difficulty, graphics, or features
- 🌐 **Publish** - Share on the marketplace and start earning

Click "Play Now" to try your game, or tell me what you'd like to change!`,
      gamePreview: {
        id: 'game_' + Date.now(),
        title: 'Pixel Adventure',
        type: 'Platformer',
        status: 'ready',
        previewUrl: '/preview/game_' + Date.now(),
      },
      suggestions: [
        'Make it harder',
        'Add more levels',
        'Change to cartoon graphics',
        'Publish to marketplace',
      ],
    };
  };

  // Handle suggestion click
  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Game Types */}
      <div className="hidden lg:block w-64 bg-black/30 border-r border-white/10 p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">GAME TYPES</h3>
        <div className="space-y-2">
          {GAME_TYPES.map((type) => (
            <button
              key={type.type}
              onClick={() => setInput(`I want to create a ${type.type.toLowerCase()} game`)}
              className="w-full p-3 text-left bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{type.icon}</span>
                <span className="font-medium">{type.type}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{type.examples}</p>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">QUICK PROMPTS</h3>
          <div className="space-y-2">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="w-full p-2 text-left text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold">Javari Game Creator</h1>
              <p className="text-sm text-gray-400">Describe your dream game</p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${message.role === 'user' ? 'order-2' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <div className="prose prose-invert prose-sm max-w-none">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0">
                          {line.startsWith('**') ? (
                            <strong>{line.replace(/\*\*/g, '')}</strong>
                          ) : line.startsWith('✅') || line.startsWith('⏳') || line.startsWith('🎉') || line.startsWith('👋') || line.startsWith('🎮') || line.startsWith('🚀') ? (
                            <span>{line}</span>
                          ) : (
                            line
                          )}
                        </p>
                      ))}
                    </div>

                    {/* Game Preview */}
                    {message.gamePreview && (
                      <div className="mt-4 p-4 bg-black/30 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{message.gamePreview.title}</h4>
                            <p className="text-sm text-gray-400">{message.gamePreview.type}</p>
                          </div>
                          {message.gamePreview.status === 'generating' ? (
                            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                          ) : (
                            <Check className="w-5 h-5 text-green-400" />
                          )}
                        </div>

                        {message.gamePreview.status === 'ready' && (
                          <div className="aspect-video bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg mb-3 flex items-center justify-center">
                            <Gamepad2 className="w-16 h-16 text-white/30" />
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                            <Play className="w-4 h-4" />
                            Play Now
                          </button>
                          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.role === 'assistant' && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(suggestion)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <span className="text-gray-400">Javari is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <button
                onClick={toggleVoice}
                className={`p-3 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-gray-400'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your dream game..."
                  rows={1}
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-2">
              Powered by Javari AI • 11 AI Brains • CR AudioViz AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
