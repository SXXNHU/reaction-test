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
  { id: 1, min: 0, max: 170, label: '프로급', animalName: '치타', emoji: '🐆', description: '일반인 기준으로는 꽤 드문, 거의 프로게이머급 반응에 가까워요.', image: '' },
  { id: 2, min: 171, max: 200, label: '매우 빠름', animalName: '고양이', emoji: '🐈', description: '집중이 잘 붙는 날엔 상위권 기록도 충분히 노려볼 수 있어요.', image: '' },
  { id: 3, min: 201, max: 230, label: '빠름', animalName: '매', emoji: '🦅', description: '일반인 기준으로 빠른 편이고 스타트 감각도 꽤 좋은 편이에요.', image: '' },
  { id: 4, min: 231, max: 260, label: '준수함', animalName: '여우', emoji: '🦊', description: '조금만 예열하면 더 안정적으로 빠른 기록이 나올 수 있는 구간이에요.', image: '' },
  { id: 5, min: 261, max: 290, label: '평균 이상', animalName: '토끼', emoji: '🐇', description: '보통 사람들 사이에서는 꽤 괜찮은 반응속도에 속해요.', image: '' },
  { id: 6, min: 291, max: 320, label: '평균', animalName: '사슴', emoji: '🦌', description: '가장 일반적인 반응속도 구간이라 실전 체감도 무난한 편이에요.', image: '' },
  { id: 7, min: 321, max: 360, label: '조금 느림', animalName: '판다', emoji: '🐼', description: '평균권이지만 신호를 읽고 손이 나가기까지 약간의 텀이 있는 편이에요.', image: '' },
  { id: 8, min: 361, max: 420, label: '느림', animalName: '거북이', emoji: '🐢', description: '서두르기보다는 신중하게 반응하는 타입에 더 가까워요.', image: '' },
  { id: 9, min: 421, max: 1000, label: '워밍업 필요', animalName: '나무늘보', emoji: '🦥', description: '아직 손이 덜 풀린 상태일 수 있어요. 한 번 더 하면 달라질 수 있어요.', image: '' },
]
