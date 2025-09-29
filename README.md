<div align="center">

# 🏠 oasis

</div>

**블록체인 기반 P2P** 숙박 예약 플랫폼<br>
**스마트 계약(Smart Contract)**을 통해 신뢰 없이 투명한 거래를 보장하고,
디지털 키 발급 및 결제 내역을 온체인(On-chain)으로 관리하여,
중개 수수료 없이 게스트와 호스트가 직접 연결되는 탈중앙화 숙박 예약 서비스를 제공합니다.

> 머무는 순간까지, 여행이니까 **oasis**

- **개발 기간** : 2025.08.25 ~ 2025.09.29 **(6주)**
- **플랫폼** : PWA Web & Mobile
- **개발 인원** : 6명
- **기관** : 삼성 청년 SW·AI 아카데미 13기 <br><br>

<!-- <img src="./readme-assets/oasis_thumbnail.png" /> -->

</div> <br>

## 🔎 목차

<div align="center">

### <a href="#developers">🌴 팀원 소개</a>

### <a href="#techStack">🛠️ 기술 스택</a>

### <a href="#systemArchitecture">🌐 시스템 아키텍처</a>

### <a href="#skills">📲 기능 구성</a>

### <a href="#directories">📂 디렉터리 구조</a>

### <a href="#projectDeliverables">📦 프로젝트 산출물</a>

</div>
<br>

## 🌴 팀원 구성

<a name="developers"></a>

<div align="center">

<div align="center">
<table>
    <tr>
        <td width="33%" align="center"> <a href="https://github.com/gyudol">
            <img src="./readme-assets/doyun_lee.jpg" width="160px" /> <br> 이도윤 <br>[Backend · Leader] </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/minhe8564">
            <img src="./readme-assets/minhee_lee.png" width="160px" /> <br> 이민희 <br>[Frontend · BlockChain] </a> <br></td>
        <td width="33%" align="center"> <a href="https://github.com/0w0n2">
            <img src="./readme-assets/sumin_kim.png" width="160px" /> <br> 김수민 <br>[Frontend · 
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
        <img src="./readme-assets/ahhyun_lee.jpg" width="160px" /> <br> 이아현 <br>[Backend · BlockChain] </a> <br></td>
    </tr>
    <tr>
        <td width="280px">
          <sub>
            - CI/CD 파이프라인 구축 / 배포 자동화 <br>
            - AWS Cloud 환경 세팅 <br>
            - HW ESP32 ↔ EC2 통신 연동 / IoT 테스트 환경 구성 <br>
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

---

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

| **Category**             | **Stack**                                                                   |
| :----------------------- | :-------------------------------------------------------------------------- |
| **Language**             | TypeScript 5.4.5                                                            |
| **Runtime Environment**  | Node.js 22.12.0 (PWA 기반)                                                  |
| **Framework**            | Next.js 15.5.2, React 18.3.1 (App Router)                                   |
| **Styling**              | TailwindCSS 3.4.13, Emotion 11.14.0, Framer Motion 12.23.12                 |
| **State / Data**         | Zustand 5.0.8, TanStack React Query 5.87.1                                  |
| **Form / Validation**    | React Hook Form 7.62.0, Zod 3.23.8, @hookform/resolvers 3.10.0              |
| **Network / Auth**       | Axios 1.11.0, Firebase Auth 12.2.1, JWT Decode 4.0.0                        |
| **UI / Animation**       | Swiper 12.0.2, Lottie-web 5.13.0, Lucide-react 0.542.0, Emoji Picker 4.13.3 |
| **Blockchain / Payment** | @circle-fin/w3s-pw-web-sdk 1.1.11 (USDC 결제 처리)                          |
| **Build / PWA**          | next-pwa 5.6.0, Babel Loader 10.0.0                                         |
| **IDE**                  | Visual Studio Code 1.103.1                                                  |

</div>

---

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

</div>

---

### ⚙️ Infra / DevOps

### ⚙️ Infra / DevOps

<div align="center">

![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
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

| **Category**               | **Stack**                                                                                  |
| :------------------------- | :----------------------------------------------------------------------------------------- |
| **Infra**                  | AWS EC2 (Ubuntu 22.04 LTS), AWS S3                                                         |
| **CI/CD**                  | Jenkins **2.516.2**, Docker **28.1.1**, Docker Compose **2.38.2**                          |
| **Web / Proxy**            | Nginx **1.27**                                                                             |
| **MQTT Broker**            | Mosquitto **2.0.22**                                                                       |
| **Monitoring**             | Grafana **10.4.2**, Prometheus **v2.54.1**, Node Exporter **v1.9.1**, cAdvisor **v0.53.0** |
| **Version Control / Auth** | GitLab                                                                                     |
| **Server Spec**            | 4 vCPUs / 16 GB RAM / SSD 320 GB / HDD 6 TB                                                |

</div>

---

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

</div>

---

### 🤝 Collaboration

<div align="center">

![GitLab](https://img.shields.io/badge/GitLab-%23181717?style=for-the-badge&logo=gitlab&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-%23F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-%230A0FFF?style=for-the-badge&logo=jira&logoColor=white)
![Mattermost](https://img.shields.io/badge/Mattermost-0058CC?style=for-the-badge&logo=mattermost&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-%235865F2?style=for-the-badge&logo=discord&logoColor=white)

</div>
<br>

## 🌐 시스템 아키텍처

<a name="systemArchitecture"></a>

### 🖧 System Architecture

<div align="center">

<img src="./readme-assets/oasis_architecture.png.png"/>
</div>

### 📢 Collaboration & Event Notification

<div align="center">

<table>
  <tr>
    <td align="center" width="50%"><b>🧩 Jenkins Pipeline</b></td>
    <td align="center" width="50%"><b>🧠 DLP Process</b></td>
  </tr>
  <tr>
    <td align="center">
      <img src="./readme-assets/jenkins_pipeline.png" width="80%" alt="Jenkins Pipeline"/>
    </td>
    <td align="center">
    <img src="./readme-assets/dlp_process.png" width="80%" alt="DLP Process"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%"><b>🗨️ Jira Issue Created</b></td>
    <td align="center" width="50%"><b>🔀 Merge Request Notification</b></td>
  </tr>
  <tr>
    <td align="center">
      <img src="./readme-assets/jira_issue_created.png" width="80%" alt="Jira Issue Created"/>
    </td>
    <td align="center">
      <img src="./readme-assets/mr_notification.png" width="80%" alt="Merge Request Notification"/>
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
    <tr> <th style="text-align: center"> 데스크톱 앱 다운로드 </th> <th style="text-align: center"> 회원가입 </th> </tr>
    <tr> <td width="50%"><img width="100%" src="./readme-assets/demostration/desktop_app_download.gif"/></td> 
        <td width="50%"><img width="100%" src="./readme-assets/demostration/sign_up.gif"/></td> </tr> </tbody>
  <tbody align="center"> 
    <tr> <th style="text-align: center"> 일반 사용자 튜토리얼 </th> <th style="text-align: center"> 구화 사용자 튜토리얼 </th> </tr>
    <tr> <td width="50%"><img width="100%" src="./readme-assets/demostration/tutorial_common_user.gif"/></td>
    <td width="50%"><img width="100%" src="./readme-assets/demostration/tutorial_lip_reading_user.gif"/></td> </tr> </tbody>
  <tbody align="center"> 
    <tr> <th style="text-align: center"> 마이페이지 </th> <th style="text-align: center"> 대기방 생성 </th> </tr>
    <tr> <td width="50%"><img width="100%" src="./readme-assets/demostration/mypage.gif"/></td>
    <td width="50%"><img width="100%" src="./readme-assets/demostration/meeting_room_creating.gif"/></td> </tr>
  </tbody>
  <tbody align="center"> 
    <tr> <th style="text-align: center"> 대기방 채팅 </th> <th style="text-align: center"> 대기방 설정 </th> </tr>
    <tr> <td width="50%"><img width="100%" src="./readme-assets/demostration/chat.gif"/></td>
    <td width="50%"><img width="100%" src="./readme-assets/demostration/meeting_room_setting.gif"/></td> </tr>
  </tbody>
  <tbody align="center"> 
    <tr> <th style="text-align: center"> 라이브 세션 (일반 사용자) </th> <th style="text-align: center"> 라이브 세션 (구화 사용자) </th> </tr>
    <tr> <td width="50%"><img width="100%" src="./readme-assets/demostration/live_room_common_user.gif"/></td>
    <td width="50%"><img width="100%" src="./readme-assets/demostration/live_room_lip_reading_user.gif"/></td> </tr>
  </tbody>
</table>
</div>
<br>

## 📂 디렉터리 구조

<a name="directories"></a>

### 🌕 Frontend

<details align="left">
  <summary>
    <strong>Frontend</strong>
  </summary>

```
📦front
 ┣ 📂electron
 ┃ ┣ 📂assets
 ┣ 📂public
 ┃ ┣ 📂fonts
 ┃ ┗ 📂logo
 ┣ 📂src
 ┃ ┣ 📂apis
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂core
 ┃ ┃ ┣ 📂live-room
 ┃ ┃ ┣ 📂meeting-room
 ┃ ┃ ┣ 📂stomp
 ┃ ┃ ┗ 📂tutorial
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂category
 ┃ ┃ ┣ 📂icons
 ┃ ┃ ┣ 📂images
 ┃ ┃ ┣ 📂logo
 ┃ ┃ ┣ 📂profiles
 ┃ ┃ ┗ 📂test
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂common
 ┃ ┃ ┣ 📂live-room
 ┃ ┃ ┣ 📂main
 ┃ ┃ ┃ ┣ 📂modal
 ┃ ┃ ┣ 📂meeting-room
 ┃ ┃ ┃ ┣ 📂chat
 ┃ ┃ ┃ ┣ 📂members
 ┃ ┃ ┃ ┗ 📂modal
 ┃ ┃ ┃ ┃ ┣ 📂info
 ┃ ┃ ┃ ┃ ┗ 📂setting
 ┃ ┃ ┣ 📂my-page
 ┃ ┃ ┃ ┣ 📂modal
 ┃ ┃ ┃ ┗ 📂tab
 ┃ ┃ ┣ 📂tutorial
 ┃ ┃ ┃ ┣ 📂modal
 ┃ ┣ 📂hooks
 ┃ ┣ 📂pages
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂tutorial
 ┃ ┣ 📂stores
 ┃ ┣ 📂styles
 ┃ ┣ 📂types
 ┣ 📜.env
 ┣ 📜.gitignore
 ┣ 📜.prettierrc
 ┣ 📜db.json
 ┣ 📜eslint.config.js
 ┣ 📜index.html
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜README.md
 ┣ 📜tsconfig.app.json
 ┣ 📜tsconfig.json
 ┣ 📜tsconfig.node.json
 ┗ 📜vite.config.ts
```

</details>

### 🌑 Backend

<details align="left">
  <summary>
    <strong>Backend</strong>
  </summary>

```
📦backend-core
 ┣ 📂gradle
 ┃ ┗ 📂wrapper
 ┣ 📂src
 ┃ ┣ 📂main
 ┃ ┃ ┣ 📂java
 ┃ ┃ ┃ ┗ 📂com
 ┃ ┃ ┃ ┃ ┗ 📂bbusyeo
 ┃ ┃ ┃ ┃ ┃ ┗ 📂voida
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂constant
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂domain
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂util
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂chat
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂domain
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂live
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂liveroom
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂domain
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂model
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂meetingroom
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂domain
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂enums
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂member
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂constant
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂domain
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂enums
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂release
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂domain
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂in
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂out
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂vo
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂global
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂ai
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂stt
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂tts
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂aspect
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂exception
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂health
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂mail
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂util
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂properties
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂redis
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂dao
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂response
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂security
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂constant
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂filter
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂handler
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂oauth2
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂jwt
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂oauth2
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂util
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂support
 ┃ ┃ ┗ 📂resources
 ┃ ┗ 📂test
 ┃ ┃ ┗ 📂java
 ┃ ┃ ┃ ┗ 📂com
 ┃ ┃ ┃ ┃ ┗ 📂bbusyeo
 ┃ ┃ ┃ ┃ ┃ ┗ 📂voida
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

<h3><a href="https://youtu.be/C-kFXoJuF8M" target="_blank">📹 Video Portfolio</a></h3>
<div align="center">

<a href="https://youtu.be/C-kFXoJuF8M" target="_blank"><img src="./readme-assets/video_portfolio_thumbnail.png"/></a>

</div>

<h3>🖼️ 화면 설계서</h3>
<div align="center">

<img src="./readme-assets/screen_design.png"/>
</div>

<h3>🗄️ ERD</h3>
<div align="center">

<img src="./readme-assets/erd_image.png"/>
</div>

<h3>✅ Swagger API Docs</h3>
<details align="left">
  <summary>
    <strong>Backend-Core</strong>
  </summary>

  <div align="center">

  <img src="./readme-assets/backend_core_swagger.png"/>
  </div>
</details>

<details align="left">
  <summary>
    <strong>Backend-Lip-Model</strong>
  </summary>

  <div align="center">

  <img src="./readme-assets/backend_lip_model_swagger.png"/>
  </div>
</details>

<h3>📅 Jira Issues</h3>
<details align="left">
  <summary>
    <strong>자세히</strong>
  </summary>

  <div align="center">

  <img src="./readme-assets/jira_overall_issues.png"/>
  </div>
</details>

<h3><a href="https://www.notion.so/24276be4587d80a78d1ad824a9c825fe" target="_blank">📋 기능 명세서</a></h3>
<details align="left">
  <summary>
    <strong>자세히</strong>
  </summary>
  <div align="center">

<a href="https://www.notion.so/24276be4587d80a78d1ad824a9c825fe" target="_blank"><img src="./readme-assets/functional_specification.png" width="60%"/></a>

  </div>

</details>

<h3><a href="https://www.notion.so/API-22a76be4587d802cb7fed72fd1e93204" target="_blank">📡 API 명세서</a></h3>
<details align="left">
  <summary>
    <strong>자세히</strong>
  </summary>
  <div align="center">

<a href="https://www.notion.so/API-22a76be4587d802cb7fed72fd1e93204" target="_blank"><img src="./readme-assets/api_specification.png"/></a>

  </div>

</details>
