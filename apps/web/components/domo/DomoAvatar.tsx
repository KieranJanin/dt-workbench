import React from 'react';
import { Ghost, Lightbulb, Zap, Loader2, Frown, Smile, HelpCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export type DomoState = 'Thinking' | 'Writing' | 'Waiting' | 'Fetching' | 'Surprised' | 'Devil' | 'Angel' | 'Tired' | 'Welcoming';

interface DomoAvatarProps {
  state: DomoState;
  className?: string;
}

export const DomoAvatar: React.FC<DomoAvatarProps> = ({ state, className = '' }) => {
  const renderIcon = () => {
    switch (state) {
      case 'Thinking':
        return <Loader2 className="w-8 h-8 animate-spin text-electric-blue" />;
      case 'Writing':
        return <Zap className="w-8 h-8 text-canary-yellow animate-pulse" />;
      case 'Fetching':
        return <Loader2 className="w-8 h-8 animate-spin text-bright-orange" />;
      case 'Surprised':
        return <HelpCircle className="w-8 h-8 text-neon-pink" />;
      case 'Devil':
        return <AlertTriangle className="w-8 h-8 text-bright-orange" />;
      case 'Angel':
        return <Smile className="w-8 h-8 text-lime-green" />;
      case 'Tired':
        return <Frown className="w-8 h-8 text-gray-500" />;
      case 'Welcoming':
        return <Ghost className="w-8 h-8 text-canary-yellow" />;
      case 'Waiting':
      default:
        return <Ghost className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-2 ${className}`}>
      <motion.div
        animate={
          state === 'Thinking' || state === 'Fetching'
            ? { y: [0, -5, 0] }
            : state === 'Surprised' || state === 'Devil'
            ? { scale: [1, 1.1, 1] }
            : { y: 0, scale: 1 }
        }
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full dark:bg-gray-800 shadow-md border-2 border-gray-200 dark:border-gray-700"
      >
        {/* The lightbulb floating above */}
        <motion.div 
          animate={{ opacity: state === 'Thinking' || state === 'Writing' ? [0.5, 1, 0.5] : 1 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-6 text-canary-yellow"
        >
          <Lightbulb className={`w-6 h-6 ${state === 'Devil' ? 'text-bright-orange' : ''}`} />
        </motion.div>
        
        {renderIcon()}
      </motion.div>
    </div>
  );
};
