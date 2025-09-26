This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
front
├─ .prettierrc
├─ dockerfile
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ favicon.ico
│  ├─ fonts
│  │  ├─ Pretendard-Bold.woff2
│  │  ├─ Pretendard-ExtraBold.woff2
│  │  ├─ Pretendard-Light.woff2
│  │  ├─ Pretendard-Medium.woff2
│  │  └─ Pretendard-Regular.woff2
│  ├─ icons
│  │  ├─ oasis-logo-192.png
│  │  └─ oasis-logo-512.png
│  ├─ lotties
│  │  ├─ card-fail.json
│  │  ├─ card-processing.json
│  │  ├─ card-success.json
│  │  ├─ card.json
│  │  ├─ empty.json
│  │  ├─ loading.json
│  │  ├─ no-data.json
│  │  ├─ register.json
│  │  ├─ search.json
│  │  ├─ spinner.json
│  │  └─ success.json
│  └─ manifest.webmanifest
├─ README.md
├─ src
│  ├─ apis
│  │  ├─ httpClient.ts
│  │  └─ index.ts
│  ├─ app
│  │  ├─ chat
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [chatId]
│  │  │     ├─ layout.tsx
│  │  │     └─ page.tsx
│  │  ├─ ClientLayout.tsx
│  │  ├─ create-stay
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ edit-stay
│  │  │  ├─ layout.tsx
│  │  │  └─ [stayId]
│  │  │     └─ page.tsx
│  │  ├─ globals.css
│  │  ├─ install-ios
│  │  │  └─ page.tsx
│  │  ├─ language
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ main
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ search
│  │  │     └─ page.tsx
│  │  ├─ my-profile
│  │  │  ├─ blockchain
│  │  │  │  └─ page.tsx
│  │  │  ├─ detail
│  │  │  │  └─ page.tsx
│  │  │  ├─ favorite
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ manage-stay
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ policy
│  │  │  │  └─ page.tsx
│  │  │  ├─ reservations
│  │  │  │  └─ page.tsx
│  │  │  └─ reviews
│  │  │     └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ register
│  │  │  ├─ callback
│  │  │  │  └─ page.tsx
│  │  │  ├─ host
│  │  │  │  ├─ money
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ reservation
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ reservation-detail
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  ├─ search
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ smart-key
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ splash
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ stays
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  └─ _components
│  │     └─ AuthBootstrap.tsx
│  ├─ assets
│  │  ├─ icons
│  │  │  ├─ annoucer.png
│  │  │  ├─ calendar.png
│  │  │  ├─ calender.png
│  │  │  ├─ camera.png
│  │  │  ├─ chat-blue.png
│  │  │  ├─ chat-disable.png
│  │  │  ├─ chat-enable.png
│  │  │  ├─ conversation.png
│  │  │  ├─ create-stay.png
│  │  │  ├─ dollar.png
│  │  │  ├─ edit-profile.png
│  │  │  ├─ en-dark.png
│  │  │  ├─ en-light.png
│  │  │  ├─ google.png
│  │  │  ├─ heart-blue.png
│  │  │  ├─ heart-default.png
│  │  │  ├─ heart-disable.png
│  │  │  ├─ heart-enable.png
│  │  │  ├─ home-blue.png
│  │  │  ├─ home-disable.png
│  │  │  ├─ home-enable.png
│  │  │  ├─ key-blue.png
│  │  │  ├─ key-disable.png
│  │  │  ├─ key-enable.png
│  │  │  ├─ ko-dark.png
│  │  │  ├─ ko-light.png
│  │  │  ├─ marker.png
│  │  │  ├─ policy.png
│  │  │  ├─ positive-review.png
│  │  │  ├─ preview-user.png
│  │  │  ├─ registration-form.png
│  │  │  ├─ secession.png
│  │  │  ├─ sign-out.png
│  │  │  ├─ star.png
│  │  │  ├─ translate.png
│  │  │  ├─ usd-circle.png
│  │  │  ├─ user-blue.png
│  │  │  ├─ user-disable.png
│  │  │  ├─ user-enable.png
│  │  │  ├─ wallet.png
│  │  │  └─ zoom-in.png
│  │  ├─ images
│  │  │  ├─ blockchain.png
│  │  │  ├─ flags
│  │  │  │  ├─ flag-eur.png
│  │  │  │  ├─ flag-jpy.png
│  │  │  │  ├─ flag-krw.png
│  │  │  │  └─ flag-usd.png
│  │  │  ├─ guest.png
│  │  │  ├─ host.png
│  │  │  ├─ ios_step1.png
│  │  │  ├─ ios_step2.png
│  │  │  ├─ ios_step3.png
│  │  │  ├─ key.png
│  │  │  ├─ promo-blockchain.png
│  │  │  ├─ promo-charge.png
│  │  │  ├─ promo-house.png
│  │  │  ├─ promo-review.png
│  │  │  ├─ stay.png
│  │  │  ├─ stay_example.png
│  │  │  └─ test-room.jpeg
│  │  └─ logos
│  │     ├─ eth-logo.png
│  │     ├─ gitlab.png
│  │     ├─ notion.png
│  │     ├─ oasis-loading-logo.png
│  │     ├─ oasis-logo-512.png
│  │     └─ polygon-logo.png
│  ├─ components
│  │  ├─ atoms
│  │  │  ├─ Button.tsx
│  │  │  ├─ ChatUserThumbnail.tsx
│  │  │  ├─ chip.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ label.tsx
│  │  │  ├─ Lottie.tsx
│  │  │  ├─ SplashLoading.tsx
│  │  │  └─ textarea.tsx
│  │  ├─ molecules
│  │  │  ├─ AddressField.tsx
│  │  │  ├─ AppToaster.tsx
│  │  │  ├─ BackHeader.tsx
│  │  │  ├─ FormField.tsx
│  │  │  ├─ ImageUploader.tsx
│  │  │  ├─ LanguageToggle.tsx
│  │  │  ├─ MultiSelectChips.tsx
│  │  │  ├─ PriceField.tsx
│  │  │  ├─ ProgressBar.tsx
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ SegmentedTabs.tsx
│  │  │  └─ TextAreaField.tsx
│  │  └─ organisms
│  │     ├─ BottomSheet.tsx
│  │     ├─ CalendarBase.tsx
│  │     ├─ CalendarSheet.tsx
│  │     ├─ Calender.tsx
│  │     ├─ CenterModal.tsx
│  │     ├─ FooterInfo.tsx
│  │     ├─ Header.tsx
│  │     ├─ InstallPrompt.tsx
│  │     ├─ main-card
│  │     │  ├─ locale.ts
│  │     │  └─ MainCard.tsx
│  │     ├─ ProfileHeader.tsx
│  │     ├─ promo-card
│  │     │  ├─ locale.ts
│  │     │  └─ PromoCard.tsx
│  │     ├─ StayForm.tsx
│  │     ├─ tabbar
│  │     │  ├─ locale.ts
│  │     │  └─ TabBar.tsx
│  │     └─ types.ts
│  ├─ features
│  │  ├─ chat
│  │  │  ├─ api
│  │  │  │  ├─ chat.firestore.ts
│  │  │  │  ├─ presence.firestore.ts
│  │  │  │  └─ toastHelpers.ts
│  │  │  ├─ components
│  │  │  │  ├─ ChatDetailPage.tsx
│  │  │  │  ├─ ChatList.tsx
│  │  │  │  ├─ ChatListItem.tsx
│  │  │  │  ├─ ChatListPage.tsx
│  │  │  │  ├─ InputBar.tsx
│  │  │  │  ├─ MessageItem.tsx
│  │  │  │  ├─ ScrollToBottomButton.tsx
│  │  │  │  └─ StayInfoCard.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ useChatDetail.ts
│  │  │  │  └─ useChatList.ts
│  │  │  ├─ index.ts
│  │  │  ├─ locale.ts
│  │  │  ├─ types.ts
│  │  │  └─ utils
│  │  │     └─ languageDetection.ts
│  │  ├─ common
│  │  │  └─ step-flow
│  │  │     └─ StepFlowContext.tsx
│  │  ├─ create-stay
│  │  │  ├─ components
│  │  │  │  ├─ Step1_StayInfo.tsx
│  │  │  │  ├─ Step2_Description.tsx
│  │  │  │  ├─ Step3_Amenities.tsx
│  │  │  │  └─ Step4_Availability.tsx
│  │  │  ├─ constants
│  │  │  │  └─ amenities.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ useAmenitiesQuery.ts
│  │  │  │  ├─ useCreateStayForm.ts
│  │  │  │  ├─ useDaumPostCode.ts
│  │  │  │  ├─ useImageUploader.ts
│  │  │  │  └─ useStayTranslateSSE.ts
│  │  │  ├─ index.ts
│  │  │  ├─ locale.ts
│  │  │  ├─ schema.ts
│  │  │  ├─ store.ts
│  │  │  └─ types.ts
│  │  ├─ edit-stay
│  │  │  ├─ components
│  │  │  │  ├─ ImageUploader_Edit.tsx
│  │  │  │  ├─ StayForm_Edit.tsx
│  │  │  │  ├─ Step1_StayInfo_Edit.tsx
│  │  │  │  ├─ Step2_Description_Edit.tsx
│  │  │  │  ├─ Step3_Amenities_Edit.tsx
│  │  │  │  └─ Step4_Availability_Edit.tsx
│  │  │  └─ index.ts
│  │  ├─ language
│  │  │  ├─ components
│  │  │  │  └─ Language.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useLanguage.ts
│  │  │  └─ index.ts
│  │  ├─ main
│  │  │  ├─ components
│  │  │  │  ├─ GuestMain.tsx
│  │  │  │  ├─ HostMain.tsx
│  │  │  │  └─ SearchResult.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ locale.ts
│  │  │  └─ types.ts
│  │  ├─ my-profile
│  │  │  ├─ components
│  │  │  │  ├─ blockchain
│  │  │  │  │  ├─ BlockChainWallet.tsx
│  │  │  │  │  ├─ ConnectWallet.tsx
│  │  │  │  │  ├─ jwt.ts
│  │  │  │  │  ├─ locale.ts
│  │  │  │  │  ├─ LockWithCircle.tsx
│  │  │  │  │  ├─ Topup.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ Detail.tsx
│  │  │  │  ├─ EditInfoTab.tsx
│  │  │  │  ├─ Favorite.tsx
│  │  │  │  ├─ GuestProfile.tsx
│  │  │  │  ├─ HostProfile.tsx
│  │  │  │  ├─ HostProfileMoney.tsx
│  │  │  │  ├─ manage
│  │  │  │  │  └─ ManageStayList.tsx
│  │  │  │  ├─ Reservations.tsx
│  │  │  │  ├─ ReviewBottomSheet.tsx
│  │  │  │  ├─ ReviewDetailBottomSheet.tsx
│  │  │  │  └─ Reviews.tsx
│  │  │  ├─ index.ts
│  │  │  └─ locale.ts
│  │  ├─ register
│  │  │  ├─ components
│  │  │  │  ├─ DonutPercentPicker.tsx
│  │  │  │  ├─ HostInfo.tsx
│  │  │  │  ├─ HostMoney.tsx
│  │  │  │  ├─ RegisterCheck.tsx
│  │  │  │  ├─ RegisterNickname.tsx
│  │  │  │  └─ RegisterRole.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useNicknameValidation.ts
│  │  │  ├─ index.ts
│  │  │  ├─ locale.ts
│  │  │  ├─ store.ts
│  │  │  └─ types.ts
│  │  ├─ reservation
│  │  │  ├─ components
│  │  │  │  ├─ CancelBar.tsx
│  │  │  │  ├─ promo
│  │  │  │  │  └─ ReservationPromo.tsx
│  │  │  │  ├─ RefundPolicy.tsx
│  │  │  │  ├─ ReservationDetail.tsx
│  │  │  │  ├─ ReservationInfo.tsx
│  │  │  │  ├─ SearchUserBar.tsx
│  │  │  │  └─ UserCard.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useReservationForm.ts
│  │  │  ├─ index.ts
│  │  │  ├─ locale.ts
│  │  │  ├─ schema.ts
│  │  │  ├─ steps
│  │  │  │  ├─ Step1_Dates.tsx
│  │  │  │  ├─ Step2_SmartKey.tsx
│  │  │  │  └─ Step3_Dummy.tsx
│  │  │  └─ toast.ts
│  │  ├─ search
│  │  │  ├─ components
│  │  │  │  ├─ Search.tsx
│  │  │  │  ├─ SearchSelector.tsx
│  │  │  │  └─ SearchTabs.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ locale.ts
│  │  │  └─ types.ts
│  │  ├─ smart-key
│  │  │  ├─ components
│  │  │  │  ├─ smartkey-card
│  │  │  │  │  ├─ SmartKeyCard.tsx
│  │  │  │  │  ├─ SmartKeyCardBack.tsx
│  │  │  │  │  ├─ SmartKeyCardFront.tsx
│  │  │  │  │  ├─ SmartKeyCardInfo.tsx
│  │  │  │  │  └─ SmartKeySummaryBar.tsx
│  │  │  │  ├─ SmartKey.tsx
│  │  │  │  ├─ SmartKeyDots.tsx
│  │  │  │  ├─ SmartKeyEmpty.tsx
│  │  │  │  ├─ SmartKeyList.tsx
│  │  │  │  └─ SmartKeyStatusModal.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useSmartKey.ts
│  │  │  ├─ index.ts
│  │  │  └─ locale.ts
│  │  ├─ splash
│  │  │  ├─ components
│  │  │  │  ├─ OnboardSlider.tsx
│  │  │  │  └─ Splash.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ useGoogleLogin.ts
│  │  │  │  └─ useSplash.ts
│  │  │  ├─ index.ts
│  │  │  ├─ locale.ts
│  │  │  └─ types.ts
│  │  └─ stays
│  │     ├─ components
│  │     │  ├─ DescriptionModal.tsx
│  │     │  ├─ ReviewModal.tsx
│  │     │  ├─ StayBookingBar.tsx
│  │     │  ├─ StayDescription.tsx
│  │     │  ├─ StayDetail.tsx
│  │     │  ├─ StayFacilities.tsx
│  │     │  ├─ StayHeader.tsx
│  │     │  ├─ StayHost.tsx
│  │     │  ├─ StayHostBar.tsx
│  │     │  ├─ StayImageSlider.tsx
│  │     │  ├─ StayMap.tsx
│  │     │  └─ StayReview.tsx
│  │     ├─ facilityLocale.ts
│  │     ├─ index.ts
│  │     └─ locale.ts
│  ├─ lib
│  │  ├─ circle
│  │  │  └─ sdk.ts
│  │  └─ firebase
│  │     └─ client.ts
│  ├─ providers
│  │  └─ ReactQueryProvider.tsx
│  ├─ services
│  │  ├─ auth.api.ts
│  │  ├─ auth.types.ts
│  │  ├─ chat.api.ts
│  │  ├─ chat.types.ts
│  │  ├─ reservation.api.ts
│  │  ├─ reservation.types.ts
│  │  ├─ smartKey.api.ts
│  │  ├─ smartKey.types.ts
│  │  ├─ stay.api.ts
│  │  ├─ stay.types.ts
│  │  ├─ submitReservation.ts
│  │  ├─ user.api.ts
│  │  └─ user.types.ts
│  ├─ stores
│  │  ├─ useAuthStores.ts
│  │  ├─ useChatStore.ts
│  │  ├─ useResversionStores.ts
│  │  ├─ useSdkStores.ts
│  │  ├─ useSearchStores.ts
│  │  ├─ useStayEditStores.ts
│  │  └─ useStayStores.ts
│  ├─ types
│  │  ├─ index.ts
│  │  └─ lang.ts
│  └─ utils
│     └─ makeReservationId.ts
├─ styles
│  ├─ borderRadius.ts
│  ├─ boxShadow.ts
│  ├─ colors.ts
│  ├─ fonts.ts
│  └─ index.ts
├─ tailwind.config.js
├─ tailwind.config.ts
├─ tsconfig.json
└─ types
   └─ next-pwa.d.ts

```
