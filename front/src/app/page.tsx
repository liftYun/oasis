'use client';

import Image from 'next/image';
import { Button } from '@/components/atoms/button';

import BlockChainImg from '@/assets/images/blockchain.png';
import KeyImage from '@/assets/images/key.png';
import StayImage from '@/assets/images/stay.png';

const SplashPage = () => {
  return (
    <div
      className="
        mx-auto w-full max-w-[480px]
        min-h-dvh
        flex flex-col flex-1
        px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        space-y-4 border-x border-gray-100
      "
    >
      <div className="space-y-1">
        <p className="font-light">Light</p>
        <p className="font-normal">Regular</p>
        <p className="font-medium">Medium</p>
        <p className="font-bold">Bold</p>
        <p className="font-extrabold">ExtraBold</p>
      </div>

      <div className="space-y-1">
        <p className="bg-primary text-white p-2">bg-primary</p>
        <p className="bg-yellow text-gray-600 p-2">bg-yellow</p>
        <p className="bg-green text-white p-2">bg-green</p>
        <p className="bg-red text-white p-2">bg-red</p>
        <p className="bg-gray-100 p-2">bg-gray-100</p>
        <p className="bg-gray-200 p-2">bg-gray-200</p>
        <p className="bg-gray-300 p-2">bg-gray-300</p>
        <p className="bg-gray-400 text-white p-2">bg-gray-400</p>
        <p className="bg-gray-500 text-white p-2">bg-gray-500</p>
        <p className="bg-gray-600 text-white p-2">bg-gray-600</p>
      </div>

      <Image src={BlockChainImg} alt="blockchain" width={300} height={300} />
      <Image src={KeyImage} alt="key" width={300} height={300} />
      <Image src={StayImage} alt="stay" width={300} height={300} />

      <Button variant="blue">확인</Button>
      <Button variant="default">검색</Button>
      <Button variant="google">구글 로그인</Button>
    </div>
  );
};

export default SplashPage;
