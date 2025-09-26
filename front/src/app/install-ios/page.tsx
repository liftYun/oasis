'use client';

import Image from 'next/image';
import Step1 from '@/assets/images/ios_step1.png';
import Step2 from '@/assets/images/ios_step2.png';
import Step3 from '@/assets/images/ios_step3.png';

export default function InstallIOSGuidePage() {
  return (
    <main className="flex flex-col items-center px-6 py-10 bg-primary/15 min-h-screen">
      <div className="w-full max-w-[480px]">
        <div className="flex justify-center mb-6 animate-bounce">
          <p className="relative inline-flex flex-col items-center justify-center text-xs px-3 py-1.5 bg-gray-600 text-white rounded-md">
            <span>앱스토어 다운로드 없이</span>
            <span className="text-[10px] text-gray-300">No App Store download needed</span>

            <span className="absolute left-1/2 -bottom-[4px] w-2 h-2  bg-gray-600 rotate-45 -translate-x-1/2"></span>
          </p>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          홈화면에 앱을 추가하세요!
          <br />
          <span className="text-sm text-gray-500 font-normal">
            Add this app to your Home Screen
          </span>
        </h1>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-2xl shadow-sm p-5">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-primary text-[11px] font-semibold">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  브라우저 하단 <span className="text-primary">공유 버튼</span> 탭
                </p>
                <p className="text-xs text-gray-500 font-normal mb-1">
                  Tap the <span className="text-primary font-semibold">Share</span> button at the
                  bottom of the browser
                </p>
              </div>
            </div>

            <Image src={Step1} alt="Step1" className="rounded-lg border border-gray-200" />
          </div>

          <div className="bg-gray-50 rounded-2xl shadow-sm p-5">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-primary text-[11px] font-semibold">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  <span className="text-primary">홈 화면에 추가</span> 선택
                </p>
                <p className="text-xs text-gray-500 font-normal mb-1">
                  Select <span className="text-primary font-semibold">Add to Home Screen</span>
                </p>
              </div>
            </div>
            <Image src={Step2} alt="Step2" className="rounded-lg border border-gray-200" />
          </div>

          <div className="bg-gray-50 rounded-2xl shadow-sm p-5">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-primary text-[11px] font-semibold">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">추가된 앱 실행</p>
                <p className="text-xs text-gray-500 font-normal mb-1">
                  Open the app from your Home Screen
                </p>
              </div>
            </div>
            <Image src={Step3} alt="Step3" className="rounded-lg border border-gray-200" />
          </div>
        </div>

        <p className="mt-12 text-xs text-gray-500 text-center leading-relaxed">
          설치가 완료되면 홈화면에서 바로 실행할 수 있어요!
          <br />
          <span className="block text-[11px] text-gray-500">
            Once installed, you can launch it directly from your Home Screen!
          </span>
        </p>
      </div>
    </main>
  );
}
