/**
 * Chat Area Component for JARVIS
 * Displays conversation messages with animations
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TranslationManager } from '@/lib/translations';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatAreaProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  onSendMessage: (message: string) => void;
  onClearMessages: () => void;
  className?: string;
}

export function ChatArea({
  messages,
  isProcessing,
  onSendMessage,
  onClearMessages,
  className = ''
}: ChatAreaProps) {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 300, 
        damping: 20 
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Header */}
      <div className="flex justify-between items-center p-4 border-b border-cyan-400/20">
        <h2 className="text-lg font-semibold text-cyan-400">
          {TranslationManager.t('jarvis')}
        </h2>
        {messages.length > 0 && (
          <Button
            onClick={onClearMessages}
            variant="outline"
            size="sm"
            className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
          >
            {TranslationManager.t('clearHistory')}
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="mb-4">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-400/20 flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(0, 255, 255, 0.3)',
                      '0 0 40px rgba(0, 255, 255, 0.5)',
                      '0 0 20px rgba(0, 255, 255, 0.3)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cyan-400"
                  >
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1"/>
                    <path d="M3 12v6c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-6"/>
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                {TranslationManager.t('welcomeBack')}
              </h3>
              <p className="text-cyan-400/70">
                {TranslationManager.t('howCanIHelp')}
              </p>
            </motion.div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-cyan-400/10 border-cyan-400/30'
                    : 'bg-purple-400/10 border-purple-400/30'
                } backdrop-blur-sm`}>
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        message.role === 'user' ? 'bg-cyan-400' : 'bg-purple-400'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium mb-1 ${
                          message.role === 'user' ? 'text-cyan-400' : 'text-purple-400'
                        }`}>
                          {message.role === 'user' 
                            ? TranslationManager.t('you')
                            : TranslationManager.t('jarvis')
                          }
                        </p>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <p className="text-xs text-white/50 mt-2">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Processing indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <Card className="bg-purple-400/10 border-purple-400/30 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-400 mb-1">
                      {TranslationManager.t('jarvis')}
                    </p>
                    <div className="flex items-center space-x-1">
                      <motion.div
                        className="flex space-x-1"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </motion.div>
                      <span className="text-sm text-purple-400/70 ml-2">
                        {TranslationManager.t('processing')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-cyan-400/20">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={TranslationManager.t('typeMessage')}
            disabled={isProcessing}
            className="flex-1 bg-transparent border-cyan-400/30 text-white placeholder-white/50 focus:border-cyan-400"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/50 text-cyan-400"
          >
            {TranslationManager.t('send')}
          </Button>
        </form>
      </div>
    </div>
  );
}