# curibox (호기심상자)

숏폼처럼 무한 스와이프하며 잡학 지식을 보는 킬링타임용 웹앱.

## 작업 규칙
- 기능 추가/구조 변경/버그 수정 후 이 파일의 관련 섹션을 최신 상태로 업데이트할 것
- 새로 추가된 파일, 변경된 아키텍처, 중요한 결정사항을 반영할 것
- **개발 완료 시 반드시 배포**: 기능 구현이 완료되면 항상 `npx vercel --prod --yes`로 즉시 배포할 것 (ChonMap 규칙 준수)
- 배포 명령어: `npx vercel --prod --yes`

## 프로젝트 개요
7개 카테고리(우주·인체·역사·동물·자연·과학·문화)의 흥미로운 잡학 사실을 카드 형태로 무한 스와이프하는 웹앱. ChonMap과 동일 스택의 정적 웹앱이며, 추후 TWA로 Android Play Store 래핑 예정.

- **GitHub**: https://github.com/nokeunsu-creator/curibox (Public)
- **라이브 URL**: https://curibox.vercel.app
- **배포**: Vercel (정적 호스팅) → TWA로 Android Play Store 래핑 예정

## 기술 스택
- React 19 + TypeScript 6 + Vite 8 (ChonMap 동일)
- Tailwind CSS 4 (`@tailwindcss/vite` 플러그인)
- **framer-motion 11** (카드 스와이프 — ChonMap엔 없는 추가 의존성)
- nanoid (고유 ID)
- Vitest (테스트)
- localStorage 데이터 저장 (서버 없음)

## 핵심 아키텍처

### 데이터 모델 (`src/models/types.ts`)
- `Category`: '우주' | '인체' | '역사' | '동물' | '자연' | '과학' | '문화' (7종 union)
- `ALL_CATEGORIES`: 위 7개를 배열로
- `TriviaItem`: { id: number, category: Category, title: string, content: string, isAd?: false }
- `AdItem`: { id: string ('ad-N' 형식), isAd: true }
- `DeckItem`: TriviaItem | AdItem (덱 항목 유니언)
- `isAdItem(item)`: type guard 함수

### 카테고리 테마 (`src/theme/categoryColors.ts`)
- `CATEGORY_THEME` (라이트): 7개 카테고리 × { bg, bgGradient, chip, chipText, text, subtext } 매핑, 파스텔 그라디언트 + 진한 칩
- `CATEGORY_THEME_DARK`: 동일 카테고리의 어두운 톤 변형 (배경은 깊은 파스텔, 칩은 부드러운 밝은 파스텔, 텍스트는 라이트)
- `getCategoryTheme(cat, isDark)`: 다크 모드 분기 헬퍼
- `CATEGORY_EMOJI`: 카테고리별 이모지(🌌🧬🏛️🐾🌊🔬🍜)

### 데이터 로더 (`src/data/triviaLoader.ts`)
- `loadAllTrivia()`: 7개 JSON 머지 → 글로벌 시퀀스 ID 1~420 재할당
- `buildDeck(items, adInterval=10)`: 매 `adInterval` trivia 뒤에 AdItem 삽입; **마지막 위치엔 광고 안 붙음**(`isLast` 체크). 결과 길이 = 420 + 42 = 462
- `shuffleDeterministic(arr, seed)`: Mulberry32 기반 결정적 셔플. 같은 시드 → 같은 순서. **입력 비파괴**(스프레드로 복사)

### 데이터 (`assets/trivia/*.json`)
- 7개 파일 × 60~72개 = 총 **500개** (우주 72, 인체 71, 역사 71, 동물 72, 자연 71, 과학 72, 문화 71)
- 각 파일 ID는 카테고리 내부 1~72 (로컬). 머지 시 글로벌로 재할당 (1~500)
- 작성 톤: title은 후킹하는 한 줄(숫자/대비/반전), content는 정확히 3문장
  - 핵심 사실 → 부연 → 임팩트 순

