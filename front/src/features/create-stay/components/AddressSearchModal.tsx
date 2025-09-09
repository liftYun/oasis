'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import type { AddressSearchResult } from '@/features/create-stay/types';

interface AddressSearchModalProps {
  onClose: () => void;
  onSelect: (address: { address: string; postalCode: string }) => void;
}

export function AddressSearchModal({ onClose, onSelect }: AddressSearchModalProps) {
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
      const response = await fetch(`/api/search-address?query=${keyword}`);
      if (!response.ok) {
        throw new Error('주소를 검색하는 데 실패했습니다.');
      }
      const data: AddressSearchResult[] = await response.json();

      if (data.length === 0) {
        setError('검색 결과가 없습니다.');
      } else {
        setResults(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (result: AddressSearchResult) => {
    onSelect({
      address: result.road_address_name || result.address_name,
      postalCode: result.zone_no,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-lg font-bold mb-4">주소 찾기</h2>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="주소를 입력해주세요."
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? '검색중...' : '검색'}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="py-2 px-1 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => handleSelectAddress(result)}
            >
              <p className="text-sm">{result.road_address_name}</p>
              <p className="text-xs text-gray-500">[지번] {result.address_name}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 text-right">
          <Button onClick={onClose} variant="outline">
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
