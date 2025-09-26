'use client';

import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';

interface StayMapProps {
  postalCode: string;
}

export function StayMap({ postalCode }: StayMapProps) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const mapUrl = `https://www.google.com/maps?q=${postalCode}&hl=ko&z=16&output=embed`;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="inline-block w-1.5 h-5 bg-primary rounded-sm" />
        {t.detail.mapTitle}
      </h2>

      <div className="w-full mt-2 overflow-hidden rounded-md">
        <iframe
          src={mapUrl}
          width="100%"
          height="220"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
