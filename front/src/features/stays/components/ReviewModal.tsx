'use client';

import { useEffect, useState } from 'react';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { stayDetailLocale } from '@/features/stays/locale';
import { fetchStayReviews } from '@/services/stay.api';
import { StayReviewResponseVo } from '@/services/stay.types';
import { StayReadResponseDto } from '@/services/stay.types';
import { useLanguage } from '@/features/language';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  stayId: number;
}

export default function ReviewModal({ open, onClose, stayId }: ReviewModalProps) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const [reviews, setReviews] = useState<StayReviewResponseVo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const loadReviews = async () => {
      setLoading(true);
      try {
        const res = await fetchStayReviews(stayId);
        setReviews(res.result);
      } catch (err) {
        console.error('리뷰 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [open, stayId]);

  function maskNickname(nickname: string): string {
    if (nickname.length <= 2) {
      return nickname[0] + '*';
    }
    return nickname[0] + '*'.repeat(nickname.length - 2) + nickname[nickname.length - 1];
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-w-[480px] mx-auto shadow-xl h-[85vh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="h-1.5 w-12 rounded-full bg-gray-200 mx-auto absolute left-1/2 -translate-x-1/2 -top-2" />
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">{t.review.seeAll}</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loading && <p className="text-center text-gray-400">{t.common.loading}</p>}

              {!loading && reviews.length === 0 && (
                <p className="text-center text-gray-400">{t.review.reviewsNot}</p>
              )}

              {reviews.map((r) => (
                <div key={r.reviewId} className="bg-gray-100 p-3 rounded-md text-sm text-gray-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{maskNickname(r.nickname)}</span>
                    <span className="text-xs text-gray-400">{r.createdAt.slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i + 1 <= Math.round(r.rating)
                            ? 'text-yellow fill-yellow'
                            : 'text-white fill-white'
                        }
                      />
                    ))}
                    <span className="ml-2 text-gray-600 text-sm">{r.rating.toFixed(1)}</span>
                  </div>
                  <p className="whitespace-pre-line">{r.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
