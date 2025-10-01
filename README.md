<div align="center">

# 🏠 oasis

</div>

**블록체인 기반 P2P** 숙박 예약 플랫폼<br>
**스마트 계약(Smart Contract)** 을 통해 신뢰 없이 투명한 거래를 보장하고,<br>
디지털 키 발급 및 결제 내역을 온체인(On-chain)으로 관리하여,<br>
중개 수수료 없이 게스트와 호스트가 직접 연결되는 탈중앙화 숙박 예약 서비스를 제공합니다.<br><br>

> 머무는 순간까지, 여행이니까 **oasis**

- **개발 기간** : 2025.08.25 ~ 2025.09.29 **(6주)**
- **플랫폼** : PWA Web & Mobile
- **개발 인원** : 6명
- **기관** : 삼성 청년 SW·AI 아카데미 13기 <br><br>

<img src="./readme-assets/oasis_thumbnail.png" />

</div> <br>

## 🔎 목차

<div align="center">

### <a href="#developers">🌴 팀원 소개</a>

### <a href="#techStack">🛠️ 기술 스택</a>

### <a href="#systemArchitecture">🌐 시스템 아키텍처</a>

### <a href="#skills">📲 기능 구성</a>

### <a href="#directories">📂 디렉터리 구조</a>

### <a href="#projectDeliverables">📦 프로젝트 산출물</a>

</div> <br>

## 🌴 팀원 구성

<a name="developers"></a>

<div align="center">

<div align="center">
<table>
    <tr>
        <td width="33%" align="center"> 
            <img src="./readme-assets/doyun_lee.jpg" width="160px" /> <br> 이도윤 <br>[Backend · Leader] </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/minhe8564">
            <img src="./readme-assets/minhee_lee.jpg" width="160px" /> <br> 이민희 <br>[Frontend · BlockChain] </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/soomkim00">
            <img src="./readme-assets/sumin_kim.jpeg" width="160px" /> <br> 김수민 <br>[Frontend · 
Presentation] </a> <br></td>
    </tr>
    <tr>
      <td width="280px">
        <sub>
          - Security, OAuth2, SMTP 기반 인증 API 구현 <br>
          - 숙소 예약 API 구조 설계 <br>
          - Swagger / API 명세서 문서화 관리 <br>
          - 프로젝트 총괄 및 일정 관리 담당
        </sub>
      </td>
      <td width="280px">
        <sub>
          - Next.js + TypeScript + PWA 기반 Web / Mobile App 개발 <br>
          - Polygon 트랜잭션 처리 및 비동기 흐름 최적화 <br>
          - UI/UX 설계 및 반응형 컴포넌트 구현 <br>
          - 상태관리(Zustand) + React Query 캐싱 아키텍처 설계
        </sub>
      </td>
      <td width="280px">
        <sub>
          - Firebase 연동 및 설정 <br>
          - Cloud Firestore 기반 실시간 채팅 구현 <br>
          - UI 구성 정리 및 사용자 피드백 기반 개선 작업 <br>
          - 프로젝트 발표
        </sub>
      </td>
    </tr>

</table>

<table>
    <tr>
        <td width="33%" align="center"> <a href="https://github.com/jieun-99">
        <img src="./readme-assets/jieun_lee.jpg" width="160px" /> <br> 김지은 <br>[Infra · IoT] </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/yoonsu0325">
        <img src="./readme-assets/yunseo_won.jpg" width="160px" /> <br> 원윤서 <br>[Backend · Async API] </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/yuju9">
        <img src="./readme-assets/ahhyun_lee.png" width="160px" /> <br> 이아현 <br>[Backend · BlockChain] </a> <br></td>
    </tr>
    <tr>
        <td width="280px">
          <sub>
            - CI/CD 파이프라인 구축 / 배포 자동화 <br>
            - AWS Cloud 환경 세팅 <br>
            - HW ESP32 및 EC2 통신 연동 / IoT 테스트 환경 구성 <br>
            - 빌드 / 배포 안정성 및 서버 성능 최적화
          </sub>
        </td>
        <td width="280px">
          <sub>
            - 숙소 관련 도메인 설계 및 비지니스 로직 구현<br>
            - 비동기 메시징 / 아키텍처 구축 <br>
            - AI 리뷰 요약 / 번역 기능 구현 <br>
            - 비동기 API 구조 및 데이터 파이프라인 개선
          </sub>
        </td>
        <td width="280px">
          <sub>
            - Solidity 기반 스마트 컨트랙트 설계 <br>
            - Circle Web3 Service 활용 USDC 결제 시스템 구축 <br>
            - Polygon 네트워크 연동 <br>
            - 온체인 데이터 정합성 검증 및 운영 자동화
          </sub>
        </td>
    </tr>

