# 바이닐 컬렉션 앱 프로젝트 Context

## 프로젝트 개요

React Native + Expo Router를 사용한 개인 바이닐 레코드 컬렉션 관리 앱

## 기술 스택

- **프레임워크**: React Native + Expo Router (파일 기반 라우팅)
- **언어**: TypeScript
- **상태관리**: TanStack Query (데이터 페칭 & 캐싱)
- **스토리지**: AsyncStorage (로컬 데이터 저장)
- **API**: Discogs API (바이닐 정보 조회)
- **스타일링**: StyleSheet (React Native 기본)
- **아이콘**: @expo/vector-icons

## 핵심 기능

- 바이닐 컬렉션 관리 (추가/수정/삭제)
- Discogs API 연동으로 바이닐 정보 자동 조회
- 바이닐 검색 및 필터링
- 위시리스트 관리
- 내 바이닐에 대한 나의 별점, 코멘트, 보관중인 위치 추가 기능

## 폴더 구조 및 파일 역할

### `/app` - 화면 및 라우팅 (Expo Router)

```
app/
├── (tabs)/                 # 메인 탭 네비게이션 그룹
│   ├── index.tsx          # 홈 화면 - 내 바이닐 목록, 바이닐 등록하기 이동 버튼
│   ├── wishlist.tsx       # 위시리스트 화면 - 구매하고 싶은 바이닐 목록
│   ├── settings.tsx       # 설정 화면 - 앱 버전 정보, 앱 문의 메일 보내기
│   └── _layout.tsx        # 탭 레이아웃 설정 (탭바 구성, 아이콘, 제목)
├── vinyl/                  # 바이닐 관련 화면
│   ├── [id].tsx          # 바이닐 상세 화면 - 트랙리스트, 아티스트 정보, 수정/삭제
│   └── add-vinyl.tsx     # 바이닐 추가 모달 - 수동 입력 또는 Discogs 검색
└── _layout.tsx           # 루트 레이아웃 - 전역 설정, 테마, 헤더 스타일
```

### `/components` - 재사용 가능한 UI 컴포넌트

```
components/
├── ui/                    # 기본 UI 컴포넌트
│   ├── Input.tsx         # 공통 입력 필드 (텍스트, 숫자, 검색 등)
│   └── Icon.tsx         # 아이콘 컴포넌트
├── vinyl/                 # 바이닐 관련 컴포넌트
│   ├── selected-vinyl-container.tsx     # 바이닐 등록하기의 바이닐 검색 결과에서 선택한 바이닐 - 바이닐 정보 포함
│   ├── star-rating.tsx     # 별점 컴포넌트 - 내 바이닐 상세, 바이닐 등록하기에서 사용할 내 별점 추가 컴포넌트
│   ├── vinyl-search-result-item.tsx     # 바이닐 등록하기에서 바이닐 검색결과 표시할 검색결과 아이템 컴포넌트
│   └── write-button.tsx   # 메인 화면에서 바이닐 등록하기 화면으로 넘어가기 위한 버튼 컴포넌트
└── layout/               # 레이아웃 컴포넌트
    ├── page-header.tsx        # tabs에 포함된 주요한 페이지에서 상단 타이틀을 표시하기 위한 공통 컴포넌트
    ├── sub-header.tsx        # tabs에 포함된 주요한 페이지가 아닌 다른 서브 페이지에서 상단 타이틀을 표시하기 위한 공통 컴포넌트
    ├── themed-view.tsx        # 공통된 스타일을 적용하기 위한 레이아웃 컴포넌트
    └── themed-text.tsx # 공통된 스타일을 적용하기 위한 텍스트 컴포넌트
```

### `/api` - api 통신 함수

```
api/
├── client.ts      # discogs api와 통신하고 있는 프록시 서버와 통신
├── types.ts          # API 응답 타입 정의
└── vinyl.ts    # 바이닐 검색, 바이닐 상세 정보 호출 api
```

### `/utils` - 유틸리티 및 설정

```
utils/
└── asyncStorage.ts   # AsyncStorage 유틸리티 함수
```

### `/assets` - 정적 자산

```
assets/
├── images/ #추가 예정
```

## 코딩 규칙 및 컨벤션

### 네이밍 규칙

- **컴포넌트**: PascalCase (`VinylCard.tsx`)
- **훅**: camelCase with 'use' prefix (`useVinyls.ts`)
- **타입/인터페이스**: PascalCase (`VinylType`, `VinylCardProps`)
- **파일명**: kebab-case for screens, PascalCase for components
- **변수/함수**: camelCase

### 컴포넌트 구조

```typescript
// 1. Imports (React, libraries, local)
// 2. Type definitions
// 3. Component definition (export default function)
// 4. Styles (StyleSheet)
```

### API 호출 패턴

- 모든 API 호출은 TanStack Query 사용
- 에러 핸들링은 try-catch + 사용자 친화적 메시지

### 데이터 관리

- 주요 데이터는 AsyncStorage에 캐싱
- TanStack Query의 staleTime을 길게 설정 (30분~24시간)
- 오프라인 지원을 위한 로컬 우선 전략

### 성능 최적화

- 이미지는 lazy loading 적용
- FlatList에서 getItemLayout 최적화
- React.memo 적극 활용
- 불필요한 리렌더링 방지

## 주요 라이브러리 사용법

### TanStack Query 설정

```typescript
// staleTime: 30분 (바이닐 정보는 자주 변경되지 않음)
// cacheTime: 24시간
// refetchOnWindowFocus: false
```

### Expo Router

```typescript
// 파일 기반 라우팅
// 모달은 presentation: 'modal'
// 동적 라우트는 [id].tsx
```

## 특별 고려사항

### Discogs API Rate Limiting

- 인증된 요청: 60/분
- 미인증 요청: 25/분
- requestQueue로 요청 간격 조절
- 429 에러 시 자동 재시도

### 데이터 구조

- 각 바이닐은 고유 ID (UUID 또는 timestamp)
- Discogs ID와 로컬 ID 구분

### 사용자 경험

- 오프라인 우선 설계
- 로딩 상태 명확히 표시
- 에러 발생 시 재시도 옵션 제공
- 데이터 손실 방지를 위한 자동 저장
