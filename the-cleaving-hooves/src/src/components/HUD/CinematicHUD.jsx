import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, ChevronDown } from 'lucide-react';
import { TEAM_MEMBERS } from '../../data/team';
import { CAMPAIGN_CONTENT } from '../../data/content';

export const CinematicHUD = ({ progress }) => {
  const isHero = progress < 0.22;
  const isWarriors = progress >= 0.22 && progress < 0.52;
  const isTrials = progress >= 0.52 && progress < 0.78;
  const isFinal = progress >= 0.78;

  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef(null);
  const droneNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Jump to specific scroll progress
  const jumpToProgress = (targetProg) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetProg * maxScroll,
      behavior: 'smooth',
    });
  };

  // Ambient sound synthesizer using Web Audio API
  const toggleSound = () => {
    if (!soundEnabled) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Drone / Wind noise generator
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(110, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc2.start();

        droneNodeRef.current = { osc, osc2 };
        gainNodeRef.current = gain;
        setSoundEnabled(true);
      } catch (err) {
        console.error('Audio initialization error:', err);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setSoundEnabled(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-10 text-mongol-dirtyIvory select-none">
      {/* Top Header */}
      <header className="flex justify-between items-start w-full border-b border-mongol-bronze/30 pb-3 md:pb-4 backdrop-blur-[2px]">
        <div>
          <span className="text-[10px] md:text-xs font-mono tracking-widest text-mongol-gold block">
            MONGOL WAR CAMPAIGN // 2026
          </span>
          <h2 className="text-sm md:text-base font-black tracking-cinematic text-mongol-dirtyIvory mt-0.5">
            THE CLEAVING HOOVES
          </h2>
        </div>

        {/* Chapter Quick Navigator */}
        <nav className="hidden md:flex items-center space-x-1 pointer-events-auto bg-black/40 border border-mongol-bronze/40 px-2 py-1 rounded-sm">
          {[
            { label: 'I. AWAKENING', prog: 0 },
            { label: 'II. SEVEN BLADES', prog: 0.32 },
            { label: 'III. TRIALS', prog: 0.62 },
            { label: 'IV. UNBROKEN', prog: 0.92 },
          ].map((chap, idx) => (
            <button
              key={idx}
              onClick={() => jumpToProgress(chap.prog)}
              className={`px-2.5 py-1 text-[10px] font-mono tracking-wider transition-all duration-200 ${
                (idx === 0 && isHero) ||
                (idx === 1 && isWarriors) ||
                (idx === 2 && isTrials) ||
                (idx === 3 && isFinal)
                  ? 'bg-mongol-bronze text-white shadow-sm font-bold'
                  : 'text-mongol-gold/70 hover:text-mongol-dirtyIvory hover:bg-white/5'
              }`}
            >
              {chap.label}
            </button>
          ))}
        </nav>

        {/* Status & Sound Toggle */}
        <div className="flex items-center space-x-3 font-mono text-xs text-mongol-gold">
          <button
            onClick={toggleSound}
            aria-label="Toggle Atmosphere Audio"
            className="pointer-events-auto p-1.5 border border-mongol-bronze/50 bg-black/60 hover:bg-mongol-bronze/30 transition-colors text-mongol-gold rounded-sm flex items-center gap-1.5 text-[10px]"
            title={soundEnabled ? 'Mute atmosphere audio' : 'Enable ambient war atmosphere audio'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-mongol-gold animate-pulse" />
                <span className="hidden sm:inline">WAR DRUM ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline text-zinc-400">AUDIO OFF</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline text-[11px]">MARCH</span>
            <span className="text-mongol-dirtyIvory font-bold text-[11px]">
              {Math.round(progress * 100)}%
            </span>
            <div className="w-14 sm:w-20 h-1.5 bg-black/60 border border-mongol-bronze/50 overflow-hidden">
              <div
                className="h-full bg-mongol-gold transition-all duration-75"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Center Overlay Content */}
      <main className="flex flex-col items-center text-center justify-center space-y-4 my-auto w-full px-2">
        {/* Chapter 01: The Warrior Awakens */}
        {isHero && (
          <div className="space-y-4 transition-opacity duration-700 animate-fadeIn max-w-4xl">
            <span className="text-xs uppercase tracking-cinematic text-mongol-gold border-b border-mongol-bronze/40 pb-1 inline-block">
              {CAMPAIGN_CONTENT.hero.chapter} &mdash; {CAMPAIGN_CONTENT.hero.subtitle}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-widest metal-text leading-tight">
              {CAMPAIGN_CONTENT.hero.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-lg tracking-[0.4em] text-mongol-dirtyIvory/90 font-medium">
              {CAMPAIGN_CONTENT.hero.tagline}
            </p>
            <div className="pt-4 pointer-events-auto">
              <button
                onClick={() => jumpToProgress(0.3)}
                className="px-6 py-2.5 bg-black/70 border border-mongol-gold/60 text-mongol-gold hover:bg-mongol-bronze/40 transition-all duration-300 text-xs font-mono tracking-widest flex items-center gap-2 mx-auto rounded-sm"
              >
                <span>BEGIN THE MARCH</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>
        )}

        {/* Chapter 02: Seven Blades */}
        {isWarriors && (
          <div className="space-y-4 transition-opacity duration-700 w-full max-w-5xl animate-fadeIn">
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-cinematic text-mongol-gold border-b border-mongol-bronze/40 pb-1">
                CHAPTER 02 &mdash; SEVEN BLADES
              </span>
              <p className="text-xs text-mongol-dirtyIvory/70 tracking-widest mt-1">
                THE VANGUARD WARBAND OF THE STEPPE
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="bg-black/85 border border-mongol-bronze/60 hover:border-mongol-gold p-3 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                >
                  <div className="text-[9px] text-mongol-gold font-mono tracking-widest uppercase">
                    WARRIOR
                  </div>
                  <div className="text-sm md:text-base font-black tracking-wider text-mongol-dirtyIvory my-0.5">
                    {member.name}
                  </div>
                  <div className="text-[10px] text-zinc-300 font-serif tracking-tight truncate">
                    {member.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapter 03: The Trials of War */}
        {isTrials && (
          <div className="space-y-5 transition-opacity duration-700 max-w-5xl w-full animate-fadeIn">
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-cinematic text-mongol-gold border-b border-mongol-bronze/40 pb-1">
                CHAPTER 03 &mdash; THE TRIALS OF WAR
              </span>
              {/* Banner Mottos */}
              <div className="flex flex-wrap justify-center gap-3 text-[10px] font-mono tracking-widest text-mongol-gold/90 mt-2">
                <span className="px-2 py-0.5 bg-black/60 border border-mongol-bronze/40">
                  {CAMPAIGN_CONTENT.banners.banner1.join(' • ')}
                </span>
                <span className="px-2 py-0.5 bg-black/60 border border-mongol-bronze/40">
                  {CAMPAIGN_CONTENT.banners.banner2.join(' • ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left pt-1">
              {CAMPAIGN_CONTENT.trials.map((trial) => (
                <div
                  key={trial.code}
                  className="bg-black/85 border border-mongol-bronze/60 p-4 sm:p-5 backdrop-blur-md space-y-2 hover:border-mongol-gold/80 transition-all duration-300 shadow-xl"
                >
                  <div className="text-[11px] tracking-cinematic text-mongol-gold font-bold font-mono">
                    {trial.code}
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-wider text-mongol-dirtyIvory">
                    {trial.title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">{trial.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapter 04: Grand Victory */}
        {isFinal && (
          <div className="space-y-4 transition-opacity duration-700 animate-fadeIn max-w-4xl">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-widest metal-text leading-tight">
              {CAMPAIGN_CONTENT.final.line1} {CAMPAIGN_CONTENT.final.line2} {CAMPAIGN_CONTENT.final.line3}
            </h2>
            <p className="text-sm sm:text-base md:text-lg tracking-[0.35em] text-mongol-gold font-semibold pt-1">
              {CAMPAIGN_CONTENT.final.tag}
            </p>
            <div className="pt-4 pointer-events-auto">
              <button
                onClick={() => jumpToProgress(0)}
                className="px-6 py-2.5 bg-mongol-bronze/80 hover:bg-mongol-bronze border border-mongol-gold text-mongol-dirtyIvory transition-all duration-300 text-xs font-mono tracking-widest flex items-center gap-2 mx-auto rounded-sm shadow-lg hover:scale-105"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>MARCH ANEW</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Bar */}
      <footer className="flex justify-between items-end w-full border-t border-mongol-bronze/30 pt-3 md:pt-4 backdrop-blur-[2px]">
        <div className="text-[10px] md:text-xs tracking-widest text-mongol-dirtyIvory/60 font-mono">
          SPATIAL COORDINATE: [Z: {(-progress * 65).toFixed(1)}m]
        </div>

        <div className="flex items-center space-x-2 text-[10px] md:text-xs tracking-[0.3em] text-mongol-gold uppercase">
          <span>DRAG / SCROLL TO MARCH</span>
          <div className="w-1.5 h-1.5 bg-mongol-gold rounded-full animate-ping" />
        </div>
      </footer>
    </div>
  );
};