## 폴더 구조
```
curibox/
├── public/                    # Vercel 정적 자원 (manifest, sw, icons는 빌드 시 dist/로 복사)
│   ├── manifest.json
│   ├── sw.js                  # 서비스 워커 (cache-first 정적 / network-first navigation)
│   └── icons/
│       ├── icon.svg           # 일반 아이콘 (보라 그라디언트 + 박스 + 물음표)
│       └── icon-maskable.svg  # PWA maskable (안전 영역 작게)
├── assets/trivia/             # 카테고리별 JSON (src 외부, 로더에서 ../../로 import)
│   ├── space.json (60개)
│   ├── body.json (60개)
│   ├── history.json (60개)
│   ├── animal.json (60개)
│   ├── nature.json (60개)
│   ├── science.json (60개)
│   └── culture.json (60개)
├── src/
│   ├── models/types.ts
│   ├── theme/categoryColors.ts
│   ├── data/
│   │   ├── triviaLoader.ts
│   │   └── triviaLoader.test.ts (Vitest 14건)
│   ├── components/
│   │   ├── cards/
│   │   │   ├── TriviaCard.tsx     # 카테고리 그라디언트 + 칩 + 큰 이모지(워터마크) + title + content + 하트 버튼
│   │   │   └── AdCard.tsx         # 다크 톤 광고 placeholder (현재 미사용 — 광고 추후 재활성)
│   │   ├── deck/
│   │   │   └── SwipeDeck.tsx      # framer-motion 세로 스와이프 + AnimatePresence
│   │   ├── settings/
│   │   │   └── SettingsSheet.tsx  # 바텀시트 (테마 토글 + 카테고리 칩 + 진행도/즐겨찾기 초기화 + 튜토리얼 다시 보기)
│   │   ├── onboarding/
│   │   │   └── OnboardingTutorial.tsx # 4슬라이드 전체화면 (좌우 스와이프 + 인디케이터 + 건너뛰기/시작하기)
│   │   ├── search/
│   │   │   └── SearchSheet.tsx    # 전체화면 검색 (title/content includes, score=2 title>content, 50개 cap)
│   │   └── common/
│   │       └── EmptyState.tsx     # 빈 덱 상태 (이모지 + 제목 + 설명 + 액션 버튼)
│   ├── hooks/
│   │   ├── useLastIndex.ts        # localStorage 디바운스(500ms) 저장 + beforeunload/visibilitychange 즉시 flush
│   │   ├── useFavorites.ts        # 즐겨찾기 ID Set 관리 (toggle/isFavorite/clear/count) + 디바운스 저장
│   │   ├── useCategoryFilter.ts   # 활성 카테고리 Set + toggle/enableAll/disableAll + 디바운스 저장
│   │   ├── useViewMode.ts         # 'all' | 'favorites' 보기 모드 + 즉시 저장
│   │   ├── useOnboardingSeen.ts   # 첫 방문 플래그 (seen/markSeen/reset)
│   │   └── useTheme.ts            # 'light' | 'dark' | 'system' + system prefers-color-scheme 추적 + theme-color 메타 동기화
│   ├── App.tsx                    # 헤더 + SwipeDeck + 인덱스 카운터
│   ├── main.tsx                   # ErrorBoundary + StrictMode
│   ├── index.css                  # Tailwind import
│   └── vite-env.d.ts
├── index.html                     # 호기심상자 메타태그
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .gitignore                     # node_modules, dist, *.tsbuildinfo
```

