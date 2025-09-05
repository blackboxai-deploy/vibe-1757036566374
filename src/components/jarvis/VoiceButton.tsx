/**
 * Voice Button Component for JARVIS
 * Animated microphone button with recording states
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TranslationManager } from '@/lib/translations';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  className?: string;
}

export function VoiceButton({
  isListening,
  isProcessing,
  isSupported,
  onStartListening,
  onStopListening,
  className = ''
}: VoiceButtonProps) {
  const handleClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const getButtonState = () => {
    if (!isSupported) return 'unsupported';
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'ready';
  };

  const getButtonText = () => {
    switch (getButtonState()) {
      case 'unsupported':
        return TranslationManager.t('voiceNotSupported');
      case 'processing':
        return TranslationManager.t('processing');
      case 'listening':
        return TranslationManager.t('listening');
      default:
        return TranslationManager.t('ready');
    }
  };

  const buttonVariants = {
    ready: {
      scale: 1,
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
      backgroundColor: 'rgba(0, 255, 255, 0.1)'
    },
    listening: {
      scale: 1.1,
      boxShadow: '0 0 40px rgba(255, 0, 255, 0.6)',
      backgroundColor: 'rgba(255, 0, 255, 0.2)'
    },
    processing: {
      scale: 0.95,
      boxShadow: '0 0 30px rgba(255, 255, 0, 0.4)',
      backgroundColor: 'rgba(255, 255, 0, 0.1)'
    },
    unsupported: {
      scale: 1,
      boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
      backgroundColor: 'rgba(255, 0, 0, 0.1)'
    }
  };

  const pulseVariants = {
    ready: { opacity: 0 },
    listening: { 
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.2, 1],
      transition: { 
        repeat: Infinity, 
        duration: 1.5,
        ease: "easeInOut" as const
      }
    },
    processing: {
      opacity: [0.3, 0.7, 0.3],
      rotate: 360,
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "linear" as const
      }
    },
    unsupported: { opacity: 0 }
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        {/* Pulse animation background */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
          variants={pulseVariants}
          animate={getButtonState()}
        />
        
        {/* Main button */}
        <motion.div
          variants={buttonVariants}
          animate={getButtonState()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Button
            onClick={handleClick}
            disabled={!isSupported || isProcessing}
            className="w-24 h-24 rounded-full bg-transparent border-2 border-cyan-400 hover:border-cyan-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            <motion.div
              animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
              className="flex items-center justify-center"
            >
              {getButtonState() === 'listening' ? (
                <motion.div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full"
                      animate={{
                        height: [16, 32, 16],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              ) : getButtonState() === 'processing' ? (
                <motion.div
                  className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              ) : (
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
                  <path d="m12 1-9 5 9 5 9-5-9-5z"/>
                  <path d="m9 15-7-4l7-4 7 4-7 4z"/>
                  <path d="m12 18-9-5 9-5 9 5-9 5z"/>
                </svg>
              )}
            </motion.div>
          </Button>
        </motion.div>

        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-[-8px] rounded-full border border-cyan-400/20 pointer-events-none"
          animate={isListening ? {
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2]
          } : {}}
          transition={{ repeat: isListening ? Infinity : 0, duration: 2 }}
        />
      </div>

      {/* Status text */}
      <motion.p
        className="text-sm text-cyan-400/80 text-center font-medium min-h-[20px]"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        {getButtonText()}
      </motion.p>

      {/* Voice tip */}
      {!isListening && !isProcessing && isSupported && (
        <motion.p
          className="text-xs text-cyan-400/60 text-center max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {TranslationManager.t('startListening')}
        </motion.p>
      )}
    </div>
  );
}