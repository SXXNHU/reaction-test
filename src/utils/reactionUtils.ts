import type { AnimalRank, ProPlayer } from '../data/reactionData'

export function calculateAverage(records: number[]) {
  const total = records.reduce((sum, value) => sum + value, 0)
  return Math.round(total / records.length)
}

export function findClosestPlayer(averageMs: number, players: ProPlayer[]) {
  return players.reduce((closest, candidate) => {
    const currentGap = Math.abs(candidate.reactionMs - averageMs)
    const bestGap = Math.abs(closest.reactionMs - averageMs)
    return currentGap < bestGap ? candidate : closest
  })
}

export function findAnimalRank(averageMs: number, ranks: AnimalRank[]) {
  return ranks.find((rank) => averageMs >= rank.min && averageMs <= rank.max) ?? ranks[ranks.length - 1]
}

export function getResultLine(averageMs: number) {
  if (averageMs <= 180) return '벼락치기 치고는 꽤 빠른데요?'
  if (averageMs <= 220) return '이 반응이면 시험범위 알림은 누구보다 빨리 보겠네요.'
  if (averageMs <= 260) return '일반인 기준으로는 꽤 괜찮은 편이에요. 손이 잘 따라오네요.'
  if (averageMs <= 320) return '딱 평균권에서 안정적인 타입이에요. 급할 때도 크게 흔들리지 않겠네요.'
  if (averageMs <= 380) return '조금 느긋한 편이지만, 익숙해지면 충분히 줄일 수 있는 구간이에요.'
  return '아직은 워밍업 단계예요. 한 번 더 하면 기록이 달라질지도 몰라요.'
}

export function buildShareText(averageMs: number, player: ProPlayer) {
  return `내 반응속도는 ${averageMs}ms, 기준 데이터상 ${player.nickname} 선수와 가장 비슷!`
}
