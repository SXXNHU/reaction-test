# reaction-test

모바일 반응속도 테스트 웹앱입니다.  
5번 측정한 평균 반응속도를 바탕으로, 기준 데이터상 가장 비슷한 프로게이머와 동물 등급을 함께 보여줍니다.

## Stack

- React
- TypeScript
- Vite

## Features

- 랜덤 대기 후 탭하는 반응속도 테스트
- false start 처리
- 5회 측정 기록과 평균 반응속도 계산
- 기준 데이터상 가장 비슷한 프로게이머 카드
- 동물 등급 카드와 공유용 텍스트 생성
- 모바일 게임 테스트 스타일 UI

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Structure

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

## Edit Points

- 프로게이머 기준 데이터 수정: `src/data/reactionData.ts`
- 동물 등급 구간 수정: `src/data/reactionData.ts`
- 결과 문구 및 비교 로직 수정: `src/utils/reactionUtils.ts`
- 측정 횟수와 랜덤 대기 시간 수정: `src/App.tsx`
- 전체 UI 수정: `src/App.css`

## Notes

- 반응속도 계산은 `performance.now()`를 사용합니다.
- 색상 변화만이 아니라 텍스트 신호도 함께 보여줍니다.
- 정적 배포 가능한 구조입니다.
