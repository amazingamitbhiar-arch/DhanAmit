import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Play, 
  RotateCw, 
  Flame, 
  Award, 
  ShieldCheck, 
  Wallet, 
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Volume2,
  RefreshCw
} from 'lucide-react';
import { WalletBalance, Language, Transaction } from '../types';
import { sounds } from '../utils/soundEffects';

interface GamesArenaProps {
  balance: WalletBalance;
  onGameWin: (gameName: string, betAmount: number, multiplier: number) => Transaction;
  onOpenWithdraw: () => void;
  lang: Language;
}

export const GamesArena: React.FC<GamesArenaProps> = ({
  balance,
  onGameWin,
  onOpenWithdraw,
  lang,
}) => {
  const isHi = lang === 'hi';

  const [activeGame, setActiveGame] = useState<'chakra' | 'rocket' | 'cards'>('chakra');

  // ---------- GAME 1: DHAN CHAKRA (WHEEL) ----------
  const [wheelBet, setWheelBet] = useState(100);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<{ multiplier: number; winAmount: number } | null>(null);

  const wheelSegments = [
    { label: '1.5x', mult: 1.5, color: '#f59e0b' },
    { label: '2.0x', mult: 2.0, color: '#10b981' },
    { label: '3.0x', mult: 3.0, color: '#3b82f6' },
    { label: '5.0x', mult: 5.0, color: '#8b5cf6' },
    { label: '1.5x', mult: 1.5, color: '#f59e0b' },
    { label: '10x', mult: 10.0, color: '#ec4899' },
    { label: '2.5x', mult: 2.5, color: '#10b981' },
    { label: '50x JACKPOT', mult: 50.0, color: '#eab308' },
  ];

  const handleSpinWheel = () => {
    if (isSpinning) return;
    if (!balance.isInfiniteFlow && balance.total < wheelBet) {
      alert(isHi ? 'पर्याप्त बैलेंस नहीं है! कृपया पैसे जोड़ें।' : 'Insufficient balance! Please add funds.');
      return;
    }

    sounds.playClick();
    setIsSpinning(true);
    setWheelResult(null);

    // Pick segment
    const chosenIndex = Math.floor(Math.random() * wheelSegments.length);
    const chosen = wheelSegments[chosenIndex];

    const segmentAngle = 360 / wheelSegments.length;
    // 5 full spins + target angle
    const extraSpins = 360 * 5;
    const targetAngle = wheelRotation + extraSpins + (360 - chosenIndex * segmentAngle - segmentAngle / 2);

    setWheelRotation(targetAngle);

    // Tick audio sound interval during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sounds.playTick();
      tickCount++;
      if (tickCount > 24) clearInterval(tickInterval);
    }, 120);

    setTimeout(() => {
      setIsSpinning(false);
      clearInterval(tickInterval);
      const win = wheelBet * chosen.mult;
      setWheelResult({ multiplier: chosen.mult, winAmount: win });
      sounds.playWinChime();
      onGameWin('धन चक्र (Dhan Chakra)', wheelBet, chosen.mult);
    }, 3200);
  };

  // ---------- GAME 2: KUBER MULTIPLIER ROCKET ----------
  const [rocketBet, setRocketBet] = useState(100);
  const [rocketStatus, setRocketStatus] = useState<'IDLE' | 'FLYING' | 'CRASHED' | 'CASHED_OUT'>('IDLE');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [rocketWin, setRocketWin] = useState<number>(0);
  const rocketTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startRocket = () => {
    if (rocketStatus === 'FLYING') return;
    if (!balance.isInfiniteFlow && balance.total < rocketBet) {
      alert(isHi ? 'पर्याप्त बैलेंस नहीं है!' : 'Insufficient balance!');
      return;
    }

    sounds.playClick();
    setRocketStatus('FLYING');
    setCurrentMultiplier(1.0);
    setRocketWin(0);

    const crashMultiplier = 1.2 + Math.random() * 8.0; // Random crash threshold
    let mult = 1.0;

    rocketTimerRef.current = setInterval(() => {
      mult += 0.05 + mult * 0.03;
      setCurrentMultiplier(parseFloat(mult.toFixed(2)));
      sounds.playRocket(mult);

      if (mult >= crashMultiplier) {
        clearInterval(rocketTimerRef.current!);
        setRocketStatus('CRASHED');
      }
    }, 100);
  };

  const handleCashOut = () => {
    if (rocketStatus !== 'FLYING') return;
    if (rocketTimerRef.current) clearInterval(rocketTimerRef.current);

    const win = Math.round(rocketBet * currentMultiplier);
    setRocketWin(win);
    setRocketStatus('CASHED_OUT');
    sounds.playWinChime();
    onGameWin('कुबेर रॉकेट (Kuber Rocket)', rocketBet, currentMultiplier);
  };

  useEffect(() => {
    return () => {
      if (rocketTimerRef.current) clearInterval(rocketTimerRef.current);
    };
  }, []);

  // ---------- GAME 3: TAASH ROYALE (3 CARDS) ----------
  const [cardBet, setCardBet] = useState(100);
  const [cardChoice, setCardChoice] = useState<number | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardReward, setCardReward] = useState<{ cardName: string; mult: number; win: number } | null>(null);

  const cardsData = [
    { cardName: 'हुकुम का इक्का (Ace of Spades)', mult: 3.5, label: '3.5x' },
    { cardName: 'बादशाह (King of Hearts)', mult: 2.0, label: '2.0x' },
    { cardName: 'बेगम (Queen of Diamonds)', mult: 1.5, label: '1.5x' },
  ];

  const handlePickCard = (index: number) => {
    if (cardFlipped) return;
    sounds.playClick();
    setCardChoice(index);
    setCardFlipped(true);

    const selected = cardsData[index];
    const win = cardBet * selected.mult;

    setTimeout(() => {
      setCardReward({ cardName: selected.cardName, mult: selected.mult, win });
      sounds.playWinChime();
      onGameWin('ताश रॉयल (Taash Royale)', cardBet, selected.mult);
    }, 600);
  };

  const resetCards = () => {
    sounds.playClick();
    setCardFlipped(false);
    setCardChoice(null);
    setCardReward(null);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src="/src/assets/images/dhanamit_hero_banner_1791825495796.jpg"
            alt="DhanAmit Gaming Arena"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/80"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <Sparkles className="w-4 h-4 fill-amber-400" />
              <span>{isHi ? 'प्रीमियम डार्क थीम गेमिंग अखाड़ा' : 'Premium Dark Theme Gaming Arena'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight leading-tight">
              Dhan<span className="text-amber-400">Amit</span> {isHi ? 'गेमिंग एवं सुरक्षित विड्रॉल' : 'Gaming & Real Wins'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
              {isHi
                ? 'निष्पक्ष व रोमांचक गेम खेलें, अपनी प्रतिभा से वास्तविक धन जीतें और सीधे अपने UPI ID में तुरंत OTP/पिन से विड्रॉ करें।'
                : 'Play fair arcade games, earn instant winnings, and withdraw directly to your verified UPI ID.'}
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGame('chakra');
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Play className="w-4 h-4 fill-neutral-950" />
                <span>{isHi ? 'अभी खेलें (Play Now)' : 'Play Now'}</span>
              </button>

              <button
                onClick={onOpenWithdraw}
                className="px-4 py-2.5 bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? 'सुरक्षित वॉलेट' : 'Wallet'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Game 1 Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('chakra');
          }}
          className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all group ${
            activeGame === 'chakra'
              ? 'bg-neutral-900 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 bg-neutral-900">
            <img
              src="/src/assets/images/game_dhan_chakra_1791825506008.jpg"
              alt="Dhan Chakra"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
              {isHi ? 'धन चक्र (Dhan Chakra)' : 'Dhan Chakra Wheel'}
            </h3>
            <p className="text-[11px] text-neutral-400 truncate">
              {isHi ? 'स्पिन करें और 50x तक जीतें' : 'Spin to win up to 50x'}
            </p>
            <span className="text-[10px] text-amber-400 font-semibold block mt-1">
              50x Jackpot · Live
            </span>
          </div>
        </button>

        {/* Game 2 Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('rocket');
          }}
          className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all group ${
            activeGame === 'rocket'
              ? 'bg-neutral-900 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 bg-neutral-900">
            <img
              src="/src/assets/images/game_kuber_multiplier_1791825516085.jpg"
              alt="Kuber Multiplier"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
              {isHi ? 'कुबेर रॉकेट (Kuber Multiplier)' : 'Kuber Rocket Multiplier'}
            </h3>
            <p className="text-[11px] text-neutral-400 truncate">
              {isHi ? 'क्रैश से पहले कैश आउट करें' : 'Cash out before the crash'}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
              High Thrill · Fast Cashout
            </span>
          </div>
        </button>

        {/* Game 3 Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('cards');
          }}
          className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all group ${
            activeGame === 'cards'
              ? 'bg-neutral-900 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 bg-neutral-900">
            <img
              src="/src/assets/images/game_taash_royale_1791825526537.jpg"
              alt="Taash Royale"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
              {isHi ? 'ताश रॉयल (Taash Royale)' : 'Taash Royale Cards'}
            </h3>
            <p className="text-[11px] text-neutral-400 truncate">
              {isHi ? 'शाही पत्ता चुनें और 3.5x पाएं' : 'Pick the Royal Ace for 3.5x'}
            </p>
            <span className="text-[10px] text-purple-400 font-semibold block mt-1">
              Royal Deck · Instant Win
            </span>
          </div>
        </button>

      </div>

      {/* Active Game Stage */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
        
        {/* GAME 1: DHAN CHAKRA */}
        {activeGame === 'chakra' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
                  <span>{isHi ? 'धन चक्र - भाग्य का पहिया' : 'Dhan Chakra - Wheel of Fortune'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Live Arena
                  </span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {isHi ? 'दांव लगाएं, पहिया घुमाएं और सीधे विड्रॉएबल विनिंग्स अर्जित करें!' : 'Place bet, spin the golden wheel and win withdrawable cash!'}
                </p>
              </div>

              {/* Balance pill */}
              <div className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHi ? 'उपलब्ध:' : 'Available:'} <strong className="text-white font-mono">₹{balance.total.toLocaleString('hi-IN')}</strong></span>
              </div>
            </div>

            {/* Wheel Display & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Wheel Graphic */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center relative py-6">
                
                {/* Pointer Indicator */}
                <div className="absolute top-2 z-20 -translate-x-1/2 left-1/2 drop-shadow-md">
                  <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400"></div>
                </div>

                {/* Rotating Wheel Container */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-700 shadow-2xl shadow-amber-500/20">
                  <div
                    className="w-full h-full rounded-full relative overflow-hidden bg-neutral-950 border-4 border-amber-300 transition-transform duration-[3200ms] ease-out shadow-inner"
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                  >
                    {/* SVG Wheel segments */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {wheelSegments.map((seg, i) => {
                        const count = wheelSegments.length;
                        const angle = 360 / count;
                        const startA = (i * angle - 90) * (Math.PI / 180);
                        const endA = ((i + 1) * angle - 90) * (Math.PI / 180);
                        const x1 = 50 + 50 * Math.cos(startA);
                        const y1 = 50 + 50 * Math.sin(startA);
                        const x2 = 50 + 50 * Math.cos(endA);
                        const y2 = 50 + 50 * Math.sin(endA);
                        const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                        // Middle angle for text
                        const midA = (i * angle + angle / 2 - 90) * (Math.PI / 180);
                        const tx = 50 + 32 * Math.cos(midA);
                        const ty = 50 + 32 * Math.sin(midA);

                        return (
                          <g key={i}>
                            <path
                              d={pathData}
                              fill={i % 2 === 0 ? '#171717' : '#262626'}
                              stroke="#404040"
                              strokeWidth="0.5"
                            />
                            <text
                              x={tx}
                              y={ty}
                              fill={seg.color}
                              fontSize="5.5"
                              fontWeight="bold"
                              textAnchor="middle"
                              dominantBaseline="central"
                              transform={`rotate(${i * angle + angle / 2}, ${tx}, ${ty})`}
                            >
                              {seg.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Center Knob */}
                    <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 border-2 border-white flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-neutral-950 fill-neutral-950" />
                    </div>
                  </div>
                </div>

                {/* Spin Result Banner */}
                {wheelResult && (
                  <div className="mt-6 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center animate-in zoom-in-95">
                    <div className="text-xs text-emerald-400 font-semibold">
                      {isHi ? 'बधाई हो! आपने जीता:' : 'Congratulations! You won:'}
                    </div>
                    <div className="text-2xl font-black text-amber-300 font-display">
                      +₹{wheelResult.winAmount.toLocaleString('hi-IN')} ({wheelResult.multiplier}x)
                    </div>
                    <button
                      onClick={onOpenWithdraw}
                      className="mt-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 rounded-lg inline-flex items-center gap-1"
                    >
                      <span>{isHi ? 'सीधे विड्रॉ करें' : 'Withdraw Now'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Betting Controls */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    {isHi ? 'दांव राशि चुनें (Bet Amount):' : 'Select Bet Amount:'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 200, 500].map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          sounds.playClick();
                          setWheelBet(b);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          wheelBet === b
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        ₹{b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Potential Payout list */}
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-xs space-y-1.5">
                  <div className="text-[11px] text-neutral-400 font-semibold">
                    {isHi ? 'संभावित जीत (Payouts):' : 'Potential Winnings:'}
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>1.5x - 5x:</span>
                    <span className="font-mono text-emerald-400">₹{wheelBet * 1.5} - ₹{wheelBet * 5}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>10x Jackpot:</span>
                    <span className="font-mono text-pink-400">₹{wheelBet * 10}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300 font-bold">
                    <span>50x महा-जैकपॉट:</span>
                    <span className="font-mono text-amber-400">₹{wheelBet * 50}</span>
                  </div>
                </div>

                {/* Spin Button */}
                <button
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                >
                  <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? (isHi ? 'चक्र घूम रहा है...' : 'Spinning...') : (isHi ? `₹${wheelBet} लगाएं और चक्र घुमाएं` : `Spin For ₹${wheelBet}`)}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* GAME 2: KUBER ROCKET */}
        {activeGame === 'rocket' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
                  <span>{isHi ? 'कुबेर रॉकेट - मल्टीप्लायर रश' : 'Kuber Rocket Multiplier'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    High Thrill
                  </span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {isHi ? 'रॉकेट ऊपर जाता है और मल्टीप्लायर बढ़ता है। फटने से पहले कैश-आउट करें!' : 'Watch the rocket soar! Cash out before it crashes to claim your win.'}
                </p>
              </div>
            </div>

            {/* Rocket Flight Canvas/Stage */}
            <div className="relative h-64 sm:h-80 rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden flex flex-col items-center justify-center p-6">
              
              {/* Starry space dots */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Status Display */}
              <div className="relative z-10 text-center space-y-2">
                <div className={`text-5xl sm:text-7xl font-black font-display tracking-tight tabular-nums ${
                  rocketStatus === 'CRASHED' ? 'text-red-500' : rocketStatus === 'CASHED_OUT' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {currentMultiplier.toFixed(2)}x
                </div>

                <div className="text-sm font-semibold">
                  {rocketStatus === 'IDLE' && <span className="text-neutral-400">{isHi ? 'उड़ान के लिए तैयार' : 'Ready for Launch'}</span>}
                  {rocketStatus === 'FLYING' && <span className="text-amber-400 animate-pulse">{isHi ? 'रॉकेट तीव्र गति से ऊपर जा रहा है...' : 'Rocket Ascending...'}</span>}
                  {rocketStatus === 'CRASHED' && <span className="text-red-400">{isHi ? 'रॉकेट क्रैश हो गया!' : 'Flew Away! Crashed.'}</span>}
                  {rocketStatus === 'CASHED_OUT' && (
                    <span className="text-emerald-400">
                      {isHi ? `सफल कैश-आउट! +₹${rocketWin}` : `Cashed out! Won +₹${rocketWin}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Rocket icon animation */}
              {rocketStatus === 'FLYING' && (
                <div className="absolute bottom-6 animate-bounce">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Flame className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <label className="block text-xs font-semibold text-neutral-400 mb-2">
                  {isHi ? 'दांव राशि (Bet Amount):' : 'Bet Amount:'}
                </label>
                <div className="flex gap-2">
                  {[50, 100, 200, 500].map((b) => (
                    <button
                      key={b}
                      disabled={rocketStatus === 'FLYING'}
                      onClick={() => {
                        sounds.playClick();
                        setRocketBet(b);
                      }}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                        rocketBet === b
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                      }`}
                    >
                      ₹{b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                {rocketStatus !== 'FLYING' ? (
                  <button
                    onClick={startRocket}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-neutral-950 font-black text-base rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Play className="w-5 h-5 fill-neutral-950" />
                    <span>{isHi ? `₹${rocketBet} से उड़ान शुरू करें` : `Launch for ₹${rocketBet}`}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCashOut}
                    className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-black text-base rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 animate-pulse active:scale-95 transition-all"
                  >
                    <span>{isHi ? `कैश-आउट करें (₹${Math.round(rocketBet * currentMultiplier)})` : `Cash Out (₹${Math.round(rocketBet * currentMultiplier)})`}</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {/* GAME 3: TAASH ROYALE */}
        {activeGame === 'cards' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                  {isHi ? 'ताश रॉयल - शाही पत्ता चुनें' : 'Taash Royale - 3 Cards Pick'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {isHi ? '3 शाही पत्तों में से 1 चुनें। हुकुम का इक्का 3.5x देता है!' : 'Pick 1 of 3 royal gold cards to multiply your stake.'}
                </p>
              </div>
              <button
                onClick={resetCards}
                className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 rounded-xl hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isHi ? 'नया दौर (Reset)' : 'Reset Cards'}</span>
              </button>
            </div>

            {/* 3 Royal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
              {cardsData.map((c, idx) => {
                const isSelected = cardChoice === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => handlePickCard(idx)}
                    className={`h-64 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center p-6 text-center group ${
                      cardFlipped
                        ? isSelected
                          ? 'bg-neutral-950 border-amber-400 shadow-xl shadow-amber-500/20'
                          : 'bg-neutral-950/60 border-neutral-800 opacity-60'
                        : 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-amber-500/40 hover:border-amber-400 hover:scale-102 shadow-lg'
                    }`}
                  >
                    {!cardFlipped ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 group-hover:rotate-6 transition-transform">
                          <Sparkles className="w-8 h-8 fill-amber-400" />
                        </div>
                        <div className="font-bold text-white text-sm font-display">
                          {isHi ? `पत्ता #${idx + 1}` : `Card #${idx + 1}`}
                        </div>
                        <span className="text-[11px] text-amber-400 font-semibold block">
                          {isHi ? 'पलटने के लिए क्लिक करें' : 'Click to Flip'}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3 animate-in zoom-in-95">
                        <div className="text-3xl font-black text-amber-400 font-display">
                          {c.label}
                        </div>
                        <div className="font-bold text-white text-sm">
                          {c.cardName}
                        </div>
                        {isSelected && (
                          <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                            +₹{cardBet * c.mult} {isHi ? 'जीते!' : 'Won!'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bet Selector */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <span>{isHi ? 'दांव:' : 'Bet:'}</span>
                {[50, 100, 200, 500].map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      sounds.playClick();
                      setCardBet(b);
                    }}
                    className={`px-3 py-1 rounded-lg font-bold border ${
                      cardBet === b
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    ₹{b}
                  </button>
                ))}
              </div>

              {cardReward && (
                <button
                  onClick={onOpenWithdraw}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{isHi ? 'जीती राशि विड्रॉ करें' : 'Withdraw Winnings'}</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
