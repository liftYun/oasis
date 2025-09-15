'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Marker from '@/assets/icons/marker.png';
import Calendar from '@/assets/icons/calender.png';
import { useState } from 'react';
import { useLanguage } from '@/features/language';

interface Props {
  activeTab: 'region' | 'date';
  onTabChange: (tab: 'region' | 'date') => void;
  selectedRegion?: string | null;
}

export function SearchTabs({ activeTab, onTabChange, selectedRegion }: Props) {
  const { lang } = useLanguage(); // ✅ useLanguage 훅으로 교체
  const [showTooltip, setShowTooltip] = useState(false);

  const labels = {
    kor: { region: '지역', date: '날짜', needRegion: '지역을 선택해주세요.' },
    eng: { region: 'Region', date: 'Date', needRegion: 'Please select a region.' },
  } as const;

  const tabs = [
    { key: 'region' as const, label: labels[lang].region, icon: Marker },
    { key: 'date' as const, label: labels[lang].date, icon: Calendar },
  ];

  const handleTabChange = (tab: 'region' | 'date') => {
    if (tab === 'date' && !selectedRegion) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
    onTabChange(tab);
  };

  return (
    <div className="relative flex bg-gray-100 rounded-full p-2 w-[220px] mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleTabChange(tab.key)}
          className="relative z-10 flex items-center justify-center gap-2 flex-1 px-3 py-2 text-sm font-medium transition-colors text-gray-500"
        >
          <Image src={tab.icon} alt={tab.label} width={14} height={14} />
          {tab.label}

          {tab.key === 'date' && (
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-10"
                >
                  <div className="relative w-max rounded-sm bg-black/70 text-white text-xs font-light px-3 py-1 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                    {labels[lang].needRegion}
                    <div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2
                                  w-0 h-0
                                  border-l-4 border-r-4 border-t-4
                                  border-l-transparent border-r-transparent border-t-black/70"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </button>
      ))}

      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-1 bottom-1 w-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] z-0"
        style={{
          left: activeTab === 'region' ? '0.25rem' : 'calc(50% - 0.25rem)',
        }}
      />
    </div>
  );
}