## 구현된 기능
- ✅ Vite + React 19 + TS + Tailwind 4 + framer-motion 환경 구성
- ✅ ErrorBoundary 포함 main.tsx
- ✅ 7개 카테고리 × 60 = 420개 trivia 데이터
- ✅ Category/TriviaItem/AdItem/DeckItem 타입 + isAdItem 가드
- ✅ 카테고리별 파스텔 테마 (그라디언트/칩/텍스트 색)
- ✅ triviaLoader: 머지 + 글로벌 ID + 광고 인터리브 + 결정적 셔플 (Vitest 14건 통과)
- ✅ TriviaCard 정적 렌더 (카테고리 그라디언트 + 칩 + 이모지 워터마크 + title + content + 인덱스)
- ✅ AdCard Mock (다크 톤, "광고" 칩, AdSlot placeholder)
- ✅ **SwipeDeck** (framer-motion `<motion.div drag="y">` + AnimatePresence + 임계값 100px / 500velocity)
- ✅ **useLastIndex** 훅 (localStorage 디바운스 500ms + beforeunload/visibilitychange flush)
- ✅ App.tsx 통합 (스와이프 네비게이션, 인덱스 자동 복원)
- ✅ Vercel 배포 (https://curibox.vercel.app)
- ✅ **즐겨찾기 시스템** (TriviaCard 우상단 하트 버튼 + useFavorites 훅 + 헤더 카운트 표시)
- ✅ **결정적 셔플 적용** (App.tsx에서 `shuffleDeterministic(loadAllTrivia(), 20260428)` 적용 — 카테고리 블록 → 골고루 섞임)
- ✅ **카테고리 필터** (useCategoryFilter + 설정 시트 7칩 토글, localStorage 영속화)
- ✅ **즐겨찾기 보기 모드** (useViewMode 'all' | 'favorites' — 헤더 ❤️ 배지 탭으로 전환)
- ✅ **설정 시트** (바텀시트, 카테고리 칩, 진행도/즐겨찾기 초기화)
- ✅ **빈 상태 처리** (즐겨찾기 모드에 0개 / 카테고리 미선택)
- ✅ **온보딩 튜토리얼** (4슬라이드 — 환영/스와이프/즐겨찾기/카테고리 — 첫 방문 시 자동 표시, 설정에서 다시 보기 가능)
- ✅ **PWA 설치 가능** (manifest.json + 아이콘 SVG + apple-touch-icon — 폰 홈화면 추가 지원)
- ✅ **서비스 워커** (sw.js, cache-first 정적 자원 / network-first HTML, 오프라인 부분 지원)
- ✅ **콘텐츠 500개 달성** (7카테고리 60~72개씩, 글로벌 ID 1~500)
- ✅ **다크 모드** (light/dark/system 3모드, useTheme 훅, system은 prefers-color-scheme 실시간 추적, theme-color 메타 동기화, 카테고리 그라디언트 다크 변형, 모든 컴포넌트 dark: 클래스 적용)
- ✅ **공유 기능** (TriviaCard 공유 버튼 — Web Share API 우선, 미지원 시 navigator.clipboard 폴백 + ✓ 피드백 1.5s)
- ✅ **검색** (헤더 🔍 → SearchSheet 전체화면 모달, title/content 키워드 검색, score 정렬, 결과 탭 시 필터 풀고 점프 — pendingJumpRef로 효과 충돌 회피)
- ✅ **진행률 게이지** (헤더 상단 1px 바, 현재 카드 카테고리 색으로 채워짐, 전환 애니메이션)
- ✅ **훅 단위 테스트 추가** (jsdom + @testing-library/react, useFavorites/useLastIndex/useTheme — 총 34건 통과)
- ✅ **Lighthouse 모바일** Performance 94 / **Accessibility 100** / Best Practices 100 / SEO 100 (a11y는 81 → 100 개선: viewport user-scalable 제거, 텍스트 명도, aria-label에 visible text 포함, 도트 인디케이터 44×44 hit area)
- ✅ **번들 코드 스플릿** (Settings/Search/Onboarding/AdCard 모두 React.lazy + Suspense — Settings/Search는 첫 오픈 latch로 AnimatePresence exit 보존). 결과: 메인 462KB / 별도 청크 5개 합 14KB, **TBT 130ms → 50ms (-62%), Performance 88 → 94**
- ⚠️ **광고 일시 비활성화**: App.tsx에서 `buildDeck` 호출 제거, trivia 배열을 `DeckItem[]`로 직접 사용. AdCard/buildDeck/isAdItem 코드는 보존됨 (재활성 시 buildDeck 한 줄 부활하면 됨)

## 미완료
- ❌ TWA Android 패키징 (assetlinks.json + bubblewrap)
- ❌ AdSense 실 광고 SDK 연동 (사용자 보류 상태)

## 빌드 & 실행
```bash
npm install       # 첫 설치
npm run dev       # 개발 서버 (http://localhost:5173/)
npm run build     # 프로덕션 빌드 (tsc + vite build)
npm run preview   # 빌드 결과 미리보기
npm run test      # Vitest (jsdom 환경, 34건 — 로더 14 + 훅 20)
```

## Lighthouse 측정
```bash
NODE_OPTIONS=--use-system-ca npx lighthouse@12 https://curibox.vercel.app \
  --output=json --output-path=./lh.json \
  --form-factor=mobile \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new --no-sandbox" --quiet
```

## 배포
```bash
npx vercel --prod --yes   # ChonMap과 동일
```

## 주의사항
- **JSON 파일 위치**: `assets/trivia/`는 `src/` 외부에 있음. 로더에서 `../../assets/trivia/*.json`로 import. tsconfig include는 `["src"]`만 두고도 `resolveJsonModule: true`로 동작. 위치 옮기면 import 경로 전체 수정 필요
- **광고 인터리브**: `(idx + 1) % adInterval === 0 && !isLast` 조건. 30개 trivia + interval 10 → 32개 (광고 2개, 마지막 광고 생략). 기준 변경 시 buildDeck 테스트 같이 수정
- **글로벌 ID 재할당**: 로컬 JSON ID는 무시. `loadAllTrivia()`에서 idx+1로 새로 매김. 즐겨찾기 등 ID로 참조하는 기능 추가 시 이 점 유의
- **Mulberry32 셔플**: `shuffleDeterministic`은 입력을 변경하지 않음. 결과만 섞인 새 배열로 반환. 시드는 number만 허용 (string 시드는 hash 함수 거쳐야 함)
- **카테고리 union 타입**: TriviaItem.category는 한국어 리터럴 union. JSON에 새 카테고리 추가하면 types.ts의 Category, ALL_CATEGORIES, CATEGORY_THEME, CATEGORY_EMOJI **4곳 모두** 수정해야 함
- **번들 크기**: trivia JSON이 정적 import로 번들에 포함됨 (현재 430KB / gzip 142KB, framer-motion 포함). 데이터가 더 늘어나면 dynamic import + Suspense로 전환 검토
- **셔플 시드**: App.tsx의 `SHUFFLE_SEED` 상수가 모든 사용자에게 동일한 셔플 순서를 제공. 시드 변경 시 모든 사용자의 lastIndex가 다른 카드를 가리키게 됨 (사실상 진행도 리셋 효과). 콘텐츠 추가 후 새 시드 검토
- **서비스 워커 캐시 버스팅**: `sw.js`의 `CACHE_NAME = 'curibox-v1'` 상수. 정적 자원이 캐시되어 사용자에게 옛 버전이 보이는 문제가 발생하면 v2, v3로 올려서 강제 갱신. 보통 hashed asset URL 덕에 자동 처리되지만 manifest/sw 자체가 바뀐 경우엔 수동 bump 필요
- **PWA 아이콘**: 현재 SVG만 제공. iOS Safari `apple-touch-icon`은 SVG 폴백이 최신 iOS만 지원. 호환성 필요 시 PNG(192/512) 추가 생성 검토 (Sharp 또는 외부 변환)
- **검색 점프 + 필터 충돌**: 검색 결과 탭 → 필터를 'all'로 푸는데, filterKey 변경 effect가 setIndex(0)으로 덮어씀. `pendingJumpRef` 패턴으로 effect 안에서 점프 의도를 우선 처리. 검색 외에 인덱스 점프 기능 추가 시 같은 패턴 사용 권장
- **lazy 모달 + AnimatePresence**: SettingsSheet/SearchSheet는 React.lazy로 분할되어 있고 내부에 AnimatePresence가 있음. `{showX && <Lazy/>}` 패턴은 unmount로 exit 애니메이션이 사라짐. 그래서 `settingsLatched`/`searchLatched` 플래그(첫 오픈 시 true로 영구 latch)를 두고 `{settingsLatched && <Suspense><SettingsSheet open={showSettings}/></Suspense>}` 형태로 마운트 유지 + open prop으로 visibility 제어. 비슷한 모달 추가 시 동일 패턴 적용
- **localStorage 키**: 모든 키는 `curibox:` 접두사로 통일할 것 (`curibox:lastIndex`, `curibox:favorites`, `curibox:settings` 등)
- **framer-motion v11**: React 19와 호환 확인됨. AnimatePresence + drag 패턴 사용 시 `mode="popLayout"` 권장 (구현 시 검증)

## 작업 마일스톤
| # | 단계 | 상태 |
|---|------|------|
| 1 | Vite + React 19 + TS + Tailwind 4 + framer-motion 초기화 | ✅ |
| 2 | trivia 420개 (7카테고리 × 60) 데이터 작성 | ✅ |
| 3 | 타입 / 테마 / 로더 + Vitest 14건 | ✅ |
| 4 | TriviaCard / AdCard 컴포넌트 + App 통합 (버튼 네비) | ✅ |
| 5 | SwipeDeck (framer-motion) + useLastIndex 훅 | ✅ |
| 6 | Vercel 배포 (https://curibox.vercel.app) | ✅ |
| 7a | 즐겨찾기 (하트 버튼 + useFavorites) | ✅ |
| 7b | 카테고리 필터 + 즐겨찾기 보기 모드 + 설정 시트 | ✅ |
| 7c | 광고 일시 비활성화 (재활성 시 buildDeck 부활) | ✅ |
| 8 | 온보딩 튜토리얼 (4슬라이드 + 다시 보기) | ✅ |
| 9 | PWA (manifest + 아이콘 + 서비스 워커) | ✅ |
| 10 | 콘텐츠 500개 달성 (+80) | ✅ |
| 11 | 다크 모드 (light/dark/system) | ✅ |
| 12 | 공유 기능 (Web Share API + 클립보드 폴백) | ✅ |
| 13 | 검색 (전체화면 시트, title/content 매칭) | ✅ |
| 14 | 진행률 게이지 + 훅 테스트 + Lighthouse 만점 a11y | ✅ |
| 15 | 번들 코드 스플릿 (Performance 94) | ✅ |
| 16 | AdSense 실 광고 SDK 연동 | ⏸️ |
| 17 | TWA Android 패키징 | ⏸️ |
