export type ProPlayer = {
  id: number
  nickname: string
  team: string
  reactionMs: number
  tagline: string
  avatar: string
}

export type AnimalRank = {
  id: number
  min: number
  max: number
  label: string
  animalName: string
  emoji: string
  description: string
  image: string
}

// 초기 데모용 기준 데이터입니다.
export const proPlayers: ProPlayer[] = [
  { id: 1, nickname: 'FlashTap', team: 'Blue Orbit', reactionMs: 156, tagline: '첫 클릭이 가장 빠른 엔트리형 선수', avatar: 'FT' },
  { id: 2, nickname: 'Lime', team: 'Seoul Pulse', reactionMs: 171, tagline: '급한 한타에서 먼저 반응하는 스타일', avatar: 'LI' },
  { id: 3, nickname: 'Nova', team: 'Arcade Crew', reactionMs: 183, tagline: '안정적인 평균 속도로 유명한 타입', avatar: 'NV' },
  { id: 4, nickname: 'Rift', team: 'Velocity Gears', reactionMs: 197, tagline: '실수는 적고 타이밍 감각이 좋은 선수', avatar: 'RF' },
  { id: 5, nickname: 'Miro', team: 'Red Stack', reactionMs: 214, tagline: '후반 집중력이 강한 꾸준형 선수', avatar: 'MR' },
  { id: 6, nickname: 'Tempo', team: 'Pixel Raiders', reactionMs: 231, tagline: '안정적인 리듬감으로 승부하는 플레이어', avatar: 'TP' },
]

export const animalRanks: AnimalRank[] = [
  { id: 1, min: 0, max: 170, label: '매우 빠름', animalName: '치타', emoji: '🐆', description: '신호가 뜨자마자 치고 나가는 타입이에요.', image: '' },
  { id: 2, min: 171, max: 205, label: '빠름', animalName: '고양이', emoji: '🐈', description: '집중이 붙으면 꽤 날카롭게 반응하는 편이에요.', image: '' },
  { id: 3, min: 206, max: 250, label: '보통', animalName: '여우', emoji: '🦊', description: '대체로 안정적이지만 초반 스타트는 조금 더 끌어올릴 수 있어요.', image: '' },
  { id: 4, min: 251, max: 1000, label: '느림', animalName: '나무늘보', emoji: '🦥', description: '워밍업이 끝나면 더 좋아질 가능성이 큰 타입이에요.', image: '' },
]
