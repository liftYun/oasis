# 🌴 Oasis Frontend

> **Next.js 15 + TypeScript + TailwindCSS 기반의 Web3 숙박 예약 플랫폼 프론트엔드**

<br><br>

## 🚀 Getting Started

### ⚙️ 설치 및 실행

```
pnpm install
pnpm dev
```

> 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 됩니다.

<br><br>

## 🏗️ 빌드 & 배포

### 🧱 빌드

```
pnpm build
```

### 🚀 실행

```
pnpm start
```

<br><br>

## 🧱 프로젝트 구조

```
front/
├─ .prettierrc
├─ eslint.config.mjs
├─ next.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
├─ package.json
├─ public/
│  ├─ icons/                    # 앱 아이콘, 로고
│  ├─ images/                   # 프로모션, UI 이미지
│  ├─ lotties/                  # Lottie 애니메이션 JSON
│  └─ manifest.webmanifest      # PWA 설정 파일
├─ src/
│  ├─ app/                      # Next.js App Router 페이지
│  │  ├─ main/                  # 게스트/호스트 메인 페이지
│  │  ├─ search/                # 숙소 검색 페이지
│  │  ├─ chat/                  # 실시간 채팅
│  │  ├─ create-stay/           # 숙소 등록 단계별 페이지
│  │  ├─ edit-stay/             # 숙소 수정
│  │  ├─ reservation/           # 예약 생성
│  │  ├─ reservation-detail/    # 예약 상세
│  │  ├─ my-profile/            # 마이페이지 (게스트/호스트 공용)
│  │  ├─ smart-key/             # 스마트키 관리
│  │  ├─ splash/                # 온보딩 및 로그인 화면
│  │  └─ _components/           # AuthBootstrap 등 공용 컴포넌트
│  │
│  ├─ components/               # UI 컴포넌트
│  │  ├─ atoms/                 # 최소 단위 버튼, 인풋, 로티 등
│  │  ├─ molecules/             # 입력 필드, 헤더 등 중간 단위
│  │  └─ organisms/             # BottomSheet, Modal 등 상위 구조
│  │
│  ├─ features/                 # 도메인 기능 단위 구조
│  │  ├─ chat/                  # 채팅 관련 컴포넌트, 훅, API
│  │  ├─ create-stay/           # 숙소 등록 단계별 구성
│  │  ├─ edit-stay/             # 숙소 수정
│  │  ├─ main/                  # 게스트/호스트 메인
│  │  ├─ my-profile/            # 마이페이지
│  │  ├─ reservation/           # 예약 생성 및 취소
│  │  ├─ search/                # 숙소 검색 및 필터
│  │  ├─ smart-key/             # 스마트키 카드, 상태 모달
│  │  ├─ splash/                # 온보딩, 로그인
│  │  └─ stays/                 # 숙소 상세, 리뷰, 지도, 슬라이더 등
│  │
│  ├─ services/                 # API 및 타입 정의
│  │  ├─ auth.api.ts
│  │  ├─ stay.api.ts
│  │  ├─ reservation.api.ts
│  │  ├─ user.api.ts
│  │  └─ smartKey.api.ts
│  │
│  ├─ stores/                   # Zustand 전역 상태
│  │  ├─ useAuthStores.ts
│  │  ├─ useSearchStores.ts
│  │  └─ useStayStores.ts
│  │
│  ├─ lib/                      # SDK / Firebase / Circle 등 외부 라이브러리
│  │  ├─ firebase/
│  │  └─ circle/
│  │
│  ├─ providers/                # React Query Provider 등 글로벌 Provider
│  ├─ styles/                   # 색상, 그림자, 폰트 등 디자인 토큰
│  ├─ utils/                    # 공용 유틸리티
│  └─ types/                    # 전역 타입 정의
│
└─ styles/
   ├─ colors.ts
   ├─ fonts.ts
   ├─ boxShadow.ts
   ├─ borderRadius.ts
   └─ index.ts
```

<br><br>

## ⚙️ 주요 라이브러리 및 버전

| 카테고리             | 라이브러리                                                                       | 버전                           | 설명                                 |
| -------------------- | -------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------ |
| **Framework**        | `next`                                                                           | 15.0.3                         | Next.js App Router 기반              |
| **Core**             | `react`, `react-dom`                                                             | 18.3.1                         | React 18 기반                        |
| **TypeScript**       | `typescript`                                                                     | 5.6.2                          | 정적 타입 지원                       |
| **스타일링**         | `tailwindcss`, `postcss`, `autoprefixer`                                         | 3.4.13 / 8.5.6 / 10.4.21       | 반응형 유틸리티 클래스               |
| **상태 관리**        | `zustand`                                                                        | 5.0.8                          | 간결한 글로벌 상태 관리              |
| **비동기 데이터**    | `@tanstack/react-query`                                                          | 5.87.1                         | 서버 상태 캐싱                       |
| **HTTP 요청**        | `axios`                                                                          | 1.11.0                         | API 통신                             |
| **폼 및 검증**       | `react-hook-form`, `@hookform/resolvers`, `zod`                                  | 7.62.0 / 3.10.0 / 3.23.8       | 폼 상태 및 검증                      |
| **UI / 애니메이션**  | `framer-motion`, `lucide-react`                                                  | 12.23.12 / 0.542.0             | 애니메이션 및 아이콘                 |
| **UX 개선**          | `react-hot-toast`, `tailwind-merge`, `tailwind-scrollbar-hide`                   | 2.6.0 / 3.3.1 / 4.0.0          | 토스트, 유틸리티 병합, 스크롤바 제거 |
| **슬라이더**         | `swiper`                                                                         | 12.0.2                         | 숙소 이미지 슬라이드                 |
| **이모지**           | `emoji-picker-react`                                                             | 4.13.3                         | 채팅 입력용 이모지 피커              |
| **날짜/시간**        | `date-fns`, `react-day-picker`                                                   | 4.1.0 / 9.9.0                  | 예약 캘린더                          |
| **드래그 앤 드롭**   | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers`, `@dnd-kit/utilities` | 6.3.1 / 10.0.0 / 9.0.0 / 3.2.2 | 스마트키 카드 정렬                   |
| **인증 / 토큰 관리** | `jwt-decode`, `firebase`                                                         | 4.0.0 / 12.2.1                 | JWT 파싱, 실시간 채팅                |
| **결제 / 블록체인**  | `@circle-fin/w3s-pw-web-sdk`                                                     | 1.1.11                         | USDC 결제 및 지갑 연동               |
| **PWA**              | `next-pwa`                                                                       | 5.6.0                          | 오프라인 캐시 및 앱 설치 지원        |

<br><br>

## 🧪 개발 및 품질 도구

| 카테고리          | 라이브러리                                                                                     | 버전                                     |
| ----------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **Lint / Format** | `eslint`, `eslint-config-next`, `eslint-config-prettier`, `eslint-plugin-prettier`, `prettier` | 8.57.0 / 15.5.2 / 10.1.8 / 5.5.4 / 3.6.2 |
| **Babel**         | `@babel/core`, `@babel/preset-env`                                                             | 7.28.4 / 7.28.3                          |
| **타입 정의**     | `@types/react`, `@types/react-dom`, `@types/node`, `@types/jwt-decode`                         | 18.3.12 / 18.3.2 / 20.14.10 / 3.1.0      |
