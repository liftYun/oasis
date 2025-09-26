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
  checkIn?: Date | null;
  checkOut?: Date | null;
  onDateChange?: (checkIn: Date | null, checkOut: Date | null) => void;
}
export function SearchTabs({ activeTab, onTabChange, selectedRegion }: Props) {
  const { lang } = useLanguage();
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
    <div className="relative flex bg-gray-100 rounded-full p-2 w-full mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleTabChange(tab.key)}
          className="relative z-10 flex items-center justify-center gap-2 flex-1 px-3 py-2 text-sm font-medium transition-colors text-gray-500"
        >
          <Image src={tab.icon} alt={tab.label} width={14} height={14} />
          {tab.label}

          {tab.key === 'date' && showTooltip && (
            <div className="absolute top-12 left-1/5 -translate-x-1/2 flex justify-center mb-6 animate-bounce">
              <p className="relative inline-flex items-center justify-center text-sm px-3 py-1.5 bg-gray-600 text-white rounded-md whitespace-nowrap">
                <span>{labels[lang].needRegion}</span>
                <span className="absolute left-1/2 -top-[4px] w-2 h-2 bg-gray-600 rotate-45 -translate-x-1/2"></span>
              </p>
            </div>
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
