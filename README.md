# reaction-test

모바일 반응속도 테스트 웹입니다. React + Vite + TypeScript 기반으로 구성했고, 5회 측정 뒤 평균 반응속도와 기준 데이터상 가장 비슷한 프로게이머, 동물 등급을 보여줍니다.

## 실행 방법

1. `cd reaction-test`
2. `npm install`
3. `npm run dev`

## 구조

```text
src/
├─ App.tsx
├─ App.css
├─ index.css
├─ data/
│  └─ reactionData.ts
└─ utils/
   └─ reactionUtils.ts
```

## 수정 포인트

- 선수 기준 데이터 수정: `src/data/reactionData.ts`
- 동물 등급 수정: `src/data/reactionData.ts`
- 결과 문구 수정: `src/utils/reactionUtils.ts`
- 측정 횟수 수정: `src/App.tsx`의 `totalTrials`
- 랜덤 대기 시간 수정: `src/App.tsx`의 `armTrial()`

## 메모

- `performance.now()`로 반응속도를 계산합니다.
- false start를 명확히 처리합니다.
- 색상 변화와 텍스트 신호를 함께 써서 모바일에서 더 직관적으로 보이게 구성했습니다.
