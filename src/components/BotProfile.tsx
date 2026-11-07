import React from 'react';
import { BotPersona } from '../types/chess';
import { Volume2, Sparkles } from 'lucide-react';
import { sounds } from '../services/audio';

interface BotProfileProps {
  bot: BotPersona;
  currentSpeech: string;
  isThinking: boolean;
  scoreAdvantage?: number;
}

export const BotProfile: React.FC<BotProfileProps> = ({
  bot,
  currentSpeech,
  isThinking,
}) => {
  const handleReplayVoice = () => {
    sounds.playTap();
    sounds.speak(currentSpeech, bot.pitch, bot.rate);
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-3xl border-3 border-amber-300 shadow-xl max-w-full">
      {/* Bot Avatar with Glow */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${bot.accentColor} flex items-center justify-center text-3xl sm:text-4xl shadow-md border-2 border-white transform transition-transform hover:scale-105`}
        >
          <span>{bot.avatar}</span>
        </div>
        {isThinking && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </span>
        )}
      </div>

      {/* Bot Details and Speech Bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-bubble font-black text-slate-800 text-base sm:text-lg truncate">
              {bot.name}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300 flex-shrink-0">
              {bot.difficulty}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReplayVoice}
            title="Hear bot speak"
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Speech Bubble */}
        <div className="relative bg-amber-50 rounded-2xl px-3 py-1.5 border border-amber-200 shadow-sm text-xs sm:text-sm text-slate-700 font-medium">
          {isThinking ? (
            <div className="flex items-center gap-2 text-amber-700">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span className="font-bubble">Thinking of a clever move...</span>
            </div>
          ) : (
            <p className="line-clamp-2 italic">"{currentSpeech}"</p>
          )}
        </div>
      </div>
    </div>
  );
};
