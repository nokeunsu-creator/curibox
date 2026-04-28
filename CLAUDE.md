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
- 7개 카테고리 × { bg, bgGradient, chip, chipText, text, subtext } 매핑
- 파스텔 톤 그라디언트 + 진한 톤 칩 + 다크 텍스트 (라이트 테마 전용; 다크모드 미구현)
- `CATEGORY_EMOJI`: 카테고리별 이모지(🌌🧬🏛️🐾🌊🔬🍜)

### 데이터 로더 (`src/data/triviaLoader.ts`)
- `loadAllTrivia()`: 7개 JSON 머지 → 글로벌 시퀀스 ID 1~420 재할당
- `buildDeck(items, adInterval=10)`: 매 `adInterval` trivia 뒤에 AdItem 삽입; **마지막 위치엔 광고 안 붙음**(`isLast` 체크). 결과 길이 = 420 + 42 = 462
- `shuffleDeterministic(arr, seed)`: Mulberry32 기반 결정적 셔플. 같은 시드 → 같은 순서. **입력 비파괴**(스프레드로 복사)

### 데이터 (`assets/trivia/*.json`)
- 7개 파일 × 60개 = 총 **420개**
- 각 파일 ID는 카테고리 내부 1~60 (로컬). 머지 시 글로벌로 재할당
- 작성 톤: title은 후킹하는 한 줄(숫자/대비/반전), content는 정확히 3문장
  - 핵심 사실 → 부연 → 임팩트 순

## 폴더 구조
```
curibox/
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
│   │   │   └── SettingsSheet.tsx  # 바텀시트 (카테고리 칩 + 진행도/즐겨찾기 초기화)
│   │   └── common/
│   │       └── EmptyState.tsx     # 빈 덱 상태 (이모지 + 제목 + 설명 + 액션 버튼)
│   ├── hooks/
│   │   ├── useLastIndex.ts        # localStorage 디바운스(500ms) 저장 + beforeunload/visibilitychange 즉시 flush
│   │   ├── useFavorites.ts        # 즐겨찾기 ID Set 관리 (toggle/isFavorite/clear/count) + 디바운스 저장
│   │   ├── useCategoryFilter.ts   # 활성 카테고리 Set + toggle/enableAll/disableAll + 디바운스 저장
│   │   └── useViewMode.ts         # 'all' | 'favorites' 보기 모드 + 즉시 저장
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
- ⚠️ **광고 일시 비활성화**: App.tsx에서 `buildDeck` 호출 제거, trivia 배열을 `DeckItem[]`로 직접 사용. AdCard/buildDeck/isAdItem 코드는 보존됨 (재활성 시 buildDeck 한 줄 부활하면 됨)

## 미완료
- ❌ 온보딩 튜토리얼
- ❌ AdSense 실 광고 SDK 연동 (1차는 Mock만)
- ❌ TWA Android 패키징

## 빌드 & 실행
```bash
npm install       # 첫 설치
npm run dev       # 개발 서버 (http://localhost:5173/)
npm run build     # 프로덕션 빌드 (tsc + vite build)
npm run preview   # 빌드 결과 미리보기
npm run test      # Vitest (14건)
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
| 8 | 온보딩 튜토리얼 | ⏸️ |
| 9 | AdSense 실 광고 SDK 연동 | ⏸️ |
| 10 | TWA Android 패키징 | ⏸️ |
