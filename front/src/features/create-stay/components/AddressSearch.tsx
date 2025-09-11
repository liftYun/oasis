'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/input';
import type { AddressSearchResult } from '@/features/create-stay/types';
import { useCreateStayStore } from '@/features/create-stay/store';
import { useAddressSearchQuery } from '../hooks/useAddressSearchQuery';

export function AddressSearch() {
  const { setFormData, setView } = useCreateStayStore();
  const [keyword, setKeyword] = useState('');
  const { addresses, isLoading, isError, error } = useAddressSearchQuery(keyword);

  const handleSelectAddress = (result: AddressSearchResult) => {
    setFormData({
      address: result.road_address_name || result.address_name,
      postalCode: result.zone_no,
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
          placeholder="주소를 입력해주세요. (예: 서초대로 38)"
        />
      </div>

      {/* {isLoading && <p className="text-sm mb-4">검색중...</p>} */}

      {isError && (
        <p className="text-red-500 text-sm mb-4">
          {(error as Error)?.message || '주소를 검색하는 데 실패했습니다.'}
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
                aria-label={`${result.road_address_name || result.address_name} 선택`}
              >
                <p className="text-sm font-medium">
                  {result.road_address_name || result.address_name}
                </p>{' '}
                <p className="text-xs text-gray-500 mt-1">[지번] {result.address_name}</p>
              </button>
            ))
          : !isLoading &&
            !isError &&
            keyword && (
              <div className="text-sm text-gray-500 pt-4">
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
        {!keyword && (
          <div className="text-sm text-gray-500 pt-4">
            <p className="font-bold mb-2">주소 입력 예시</p>
            <ul>
              <li>도로명 + 건물 번호: 서초대로38길 12</li>
              <li>동/읍/면/리 + 번지: 서초동 1498-5</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
