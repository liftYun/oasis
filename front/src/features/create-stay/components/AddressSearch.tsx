'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/Button';
import type { AddressSearchResult } from '@/features/create-stay/types';
import { http } from '@/apis/httpClient';
import { ApiError } from '@/apis/httpClient';
import { useCreateStayStore } from '@/features/create-stay/store';

export function AddressSearch() {
  const { setFormData, setView } = useCreateStayStore();

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await http.get<AddressSearchResult[]>(`/api/search-address?query=${keyword}`);
      if (data.length === 0) {
        setError('검색 결과가 없습니다.');
      } else {
        setResults(data);
      }
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof Error ? err.message : '알 수 없는 오류';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

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
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="bg-gray-300"
        />
        <Button onClick={handleSearch} disabled={isLoading} className="w-20">
          {isLoading ? '검색중...' : '검색'}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex-grow overflow-y-auto">
        {results.length > 0
          ? results.map((result, index) => (
              <div
                key={index}
                className="py-3 px-1 cursor-pointer hover:bg-gray-100 rounded border-b"
                onClick={() => handleSelectAddress(result)}
              >
                <p className="text-sm font-medium">{result.road_address_name}</p>
                <p className="text-xs text-gray-500 mt-1">[지번] {result.address_name}</p>
              </div>
            ))
          : !isLoading &&
            !error && (
              <div className="text-sm text-gray-500 pt-4">
                <p className="font-bold mb-2">주소 입력 예시</p>
                <ul>
                  <li>도로명 + 건물 번호: 서초대로38길 12</li>
                  <li>동/읍/면/리 + 번지: 서초동 1498-5</li>
                  <li>건물명, 아파트명: 서초동 마제스타시티</li>
                </ul>
              </div>
            )}
      </div>
    </div>
  );
}
