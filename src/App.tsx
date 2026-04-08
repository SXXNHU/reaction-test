import { useState } from 'react'
import './App.css'
import { animalRanks, proPlayers } from './data/reactionData'
import {
  buildShareText,
  calculateAverage,
  findAnimalRank,
  findClosestPlayer,
  getResultLine,
} from './utils/reactionUtils'

type Phase = 'idle' | 'waiting' | 'ready' | 'false-start' | 'finished'

const totalTrials = 5

function App() {
  const [trial, setTrial] = useState(0)
  const [records, setRecords] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const [stageKicker, setStageKicker] = useState('시작할 준비 완료')
  const [stageTitle, setStageTitle] = useState('테스트 시작')
  const [stageCopy, setStageCopy] = useState('버튼을 누르면 5회 측정을 시작합니다.')
  const [roundText, setRoundText] = useState('시작 전')
  const [phaseText, setPhaseText] = useState('대기')
  const [startAt, setStartAt] = useState(0)
  const [timeoutId, setTimeoutId] = useState<number | null>(null)
  const [copyLabel, setCopyLabel] = useState('결과 문구 복사')
  const [isLocked, setIsLocked] = useState(false)

  const averageMs = records.length ? calculateAverage(records) : 0
  const closestPlayer = records.length ? findClosestPlayer(averageMs, proPlayers) : null
  const animalRank = records.length ? findAnimalRank(averageMs, animalRanks) : null

  function pulseFeedback(duration = 120) {
    if (navigator.vibrate) navigator.vibrate(duration)
  }

  function clearPendingTimer() {
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      setTimeoutId(null)
    }
  }

  function lockStageBriefly() {
    setIsLocked(true)
    window.setTimeout(() => setIsLocked(false), 220)
  }

  function setStageView(nextPhase: Phase, kicker: string, title: string, copy: string, nextRound: string, nextPhaseLabel: string) {
    setPhase(nextPhase)
    setStageKicker(kicker)
    setStageTitle(title)
    setStageCopy(copy)
    setRoundText(nextRound)
    setPhaseText(nextPhaseLabel)
  }

  function resetTest() {
    clearPendingTimer()
    setTrial(0)
    setRecords([])
    setStartAt(0)
    setCopyLabel('결과 문구 복사')
    setStageView('idle', '시작할 준비 완료', '테스트 시작', '버튼을 누르면 5회 측정을 시작합니다.', '시작 전', '대기')
  }

  function openResults(nextRecords: number[]) {
    const average = calculateAverage(nextRecords)
    setStageView('finished', '5회 측정 완료', '결과를 확인해보세요', '아래 카드에서 가장 비슷한 선수와 동물 등급을 볼 수 있어요.', '5회 측정 완료', '결과')
    setCopyLabel('결과 문구 복사')
    return average
  }

  function completeTrial(reactionTime: number) {
    const nextRecords = [...records, reactionTime]
    setRecords(nextRecords)
    pulseFeedback(70)

    if (nextRecords.length === totalTrials) {
      openResults(nextRecords)
      return
    }

    setStageView('idle', '다음 회차 준비 완료', '다음 측정 시작', '한 번 더 눌러 다음 회차를 시작하세요.', `${nextRecords.length + 1} / ${totalTrials} 회차 준비`, '준비')
  }

  function handleFalseStart() {
    clearPendingTimer()
    pulseFeedback(160)
    setStageView('false-start', '너무 빨랐어요', '신호 전에 눌렀어요', '초록색과 지금 탭 문구가 뜬 뒤에 눌러야 기록이 측정됩니다.', `${trial} / ${totalTrials} 회차 재시도`, '재시도')
  }

  function armTrial() {
    const nextTrial = records.length + 1
    setTrial(nextTrial)
    setStageView('waiting', '손가락 준비', '기다리세요...', '초록색 신호가 뜨기 전엔 누르면 안 됩니다.', `${nextTrial} / ${totalTrials} 회차`, '대기')

    const delay = 1500 + Math.floor(Math.random() * 2500)
    const timer = window.setTimeout(() => {
      const startedAt = performance.now()
      setStartAt(startedAt)
      pulseFeedback(40)
      setStageView('ready', '지금이 타이밍', '지금 탭!', '보이는 즉시 눌러서 반응속도를 기록하세요.', `${nextTrial} / ${totalTrials} 회차`, '측정 중')
    }, delay)

    setTimeoutId(timer)
  }

  async function copyResultText() {
    if (!closestPlayer) return

    const text = buildShareText(averageMs, closestPlayer)

    try {
      await navigator.clipboard.writeText(text)
      setCopyLabel('복사 완료')
      pulseFeedback(40)
    } catch {
      const helper = document.createElement('textarea')
      helper.value = text
      document.body.appendChild(helper)
      helper.select()
      document.execCommand('copy')
      helper.remove()
      setCopyLabel('복사 완료')
    }

    window.setTimeout(() => setCopyLabel('결과 문구 복사'), 1200)
  }

  function handleStagePress() {
    if (isLocked) return
    lockStageBriefly()

    if (phase === 'idle' || phase === 'false-start') {
      armTrial()
      return
    }

    if (phase === 'waiting') {
      handleFalseStart()
      return
    }

    if (phase === 'ready') {
      const reactionTime = Math.round(performance.now() - startAt)
      completeTrial(reactionTime)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">모바일 반응속도 테스트</p>
        <h1>당신의 반응속도, 프로게이머급?</h1>
        <p className="subcopy">눌러서 시작하고, 초록색이 뜨면 바로 탭하세요.</p>
      </section>

      <section className="status-strip">
        <div>
          <span className="status-label">현재 진행</span>
          <strong>{roundText}</strong>
        </div>
        <div>
          <span className="status-label">상태</span>
          <strong>{phaseText}</strong>
        </div>
      </section>

      <button className={`test-stage ${phase}`} type="button" onClick={handleStagePress}>
        <span className="stage-kicker">{stageKicker}</span>
        <strong className="stage-title">{stageTitle}</strong>
        <span className="stage-copy">{stageCopy}</span>
      </button>

      <section className="trial-panel">
        <div className="trial-header">
          <h2>이번 테스트 기록</h2>
          <span>{records.length} / {totalTrials}</span>
        </div>
        <ol className="trial-list">
          {records.length === 0 ? (
            <li className="trial-item empty">아직 기록이 없어요. 시작 버튼을 눌러 첫 측정을 진행해보세요.</li>
          ) : (
            records.map((record, index) => (
              <li className="trial-item" key={`${record}-${index}`}>
                <span>{index + 1}회차</span>
                <strong>{record}ms</strong>
              </li>
            ))
          )}
        </ol>
      </section>

      {phase === 'finished' && closestPlayer && animalRank ? (
        <section className="result-panel">
          <div className="result-card primary">
            <p className="result-label">평균 반응속도</p>
            <strong>{averageMs}ms</strong>
            <p>{getResultLine(averageMs)}</p>
          </div>

          <div className="result-card">
            <p className="section-title">기준 데이터상 가장 비슷한 프로게이머</p>
            <div className="player-card">
              <div className="player-avatar">{closestPlayer.avatar}</div>
              <div className="player-copy">
                <strong>{closestPlayer.nickname}</strong>
                <span>{closestPlayer.team}</span>
                <p>기준 반응속도 {closestPlayer.reactionMs}ms · 차이 {Math.abs(closestPlayer.reactionMs - averageMs)}ms</p>
                <small>{closestPlayer.tagline}</small>
              </div>
            </div>
          </div>

          <div className="result-card">
            <p className="section-title">당신의 반응속도 수준</p>
            <div className="animal-card">
              <div className="animal-emoji">{animalRank.emoji}</div>
              <div className="animal-copy">
                <strong>{animalRank.label}</strong>
                <span>{animalRank.animalName}</span>
                <p>{animalRank.description}</p>
              </div>
            </div>
          </div>

          <div className="result-actions">
            <button className="action-button strong" type="button" onClick={resetTest}>다시 테스트</button>
            <button className="action-button" type="button" onClick={copyResultText}>{copyLabel}</button>
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default App
