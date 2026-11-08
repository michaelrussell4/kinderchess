import React, { useState, useEffect, useRef } from 'react';
import { LearningChallenge } from '../types/chess';
import { sounds } from '../services/audio';
import { Volume2, Sparkles, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';

interface LearningModalProps {
  challenge: LearningChallenge | null;
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LearningModal: React.FC<LearningModalProps> = ({
  challenge,
  isOpen,
  onSuccess,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && challenge) {
      if (!dialog.open) {
        dialog.showModal();
      }
      setSelectedIdx(null);
      setIsCorrect(null);
      setShakeIdx(null);
      setHintVisible(false);

      // Speak question aloud for the child
      sounds.speak(challenge.speechText);
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen, challenge]);

  if (!isOpen || !challenge) return null;

  const handleSelectOption = (index: number) => {
    if (isCorrect === true) return; // already solved

    sounds.playTap();
    setSelectedIdx(index);

    if (index === challenge.correctIndex) {
      setIsCorrect(true);
      sounds.playCorrect();
      sounds.speak(challenge.explanation);
    } else {
      setIsCorrect(false);
      setShakeIdx(index);
      sounds.playWrong();
      sounds.speak("Oops! Almost there! Give it another try!");
      setTimeout(() => {
        setShakeIdx(null);
      }, 600);
    }
  };

  const handleReplayAudio = () => {
    sounds.playTap();
    sounds.speak(challenge.speechText);
  };

  const handleConfirmMove = () => {
    sounds.playTap();
    onSuccess();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="challenge-title"
      className="fixed inset-0 z-50 p-0 m-auto bg-transparent backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm max-w-lg w-[92vw] overflow-visible focus:outline-none"
    >
      <div className="bg-gradient-to-b from-amber-50 via-white to-amber-100 rounded-3xl shadow-2xl border-4 border-amber-400 p-6 md:p-8 transform transition-all animate-pop">
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-bold bg-amber-200 text-amber-900 border border-amber-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            {challenge.subject}
          </span>

          <button
            type="button"
            onClick={handleReplayAudio}
            title="Read question aloud"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Question</span>
          </button>
        </div>

        {/* Question Title */}
        <h2
          id="challenge-title"
          className="text-2xl md:text-3xl font-black text-slate-800 text-center mb-3 font-bubble tracking-wide drop-shadow-sm"
        >
          {challenge.question}
        </h2>

        {/* Subtext or visual hints */}
        {challenge.subtext && (
          <div className="bg-white/80 rounded-2xl p-3 md:p-4 mb-6 border-2 border-amber-200/80 shadow-inner text-center">
            <p className="text-base md:text-lg font-semibold text-slate-700">
              {challenge.subtext}
            </p>
          </div>
        )}

        {/* Multiple Choice Options */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
          {challenge.options.map((option, idx) => {
            const isSelected = selectedIdx === idx;
            const isThisCorrect = idx === challenge.correctIndex && isCorrect === true;
            const isThisWrong = isSelected && isCorrect === false;
            const isShaking = shakeIdx === idx;

            let btnStyle = 'bg-white hover:bg-amber-100/80 border-amber-300 text-slate-800 shadow-md';
            if (isThisCorrect) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300 shadow-lg scale-105';
            } else if (isThisWrong) {
              btnStyle = 'bg-rose-100 text-rose-800 border-rose-300 shadow-sm';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isCorrect === true}
                className={`py-3.5 px-4 rounded-2xl text-lg md:text-xl font-bubble font-bold border-3 transition-all duration-150 transform active:scale-95 flex items-center justify-center gap-2 ${btnStyle} ${
                  isShaking ? 'animate-wiggle' : ''
                }`}
              >
                {isThisCorrect && <CheckCircle2 className="w-5 h-5 animate-bounce" />}
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Banner on Correct */}
        {isCorrect === true && (
          <div className="bg-emerald-100 border-2 border-emerald-400 rounded-2xl p-4 mb-5 text-center animate-bounce-short shadow-md">
            <p className="text-emerald-900 font-bold text-lg md:text-xl font-bubble mb-1">
              🌟 WOW! You Got It! 🌟
            </p>
            <p className="text-emerald-800 text-sm md:text-base font-medium">
              {challenge.explanation}
            </p>
          </div>
        )}

        {/* Feedback on Wrong */}
        {isCorrect === false && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-5 text-center">
            <p className="text-rose-700 font-bold text-sm md:text-base">
              Almost! Give it another try, you can do it! 💡
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-amber-200/60">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            Cancel Move
          </button>

          {isCorrect === true ? (
            <button
              type="button"
              onClick={handleConfirmMove}
              autoFocus
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bubble font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
            >
              <span>Make My Move!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setHintVisible(!hintVisible)}
              className="flex items-center gap-1.5 px-3 py-2 text-amber-800 hover:text-amber-950 text-xs md:text-sm font-semibold rounded-xl hover:bg-amber-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{hintVisible ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
          )}
        </div>

        {/* Hint text if requested */}
        {hintVisible && isCorrect !== true && (
          <div className="mt-3 p-3 bg-amber-100/90 rounded-xl text-xs md:text-sm text-amber-950 font-medium text-center border border-amber-300">
            💡 Take your time and count carefully or sound out the word! You've got this!
          </div>
        )}
      </div>
    </dialog>
  );
};

