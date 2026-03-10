"use client";
import React, { useState, useRef, useEffect } from 'react';
import { DomoAvatar, DomoState } from './DomoAvatar';
import { MiniGraph, GraphNode, GraphEdge } from './MiniGraph';
import { Send, Hash, FileText } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'domo';
  content: string;
  graph?: { nodes: GraphNode[]; edges: GraphEdge[] };
}

export const DomoChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'domo',
    content: "Hello. I am Domo, your Design Thinking Facilitator. I'm connected to the project graph and ready to orchestrate."
  }]);
  const [input, setInput] = useState('');
  const [domoState, setDomoState] = useState<DomoState>('Welcoming');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setDomoState('Thinking');

    try {
      // Mocking the API route call to the orchestrator
      const response = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.content }),
      });

      if (!response.ok) throw new Error('Failed to fetch from orchestrator');

      // Simple mock streaming/response logic for now assuming a single JSON back instead of true SSE
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'r',
        role: 'domo',
        content: data.text || "I have processed your request.",
        graph: data.graph // MiniGraph payload
      }]);
      setDomoState('Waiting');
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'e',
        role: 'domo',
        content: "Error: Could not connect to the orchestrator."
      }]);
      setDomoState('Tired');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <DomoAvatar state={domoState} className="scale-75 -my-2" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Domo</h2>
        </div>
        <div className="flex gap-2 text-xs">
           <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
             <Hash className="w-3 h-3"/> Graph Active
           </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-canary-yellow text-zinc-900' : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white shadow-sm'}`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              
              {/* Conditional Mini-Graph Injection */}
              {msg.graph && msg.graph.nodes && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1">
                    <Hash className="w-3 h-3"/> Topological Context
                  </p>
                  <MiniGraph nodes={msg.graph.nodes} edges={msg.graph.edges} />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-zinc-900 border-none rounded-full text-sm focus:ring-2 focus:ring-electric-blue outline-none text-gray-900 dark:text-white placeholder-gray-500"
            placeholder="Ask Domo to audit or generate..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-1.5 p-1.5 bg-electric-blue text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 text-center">
            <button className="text-[10px] text-gray-400 hover:text-electric-blue flex items-center justify-center gap-1 w-full uppercase tracking-wider font-semibold">
                <FileText className="w-3 h-3" /> Open Floating Prompt Builder
            </button>
        </div>
      </div>
    </div>
  );
};
