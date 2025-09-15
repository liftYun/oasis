'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/input';
import type { AddressSearchResult } from '@/features/create-stay/types';
import { useCreateStayStore } from '@/features/create-stay/store';
import { useAddressSearchQuery } from '../hooks/useAddressSearchQuery';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

export function AddressSearch() {
  const { setFormData, setView } = useCreateStayStore();
  const [keyword, setKeyword] = useState('');
  const { addresses, isLoading, isError, error } = useAddressSearchQuery(keyword);
  const { lang } = useLanguage();
  const t = createStayMessages[lang];

  const handleSelectAddress = (result: AddressSearchResult) => {
    setFormData({
      address: result.road_address_name || result.address_name,
      postalCode: result.zone_no,
      // 영문 주소를 함께 저장(표시는 하지 않음, 이후 API 전송용)
      addressEng: result.road_address_name_eng || result.address_name_eng || undefined,
    });
    setView('form');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t.searchAddress.placeholder}
        />
      </div>

      {/* {isLoading && <p className="text-sm mb-4">검색중...</p>} */}

      {isError && (
        <p className="text-red-500 text-sm mb-4">
          {(error as Error)?.message || t.searchAddress.error}
        </p>
      )}

      <div className="flex-grow overflow-y-auto">
        {addresses && addresses.length > 0
          ? addresses.map((result, index) => (
              <button
                type="button"
                key={`${result.zone_no}-${result.road_address_name || result.address_name}`}
                className="w-full text-left py-3 px-1 hover:bg-gray-100 rounded border-b"
                onClick={() => handleSelectAddress(result)}
                aria-label={`${result.road_address_name || result.address_name} ${t.searchAddress.selectAriaSuffix}`}
              >
                <p className="text-sm font-medium">
                  {result.road_address_name || result.address_name}
                </p>{' '}
                <p className="text-xs text-gray-500 mt-1">
                  [{t.searchAddress.jibunLabel}] {result.address_name}
                </p>
              </button>
            ))
          : !isLoading &&
            !isError &&
            keyword && (
              <div className="text-sm text-gray-500 pt-4">
                <p>{t.searchAddress.noResults}</p>
              </div>
            )}
        {!keyword && (
          <div className="text-sm text-gray-500 pt-4">
            <p className="font-bold mb-2">{t.searchAddress.examplesTitle}</p>
            <ul>
              <li>{t.searchAddress.exampleRoad}</li>
              <li>{t.searchAddress.exampleDong}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
