# 학습 분석 기반 개인 맞춤형 공부 플래너

모바일 웹 우선으로 만든 캡스톤 시연용 학습 플래너 프로토타입입니다. 대학생 사용자가 과목과 시험 일정을 등록하면 간단한 규칙 기반 우선순위 로직으로 일간/주간 계획을 만들고, 공부 기록과 분석 리포트를 확인할 수 있습니다.

## 프로젝트 소개
- 목표: 복잡한 백엔드 없이도 빠르게 시연 가능한 공부 플래너 프로토타입 제공
- 핵심 포인트: 모바일 웹 우선, 카드형 대시보드, localStorage 기반 상태 저장, Vercel 배포 친화적 구조
- 주요 사용자 흐름: 온보딩 -> 과목 등록 -> 계획 생성 -> 공부 기록 -> 분석 확인 -> 미완료 재조정

## 기술 스택
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Recharts
- date-fns
- React Context + localStorage
- Vitest

## 주요 기능
- 사용자 기본 설정
  - 닉네임 입력
  - 하루 공부 가능 시간 설정
- 과목 관리
  - 과목명, 시험일, 목표 공부 시간, 중요도, 난이도, 색상 등록
  - 과목 추가 / 수정 / 삭제
- 학습 계획 자동 생성
  - 시험일까지 남은 기간
  - 목표 대비 부족 시간
  - 중요도 / 난이도
  - 최근 공부량
  - 하루 공부 가능 시간
  - 위 요소를 반영한 우선순위 점수 기반 주간 계획 생성
- 공부 기록
  - 수동 공부 시간 입력
  - 계획과 기록 연결
  - 계획 완료 체크
- 분석 대시보드
  - 과목별 누적 공부 시간
  - 목표 대비 달성률
  - 최근 7일 학습량 변화
  - 시간대별 공부 패턴
  - 오늘 추천 과목
- 계획 재조정
  - 미완료 계획을 이후 날짜로 재배치

## 핵심 로직
`lib/planner.ts`에 우선순위 계산과 계획 생성 로직을 분리했습니다.

```ts
priorityScore =
  examUrgency +
  remainingStudyNeed +
  importanceWeight +
  difficultyWeight -
  recentStudyPenalty -
  plannedPenalty
```

핵심 함수:
- `calculatePriorityScore`
- `generateStudyPlan`
- `rescheduleIncompletePlans`
- `buildAnalytics`
- `getRecommendedSubjects`

## 페이지 구성
- `/` : 랜딩 / 샘플 데이터 체험
- `/onboarding` : 닉네임, 하루 공부 가능 시간 입력
- `/dashboard` : 오늘의 계획, 추천 과목, 시험 일정 요약
- `/subjects` : 과목 관리
- `/planner` : 주간 계획표, 미완료 재배치
- `/record` : 공부 기록 입력
- `/analytics` : 분석 리포트

## 폴더 구조
```text
app/
  analytics/
  dashboard/
  onboarding/
  planner/
  record/
  subjects/
  globals.css
  layout.tsx
  page.tsx
components/
  analytics/
  dashboard/
  layout/
  planner/
  providers/
  record/
  subjects/
  ui/
hooks/
lib/
  analytics.ts
  constants.ts
  planner.ts
  sample-data.ts
  storage.ts
  utils.ts
tests/
types/
.env.example
README.md
vitest.config.ts
```

## 실행 방법
### 1. 의존성 설치
```bash
npm install
```

PowerShell 실행 정책으로 `npm`이 막히는 환경이라면 아래처럼 실행할 수 있습니다.

```bash
cmd /c npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 3. 린트
```bash
npm run lint
```

### 4. 테스트
```bash
npm test
```

### 5. 프로덕션 빌드
```bash
npm run build
```

## 샘플 데이터 사용 방법
- 첫 화면에서 `샘플 데이터로 바로 체험하기` 버튼을 누르면 데모용 데이터가 localStorage에 저장됩니다.
- 이후 `/dashboard`, `/planner`, `/analytics` 화면을 바로 시연할 수 있습니다.
- 첫 화면의 `저장 데이터 초기화` 버튼으로 초기 상태로 되돌릴 수 있습니다.

## 데이터 저장 방식
- 현재 버전은 브라우저 `localStorage`에 데이터를 저장합니다.
- 저장 대상:
  - 사용자 기본 정보
  - 과목 목록
  - 주간 계획
  - 공부 기록
- 장점: 백엔드 없이 즉시 시연 가능
- 한계: 브라우저/기기 간 동기화 불가

## GitHub에 올리는 방법
### 1. Git 초기화 확인
현재 프로젝트 루트에 `.git`이 이미 존재하면 그대로 사용하고, 아니라면 아래를 실행합니다.

```bash
git init
```

### 2. 원격 저장소 연결
```bash
git remote add origin https://github.com/<your-account>/<your-repo>.git
```

### 3. 파일 커밋
```bash
git add .
git commit -m "feat: add mobile study planner prototype"
```

### 4. GitHub로 푸시
```bash
git branch -M main
git push -u origin main
```

## Vercel 배포 방법
### 1. GitHub 저장소 준비
- 프로젝트를 GitHub에 푸시합니다.

### 2. Vercel import
- Vercel 대시보드에서 `Add New Project`
- GitHub 저장소 선택
- Framework Preset: `Next.js`

### 3. Build 설정
- 기본 설정 그대로 사용하면 됩니다.
- 현재 버전은 필수 환경변수가 없습니다.
- 필요 시 `.env.example`을 기준으로 추후 `NEXT_PUBLIC_API_URL` 등을 추가할 수 있습니다.

### 4. 배포 완료 후 확인
- `/`
- `/dashboard`
- `/subjects`
- `/planner`
- `/record`
- `/analytics`

위 경로가 정상 동작하면 시연 준비가 완료됩니다.

## 검증 결과
다음 명령 기준으로 검증했습니다.

```bash
npm run lint
npm test
npm run build
```

## 프로토타입 한계점
- 인증 기능이 없습니다.
- localStorage 기반이라 서버 동기화가 없습니다.
- 공부 기록은 수동 입력만 지원합니다.
- 우선순위 계산은 규칙 기반이며 개인화 모델은 아닙니다.
- 실제 서비스 수준의 예외 처리와 반응형 최적화는 최소 수준입니다.

## 향후 개선 방향
- PostgreSQL + Prisma 또는 FastAPI 연동으로 영속 저장소 도입
- JWT 또는 OAuth 기반 인증 추가
- 타이머 기록 기능 추가
- 과목별 상세 리포트 및 시험 직전 집중 모드 추가
- 추천 로직에 성취도, 과거 성적, 반복 학습 주기 반영
- Vercel KV / Supabase / Neon 연동으로 멀티 디바이스 동기화

## 추후 확장 포인트
- `lib/planner.ts`
  - 우선순위 가중치 조정
  - 계획 분배 알고리즘 고도화
- `lib/analytics.ts`
  - 더 정교한 패턴 분석 추가
- `components/providers/app-data-provider.tsx`
  - localStorage -> API/DB 저장소 교체
- `types/index.ts`
  - DB 스키마와 API 응답 타입으로 확장 가능
