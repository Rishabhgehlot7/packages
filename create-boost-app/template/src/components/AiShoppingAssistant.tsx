'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bot, X, Send, Sparkles, ShoppingBag, ArrowRight, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface RecommendedProduct {
  id: string;
  title: string;
  price: number;
  compareAtPrice: number;
  image: string;
  rating: number;
  inStock: boolean;
  category: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  products?: RecommendedProduct[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  'Bhai under ₹2,000 best streetwear dikhao',
  'Top selling hoodies konsi hain?',
  'Trending oversized t-shirts',
  'Winter jackets with heavy discounts',
];

export function AiShoppingAssistant() {
  const { addToCart, setIsCartDrawerOpen } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste bhai! 👋 Main tera personal AI Shopping Assistant hoon. Bata kya search kar raha hai? (e.g. "Bhai under ₹2,000 best oversized t-shirt chahiye")',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'Ye rahe aapke liye best recommendations:',
        products: data.products || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Arre bhai, network issue ho gaya. Please try again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-4 py-3 rounded-full shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Open AI Shopping Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="text-sm font-semibold tracking-wide">Ask AI Assistant</span>
        </button>
      )}

      {/* Assistant Modal / Window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[420px] max-h-[640px] h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-950 text-white p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/15">
                <Bot className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">Boost AI Shopper</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                    Online
                  </span>
                </div>
                <p className="text-xs text-gray-400">Personalized Shopping Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <span
                    className={`text-[10px] mt-1 block text-right ${
                      msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Recommended Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 w-full space-y-2.5">
                    {msg.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-sm flex items-center gap-3.5 hover:border-indigo-300 transition group"
                      >
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 truncate">
                            {prod.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-gray-900">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            {prod.compareAtPrice > prod.price && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{prod.compareAtPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-amber-600 font-medium">
                            ★ {prod.rating} rating
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              addToCart({
                                id: prod.id,
                                title: prod.title,
                                price: prod.price,
                                compareAtPrice: prod.compareAtPrice,
                                image: prod.image,
                                quantity: 1,
                              });
                              setIsCartDrawerOpen(true);
                            }}
                            className="bg-gray-900 hover:bg-black text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            Add
                          </button>
                          <Link
                            href={`/products/${prod.id}`}
                            className="text-indigo-600 hover:text-indigo-800 text-[11px] font-medium text-center hover:underline"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                <span>AI catalog search kar raha hai...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-gray-100/70 border-t border-gray-200/60 overflow-x-auto flex gap-1.5 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] whitespace-nowrap bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-gray-700 font-medium px-3 py-1.5 rounded-full border border-gray-200 transition shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your shopping question..."
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-900 transition placeholder:text-gray-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
