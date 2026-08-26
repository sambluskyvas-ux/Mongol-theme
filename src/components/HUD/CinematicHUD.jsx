import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, ChevronDown, Music } from 'lucide-react';
import {
  TEAM_MEMBERS,
  WAR_THEME,
  EMBLEM_SRC,
  TEAM_VIDEO_SRC,
  TEAM_POSTER_SRC,
  KING_SAAD_VIDEO_SRC,
  KING_SAAD_POSTER_SRC,
  KING_SAAD_NAME,
  ENEMY_DEFEAT_VIDEO_SRC,
} from '../../data/team';
import { CAMPAIGN_CONTENT } from '../../data/content';

export const CinematicHUD = ({ progress }) => {
  const isHero = progress < 0.22;
  const isWarriors = progress >= 0.22 && progress < 0.52;
  const isTrials = progress >= 0.52 && progress < 0.78;
  const isFinal = progress >= 0.78;

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const finalVideoRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(WAR_THEME.src);
    audio.loop = true;
    audio.volume = 0.65;
    audio.preload = 'auto';

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (!isFinal || !finalVideoRef.current) return;

    const video = finalVideoRef.current;
    video.muted = true;
    video.playsInline = true;
    video.play().catch(() => {
      console.warn('Final defeat video autoplay was blocked by the browser.');
    });
  }, [isFinal]);

  // Jump to specific scroll progress
  const jumpToProgress = (targetProg) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetProg * maxScroll,
      behavior: 'smooth',
    });
  };

  // Toggle Background War Music
  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn('Audio playback requires user interaction:', err);
      });
    }
  };

  const handleBeginFight = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {});
    }
    jumpToProgress(0.3);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-10 text-mongol-dirtyIvory select-none">
      {/* Top Header */}
      <header className="flex justify-between items-start w-full border-b border-mongol-bronze/30 pb-3 md:pb-4 backdrop-blur-[2px]">
        <div className="flex items-center gap-3">
          <img
            src={EMBLEM_SRC}
            alt="313 Official Logo"
            className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-mongol-gold/70 shadow-[0_0_12px_rgba(198,156,109,0.4)] object-cover bg-black/80"
          />
          <div>
            <span className="text-[10px] md:text-xs font-mono tracking-widest text-mongol-gold block">
              313 WAR CAMPAIGN // 2026
            </span>
            <h2 className="text-sm md:text-base font-black tracking-cinematic text-mongol-dirtyIvory mt-0.5">
              313
            </h2>
          </div>
        </div>

        {/* Chapter Quick Navigator */}
        <nav className="hidden md:flex items-center space-x-1 pointer-events-auto bg-black/40 border border-mongol-bronze/40 px-2 py-1 rounded-sm">
          {[
            { label: 'I. AWAKENING', prog: 0 },
            { label: 'II. 313 WARBAND', prog: 0.32 },
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
            aria-label="Toggle War Anthem"
            className={`pointer-events-auto px-2.5 py-1.5 border transition-all duration-300 rounded-sm flex items-center gap-2 text-[10px] group shadow-lg ${
              isPlaying
                ? 'border-mongol-gold/80 bg-black/80 text-mongol-gold'
                : 'border-mongol-bronze/50 bg-black/60 hover:bg-mongol-bronze/30 text-zinc-400 hover:text-mongol-gold'
            }`}
            title={isPlaying ? 'Pause War Anthem (The HU - Wolf Totem)' : 'Play War Anthem (The HU - Wolf Totem)'}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-mongol-gold animate-pulse shrink-0" />
                <div className="flex items-end gap-[2px] h-3 px-0.5">
                  <span className="w-[3px] bg-mongol-gold animate-eq-1 rounded-full" />
                  <span className="w-[3px] bg-mongol-gold animate-eq-2 rounded-full" />
                  <span className="w-[3px] bg-mongol-gold animate-eq-3 rounded-full" />
                  <span className="w-[3px] bg-mongol-gold animate-eq-4 rounded-full" />
                </div>
                <span className="hidden sm:inline font-mono tracking-widest text-mongol-dirtyIvory font-bold">
                  THE HU &bull; WOLF TOTEM
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline font-mono tracking-widest">
                  WAR MUSIC OFF
                </span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline text-[11px]">BATTLE</span>
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
      <main className="flex min-h-0 flex-1 flex-col items-center text-center justify-center space-y-4 overflow-y-auto py-4 my-auto w-full px-2">
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
                onClick={handleBeginFight}
                className="px-6 py-2.5 bg-black/70 border border-mongol-gold/60 text-mongol-gold hover:bg-mongol-bronze/40 transition-all duration-300 text-xs font-mono tracking-widest flex items-center gap-2 mx-auto rounded-sm shadow-md hover:scale-105"
              >
                <span>ENTER THE FIGHT</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>
        )}

        {/* Chapter 02: The 313 Warband (10 Warriors) */}
        {isWarriors && (
          <div className="space-y-3 transition-opacity duration-700 w-full max-w-6xl animate-fadeIn">
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-cinematic text-mongol-gold border-b border-mongol-bronze/40 pb-1">
                CHAPTER 02 &mdash; THE 313 WARBAND
              </span>
              <p className="text-[11px] text-mongol-dirtyIvory/80 tracking-widest mt-1 font-mono">
                10 WARRIORS OF THE STEPPE // USMAN (MAIN) &bull; ERIC (TEAM LEAD)
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1.5">
              {TEAM_MEMBERS.map((member) => {
                const isMain = member.id === 'usman';
                const isLead = member.id === 'eric';

                return (
                  <div
                    key={member.id}
                    className={`p-3 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 shadow-lg relative rounded-sm ${
                      isMain
                        ? 'bg-black/90 border-2 border-mongol-gold shadow-[0_0_15px_rgba(198,156,109,0.35)]'
                        : isLead
                        ? 'bg-black/90 border border-mongol-gold/80 shadow-[0_0_10px_rgba(140,98,57,0.3)]'
                        : 'bg-black/85 border border-mongol-bronze/60 hover:border-mongol-gold/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-xs ${
                          isMain
                            ? 'bg-mongol-gold text-black font-extrabold'
                            : isLead
                            ? 'bg-mongol-bronze text-mongol-dirtyIvory font-bold'
                            : 'text-mongol-gold/90 bg-white/5'
                        }`}
                      >
                        {member.badge || 'WARRIOR'}
                      </span>
                    </div>

                    <div
                      className={`text-sm sm:text-base font-black tracking-wider my-1 ${
                        isMain ? 'text-mongol-gold' : 'text-mongol-dirtyIvory'
                      }`}
                    >
                      {member.name}
                    </div>

                    <div className="text-[10px] text-zinc-300 font-serif tracking-tight truncate">
                      {member.role}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4 items-stretch pt-2 text-left">
              <div className="relative overflow-hidden border border-mongol-gold/70 bg-black/90 p-1 shadow-[0_0_20px_rgba(140,98,57,0.25)]">
                <video
                  className="block w-full aspect-video object-cover bg-black"
                  controls
                  preload="metadata"
                  poster={TEAM_POSTER_SRC}
                  aria-label="Usman and Eric teammate video"
                >
                  <source src={TEAM_VIDEO_SRC} type="video/mp4" />
                  Your browser does not support the teammate video.
                </video>
              </div>
              <div className="border border-mongol-bronze/60 bg-black/85 p-4 sm:p-5 flex flex-col justify-center backdrop-blur-md">
                <span className="text-[10px] font-mono tracking-cinematic text-mongol-gold">
                  WARBAND DISPATCH // 01
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-widest text-mongol-dirtyIvory mt-2">
                  USMAN &amp; ERIC
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-2 max-w-md">
                  Two blades. One formation. A field record from the heart of the 313 warband.
                </p>
                <div className="flex items-center gap-2 mt-4 text-[9px] font-mono tracking-widest text-mongol-gold/80">
                  <span className="w-2 h-2 bg-mongol-gold rounded-full" />
                  FIELD RECORDING // PLAY ON COMMAND
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-4 items-stretch pt-2 text-left">
              <div className="border border-mongol-bronze/60 bg-black/85 p-4 sm:p-5 flex flex-col justify-center backdrop-blur-md">
                <span className="text-[10px] font-mono tracking-cinematic text-mongol-gold">
                  AFTER THE TEAM // KING SAAD
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-widest text-mongol-dirtyIvory mt-2">
                  KING SAAD
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-2 max-w-md">
                  After the warband is assembled, King Saad&apos;s final presence anchors the fight and sets the tone for what follows.
                </p>
                <div className="flex items-center gap-2 mt-4 text-[9px] font-mono tracking-widest text-mongol-gold/80">
                  <span className="w-2 h-2 bg-mongol-gold rounded-full" />
                  AFTERMATH // KING SAAD VIDEO
                </div>
              </div>
              <div className="relative overflow-hidden border border-mongol-gold/70 bg-black/90 p-1 shadow-[0_0_20px_rgba(140,98,57,0.25)]">
                <video
                  className="block w-full aspect-video object-cover bg-black"
                  controls
                  preload="metadata"
                  poster={KING_SAAD_POSTER_SRC}
                  aria-label={`${KING_SAAD_NAME} after team video`}
                >
                  <source src={KING_SAAD_VIDEO_SRC} type="video/mp4" />
                  Your browser does not support the {KING_SAAD_NAME} video.
                </video>
              </div>
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
            <div className="relative overflow-hidden border border-mongol-gold/70 bg-black/90 p-1 shadow-[0_0_20px_rgba(140,98,57,0.25)] max-w-3xl mx-auto">
              <video
                ref={finalVideoRef}
                className="block w-full max-h-[38vh] aspect-video object-contain bg-black"
                controls
                autoPlay
                muted
                playsInline
                preload="auto"
                aria-label="Enemy defeat scene video"
              >
                <source src={ENEMY_DEFEAT_VIDEO_SRC} type="video/mp4" />
                Your browser does not support the enemy defeat video.
              </video>
            </div>

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
                <span>FIGHT ANEW</span>
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
          <span>DRAG / SCROLL TO FIGHT</span>
          <div className="w-1.5 h-1.5 bg-mongol-gold rounded-full animate-ping" />
        </div>
      </footer>
    </div>
  );
};