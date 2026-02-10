# Expo Router 가이드

## 핵심 개념

Expo Router는 파일 기반 라우팅 라이브러리입니다. `app/` 디렉토리에 파일을 추가하면 자동으로 경로가 생성됩니다.

## 주요 특징

1. **Native**: React Navigation 기반, 플랫폼 최적화
2. **Shareable**: 모든 화면이 자동 딥링크 가능
3. **Offline-first**: 캐시 기반 오프라인 지원
4. **Optimized**: 프로덕션에서 lazy-evaluation
5. **Universal**: Android, iOS, 웹 통합 네비게이션
6. **Type-safe**: TypeScript 자동 완성 지원

## 파일 구조 패턴

```
app/
├── _layout.tsx          # 루트 레이아웃
├── index.tsx            # / (홈)
├── (tabs)/              # 그룹 (URL에 포함 안됨)
│   ├── _layout.tsx      # 탭 레이아웃
│   ├── index.tsx        # /
│   └── settings.tsx     # /settings
├── info/
│   └── [id].tsx         # /info/123 (동적 라우트)
└── add-vinyl.tsx        # /add-vinyl
```

## 네비게이션 사용법

### Link 컴포넌트
```tsx
import { Link } from 'expo-router';

<Link href="/info/123">상세보기</Link>
<Link href={{ pathname: '/info/[id]', params: { id: '123' } }}>상세보기</Link>
```

### 프로그래밍 네비게이션
```tsx
import { router } from 'expo-router';

router.push('/info/123');
router.back();
router.replace('/home');
```

## 동적 라우트

파일명에 `[param]` 사용:
- `[id].tsx` → `/info/123`
- `[...slug].tsx` → `/docs/getting-started/intro` (catch-all)

```tsx
// app/info/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function InfoScreen() {
  const { id } = useLocalSearchParams();
  return <Text>Vinyl ID: {id}</Text>;
}
```

## 레이아웃

`_layout.tsx`로 공통 레이아웃 정의:

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: '내 바이닐' }} />
      <Tabs.Screen name="wishlist" options={{ title: '위시리스트' }} />
      <Tabs.Screen name="settings" options={{ title: '설정' }} />
    </Tabs>
  );
}
```

## 참고

- React Navigation의 모든 기능 사용 가능
- 공식 문서: https://docs.expo.dev/router/introduction/
