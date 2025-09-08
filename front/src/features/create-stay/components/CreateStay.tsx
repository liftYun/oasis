'use client';

import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import cameraIcon from '@/assets/icons/camera.png';

export function CreateStay({ currentStep }: { currentStep: number }) {
  return (
    <main className="flex flex-col min-h-screen p-6 bg-white">
      <header className="relative flex items-center justify-center h-12 mb-8">
        <div className="flex flex-col w-full">
          <div className="mb-4">
            <button type="button">
              <ChevronLeft />
            </button>
          </div>
          <div>
            <ProgressBar totalSteps={4} currentStep={1} />
          </div>
        </div>
      </header>
      <div className="flex flex-col flex-grow">
        <h1 className="text-xl font-bold mb-6">숙소 정보를 작성해주세요.</h1>

        <form className="flex flex-col gap-6">
          {/* 숙소 이름 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="stay-name">숙소 이름</Label>
            <div className="relative">
              <Input
                id="stay-name"
                placeholder="숙소 이름을 적어주세요."
                className="pr-12 text-sm placeholder:text-gray-300"
              />
              <p className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                0/20
              </p>
            </div>
          </div>

          {/* 숙소 위치 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="stay-location">숙소 위치</Label>
            <Input
              id="stay-location"
              placeholder="주소 검색하기"
              className="text-sm placeholder:text-gray-300"
            />
            <Input placeholder="상세 주소" className="text-sm placeholder:text-gray-300" />
          </div>

          {/* 가격 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="stay-price">가격</Label>
            <Input
              id="stay-price"
              placeholder="$ 가격을 적어주세요."
              className="text-sm placeholder:text-gray-300"
            />
          </div>

          {/* 숙소 사진 */}
          <div className="flex flex-col gap-2">
            <Label>숙소 사진</Label>
            <div className="bg-primary/10 text-primary text-xs p-2 rounded-md">
              TIP 첫 사진은 숙소가 잘 보이게 업로드해주세요.
            </div>
            <button
              type="button"
              className="flex flex-col items-center justify-center w-25 h-25 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
            >
              <Image src={cameraIcon} alt="카메라 아이콘" width={32} height={32} className="mb-1" />
              사진 업로드
            </button>
          </div>
        </form>

        <div className="mt-auto pt-4">
          <Button className="bg-gray-200 w-full text-gray-400" disabled>
            다음
          </Button>
        </div>
      </div>
    </main>
  );
}
