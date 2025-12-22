'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  MessageCircle,
  Send,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Search,
  ExternalLink,
  Mail,
  Phone,
  Bot
} from 'lucide-react';
import { ECOSYSTEM_CONFIG } from '@/lib/ecosystem';

const FAQ_ITEMS = [
  {
    category: 'Getting Started',
    items: [
      { q: 'How do I create my first game?', a: 'Click "Create Game" and choose a template or describe your game to Javari AI.' },
      { q: 'What templates are available?', a: 'We offer 10 templates: Platformer, Puzzle, Shooter, Racing, Runner, Quiz, RPG, Tower Defense, Idle, and Card games.' },
      { q: 'How do I publish my game?', a: 'From your dashboard, click "Publish" on any game. Fill in the details and submit for review.' },
    ],
  },
  {
    category: 'Credits & Billing',
    items: [
      { q: 'How much do credits cost?', a: 'Packages start at $9.99 for 100 credits. Larger packages offer bonus credits and better per-credit pricing.' },
      { q: 'Do credits expire?', a: 'No! Credits never expire on paid plans.' },
      { q: 'How do I get a refund?', a: 'Contact support within 30 days of purchase for unused credit refunds.' },
    ],
  },
  {
    category: 'Revenue & Payments',
    items: [
      { q: 'How much do I earn from my games?', a: 'Creators earn 70% of all revenue. Platform retains 30% for maintenance and services.' },
      { q: 'When do I get paid?', a: 'Payments are processed monthly on the 1st for the previous month\'s earnings (minimum $25).' },
      { q: 'What payment methods are supported?', a: 'PayPal, direct bank transfer (US), and Wise for international creators.' },
    ],
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'faq' | 'ticket' | 'contact'>('faq');
  const [ticketForm, setTicketForm] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ECOSYSTEM_CONFIG.supportCategories;

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm),
      });
      
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Failed to submit ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/30 to-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-purple-400" />
            Support Center
          </h1>
          <div className="w-32" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-400 mb-8">
            Find answers in our FAQ, chat with Javari AI, or submit a support ticket
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a
            href="https://javariai.com/chat?context=support"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-500/30 hover:border-purple-500 transition-all group"
          >
            <Bot className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Chat with Javari AI</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get instant answers 24/7 from our AI assistant
            </p>
            <span className="text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Chat <ExternalLink className="w-4 h-4" />
            </span>
          </a>

          <button
            onClick={() => setActiveTab('ticket')}
            className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/30 transition-all text-left"
          >
            <MessageCircle className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Submit a Ticket</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get help from our support team (24-48h response)
            </p>
            <span className="text-blue-400 flex items-center gap-1">
              Create Ticket <ChevronRight className="w-4 h-4" />
            </span>
          </button>

          <a
            href="mailto:support@craudiovizai.com"
            className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/30 transition-all"
          >
            <Mail className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-gray-400 text-sm mb-4">
              support@craudiovizai.com
            </p>
            <span className="text-green-400 flex items-center gap-1">
              Send Email <ExternalLink className="w-4 h-4" />
            </span>
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['faq', 'ticket', 'contact'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400'
              }`}
            >
              {tab === 'faq' ? 'FAQ' : tab === 'ticket' ? 'Submit Ticket' : 'Contact Info'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            {FAQ_ITEMS.map((section, i) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h2 className="text-xl font-bold mb-4">{section.category}</h2>
                <div className="space-y-3">
                  {section.items.map((item, j) => (
                    <div key={j} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h3 className="font-semibold mb-2">{item.q}</h3>
                      <p className="text-gray-400 text-sm">{item.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'ticket' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {submitted ? (
              <div className="text-center p-12 bg-green-500/10 border border-green-500/30 rounded-2xl">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Ticket Submitted!</h2>
                <p className="text-gray-400 mb-6">
                  We've received your request and will respond within 24-48 hours.
                  Check your email for updates.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setTicketForm({ category: '', subject: '', description: '', priority: 'medium' });
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h2 className="text-xl font-bold mb-6">Create Support Ticket</h2>

                  {/* Category */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setTicketForm(prev => ({ ...prev, category: cat.id }))}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            ticketForm.category === cat.id
                              ? 'bg-purple-600/20 border-purple-500'
                              : 'bg-black/30 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <div className="text-xs mt-1">{cat.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Please provide as much detail as possible..."
                      rows={6}
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      required
                    />
                  </div>

                  {/* Priority */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <div className="flex gap-2">
                      {[
                        { id: 'low', label: 'Low', color: 'green' },
                        { id: 'medium', label: 'Medium', color: 'yellow' },
                        { id: 'high', label: 'High', color: 'orange' },
                        { id: 'urgent', label: 'Urgent', color: 'red' },
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setTicketForm(prev => ({ ...prev, priority: p.id }))}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            ticketForm.priority === p.id
                              ? `bg-${p.color}-500/20 border-${p.color}-500`
                              : 'bg-black/30 border-white/10'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !ticketForm.category || !ticketForm.subject || !ticketForm.description}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {activeTab === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-purple-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-400">support@craudiovizai.com</p>
                    <p className="text-gray-400">billing@craudiovizai.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">Response Time</h3>
                    <p className="text-gray-400">24-48 hours for tickets</p>
                    <p className="text-gray-400">Instant for Javari AI chat</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-6">Company Information</h2>
              
              <div className="space-y-2 text-gray-400">
                <p><strong className="text-white">CR AudioViz AI, LLC</strong></p>
                <p>Florida S-Corporation</p>
                <p>EIN: 93-4520864</p>
                <p className="pt-4 text-sm">
                  "Your Story. Our Design"<br />
                  "Everyone connects. Everyone wins."
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
