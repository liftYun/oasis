'use client';

import Image from 'next/image';
import GitLab from '@/assets/logos/gitlab.png';
import Notion from '@/assets/logos/notion.png';

export const FooterInfo = () => {
  return (
    <footer className=" text-gray-600 text-xs -mx-6">
      <div className="px-6 py-8 space-y-8">
        <div className="space-y-2 flex flex-col justify-center items-center text-center">
          <h4 className="font-semibold text-sm bg-gradient-to-r from-primary to-green bg-clip-text text-transparent">
            Project Oasis
          </h4>

          <p className="text-gray-500 leading-relaxed">
            Oasis는{' '}
            <span className="font-medium text-gray-600">블록체인 기반 P2P 숙박 예약 플랫폼</span>
            으로,
            <br />
            중개 수수료 없이 <span className="font-medium">호스트와 게스트가 직접 연결</span>되어
            <br />
            더욱 <span className="font-medium">투명하고 안전한 거래</span>를 제공합니다.
            <br />
            <br />
            디지털 키 발급과 지갑 연동을 통해
            <br />
            <span className="font-medium">차세대 탈중앙 숙박 경험</span>을 선도합니다.
          </p>
        </div>

        <div className="space-y-2 items-center justify-center flex flex-col">
          <h4 className="font-semibold text-gray-600 text-xs">Team SSAFY E103 무한도전</h4>
          <p className="text-gray-500">이도윤 · 원윤서 · 김수민 · 이민희 · 이아현 · 이지은</p>
        </div>

        <div className="flex gap-6 items-center justify-center">
          <a
            href="https://lab.ssafy.com/s13-blochain-transaction-sub1/S13P21E103"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition text-xs"
          >
            <Image src={GitLab} alt="GitLab" width={20} height={20} />
            <span>GitLab</span>
          </a>
          <a
            href="https://www.notion.so/SSAFY-13-_-25abdd006a7d808f98f5fe5030fb36d8"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition text-xs"
          >
            <Image src={Notion} alt="Notion" width={20} height={20} />
            <span>Notion</span>
          </a>
        </div>

        <p className="text-xs text-gray-400 pt-6 text-center">
          © {new Date().getFullYear()} Team Oasis. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
