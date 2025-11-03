import React, { useState, useRef, useEffect } from 'react';
import { Share2, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';

const HolidayPosterApp = () => {
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [wish, setWish] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(9);
  const [currentYear] = useState(2025);
  const posterRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const festivalsByMonth = {
    0: [
      { id: 'jan1', name: 'Makar Sankranti', day: 14, icon: '🪁', posterBg: 'linear-gradient(180deg, #fb923c 0%, #fbbf24 100%)' },
      { id: 'jan2', name: 'Republic Day', day: 26, icon: '🇮🇳', posterBg: 'linear-gradient(180deg, #f97316 0%, #ffffff 50%, #22c55e 100%)' }
    ],
    1: [
      { id: 'feb1', name: 'Maha Shivaratri', day: 26, icon: '🔱', posterBg: 'linear-gradient(180deg, #4f46e5 0%, #8b5cf6 100%)' }
    ],
    2: [
      { id: 'mar1', name: 'Holi', day: 14, icon: '🎨', posterBg: 'linear-gradient(180deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)' }
    ],
    7: [
      { id: 'aug1', name: 'Independence Day', day: 15, icon: '🇮🇳', posterBg: 'linear-gradient(180deg, #f97316 0%, #ffffff 50%, #22c55e 100%)' },
      { id: 'aug2', name: 'Raksha Bandhan', day: 30, icon: '🎀', posterBg: 'linear-gradient(180deg, #f472b6 0%, #fb7185 100%)' }
    ],
    8: [
      { id: 'sep1', name: 'Ganesh Chaturthi', day: 17, icon: '🐘', posterBg: 'linear-gradient(180deg, #f97316 0%, #ef4444 100%)' }
    ],
    9: [
      { id: 'oct1', name: 'Gandhi Jayanti', day: 2, icon: '🕊️', posterBg: 'linear-gradient(180deg, #f97316 0%, #ffffff 50%, #22c55e 100%)' },
      { id: 'oct2', name: 'Dussehra', day: 12, icon: '🏹', posterBg: 'linear-gradient(180deg, #dc2626 0%, #fbbf24 100%)' },
      { id: 'oct3', name: 'Karwa Chauth', day: 20, icon: '🌙', posterBg: 'linear-gradient(180deg, #ec4899 0%, #a855f7 100%)' },
      { id: 'oct4', name: 'Diwali', day: 20, icon: '🪔', posterBg: 'linear-gradient(180deg, #f59e0b 0%, #fb923c 100%)' }
    ],
    10: [
      { id: 'nov1', name: 'Govardhan Puja', day: 2, icon: '⛰️', posterBg: 'linear-gradient(180deg, #3b82f6 0%, #4ade80 100%)' },
      { id: 'nov2', name: 'Chhath Puja', day: 7, icon: '☀️', posterBg: 'linear-gradient(180deg, #f97316 0%, #facc15 100%)' }
    ]
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // PWA Install Prompt Handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const calendar = [];
    
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }
    
    return calendar;
  };

  const getFestivalForDay = (day) => {
    const festivals = festivalsByMonth[currentMonth] || [];
    return festivals.find(f => f.day === day);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day) => {
    const festival = getFestivalForDay(day);
    if (festival) {
      setSelectedHoliday(festival);
      setWish('');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy ${selectedHoliday.name}!`,
          text: wish || `Wishing you a joyous ${selectedHoliday.name}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleDownload = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied!');
  };

  if (!selectedHoliday) {
    const calendarDays = generateCalendar();
    
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="text-center py-8 px-6">
          <h1 className="text-3xl font-light text-gray-800 mb-2 tracking-wide">
            Festive Wishes
          </h1>
          <p className="text-gray-500 text-sm">Create beautiful festival greetings</p>
        </div>

        {/* Golden Deer Animation */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-9xl animate-diya mb-8">
            🦌
          </div>

          {/* Story Paragraph */}
          <div className="max-w-2xl text-center">
            <h2 className="text-base font-semibold text-gray-800 mb-2">
              THE GOLDEN DEER / NASHIK, MAHARASHTRA
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              In the Ramayana, a golden deer enchants Sita, prompting Rama to pursue it, unaware it is the demon Maricha in disguise. The shining illusion symbolizes Maya, reminding us that not all that glitters brings joy. This episode is believed to have occurred in the forests of Panchavati, near the Godavari River in present-day Nashik, Maharashtra.
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div className="pb-8 px-6">
          <div className="max-w-xl mx-auto">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={24} className="text-gray-600" strokeWidth={1.5} />
              </button>
              <h2 className="text-xl font-light text-gray-800 tracking-wide">
                {months[currentMonth].toUpperCase()} {currentYear}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={24} className="text-gray-600" strokeWidth={1.5} />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const festival = day ? getFestivalForDay(day) : null;
                return (
                  <div
                    key={index}
                    onClick={() => day && handleDayClick(day)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all ${
                      day
                        ? festival
                          ? 'bg-red-500 text-white cursor-pointer hover:bg-red-600 font-medium'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : ''
                    }`}
                  >
                    {day && (
                      <>
                        <div>{day}</div>
                        {festival && <div className="text-xs mt-1">{festival.icon}</div>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes deerAnimation {
            0%, 100% {
              transform: translateX(0px) translateY(0px) scale(1);
              filter: drop-shadow(0 10px 30px rgba(255, 215, 0, 0.4)) brightness(1);
            }
            25% {
              transform: translateX(-20px) translateY(-15px) scale(1.05);
              filter: drop-shadow(0 15px 40px rgba(255, 215, 0, 0.6)) brightness(1.2);
            }
            50% {
              transform: translateX(0px) translateY(-20px) scale(1.1);
              filter: drop-shadow(0 20px 50px rgba(255, 215, 0, 0.8)) brightness(1.3);
            }
            75% {
              transform: translateX(20px) translateY(-15px) scale(1.05);
              filter: drop-shadow(0 15px 40px rgba(255, 215, 0, 0.6)) brightness(1.2);
            }
          }

          .animate-diya {
            animation: deerAnimation 6s ease-in-out infinite;
            transform-style: preserve-3d;
          }
        `}</style>

        {/* Install Prompt */}
        {showInstallPrompt && (
          <div className="fixed bottom-6 left-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 z-50 animate-slideUp">
            <button
              onClick={handleDismissInstall}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <div className="flex items-start gap-4">
              <div className="text-4xl">📅</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  Install as Mobile App
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add to your home screen for quick access to create beautiful festival posters anytime!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    Install App
                  </button>
                  <button
                    onClick={handleDismissInstall}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-all"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Poster View
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setSelectedHoliday(null)}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X size={24} strokeWidth={1.5} />
        </button>
        <h2 className="text-lg font-light text-gray-800 tracking-wide">Create Poster</h2>
        <div className="w-6" />
      </div>

      {/* Poster Preview */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-md mx-auto w-full">
        <div
          ref={posterRef}
          className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: selectedHoliday.posterBg,
          }}
        >
          {/* Poster Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center p-12">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-8xl mb-8 drop-shadow-lg">
                {selectedHoliday.icon}
              </div>

              <h1 className="text-5xl font-light text-white mb-4 tracking-wide drop-shadow-lg">
                {selectedHoliday.name}
              </h1>
              
              <p className="text-white/90 text-lg font-light mb-8">
                {months[currentMonth]} {selectedHoliday.day}, {currentYear}
              </p>
              
              {wish && (
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 max-w-xs border border-white/30">
                  <p className="text-white text-xl font-bold leading-relaxed">
                    {wish}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wish Input */}
        <div className="w-full">
          <textarea
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            placeholder="Add your wish..."
            maxLength={120}
            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-gray-300 transition-all font-light"
            rows={3}
          />
          <div className="text-right text-gray-400 text-xs mt-2">
            {wish.length}/120
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-light py-3 rounded-xl transition-all border border-gray-200 active:scale-95"
          >
            <Download size={20} strokeWidth={1.5} />
            <span>Save</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white hover:bg-gray-900 font-light py-3 rounded-xl transition-all active:scale-95"
          >
            <Share2 size={20} strokeWidth={1.5} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-gray-200 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 font-light text-lg">Share Poster</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-6 font-light">
              Take a screenshot and share it on your favorite platform
            </p>
            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(window.location.href)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-light py-3 rounded-lg transition-all border border-gray-200"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full bg-gray-800 text-white hover:bg-gray-900 font-light py-3 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayPosterApp;