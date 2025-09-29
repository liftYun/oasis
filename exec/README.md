# 포팅 메뉴얼

## 1️⃣ 사용 스택

- **Frontend**
    - Next.js, TypeScript, Tailwind CSS, TanStack Query, Zustand, PWA, Cloud Firestore
- **Backend**
    - Spring Boot, Spring Security, Spring AI, Spring Batch, JPA, JWT, OAuth2.0
- **Database**
    - MySQL
- **Blockchain**
    - Solidity, Hardhat, Web3j, Circle SDK
- **Infra / DevOps**
    - AWS EC2, S3, Jenkins, Docker, Grafana, Prometheus, GitLab, Firebase
- **IoT**
    - Arduino(C/C++), ESP32, Servo Motor
- **Collaboration**
    - Jira, Mattermost, Notion, Figma

## 2️⃣ 개발 도구

### Frontend

- **프레임워크**
    - **Next.js 15.5.2**
    - **React 18.3.1**
- **라이브러리**
    - **상태 관리**
        - zustand ^5.0.8
    - **HTTP 요청**
        - axios ^1.11.0
    - **UI / 애니메이션**
        - framer-motion ^12.23.12
        - swiper ^12.0.2
        - emoji-picker-react ^4.13.3
        - lucide-react ^0.542.0
        - react-hot-toast ^2.6.0
        - tailwind-merge ^3.3.1
        - tailwind-scrollbar-hide ^4.0.0
        - lottie-web ^5.13.0
    - **폼 및 검증**
        - react-hook-form ^7.62.0
        - @hookform/resolvers ^3.10.0
        - zod ^3
    - **데이터 관리 / 비동기**
        - @tanstack/react-query ^5.87.1
        - use-debounce ^10.0.6
    - **드래그 앤 드롭**
        - @dnd-kit/core ^6.3.1
        - @dnd-kit/modifiers ^9.0.0
        - @dnd-kit/sortable ^10.0.0
        - @dnd-kit/utilities ^3.2.2
    - **날짜 및 시간**
        - date-fns ^4.1.0
        - react-day-picker ^9.9.0
    - **인증 및 토큰 관리**
        - jwt-decode ^4.0.0
        - firebase ^12.2.1
    - **블록체인 / 결제 SDK**
        - @circle-fin/w3s-pw-web-sdk ^1.1.11
    - **PWA / 서비스 워커**
        - next-pwa ^5.6.0
- **개발 및 테스트 도구**
    - **빌드 도구**
        - Next.js 자체 빌드 + Babel Loader ^10.0.0
    - **타입스크립트**
        - typescript ^5
    - **스타일링**
        - tailwindcss 3.4.13
        - autoprefixer ^10.4.21
        - postcss ^8.5.6
    - **ESLint 및 코드 포맷팅**
        - eslint ^8.57.0
        - eslint-config-next 15.5.2
        - eslint-config-prettier ^10.1.8
        - eslint-plugin-prettier ^5.5.4
        - prettier ^3.6.2
    - **바벨**
        - @babel/core ^7.28.4
        - @babel/preset-env ^7.28.3
    - **타입 정의**
        - @types/react ^18
        - @types/react-dom ^18
        - @types/node ^20
        - @types/jwt-decode ^3.1.0

### Backend

# Stay Oasis 백엔드 포팅(배포) 매뉴얼 v1.0

> 대상: 운영/개발 환경에 백엔드(Spring Boot 3.3, Java 17) 서비스를 설치·구동·운영하려는 엔지니어
> 

---

## 1) 시스템 개요

- **Framework**: Spring Boot 3.3.4 (Java 17)
- **Build**: Gradle (wrapper 포함)
- **DB**: MySQL (mysql-connector-j), JPA + Querydsl
- **Cache**: Redis (Lettuce)
- **Messaging**: AWS SQS, MQTT (Eclipse Paho)
- **Storage**: AWS S3 (AWS SDK v2)
- **Auth**: OAuth2 (Google), JWT (jjwt 0.12.3)
- **Web**: Spring MVC + WebFlux 일부, Validation, WebSocket
- **Docs**: springdoc-openapi (Swagger UI)
- **Others**: Quartz(스케줄러), Mattermost Webhook(모니터링 알림), OpenAI(프록시 경유)

---

## 2) 소스 구조 & 빌드 스펙

- **JDK**: 17 (필수)
- **Gradle 플러그인**: `org.springframework.boot 3.3.4`, `io.spring.dependency-management 1.1.6`
- **의존성 요약** (발췌):
    - spring-boot-starter: web, security, oauth2-client, data-jpa, data-redis, validation, websocket, quartz
    - DB: mysql-connector-j, Querydsl (jakarta)
    - Cloud: spring-cloud-aws-starter-sqs (BOM 3.2.0), AWS SDK v2 (S3, Transfer Manager)
    - Auth: jjwt-api/impl/jackson 0.12.3
    - Blockchain: web3j core/contracts/utils
    - MQTT: org.eclipse.paho.client.mqttv3 1.2.5
    - 문서: springdoc-openapi-starter-webmvc-ui 2.6.0

> build.gradle에 정의된 버전과 BOM을 반드시 동일하게 유지하세요. Java 17 미만에서는 컴파일/실행이 실패합니다.
> 

---

## 3) 환경 변수(ENV) 정의

> 애플리케이션은 application.yml의 값들을 환경 변수로 주입받습니다. (운영/스테이징/로컬 공통)
> 

### 3.1 서버/네트워크

| 키 | 설명 | 예시 |
| --- | --- | --- |
| `SERVER_PORT` | Spring Boot 포트 | `8080` |
| `BACK_BASE_URL` | 백엔드 베이스 URL(콜백 구성에 사용) | `https://api.stay-oasis.kr` |
| `FRONT_BASE_URL` | 프론트 베이스 URL(CORS/리다이렉트) | `https://app.stay-oasis.kr` |

### 3.2 DB (MySQL)

| 키 | 설명 | 예시 |
| --- | --- | --- |
| `DATASOURCE_URL` | JDBC URL | `jdbc:mysql://db:3306/prod?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul` |
| `DATASOURCE_USERNAME` | DB 계정 | `oasis` |
| `DATASOURCE_PASSWORD` | DB 비밀번호 | `***` |

> spring.jpa.hibernate.ddl-auto=update 로 되어 있어 최초 스키마를 자동 생성합니다. 운영에서는 DDL 변경을 관리 도구(Flyway/Liquibase)로 전환을 권장합니다.
> 

### 3.3 Redis

| 키 | 설명 | 예시 |
| --- | --- | --- |
| `REDIS_HOST` | Redis 호스트 | `redis` 또는 `127.0.0.1` |
| `REDIS_PORT` | Redis 포트 | `6379` |
| `REDIS_PASSWORD` | 비밀번호(없으면 공란) | `` |

### 3.4 보안/인증

| 키 | 설명 | 예시 |
| --- | --- | --- |
| `JWT_SECRET_KEY` | JWT 서명 키(충분히 긴 랜덤) | `base64 혹은 긴 랜덤 문자열` |
| `GOOGLE_CLIENT_ID` | Google OAuth2 | `xxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 | `***` |

> Google 콘솔의 Authorized redirect URI 에 https://<BACK_BASE_URL>/login/oauth2/code/google 를 정확히 등록해야 합니다. (예: https://api.stay-oasis.kr/login/oauth2/code/google)
> 

### 3.5 AWS (S3/SQS)

| 키 | 설명 | 예시 |
| --- | --- | --- |
| `S3_REGION` | S3 리전 | `ap-northeast-2` |
| `S3_BUCKET` | 버킷명 | `stay-oasis-prod` |
| `S3_STAY_IMG_PATH` | 숙소 이미지 프리픽스 | `stays/` |
| `S3_CERTIFICATE_PATH` | 인증서 경로 | `certs/` |
| `S3_PROFILE_IMG_PATH` | 프로필 이미지 경로 | `profiles/` |
| `S3_ACCESS_KEY_ID` | S3 접근 키 | `AKIA...` |
| `S3_SECRET_ACCESS_KEY` | S3 시크릿 | `***` |
| `AWS_ACCESS_KEY_ID` | SQS용 접근 키 | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | SQS용 시크릿 | `***` |
| `SQS_TRANS_STAY` | 숙소 번역 큐 URL | `https://sqs.../stay-translation` |
| `DLQ_TRANS_STAY` | 숙소 번역 DLQ | `...` |
| `SQS_TRANS_REVIEW` | 리뷰 번역 큐 | `...` |
| `DLQ_TRANS_REVIEW` | 리뷰 번역 DLQ | `...` |
| `SQS_SUMMARY_REVIEW` | 리뷰 요약 큐 | `...` |
| `DLQ_SUMMARY_REVIEW` | 리뷰 요약 DLQ | `...` |

### 3.6 OpenAI(프록시)

| 키 | 설명 | 예시 |
| --- | --- | --- |
| `OPENAI_SECRET_KEY` | OpenAI API Key | `sk-...` |
| *(고정)* | `openai.chat-url` | `https://gms.ssafy.io/gmsapi/api.openai.com/v1/chat/completions` |
| *(고정)* | `openai.chat-model` | `gpt-4.1-mini` |

### 3.7 블록체인/결제

| 키 | 설명 | 예시 |
| --- | --- | --- |
| `CIRCLE_BASE_URL` | Circle Smart Wallet API | `https://api.circle.com/v1` |
| `CIRCLE_API_KEY` | Circle API Key | `***` |
| `CONTRACT_ADDRESS` | 스마트 컨트랙트 | `0x...` |
| `USDC_ADDRESS` | USDC 토큰 | `0x...` |
| `INFURA_URL` | RPC 엔드포인트 | `https://polygon-amoy.infura.io/v3/<projectId>` |
| `WALLET_PRIVATE_KEY` | 서버 지갑 프라이빗키(주의) | `***` |
| *(고정)* `chain.id` | 체인 ID | `80002` (Polygon Amoy) |

### 3.8 MQTT/디바이스/모니터링

| 키 | 설명 | 예시 |
| --- | --- | --- |
| `MQTT_HOST` | 브로커 호스트 | `ssl://mqtt.stay-oasis.kr` 혹은 DNS/IP |
| `MQTT_PORT` | 포트 | `8883` (SSL) |
| `MQTT_USERNAME` | 계정 | `oasis` |
| `MQTT_PASSWORD` | 비밀번호 | `***` |
| `MQTT_LOG_PATH` | 로그 디렉터리 | `/var/log/oasis/mqtt` |
| `DEVICE_OPEN_CMD` | 기본 제어 명령 | `open` |
| `DEVICE_MOVE_ANGLE` | 이동 각도 | `90` |
| `DEVICE_HOME_ANGLE` | 홈 각도 | `0` |
| `DEVICE_DURATION_SEC` | 동작 시간 | `3` |
| `MATTERMOST_URL` | MM Webhook | `https://mattermost.../hooks/...` |

---

## 4) 로컬 개발 절차

### 4.1 사전 준비물

- JDK 17, MySQL 8.x, Redis 7.x, (선택) Mosquitto 2.x, (선택) LocalStack(AWS 대체), Node 18+ (프론트 연동 시)

### 4.2 환경 변수 주입(.env 예시)

```bash
# server
export SERVER_PORT=8080
export BACK_BASE_URL=http://localhost:8080
export FRONT_BASE_URL=http://localhost:3000

# db
export DATASOURCE_URL="jdbc:mysql://localhost:3306/dev?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul"
export DATASOURCE_USERNAME=dev
export DATASOURCE_PASSWORD=devpass

# redis
export REDIS_HOST=localhost
export REDIS_PORT=6379
export REDIS_PASSWORD=

# jwt
export JWT_SECRET_KEY="replace-with-long-random-string"

# oauth2
export GOOGLE_CLIENT_ID=...
export GOOGLE_CLIENT_SECRET=...

# aws (필요 시)
export S3_REGION=ap-northeast-2
export S3_BUCKET=stay-oasis-dev
export S3_ACCESS_KEY_ID=...
export S3_SECRET_ACCESS_KEY=...
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...

# queues (선택)
export SQS_TRANS_STAY=...
export DLQ_TRANS_STAY=...
...

# openai proxy
export OPENAI_SECRET_KEY=sk-...

# blockchain
export INFURA_URL=https://polygon-amoy.infura.io/v3/...
export CONTRACT_ADDRESS=0x...
export USDC_ADDRESS=0x...
export CIRCLE_BASE_URL=https://api.circle.com/v1
export CIRCLE_API_KEY=...
export WALLET_PRIVATE_KEY=...
export CHAIN_ID=80002

# mqtt
export MQTT_HOST=ssl://localhost
export MQTT_PORT=8883
export MQTT_USERNAME=test
export MQTT_PASSWORD=test
export MQTT_LOG_PATH=/tmp/oasis-mqtt
export DEVICE_OPEN_CMD=open
export DEVICE_MOVE_ANGLE=90
export DEVICE_HOME_ANGLE=0
export DEVICE_DURATION_SEC=3

# monitor
export MATTERMOST_URL=https://...

```

### 4.3 빌드 & 실행

```bash
./gradlew clean build -x test
java -jar build/libs/oasis-0.0.1-SNAPSHOT.jar \
  --server.port=$SERVER_PORT

```

### 4.4 Swagger UI

- 기본: `http://localhost:8080/swagger-ui/index.html`
- `swagger.uri: "/"` 를 사용하는 커스텀 설정이 있는 경우 루트로 노출될 수 있습니다. (프로젝트 설정에 따름)

---

## 5) 운영(Production) 배포 가이드

### 5.1 시스템 요구 사항

- OS: Linux (x86_64) 권장
- JDK 17 런타임
- 네트워크/방화벽 오픈
    - 8080(또는 Nginx 뒤의 내부 포트), 3306(MySQL), 6379(Redis), 8883(MQTT SSL), 아웃바운드: AWS S3/SQS, Infura, Google OAuth

### 5.2 실행 사용자/디렉터리

```bash
useradd -m -r -s /bin/false oasis
mkdir -p /opt/oasis /var/log/oasis /var/lib/oasis
chown -R oasis:oasis /opt/oasis /var/log/oasis /var/lib/oasis

```

### 5.3 배포 산출물

- `build/libs/oasis-0.0.1-SNAPSHOT.jar`
- (선택) `application.yml` 템플릿 및 `.env` 파일 (CI/CD에서 ENV 주입을 권장)

### 5.4 Systemd 예시

```
[Unit]
Description=Stay Oasis API
After=network.target

[Service]
User=oasis
WorkingDirectory=/opt/oasis
EnvironmentFile=/opt/oasis/.env
ExecStart=/usr/bin/java -jar /opt/oasis/oasis-0.0.1-SNAPSHOT.jar --server.port=${SERVER_PORT}
Restart=always
RestartSec=5
SuccessExitStatus=143
StandardOutput=append:/var/log/oasis/app.log
StandardError=append:/var/log/oasis/app.err

[Install]
WantedBy=multi-user.target

```

### 5.5 리버스 프록시(Nginx) 기본

```
server {
  listen 443 ssl;
  server_name api.stay-oasis.kr;

  ssl_certificate     /etc/letsencrypt/live/api.stay-oasis.kr/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.stay-oasis.kr/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $host;
  }
}

```

> server.forward-headers-strategy=framework 이 설정되어 있으므로, 프록시에서 X-Forwarded-* 헤더가 전달되도록 구성하십시오.
> 

---

## 6) 서비스 연동 체크리스트

### 6.1 OAuth2 (Google)

- [ ]  OAuth 동의 화면/프로젝트 발급 완료
- [ ]  Authorized redirect URI: `${BACK_BASE_URL}/login/oauth2/code/google`
- [ ]  `app.domain` 과 `front-base-url`이 프론트 실제 도메인과 일치

### 6.2 JWT

- [ ]  `JWT_SECRET_KEY` 길이/엔트로피 충분 (HMAC256 이상 권장)
- [ ]  Access/Refresh 만료(ms): `600000`, `604800000` (정책에 맞게 조정)

### 6.3 DB/Redis

- [ ]  MySQL 사용자/스키마 권한 확인 (utf8mb4)
- [ ]  Redis 인증/보안그룹 확인, maxmemory 정책(필요 시) 설정

### 6.4 S3/SQS

- [ ]  버킷 정책(CORS 포함), 객체 키 프리픽스 확인
- [ ]  SQS 큐/권한, DLQ 바인딩 확인

### 6.5 MQTT

- [ ]  브로커 SSL 인증서(서버명 일치), 계정/권한
- [ ]  `topic-prefix=cmd` 규칙에 맞는 구독/발행 토픽 존재

### 6.6 블록체인

- [ ]  RPC(Infura) 접근 가능, 체인ID 80002
- [ ]  컨트랙트/USDC 주소 정확성, 서버 지갑 키 보관(HSM/Parameter Store 권장)

### 6.7 OpenAI 프록시

- [ ]  프록시 URL·모델 값 확인, `OPENAI_SECRET_KEY` 유효성

---

## 7) 기동 전 점검 & 헬스체크

- (선택) `spring-boot-starter-actuator` 추가 시
    - `/actuator/health`, `/actuator/metrics` 사용 가능
- 기본 헬스체크 (간단):

```bash
curl -I https://api.stay-oasis.kr/actuator/health || curl -I https://api.stay-oasis.kr/swagger-ui/index.html

```

---

## 8) 트러블슈팅 FAQ

1. **Google OAuth 400: invalid_request (redirect_uri mismatch)**
    - 콘솔에 등록된 리다이렉트 URI가 **정확히** `${BACK_BASE_URL}/login/oauth2/code/google` 와 일치하는지 확인. HTTP↔HTTPS, 슬래시 누락, 도메인 오타 주의.
2. **MySQL `Data too long` / `bit(1)` 이슈**
    - `bit(1)` 컬럼에 `'1'` 문자열을 넣지 말고 **boolean/bit 값**으로 저장.
    - 워크벤치 수동 수정 시: 테이블 디자인 → 컬럼 타입을 `TINYINT(1)` 로 변경하거나, 애플리케이션 매핑(boolean) 일치 여부 확인.
3. **FK 제약으로 삭제 실패 (ERROR 1451)**
    - 참조 테이블(예: `stay_rating_summary`, `devices`) 레코드 먼저 삭제 또는 FK `ON DELETE CASCADE` 정책 검토.
4. **CORS/쿠키 문제 (401 Unauthorized, Set-Cookie 미노출)**
    - 백엔드: `Access-Control-Allow-Credentials: true`, `Access-Control-Allow-Origin: <FRONT_BASE_URL>` 설정 필요.
    - 프론트 axios: `withCredentials: true`.
5. **JWT 예외 및 필터 스킵 경로**
    - OAuth2 콜백, 정적 리소스 등 화이트리스트 경로가 `JWTFilter`의 SKIP 목록에 포함되는지 확인.
6. **S3 403 / 서명 실패**
    - 키/리전/버킷명 오타 점검, IAM 정책에 PutObject/GetObject 권한 포함.
7. **MQTT SSL 연결 실패**
    - 포트(8883) 오픈, 서버 인증서 CN/SAN, 클라이언트 신뢰스토어 구성.

---

## 9) 운영 모니터링/로그

- **Log4j2** 사용. `ThreadContext`(MDC) 기반 추적ID 부여 (코드에 따라).
- 로그 경로 예: `/var/log/oasis/*.log`. 로테이션/수집(CloudWatch/ELK) 권장.
- Mattermost Webhook으로 주요 이벤트/에러 알림 전송 가능.

---

## 10) 배포 절차(요약)

1. ENV 준비(섹션 3)
2. 빌드: `./gradlew clean build -x test`
3. 산출물 배치: `/opt/oasis`
4. Systemd 등록 및 기동: `systemctl enable --now oasis`
5. 리버스 프록시/Nginx 적용 + TLS 발급
6. 기능 점검: OAuth 로그인, 이미지 업로드(S3), 번역 큐(SQS), MQTT 제어, 블록체인 트랜잭션, Swagger 문서

---

## 11) API 문서 접근

- 기본 경로: `/swagger-ui/index.html` (배포 환경 도메인 기준)
- `swagger.uri` 커스텀 사용 시 프로젝트 설정 참고

---

## 12) 보안 권고

- 비밀키/프라이빗키는 **환경 변수·시크릿 매니저**에 보관 (Git 미포함)
- 운영 DB는 **공개망 차단**, Bastion을 통한 접근
- HTTPS 강제 및 `X-Forwarded-Proto: https` 헤더 적용
- S3 버킷은 **퍼블릭 차단** + 필요한 CORS만 허용

---

## 13) (선택) Docker 배포 예시

### 13.1 Dockerfile (예시)

```docker
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY build/libs/oasis-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]

```

### 13.2 docker-compose (예시: DB/Redis 포함)

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: prod
      MYSQL_USER: oasis
      MYSQL_PASSWORD: oasis
      MYSQL_ROOT_PASSWORD: root
    ports: ["3306:3306"]
  redis:
    image: redis:7
    ports: ["6379:6379"]
  api:
    build: .
    env_file: ./.env
    ports: ["8080:8080"]
    depends_on: [db, redis]

```

---

## 14) 프론트엔드 연동 체크

- `app.front-base-url` ↔ 실제 프론트 도메인 일치
- OAuth2 로그인 플로우: 프론트 → 백엔드 `/oauth2/authorization/google` → 콜백 처리 → 토큰 발급
- 이미지 업로드: 프리사인 URL(S3) 또는 API를 통한 업로드 시 CORS 설정 필요

---

## 15) 변경 이력

- v1.0 (2025-09-29): 초기 작성

---

## 16) 추가 확인 필요 정보(제공 부탁드립니다)

1. 운영/스테이징 **도메인 확정** (front/back) 및 SSL 인증서 발급 방식(Let's Encrypt/ACM 등)
2. DB 초기 **스키마 마이그레이션 정책** (현재 `ddl-auto=update` → Flyway/Liquibase 전환 여부)
3. **S3 버킷 CORS/정책** (정확한 오리진·Method·Header 목록)
4. Google OAuth2 동의 화면 **범위/테스트 사용자 등록 상태**
5. MQTT 브로커 **인증서/CA 체인** 배포 경로와 TLS 설정(서버/클라이언트)
6. 운영 환경의 **프록시/로드밸런서** 유무(Nginx/ALB) 및 헬스체크 URL
7. Circle/블록체인 트랜잭션 처리 시 **수수료·리스크 정책**(재시도, 아이템포턴시 키) 적용 여부

## 3️⃣ 환경 변수

### Frontend

```jsx
NEXT_PUBLIC_API_URL=https://app-stay-oasis.kr
KAKAO_REST_API_KEY=5b1a0e64d37062ac4be651b1e8636ada

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBYakHrPFBkzRA1-M1nzCKLBr-MFLQK7SE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=oasis-2795b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=oasis-2795b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=oasis-2795b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=756233114763
NEXT_PUBLIC_FIREBASE_APP_ID=1:756233114763:web:146fbb6165258ad3a8b08e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-K628PF1CCR
NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY=6LfiV9ArAAAAABZsiq_j9mcaa9EIIXoDNYuESGeS
```

### Backend

```jsx
# Server -> 수정필요
SERVER_PORT=8080

# JWT
JWT_SECRET_KEY=bXl2dXJ5c2VjdXJlYmFzZTY0c2VjcmV0MTIzNA==

# OAuth_Google
GOOGLE_CLIENT_ID=1003304153004-u7ev2enu1966jsk4j5gjpbetbc0a9519.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# PAPAGO
PAPAGO_CLIENT_ID=a8hxuasqvl
PAPAGO_CLIENT_SECRET=Fsk5pEj3F8XIvWhnxnAptpEvJ4ClfxTpuD2AhZtl

# 레디스 -> 수정필요
REDIS_HOST=redis-vector
REDIS_PORT=6380
REDIS_PASSWORD=!@Oasis103

# DB
DATASOURCE_URL=jdbc:mysql://stay-oasis.kr:3366/dev?useSSL=false&useUnicode=true&serverTimezone=Asia/Seoul&allowPublicKeyRetrieval=true
DATASOURCE_USERNAME=backend_dev
DATASOURCE_PASSWORD=backendDev103

# S3 -> 수정필요
S3_REGION=ap-northeast-2
S3_BUCKET=stay-oasis
S3_ACCESS_KEY_ID=AKIAWCCWVAMLHZWAVXZC
S3_SECRET_ACCESS_KEY=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
S3_STAY_IMG_PATH=stay-image/
S3_CERTIFICATE_PATH=business-registration-certificate/
S3_PROFILE_IMG_PATH=profile-image/

# AI
OPENAI_SECRET_KEY=S13P22E103-30384f70-8ad3-489a-b6d3-bb4a22288647

# SQS
AWS_ACCESS_KEY_ID=AKIAWCCWVAMLIOH7WE5O
AWS_SECRET_ACCESS_KEY=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
SQS_TRANS_STAY=oasis-sqs-trans-stay.fifo
SQS_TRANS_REVIEW=oasis-sqs-trans-review.fifo
SQS_SUMMARY_REVIEW=oasis-sqs-summary-review.fifo
DLQ_TRANS_STAY=oasis-dlq-trans-stay.fifo
DLQ_TRANS_REVIEW=oasis-dlq-trans-review.fifo
DLQ_SUMMARY_REVIEW=oasis-dlq-summary-review.fifo

FRONT_BASE_URL=https://stay-oasis.kr
BACK_BASE_URL=https://app.stay-oasis.kr

# CIRCLE
CIRCLE_BASE_URL=https://api.circle.com/v1/w3s
CIRCLE_API_KEY=TEST_API_KEY:ec7bb7f5221b5a64060ff39d8c1da625:e4509722324693297ca398b2a51c707d

# 배포된 NomadBooking 컨트랙트 주소
CONTRACT_ADDRESS=0x3bda11c04838493f68f688207cc0c86fc96f8b03

#USDC 주
USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582

#INFURA RPC
INFURA_URL=wss://polygon-amoy.infura.io/ws/v3/d4c6f7b6c50040eeacfa2f575c9a58dc
WALLET_PRIVATE_KEY=0d9b9f51805db5db8468aa0863ae424d25353056d262ea9dfe216d4422a74fd3

#MQTT
MQTT_HOST=mqtt.stay-oasis.kr
MQTT_PORT=8883
MQTT_USERNAME=espuser
MQTT_PASSWORD=esp-pass
MQTT_LOG_PATH=/logs/mqtt

# DEVICE
DEVICE_OPEN_CMD=MOVE
DEVICE_MOVE_ANGLE=90
DEVICE_HOME_ANGLE=0
DEVICE_DURATION_SEC=1

## MM
MATTERMOST_URL=https://meeting.ssafy.com/hooks/jpd35pgmcff5jjyddyx6am3shw
```

## 4️⃣ CI/CD

### AWS

- 포트 번호
    
    
    | **Service** | **Port Number** |
    | --- | --- |
    | MySQL | 3366 |
    | Jenkins | 8080 |
    | Backend | 8088 |
    | Nginx | 80,443 |
    | Redis | 5540, 6379 |
    | MQTT | 8883 |

### Docker

**docker 설치**

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl

# apt에 GPG 키를 안전하게 보관할 디렉토리 생성 및 권한 755 설정
sudo install -m 0755 -d /etc/apt/keyrings 

# docker 공식 GPG 키를 다운 및 저장
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# docker 패키지를 받아올 apt 저장소 등록
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

**docker network 생성**

```bash
docker network create devnet
docker network create prodnet
docker network create edgenet
```

### MySQL

```bash
mkdir -p /home/ubuntu/mysql_home/{conf.d,initdb,data}

# 파일 생성 후 실행 명령어 입력
docker compose -f /home/ubuntu/docker-compose/mysql-deocker-compose.yaml  up -d
```

- **파일 생성**
    
    **/home/ubuntu/dockerfile/mysql.dockerfile**
    
    ```bash
    FROM mysql:8.4.6
    ENV TZ=Asia/Seoul
    ```
    
    **/home/ubuntu/docker-compose/mysql-deocker-compose.yaml**
    
    ```yaml
    networks:
      edge:
        external: true
        name: edge
      devnet:
        external: true
        name: devnet
      prodnet:
        external: true
        name: prodnet
    
    services:
      mysql:
        #image: mysql:8.4.6
        build:
          context: /home/ubuntu/oasis/edge/dockerfile.d
          dockerfile: mysql.dockerfile
        container_name: mysql
        restart: unless-stopped
        environment:
          MYSQL_ROOT_PASSWORD: 'Oasis+103^'
          TZ: 'Asia/Seoul'
        ports:
          - "3366:3306"
        volumes:
          - /home/ubuntu/oasis/edge/mysql_home/data:/var/lib/mysql
          - /home/ubuntu/oasis/edge/mysql_home/conf.d:/etc/mysql/conf.d
          - /home/ubuntu/oasis/edge/mysql_home/initdb:/docker-entrypoint-initdb.d
        networks:
          - edge
    
    ```
    
    **/home/ubuntu/oasis/edge/mysql_home/initdb/01_init.sql**
    
    ```sql
    -- DB 생성
    CREATE DATABASE IF NOT EXISTS `dev`
      CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
    CREATE DATABASE IF NOT EXISTS `prod`
      CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
    
    -- 유저 생성
    CREATE USER IF NOT EXISTS 'backend_dev'@'%' IDENTIFIED BY '${backend_dev}';
    CREATE USER IF NOT EXISTS 'backend_prod'@'%' IDENTIFIED BY '${backend_prod}';
    CREATE USER IF NOT EXISTS 'oasis'@'%'       IDENTIFIED BY '${oasis}';
    
    -- 권한 부여
    -- backend_dev: dev DB 전체 권한
    GRANT ALL PRIVILEGES ON `dev`.*  TO 'backend_dev'@'%';
    
    -- backend_prod: dev, prod 두 DB 전체 권한
    GRANT ALL PRIVILEGES ON `dev`.*  TO 'backend_prod'@'%';
    GRANT ALL PRIVILEGES ON `prod`.* TO 'backend_prod'@'%';
    
    -- oasis: dev, prod 읽기 전용(SELECT)
    GRANT SELECT ON `dev`.*  TO 'oasis'@'%';
    GRANT SELECT ON `prod`.* TO 'oasis'@'%';
    
    FLUSH PRIVILEGES;
    
    ```
    

### Jenkins

```bash
mkdir /home/ubuntu/oasis/edge/jenkins_home

# 파일 생성 후 실행 명령어 입력
docker compose -f /home/ubuntu/oasis/edge/docker-compose.d/jenkins-docker-compose.yaml up -d

# 초기 비밀번호 출력
docker logs jenkins
```

- **파일 생성**
    
    **/home/ubuntu/oasis/edge/docker-compose.d
    /jenkins-docker-compose.yaml**
    
    ```yaml
    networks:
      edge:
        external: true
        name: edge
      devnet:
        external: true
        name: devnet
      prodnet:
        external: true
        name: prodnet
    
    services:
      jenkins:
        container_name: jenkins
        build:
          context: /home/ubuntu/oasis/edge/dockerfile.d   # jenkins.dockerfile 있는 경로
          dockerfile: jenkins.dockerfile
        restart: unless-stopped
        volumes:
          - /var/run/docker.sock:/var/run/docker.sock
          - /home/ubuntu/oasis/edge/jenkins_home:/var/jenkins_home
          - /usr/bin/docker:/usr/bin/docker
        group_add:
          - "999"           # 호스트 docker 그룹 GID
        networks:
          - edge
    ```
    

### Nginx

```bash
mkdir -p /home/ubuntu/oasis/edge/nginx_home/{nginx,html,conf.d,stream.d}

# 파일 생성 후 실행 명령어 입력
docker compose -f /home/ubuntu/oasis/edge/docker-compose.d/nginx-web-docker-compose.yaml up -d
docker compose -f /home/ubuntu/oasis/edge/docker-compose.d/nginx-web-docker-compose.yaml exec nginx nginx -t
docker compose -f /home/ubuntu/oasis/edge/docker-compose.d/nginx-web-docker-compose.yaml exec nginx nginx -s reload
```

- **파일 생성**
    
    ## nginx
    
    ## nginx.conf
    
    ```bash
    user  nginx;
    worker_processes  auto;
    
    error_log  /var/log/nginx/error.log notice;
    pid        /run/nginx.pid;
    
    events {
        worker_connections  1024;
    }
    
    http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;
    
        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';
    
        access_log  /var/log/nginx/access.log  main;
        error_log   /var/log/nginx/error.log warn;
    
        sendfile        on;
    
        keepalive_timeout  65;
        
        include /etc/nginx/conf.d/dev/*.conf;
        include /etc/nginx/conf.d/edge/*.conf;
        include /etc/nginx/conf.d/prod/*.conf;
        include /etc/nginx/conf.d/test/*.conf;
    }
    
    stream {
      include /etc/nginx/stream.d/*.conf;
    }
    
    ```
    
    ## stream.d
    
    ## redis.stream.conf
    
    ```bash
    server {
      listen 6380;
      proxy_connect_timeout 10s;
      proxy_timeout 5m;
      proxy_pass redis-vector:6379;
    
      proxy_socket_keepalive on;
    }
    
    ```
    
    ## mosquitto.stream.conf
    
    ```bash
    upstream mosquitto_8883 {
        server mqtt-broker:8883;
    }
    
    server {
        listen 8883;        
        proxy_pass mosquitto_8883;
        proxy_timeout 300s;
        proxy_connect_timeout 5s;
    }
    ```
    
    ## conf.d
    
    /home/ubuntu/oasis/edge/nginx_home/conf.d/**edge**
    
    ## default-http.conf
    
    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
    
        add_header X-Debug-Block "catch-all-80" always;
        return 301 https://stay-oasis.kr$request_uri;
    }
    
    server {
        listen 443 ssl default_server;
        listen [::]:443 ssl default_server;
        http2 on;
        server_name _;
    
        ssl_certificate     /etc/letsencrypt/live/stay-oasis.kr/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/stay-oasis.kr/privkey.pem;
    
        return 301 https://stay-oasis.kr$request_uri;
    }
    
    ```
    
    ## ssafy.conf
    
    ```sql
    server {
        listen 80;
        server_name j13e103.p.ssafy.io;
    
        add_header X-Debug-Block "ssafy-80" always;
        return 301 https://stay-oasis.kr$request_uri;
    }
    
    server {
        listen 443 ssl;
        http2 on;
        server_name j13e103.p.ssafy.io;
    
        ssl_certificate     /etc/letsencrypt/live/stay-oasis.kr/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/stay-oasis.kr/privkey.pem;
    
         return 301 https://stay-oasis.kr$request_uri;
    }
    
    ```
    
    ## jenkins.conf
    
    ```yaml
    server {
        listen 443 ssl;
        http2 on;
        server_name jenkins.stay-oasis.kr;
    
        ssl_certificate     /etc/letsencrypt/live/stay-oasis.kr/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/stay-oasis.kr/privkey.pem;
    
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
    
        client_max_body_size 200m;
        proxy_read_timeout   3600;
        proxy_send_timeout   3600;
        proxy_connect_timeout 60;
        proxy_buffering off;
        proxy_request_buffering off;
    
        location / {
            proxy_pass http://jenkins:8080;     
            proxy_http_version 1.1;
    
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
    
            proxy_set_header Host              $host;
            proxy_set_header X-Real-IP         $remote_addr;
            proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    
    ```
    
    ## redisinsight.conf
    
    ```yaml
    server {
        listen 80;
        listen [::]:80;
        server_name redisin.stay-oasis.kr;
        return 301 https://$host$request_uri;
    }
    
    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name redisin.stay-oasis.kr;
    
        ssl_certificate     /etc/letsencrypt/live/stay-oasis.kr/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/stay-oasis.kr/privkey.pem;
    
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
    
        add_header X-VHost "edge-redisin v1" always;
    
        location / {
            proxy_pass http://redis-insight:5540;
            
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
    
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
    
            proxy_read_timeout 300;
            proxy_send_timeout 300;
    
            proxy_buffering off;
        }
    }
    
    ```
    
    ## grafana.conf
    
    ```yaml
    server {
        listen 80;
        listen [::]:80;
        server_name grafana.stay-oasis.kr;
        return 301 https://$host$request_uri;
    }
    
    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name grafana.stay-oasis.kr;
    
        ssl_certificate     /etc/letsencrypt/live/stay-oasis.kr/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/stay-oasis.kr/privkey.pem;
    
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        add_header X-Content-Type-Options "nosniff" always;
    
        client_max_body_size 20m;
        proxy_read_timeout   300;
        proxy_send_timeout   300;
        proxy_connect_timeout 60;
        proxy_buffering      off;
    
        location /api/live/ {
            proxy_pass http://grafana:3000;
            proxy_http_version 1.1;
    
            proxy_set_header Upgrade            $http_upgrade;
            proxy_set_header Connection         $connection_upgrade;
    
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto  $scheme;
            proxy_set_header X-Forwarded-Host   $host;
            proxy_set_header X-Forwarded-Port   443;
        }
    
        location / {
            proxy_pass http://grafana:3000;
            proxy_http_version 1.1;
    
            proxy_set_header Upgrade            $http_upgrade;
            proxy_set_header Connection         $connection_upgrade;
    
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto  $scheme;
            proxy_set_header X-Forwarded-Host   $host;
            proxy_set_header X-Forwarded-Port   443;
    
            proxy_redirect off;
        }
    }
    
    ```
    
    /home/ubuntu/oasis/edge/nginx_home/conf.d/**dev**
    
    ## dev-frontend.conf
    
    ```bash
    server {
        listen 80;
        listen [::]:80;
        server_name dev.stay-oasis.kr;
        return 301 https://$host$request_uri;
    }
    
    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name dev.stay-oasis.kr;
    
        ssl_certificate     /etc/letsencrypt/live/stay-oasis.kr/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/stay-oasis.kr/privkey.pem;
    
        client_max_body_size 20m;
        proxy_read_timeout   300;
        proxy_send_timeout   300;
        proxy_connect_timeout 60;
    
        location ~* \.(?:js|mjs|css|png|jpg|jpeg|gif|webp|ico|svg|woff2?|ttf)$ {
            proxy_pass http://dev-frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade            $http_upgrade;
            proxy_set_header Connection         $connection_upgrade;
    
            proxy_set_header Cookie             $http_cookie;
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto  $scheme;
            expires 7d;
            add_header Cache-Control "public, max-age=604800" always;
        }
    
        location ~* ^/(sockjs-node|ws|ws-client|vite-hmr|_next/webpack-hmr) {
            proxy_pass http://dev-frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade            $http_upgrade;
            proxy_set_header Connection         $connection_upgrade;
    
            proxy_set_header Cookie             $http_cookie;
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto  $scheme;
        }
    
        location / {
            proxy_pass http://dev-frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade            $http_upgrade;
            proxy_set_header Connection         $connection_upgrade;
    
            proxy_set_header Cookie             $http_cookie;
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto  $scheme;
            proxy_set_header X-Forwarded-Port   $server_port;
        }
    }
    
    ```
    
    ## dev-backend.conf
    
    ```bash
    server {
        listen 80;
        listen [::]:80;
        server_name dev-app.stay-oasis.kr;
        return 301 https://$host$request_uri;
    }
    
    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name dev-app.stay-oasis.kr;
    
        ssl_certificate     /etc/letsencrypt/live/stay-oasis.kr/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/stay-oasis.kr/privkey.pem;
    
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
        client_max_body_size 50m;
        proxy_read_timeout   300;
        proxy_send_timeout   300;
        proxy_connect_timeout 60;
    
        location / {
            proxy_pass http://dev-backend:8080;
            proxy_http_version 1.1;
    
            proxy_set_header Upgrade            $http_upgrade;
            proxy_set_header Connection         $connection_upgrade;
    
            proxy_set_header Cookie             $http_cookie;
            proxy_set_header Authorization      $http_authorization;
    
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto  $scheme;
            proxy_set_header X-Forwarded-Port   $server_port;
            proxy_set_header X-Forwarded-Host   $host;
    
            proxy_set_header Origin                       $http_origin;
            proxy_set_header Access-Control-Request-Method $http_access_control_request_method;
            proxy_set_header Access-Control-Request-Headers $http_access_control_request_headers;
    
            proxy_cache_bypass $http_upgrade;
            proxy_no_cache $http_upgrade;
        }
    }
    ```
    
    /home/ubuntu/oasis/edge/nginx_home/conf.d/**prod**
    
    ## prod-frontend.conf
    
    ```bash
    server {
        listen 80;
        listen [::]:80;
        server_name stay-oasis.kr;
        return 301 https://$host$request_uri;
    }
    
    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name stay-oasis.kr;
    
        ssl_certificate     /etc/letsencrypt/live/stay-oasis.kr/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/stay-oasis.kr/privkey.pem;
    
        client_max_body_size 20m;
        proxy_read_timeout   300;
        proxy_send_timeout   300;
        proxy_connect_timeout 60;
    
        location ~* \.(?:js|mjs|css|png|jpg|jpeg|gif|webp|ico|svg|woff2?|ttf)$ {
            proxy_pass http://prod-frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade            $http_upgrade;
            proxy_set_header Connection         $connection_upgrade;
    
            proxy_set_header Cookie             $http_cookie;
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto  $scheme;
            expires 7d;
            add_header Cache-Control "public, max-age=604800" always;
        }
    
        location ~* ^/(sockjs-node|ws|ws-client|vite-hmr|_next/webpack-hmr) {
            proxy_pass http://prod-frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade            $http_upgrade;
            proxy_set_header Connection         $connection_upgrade;
    
            proxy_set_header Cookie             $http_cookie;
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto  $scheme;
        }
    
        location / {
            proxy_pass http://prod-frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade            $http_upgrade;
            proxy_set_header Connection         $connection_upgrade;
    
            proxy_set_header Cookie             $http_cookie;
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto  $scheme;
            proxy_set_header X-Forwarded-Port   $server_port;
        }
    }
    
    ```
    
    ## prod-backend.conf
    
    ```bash
    server {
        listen 80;
        listen [::]:80;
        server_name app.stay-oasis.kr;
        return 301 https://$host$request_uri;
    }
    
    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name app.stay-oasis.kr;
    
        ssl_certificate     /etc/letsencrypt/live/stay-oasis.kr/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/stay-oasis.kr/privkey.pem;
    
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
        client_max_body_size 50m;
        proxy_read_timeout   300;
        proxy_send_timeout   300;
        proxy_connect_timeout 60;
    
        location / {
            proxy_pass http://prod-backend:8088;
            proxy_http_version 1.1;
    
            proxy_set_header Upgrade            $http_upgrade;
            proxy_set_header Connection         $connection_upgrade;
    
            proxy_set_header Cookie             $http_cookie;
            proxy_set_header Authorization      $http_authorization;
    
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto  $scheme;
            proxy_set_header X-Forwarded-Port   $server_port;
            proxy_set_header X-Forwarded-Host   $host;
    
            proxy_set_header Origin                       $http_origin;
            proxy_set_header Access-Control-Request-Method $http_access_control_request_method;
            proxy_set_header Access-Control-Request-Headers $http_access_control_request_headers;
    
            proxy_cache_bypass $http_upgrade;
            proxy_no_cache $http_upgrade;
        }
    }
    ```
    

### MQTT

```bash
sudo mkdir -p /home/ubuntu/oasis/edge/mosquitto_home/{config,data,log}
sudo mkdir -p /home/ubuntu/oasis/edge/mosquitto_home/config/certs

sudo chown -R ubuntu:ubuntu /home/ubuntu/oasis/edge/mosquitto_home

cd /home/ubuntu/oasis/edge/mosquitto_home
sudo touch log/mosquitto.log 

sudo chown -R 1883:1883 data log
sudo find data -type d -exec chmod 750 {} \;
sudo find data -type f -exec chmod 640 {} \;
sudo chmod 640 log/mosquitto.log 

passwd # 생성(최초 1회만; 이미 있다면 소유권만 맞추면 됨)
docker run -it --rm -u 1883:1883 \
  -v "$PWD/data:/mosquitto/data" eclipse-mosquitto:2 \
  mosquitto_passwd -c /mosquitto/data/passwd espuser
  
# log 생성
sudo mkdir -p /home/ubuntu/oasis/logs/mqtt
sudo chown -R ubuntu:ubuntu /home/ubuntu/oasis/logs/mqtt
sudo chmod 755 /home/ubuntu/oasis/logs/mqtt
  
# 파일 생성 후 실행 명령어 입력
docker compose -f /home/ubuntu/oasis/edge/docker-compose.d/mosquitto-docker-compose.yaml up -d
  
```

- **파일 생성**
    
    **/home/ubuntu/oasis/edge/mosquitto_home/config/mosquitto.conf**
    
    ```bash
    persistence true
    persistence_location /mosquitto/data/
    log_dest file /mosquitto/log/mosquitto.log
    log_timestamp true
    
    allow_anonymous false
    password_file /mosquitto/data/passwd
    
    listener 8883
    cafile   /mosquitto/certs/fullchain.pem
    certfile /mosquitto/certs/fullchain.pem
    keyfile  /mosquitto/certs/privkey.pem
    ```
    
    **/home/ubuntu/oasis/edge/docker-compose.d/mosquitto-docker-compose.yaml**
    
    ```bash
    networks:
      devnet:
        external: true
      prodnet:
        external: true
      edge:
        external: true
    
    services:
      mosquitto:
        image: eclipse-mosquitto:2
        container_name: mqtt-broker
        restart: unless-stopped
        user: "1883:1883"
        group_add:
          - "1001"   # ssl-cert 그룹 GID
        networks: 
          - devnet
          - prodnet
          - edge
        ports:
          - "8883:8883"
        volumes:
          - /home/ubuntu/oasis/edge/mosquitto_home/config:/mosquitto/config:ro
          - /home/ubuntu/oasis/edge/mosquitto_home/data:/mosquitto/data
          - /home/ubuntu/oasis/edge/mosquitto_home/log:/mosquitto/log
    
          - /etc/letsencrypt/live/stay-oasis.kr/fullchain.pem:/mosquitto/certs/fullchain.pem:ro
          - /etc/letsencrypt/live/stay-oasis.kr/privkey.pem:/mosquitto/certs/privkey.pem:ro
    
    ```
    

### Redis

```bash
sudo mkdir /home/ubuntu/oasis/edge/redisinsight_home

# 파일 생성 후 실행 명령어 입력
docker compose -f /home/ubuntu/oasis/edge/docker-compose.d/redis-docker-compose.yaml up -d
```

- **파일 생성**
    
    **/home/ubuntu/oasis/edge/docker-compose.d/redis-docker-compose.yaml**
    
    ```bash
    networks:
      devnet:
        external: true
        name: devnet
      prodnet:
        external: true
        name: prodnet
      edge:
        external: true
        name: edge
    
    services:
      redis:
        image: redis/redis-stack-server:7.4.0-v6   # RediSearch 내장(벡터 인덱스 지원)
        container_name: redis-vector                    
        environment:
          - REDIS_ARGS=--requirepass !@Oasis103  # 비밀번호 지정
        volumes:
          - /home/ubuntu/oasis/edge/redis_home:/data
        restart: unless-stopped
        networks:
          - devnet
          - edge
          - prodnet
    
      redisinsight:
        image: redis/redisinsight:2.70
        container_name: redis-insight
        volumes:
          - /home/ubuntu/oasis/edge/redisinsight_home:/data
        restart: unless-stopped
        networks:
          - devnet
          - edge
          - prodnet
        depends_on :
          - redis
    
    ```
    

### CA

```bash
getent group ssl-cert >/dev/null || sudo groupadd ssl-cert

sudo usermod -aG ssl-cert mosquitto
sudo usermod -aG ssl-cert www-data
sudo usermod -aG ssl-cert ubuntu

sudo chgrp -R ssl-cert /etc/letsencrypt/live /etc/letsencrypt/archive
sudo find /etc/letsencrypt/live    -type d -exec chmod 750 {} \;
sudo find /etc/letsencrypt/archive -type d -exec chmod 750 {} \;

sudo find /etc/letsencrypt/archive/stay-oasis.kr -maxdepth 1 -type f -name 'privkey*.pem' -exec chgrp ssl-cert {} \; -exec chmod 640 {} \;
sudo find /etc/letsencrypt/archive/stay-oasis.kr -maxdepth 1 -type f -regex '.*\(fullchain\|chain\|cert\).*\.pem' -exec chmod 644 {} \;

```

## 5️⃣ 배포 단계

### Frontend

**Dockerfile**

```bash
FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache tzdata \
  && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
  && echo "Asia/Seoul" > /etc/timezone
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

**Command**

```bash
docker run -d \\
--name ${DOCKER_CONTAINER_NAME} \\
--network ${NETWORK_NAME} \\
--network-alias ${DOCKER_CONTAINER_NAME} \\
--restart unless-stopped \\
-e TZ=Asia/Seoul \\
-e NODE_ENV=prod \\
-e PORT=${INTERNAL_PORT} \\
${IMAGE_NAME}:${IMAGE_TAG}
```

### Backend

**Dockerfile**

```bash
FROM openjdk:17-alpine
RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app
COPY build/libs/*.jar oasis.jar
RUN chown spring:spring oasis.jar
USER spring
EXPOSE 8088
ENTRYPOINT ["java","-Duser.timezone=Asia/Seoul","-jar","/app/oasis.jar"]
```

**Command**

```bash
docker run -d \
--name ${DOCKER_CONTAINER_NAME} \
--network ${NETWORK_NAME} \
--network-alias ${DOCKER_CONTAINER_NAME} \
--restart unless-stopped \
--env-file ${WORKSPACE}/${GRADLE_PROJECT_DIR}/.env \
-e TZ=Asia/Seoul \
-e SPRING_PROFILES_ACTIVE=prod \
-v /home/ubuntu/oasis/logs/mqtt:/logs/mqtt/prod \
${IMAGE_NAME}:${IMAGE_TAG}
```