</table>
</div>
<br>

</div>

## 🛠️ 기술 스택

<a name="techStack"></a>

### 🌕 Frontend

<div align="center">

![VSCode](https://img.shields.io/badge/VisualStudioCode-007ACC?style=for-the-badge&logo=VisualStudioCode&logoColor=white)<br>
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)<br>
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-181717?style=for-the-badge&logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Circle SDK](https://img.shields.io/badge/Circle%20SDK-000000?style=for-the-badge&logo=circle&logoColor=white)

<br>

| **Category**             | **Stack**                                                                                          |
| :----------------------- | :------------------------------------------------------------------------------------------------- |
| **Language**             | TypeScript 5.6.2                                                                                   |
| **Runtime Environment**  | Node.js 22.12.0 (PWA 기반)                                                                         |
| **Framework**            | Next.js 15.5.2, React 18.3.1 (App Router)                                                          |
| **Styling**              | TailwindCSS 3.4.13, Emotion 11.14.0, Framer Motion 12.23.12                                        |
| **State / Data**         | Zustand 5.0.8, TanStack React Query 5.87.1, use-debounce 10.0.6                                    |
| **Form / Validation**    | React Hook Form 7.62.0, Zod 3.23.8, @hookform/resolvers 3.10.0                                     |
| **Network / Auth**       | Axios 1.11.0, Firebase Auth 12.2.1, JWT Decode 4.0.0                                               |
| **UI / Animation**       | Swiper 12.0.2, Lottie-web 5.13.0, Lucide-react 0.542.0, Emoji Picker 4.13.3, React Hot Toast 2.6.0 |
| **Blockchain / Payment** | @circle-fin/w3s-pw-web-sdk 1.1.11 (USDC 결제 처리)                                                 |
| **Build / PWA**          | next-pwa 5.6.0, Babel Loader 10.0.0                                                                |
| **IDE**                  | Visual Studio Code 1.103.1                                                                         |

</div><br>

### 🌑 Backend

<div align="center">

![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=for-the-badge&logo=intellijidea&logoColor=white)
![Java](https://img.shields.io/badge/Java%2017-%23ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)<br>
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![Spring Batch](https://img.shields.io/badge/Spring%20Batch-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)<br>
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23DD0031?style=for-the-badge&logo=redis&logoColor=white)
![MQTT](https://img.shields.io/badge/MQTT-3C5280?style=for-the-badge&logo=eclipsepaho&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![AWS SQS](https://img.shields.io/badge/AWS%20SQS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![OAuth2](https://img.shields.io/badge/OAuth2.0-3B5998?style=for-the-badge&logo=openid&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Web3j](https://img.shields.io/badge/Web3j-333333?style=for-the-badge&logo=ethereum&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

<br>

| **Category**   | **Stack**                                                                                                                                                                                                                                                             |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Language**   | Java 17                                                                                                                                                                                                                                                               |
| **Framework**  | Spring Boot 3.3.4                                                                                                                                                                                                                                                     |
| **Build Tool** | Gradle 8.14.3                                                                                                                                                                                                                                                         |
| **Libraries**  | Spring Security, Spring Validation, Spring Data JPA, QueryDSL, Spring Data Redis, Spring Batch, WebSocket, WebFlux, Quartz Scheduler, jjwt 0.12.3, OAuth2 Client (Google), Springdoc OpenAPI 2.6.0, AWS SDK v2 (S3, SQS), MQTT (Eclipse Paho 1.2.5), OpenAI Proxy API |
| **Database**   | MySQL 8.0.11 (mysql-connector-j), Redis 7.4.5                                                                                                                                                                                                                         |
| **Blockchain** | Web3j Core / Contracts / Utils                                                                                                                                                                                                                                        |
| **Messaging**  | AWS SQS, MQTT                                                                                                                                                                                                                                                         |
| **Storage**    | AWS S3 (Transfer Manager)                                                                                                                                                                                                                                             |
| **Monitoring** | Mattermost Webhook, Spring Actuator                                                                                                                                                                                                                                   |
| **Docs**       | Swagger UI (springdoc-openapi-starter-webmvc-ui 2.6.0)                                                                                                                                                                                                                |
| **IDE**        | IntelliJ IDEA 2025.1.3 (Ultimate Edition)                                                                                                                                                                                                                             |

</div><br>

### ⚙️ Infra / DevOps

<div align="center">

![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![AWS SQS](https://img.shields.io/badge/AWS%20SQS-FF4F00?style=for-the-badge&logo=awslambda&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-2.516.2-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-28.1.1-2496ED?style=for-the-badge&logo=docker&logoColor=white)<br>
![Grafana](https://img.shields.io/badge/Grafana-10.4.2-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-v2.54.1-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-1.27-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Mosquitto](https://img.shields.io/badge/Mosquitto-2.0.22-3C5280?style=for-the-badge&logo=eclipsepaho&logoColor=white)<br>
![Node Exporter](https://img.shields.io/badge/Node%20Exporter-v1.9.1-5091CD?style=for-the-badge&logo=prometheus&logoColor=white)
![cAdvisor](https://img.shields.io/badge/cAdvisor-v0.53.0-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitLab](https://img.shields.io/badge/GitLab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white)

<br>

| **Category**               | **Stack**                                                                 |
| :------------------------- | :------------------------------------------------------------------------ |
| **Infra**                  | AWS EC2 (Ubuntu 22.04 LTS), AWS S3, AWS SQS                               |
| **CI/CD**                  | Jenkins 2.516.2, Docker 28.1.1, Docker Compose 2.38.2                     |
| **Web / Proxy**            | Nginx 1.27                                                                |
| **MQTT Broker**            | Mosquitto 2.0.22                                                          |
| **Monitoring**             | Grafana 12.2.0, Prometheus v3.5.0, Node Exporter v1.9.1, cAdvisor v0.53.0 |
| **Version Control / Auth** | GitLab                                                                    |
| **Server Spec**            | 4 vCPUs / 16 GB RAM / SSD 320 GB / HDD 6 TB                               |

</div><br>

### 🔌 IoT

<div align="center">

![Arduino](https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=arduino&logoColor=white)
![ESP32](https://img.shields.io/badge/ESP32-000000?style=for-the-badge&logo=espressif&logoColor=white)
![C/C++](https://img.shields.io/badge/C%2FC++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)
![Servo Motor](https://img.shields.io/badge/Servo%20Motor-FFB300?style=for-the-badge&logo=electronfiddle&logoColor=white)

<br>

| **Category** | **Stack**                       |
| :----------: | :------------------------------ |
| **Hardware** | Arduino, ESP32                  |
| **Language** | C / C++                         |
|  **Module**  | Servo Motor (Door Lock Control) |

</div><br>

### 🤝 Collaboration

<div align="center">

![GitLab](https://img.shields.io/badge/GitLab-%23181717?style=for-the-badge&logo=gitlab&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-%23F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-%230A0FFF?style=for-the-badge&logo=jira&logoColor=white)
![Mattermost](https://img.shields.io/badge/Mattermost-0058CC?style=for-the-badge&logo=mattermost&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-%235865F2?style=for-the-badge&logo=discord&logoColor=white)
![ZEP](https://img.shields.io/badge/ZEP-%23000000?style=for-the-badge&logo=zapier&logoColor=white)

</div>
<br>

## 🌐 시스템 아키텍처

<a name="systemArchitecture"></a>

### 🖧 System Architecture

<div align="center">

<img src="./readme-assets/oasis_architecture.png"/>
</div><br>

### 📢 Collaboration & Event Notification

<div align="center">

<table>
  <tr>
    <td align="center" width="50%"><b>🧩 Jenkins Pipeline</b></td>
    <td align="center" width="50%"><b>🧠 DLP Process</b></td>
  </tr>
  <tr>
    <td align="center">
      <img src="./readme-assets/jenkins_pipeline.png" width="100%" alt="Jenkins Pipeline"/>
    </td>
    <td align="center">
    <img src="./readme-assets/dlp_process.png" width="100%" alt="DLP Process"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%"><b>🗨️ Jira Issue Created</b></td>
    <td align="center" width="50%"><b>🔀 Merge Request Notification</b></td>
  </tr>
  <tr>
    <td align="center">
      <img src="./readme-assets/jira_issue_created.png" width="100%" alt="Jira Issue Created"/>
    </td>
    <td align="center">
      <img src="./readme-assets/mr_notification.png" width="100%" alt="Merge Request Notification"/>
    </td>
  </tr>
</table>

</div>

<br>

## 📲 기능 구성

<a name="skills"></a>

<div align="center">

<table>
  <tbody align="center">
    <tr>
      <th style="text-align: center">시작 화면</th>
      <th style="text-align: center">회원가입</th>
      <th style="text-align: center">숙소 검색</th>
    </tr>
    <tr>
      <td width="33%"><img width="100%" src="./readme-assets/skills/1_splash.gif"/></td>
      <td width="33%"><img width="100%" src="./readme-assets/skills/2_register.gif"/></td>
      <td width="33%"><img width="100%" src="./readme-assets/skills/3_search.gif"/></td>
    </tr>
  </tbody>

  <tbody align="center">
    <tr>
      <th style="text-align: center">게스트 스마트키</th>
      <th style="text-align: center">스마트키 리스트</th>
      <th style="text-align: center">채팅</th>
    </tr>
    <tr>
      <td width="33%"><img width="100%" src="./readme-assets/skills/4_smartKey_none.gif"/></td>
      <td width="33%"><img width="100%" src="./readme-assets/skills/5_smartKey.gif"/></td>
      <td width="33%"><img width="100%" src="./readme-assets/skills/6_chat.gif"/></td>
    </tr>
  </tbody>

  <tbody align="center">
    <tr>
      <th style="text-align: center">블록체인 지갑생성</th>
      <th style="text-align: center">블록체인 지갑 충전</th>
      <th style="text-align: center">내 예약 확인</th>
    </tr>
    <tr>
      <td width="33%"><img width="100%" src="./readme-assets/skills/7_wallet.gif"/></td>
      <td width="33%"><img width="100%" src="./readme-assets/skills/8_wallet_topup.gif"/></td>
      <td width="33%"><img width="100%" src="./readme-assets/skills/9_reservation_check.gif"/></td>
    </tr>
  </tbody>

  <tbody align="center">
    <tr>
      <th style="text-align: center">내 관심 숙소</th>
      <th style="text-align: center">내 리뷰 확인</th>
      <th style="text-align: center">내 프로필</th>
    </tr>
    <tr>
      <td width="33%"><img width="100%" src="./readme-assets/skills/10_wishlist.gif"/></td>
      <td width="33%"><img width="100%" src="./readme-assets/skills/11_review.gif"/></td>
      <td width="33%"><img width="100%" src="./readme-assets/skills/12_profile.gif"/></td>
    </tr>
  </tbody>

  <tbody align="center">
    <tr>
      <th style="text-align: center">내 숙소 관리</th>
      <th style="text-align: center">내 숙소 등록</th>
      <th style="text-align: center">숙소 예약</th>
    </tr>
    <tr>
      <td width="33%"><img width="100%" src="./readme-assets/skills/13_edit_stay.gif"/></td>
      <td width="33%"><img width="100%" src="./readme-assets/skills/14_create_stay.gif"/></td>
      <td width="33%"><img width="100%" src="./readme-assets/skills/15_reservation.gif"/></td>
    </tr>
  </tbody>
</table>
</div>
<br>

## 📂 디렉터리 구조

<a name="directories"></a>

### 🌕 Frontend

<details align="left">
  <summary>
    <strong>Frontend-App</strong>
  </summary>

```
📦 front
 ┣ 📂public
 ┃ ┣ 📂fonts
 ┃ ┣ 📂icons
 ┃ ┣ 📂lotties
 ┃ ┗ 📜manifest.webmanifest
 ┣ 📂src
 ┃ ┣ 📂apis
 ┃ ┣ 📂app
 ┃ ┃ ┣ 📂chat
 ┃ ┃ ┣ 📂create-stay
 ┃ ┃ ┣ 📂edit-stay
 ┃ ┃ ┣ 📂install-ios
 ┃ ┃ ┣ 📂language
 ┃ ┃ ┣ 📂main
 ┃ ┃ ┣ 📂my-profile
 ┃ ┃ ┣ 📂register
 ┃ ┃ ┣ 📂reservation
 ┃ ┃ ┣ 📂reservation-detail
 ┃ ┃ ┣ 📂search
 ┃ ┃ ┣ 📂smart-key
 ┃ ┃ ┣ 📂splash
 ┃ ┃ ┣ 📂stays
 ┃ ┃ ┗ 📂_components
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂icons
 ┃ ┃ ┣ 📂images
 ┃ ┃ ┃ ┗ 📂flags
 ┃ ┃ ┗ 📂logos
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂atoms
 ┃ ┃ ┣ 📂molecules
 ┃ ┃ ┗ 📂organisms
 ┃ ┣ 📂features
 ┃ ┃ ┣ 📂chat
 ┃ ┃ ┣ 📂common
 ┃ ┃ ┣ 📂create-stay
 ┃ ┃ ┣ 📂edit-stay
 ┃ ┃ ┣ 📂language
 ┃ ┃ ┣ 📂main
 ┃ ┃ ┣ 📂my-profile
 ┃ ┃ ┣ 📂register
 ┃ ┃ ┣ 📂reservation
 ┃ ┃ ┣ 📂search
 ┃ ┃ ┣ 📂smart-key
 ┃ ┃ ┣ 📂splash
 ┃ ┃ ┗ 📂stays
 ┃ ┣ 📂lib
 ┃ ┃ ┣ 📂circle
 ┃ ┃ ┗ 📂firebase
 ┃ ┣ 📂providers
 ┃ ┣ 📂services
 ┃ ┣ 📂stores
 ┃ ┣ 📂types
 ┃ ┗ 📂utils
 ┣ 📂styles
 ┣ 📂types
 ┣ 📜.prettierrc
 ┣ 📜dockerfile
 ┣ 📜eslint.config.mjs
 ┣ 📜next.config.ts
 ┣ 📜package.json
 ┣ 📜postcss.config.js
 ┣ 📜README.md
 ┣ 📜tailwind.config.js
 ┣ 📜tailwind.config.ts
 ┣ 📜tsconfig.json
 ┗ 📜README.md

```

</details>

### 🌑 Backend

<details align="left">
  <summary>
    <strong>Backend-Core</strong>
  </summary>

```
📦 oasis
 ┣ 📂.gradle
 ┃ ┣ 📂8.14.3
 ┃ ┣ 📂buildOutputCleanup
 ┃ ┗ 📂vcs-1
 ┣ 📂.idea
 ┃ ┗ 📂modules
 ┣ 📂gradle
 ┃ ┗ 📂wrapper
 ┣ 📂build
 ┃ ┣ 📂classes
 ┃ ┃ ┗ 📂java
 ┃ ┃ ┃ ┗ 📂main
 ┃ ┃ ┃ ┃ ┗ 📂org
 ┃ ┃ ┃ ┃ ┃ ┗ 📂muhan
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂oasis
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂charging
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂vo
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂chatTranslate
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂util
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂base
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂exception
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂external
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂circle
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂key
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂vo
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂mqtt
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂handler
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂vo
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂openAI
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂client
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂domain
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂reservation
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂enums
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂listener
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂vo
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂review
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂vo
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂s3
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂security
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂exception
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂handler
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂jwt
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂vo
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂settlement
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂stay
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂vo
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂vo
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂wallet
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂circle
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂vo
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂web3
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂wish
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┣ 📂resources
 ┃ ┗ 📂tmp
 ┣ 📂src
 ┃ ┣ 📂main
 ┃ ┃ ┣ 📂java
 ┃ ┃ ┃ ┗ 📂org
 ┃ ┃ ┃ ┃ ┗ 📂muhan
 ┃ ┃ ┃ ┃ ┃ ┗ 📂oasis
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂charging
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂chatTranslate
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂external
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂key
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂mqtt
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂openAI
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂reservation
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂review
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂s3
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂security
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂settlement
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂stay
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂wallet
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂web3
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂wish
 ┃ ┃ ┗ 📂resources
 ┃ ┗ 📂test
 ┃ ┃ ┗ 📂java
 ┃ ┃ ┃ ┗ 📂org
 ┃ ┃ ┃ ┃ ┗ 📂muhan
 ┃ ┃ ┃ ┃ ┃ ┗ 📂oasis
 ┣ 📜.gitattributes
 ┣ 📜.gitignore
 ┣ 📜build.gradle
 ┣ 📜Dockerfile
 ┣ 📜gradlew
 ┣ 📜gradlew.bat
 ┣ 📜README.md
 ┗ 📜settings.gradle
```

</details>
<br>

## 📦 프로젝트 산출물

<a name="projectDeliverables"></a>

<h3><a href="https://youtu.be/zElqUWnAi4o" target="_blank">📹 Demonstration video</a></h3>
<div align="center">

<a href="https://youtu.be/zElqUWnAi4o" target="_blank"><img src="./readme-assets/oasis_demonstration_video.png"/></a>

</div>

<h3>🖼️ 화면 설계서</h3>
<div align="center">

<img src="./readme-assets/oasis_figma.png"/>
</div>

<h3>🗄️ ERD</h3>
<div align="center">

<img src="./readme-assets/oasis_erd.png"/>
</div>

<h3>✅ Swagger API Docs</h3>
<details align="left">
  <summary>
    <strong>Backend</strong>
  </summary>

  <div align="center">

  <img src="./readme-assets/oasis_API.png"/>
  </div>
</details>

<h3>📅 Jira Issues</h3>
<details align="left">
  <summary>
    <strong>자세히</strong>
  </summary>

  <div align="center">

  <img src="./readme-assets/oasis_jira.png"/>
  </div>
</details>

<h3><a href="https://www.notion.so/25abdd006a7d81b386bfc57e598b43d5" target="_blank">📋 기능 명세서</a></h3>
<details align="left">
  <summary>
    <strong>자세히</strong>
  </summary>
  <div align="center">

<a href="https://www.notion.so/25abdd006a7d81b386bfc57e598b43d5" target="_blank"><img src="./readme-assets/oasis_functional_specification.png" width="60%"/></a>

  </div>

</details>

<h3><a href="https://www.notion.so/API-25abdd006a7d81c9aafbebc127a5014c" target="_blank">📡 API 명세서</a></h3>
<details align="left">
  <summary>
    <strong>자세히</strong>
  </summary>
  <div align="center">

<a href="https://www.notion.so/API-25abdd006a7d81c9aafbebc127a5014c" target="_blank"><img src="./readme-assets/oasis_api_specification.png"/></a>

  </div>

</details>
