import React, { useRef, useEffect } from 'react';
import {
  GameSettings,
  BoardThemeId,
  PieceStyleId,
  LearningCategory,
  LearningDifficulty,
  ChallengeFrequency,
  PlayerProfile,
  VoiceMode,
} from '../types/chess';
import { THEMES } from '../services/themes';
import { sounds } from '../services/audio';
import { X, Volume2, VolumeX, Sparkles, Palette, GraduationCap, User, Music, HelpCircle } from 'lucide-react';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  player1: PlayerProfile;
  onUpdatePlayer1: (p: PlayerProfile) => void;
  player2: PlayerProfile;
  onUpdatePlayer2: (p: PlayerProfile) => void;
  isPvpMode: boolean;
}

const AVATAR_CHOICES = ['🦁', '🚀', '🧙', '🦄', '🤖', '👑', '🦖', '🐱', '🐶', '🦊', '🐼', '🐯'];

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  player1,
  onUpdatePlayer1,
  player2,
  onUpdatePlayer2,
  isPvpMode,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSoundToggle = () => {
    const next = !settings.soundEnabled;
    sounds.setSoundEnabled(next);
    if (next) sounds.playTap();
    onUpdateSettings({ ...settings, soundEnabled: next });
  };

  const handleVoiceModeChange = (mode: VoiceMode) => {
    sounds.setVoiceMode(mode);
    sounds.playTap();
    if (mode === 'chimes') {
      sounds.playBotChime('gizmo');
    } else if (mode === 'natural') {
      sounds.speak('Hello! I am ready to play chess with you!');
    }
    onUpdateSettings({ ...settings, voiceMode: mode });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="customize-title"
      className="fixed inset-0 z-50 p-0 m-auto bg-transparent backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm max-w-xl w-[92vw] overflow-visible focus:outline-none"
    >
      <div className="bg-gradient-to-b from-amber-50 via-white to-amber-100 rounded-3xl shadow-2xl border-4 border-amber-400 p-6 max-h-[88vh] overflow-y-auto animate-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h2 id="customize-title" className="text-2xl font-black font-bubble text-slate-800">
              Customize Your Game
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 py-4">
          {/* Section 1: Player Profiles */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bubble font-bold text-lg text-slate-800">Player 1 (White)</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-amber-200 mb-4">
              <input
                type="text"
                value={player1.name}
                onChange={(e) => onUpdatePlayer1({ ...player1, name: e.target.value })}
                placeholder="Player 1 Name"
                className="flex-1 min-w-[140px] px-3 py-1.5 rounded-xl border border-slate-300 font-bubble text-base focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {AVATAR_CHOICES.slice(0, 6).map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => onUpdatePlayer1({ ...player1, avatar: av })}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all ${
                      player1.avatar === av
                        ? 'bg-amber-300 ring-2 ring-amber-500 scale-110 shadow-sm'
                        : 'bg-slate-100 hover:bg-amber-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {isPvpMode && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bubble font-bold text-lg text-slate-800">Player 2 (Black)</h3>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-amber-200">
                  <input
                    type="text"
                    value={player2.name}
                    onChange={(e) => onUpdatePlayer2({ ...player2, name: e.target.value })}
                    placeholder="Player 2 Name"
                    className="flex-1 min-w-[140px] px-3 py-1.5 rounded-xl border border-slate-300 font-bubble text-base focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                  <div className="flex items-center gap-1 overflow-x-auto py-1">
                    {AVATAR_CHOICES.slice(6, 12).map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => onUpdatePlayer2({ ...player2, avatar: av })}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all ${
                          player2.avatar === av
                            ? 'bg-amber-300 ring-2 ring-amber-500 scale-110 shadow-sm'
                            : 'bg-slate-100 hover:bg-amber-100'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Board Themes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-5 h-5 text-pink-500" />
              <h3 className="font-bubble font-bold text-lg text-slate-800">Board Theme</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.values(THEMES).map((theme) => {
                const isSelected = settings.boardTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      onUpdateSettings({ ...settings, boardTheme: theme.id as BoardThemeId });
                    }}
                    className={`p-3 rounded-2xl border-2 text-left font-bubble transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-200/80 shadow-md scale-102 ring-2 ring-amber-400'
                        : 'border-slate-200 bg-white hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full ${theme.badge}`}></div>
                      <span className="font-bold text-sm text-slate-800">{theme.name}</span>
                    </div>
                    {/* Mini board preview */}
                    <div className="grid grid-cols-4 grid-rows-2 h-7 rounded-lg overflow-hidden border border-slate-300">
                      <div className={theme.lightSquare}></div>
                      <div className={theme.darkSquare}></div>
                      <div className={theme.lightSquare}></div>
                      <div className={theme.darkSquare}></div>
                      <div className={theme.darkSquare}></div>
                      <div className={theme.lightSquare}></div>
                      <div className={theme.darkSquare}></div>
                      <div className={theme.lightSquare}></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Piece Artwork & Recognition Badges */}
          <div>
            <h3 className="font-bubble font-bold text-lg text-slate-800 mb-3">Piece Artwork Style</h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { id: 'cartoon', name: 'High-Clarity Vectors 🎨', desc: 'Distinct silhouettes & cross' },
                { id: 'animals', name: 'Animal Pals 🦁', desc: 'Cute animal emojis' },
                { id: 'classic', name: 'Classic Bold 🏛️', desc: 'Crisp Staunton icons' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    onUpdateSettings({ ...settings, pieceStyle: style.id as PieceStyleId });
                  }}
                  className={`p-3 rounded-2xl border-2 text-center transition-all ${
                    settings.pieceStyle === style.id
                      ? 'border-amber-500 bg-amber-200/80 shadow-md ring-2 ring-amber-400'
                      : 'border-slate-200 bg-white hover:bg-amber-50'
                  }`}
                >
                  <p className="font-bubble font-bold text-sm text-slate-800">{style.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Learning Subject & Difficulty */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bubble font-bold text-lg text-slate-800">Learning Challenges</h3>
            </div>

            <div className="space-y-3">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Subject Focus
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'math', label: 'Math 🔢' },
                    { id: 'reading', label: 'Words 📖' },
                    { id: 'chess', label: 'Chess Tips ♟️' },
                    { id: 'mixed', label: 'Mixed Fun 🎲' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        onUpdateSettings({
                          ...settings,
                          learningCategory: sub.id as LearningCategory,
                        });
                      }}
                      className={`py-2 px-3 rounded-xl border text-sm font-bubble font-bold transition-all ${
                        settings.learningCategory === sub.id
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Skill Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'easy', label: 'Pre-K & Kinder 🌱', sub: 'Counting, Shapes & 3-letter words' },
                    { id: 'medium', label: 'Elementary 🌿', sub: 'Math to 25, Opposites & Rhymes' },
                    { id: 'hard', label: 'Junior Master 🌳', sub: 'Times tables, Division & Vocab' },
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        onUpdateSettings({
                          ...settings,
                          learningDifficulty: diff.id as LearningDifficulty,
                        });
                      }}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        settings.learningDifficulty === diff.id
                          ? 'bg-amber-400 text-amber-950 border-amber-500 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      <p className="font-bubble text-xs font-bold">{diff.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{diff.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Question Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'every_move', label: 'Every Move' },
                    { id: 'captures_only', label: 'On Captures' },
                    { id: 'every_two_moves', label: 'Every 2 Moves' },
                    { id: 'off', label: 'Freeplay (Off)' },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        onUpdateSettings({
                          ...settings,
                          challengeFrequency: freq.id as ChallengeFrequency,
                        });
                      }}
                      className={`py-1.5 px-2 rounded-xl border text-xs font-bubble font-bold transition-all ${
                        settings.challengeFrequency === freq.id
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Voice Mode & Audio Settings */}
          <div>
            <h3 className="font-bubble font-bold text-lg text-slate-800 mb-3">Sound & Voices</h3>
            <div className="space-y-3">
              {/* Voice Mode Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Bot Voice / Audio Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'natural',
                      label: 'Natural Voice 🗣️',
                      desc: 'Clear human reading',
                    },
                    {
                      id: 'chimes',
                      label: 'Cute Chimes Only 🎵',
                      desc: 'Playful musical tones (No TTS)',
                    },
                    {
                      id: 'off',
                      label: 'Voice Mute 🔇',
                      desc: 'Silent bots',
                    },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleVoiceModeChange(v.id as VoiceMode)}
                      className={`p-2.5 rounded-2xl border text-center transition-all ${
                        settings.voiceMode === v.id
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50'
                      }`}
                    >
                      <p className="font-bubble text-xs font-bold">{v.label}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">{v.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound FX Toggle */}
              <div className="bg-white p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="font-bubble font-bold text-sm text-slate-800">Move & Win Sound Effects</p>
                  <p className="text-xs text-slate-500">Board moves, captures, check fanfare & victory melody</p>
                </div>
                <button
                  type="button"
                  onClick={handleSoundToggle}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bubble text-xs font-bold border transition-all ${
                    settings.soundEnabled
                      ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm'
                      : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{settings.soundEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="pt-4 border-t border-amber-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bubble font-black text-base shadow-md transition-all active:scale-95"
          >
            Save & Return to Game 🌟
          </button>
        </div>
      </div>
    </dialog>
  );
};
