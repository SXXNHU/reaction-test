import { useCallback, useEffect, useRef, useState } from 'react'
import type { Test1Result } from '../App'

// ── Asterisk (*) 9-point layout ──────────────────────────────
// center (50,50) + 8 endpoints at radius=40% from center
const POINTS = [
  { id: 'c',  x: 50,   y: 50   },
  { id: 'r',  x: 90,   y: 50   },
  { id: 'br', x: 78.3, y: 78.3 },
  { id: 'b',  x: 50,   y: 90   },
  { id: 'bl', x: 21.7, y: 78.3 },
  { id: 'l',  x: 10,   y: 50   },
  { id: 'tl', x: 21.7, y: 21.7 },
  { id: 't',  x: 50,   y: 10   },
  { id: 'tr', x: 78.3, y: 21.7 },
]

// SVG lines: center to each outer point
const LINES = POINTS.slice(1).map((p) => ({ x1: 50, y1: 50, x2: p.x, y2: p.y }))

const TOTAL_ROUNDS = 15
const WINDOW_MS    = 1300   // max time to click
const GAP_MIN_MS   = 400
const GAP_MAX_MS   = 700

type Phase = 'intro' | 'countdown' | 'active' | 'done'

type Props = {
  onComplete: (result: Test1Result) => void
  onBack: () => void
}

export default function Test1Page({ onComplete, onBack }: Props) {
  const [phase, setPhase]               = useState<Phase>('intro')
  const [round, setRound]               = useState(0)
  const [activeId, setActiveId]         = useState<string | null>(null)
  const [hits, setHits]                 = useState(0)
  const [misses, setMisses]             = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [lastMs, setLastMs]             = useState<number | null>(null)
  const [countdown, setCountdown]       = useState(3)
  const [feedback, setFeedback]         = useState<{ text: string; ok: boolean } | null>(null)

  const spawnedAtRef   = useRef<number>(0)
  const expireTimerRef = useRef<number | null>(null)
  const gapTimerRef    = useRef<number | null>(null)
  const countdownRef   = useRef<number | null>(null)
  const feedbackRef    = useRef<number | null>(null)
  const lastIdRef      = useRef<string | null>(null)
  const roundRef       = useRef(0)
  const hitsRef        = useRef(0)
  const missesRef      = useRef(0)
  const timesRef       = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    if (expireTimerRef.current !== null) { window.clearTimeout(expireTimerRef.current); expireTimerRef.current = null }
    if (gapTimerRef.current !== null)    { window.clearTimeout(gapTimerRef.current);    gapTimerRef.current    = null }
  }, [])

  const showFeedback = useCallback((text: string, ok: boolean) => {
    setFeedback({ text, ok })
    if (feedbackRef.current !== null) window.clearTimeout(feedbackRef.current)
    feedbackRef.current = window.setTimeout(() => setFeedback(null), 700)
  }, [])

  const finishGame = useCallback(() => {
    clearTimers()
    setActiveId(null)
    setPhase('done')
    const avg = timesRef.current.length
      ? timesRef.current.reduce((s, v) => s + v, 0) / timesRef.current.length
      : 0
    const total = hitsRef.current + missesRef.current
    onComplete({
      reactionTimes: timesRef.current,
      hits:          hitsRef.current,
      misses:        missesRef.current,
      averageMs:     avg,
      accuracy:      total > 0 ? (hitsRef.current / total) * 100 : 0,
    })
  }, [clearTimers, onComplete])

  const spawnNext = useCallback((afterMs: number) => {
    clearTimers()
    gapTimerRef.current = window.setTimeout(() => {
      if (roundRef.current >= TOTAL_ROUNDS) { finishGame(); return }

      // pick random point (not same as last)
      const choices = POINTS.filter((p) => p.id !== lastIdRef.current)
      const picked  = choices[Math.floor(Math.random() * choices.length)]
      lastIdRef.current = picked.id
      spawnedAtRef.current = performance.now()
      setActiveId(picked.id)

      expireTimerRef.current = window.setTimeout(() => {
        // miss
        missesRef.current += 1
        setMisses(missesRef.current)
        setActiveId(null)
        showFeedback('MISS', false)
        roundRef.current += 1
        setRound(roundRef.current)
        if (roundRef.current >= TOTAL_ROUNDS) { finishGame(); return }
        const gap = GAP_MIN_MS + Math.random() * (GAP_MAX_MS - GAP_MIN_MS)
        spawnNext(gap)
      }, WINDOW_MS)
    }, afterMs)
  }, [clearTimers, finishGame, showFeedback])

  const handlePointClick = useCallback((id: string) => {
    if (phase !== 'active' || id !== activeId) return
    clearTimers()

    const ms = performance.now() - spawnedAtRef.current
    timesRef.current = [...timesRef.current, ms]
    hitsRef.current += 1

    setReactionTimes(timesRef.current)
    setHits(hitsRef.current)
    setLastMs(Math.round(ms))
    setActiveId(null)
    showFeedback(`${Math.round(ms)} ms`, true)

    roundRef.current += 1
    setRound(roundRef.current)
    if (roundRef.current >= TOTAL_ROUNDS) { finishGame(); return }

    const gap = GAP_MIN_MS + Math.random() * (GAP_MAX_MS - GAP_MIN_MS)
    spawnNext(gap)
  }, [phase, activeId, clearTimers, finishGame, showFeedback, spawnNext])

  // Countdown effect
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown > 0) {
      countdownRef.current = window.setTimeout(() => setCountdown((n) => n - 1), 900)
    } else {
      countdownRef.current = window.setTimeout(() => {
        setPhase('active')
        const gap = GAP_MIN_MS + Math.random() * (GAP_MAX_MS - GAP_MIN_MS)
        spawnNext(gap)
      }, 600)
    }
    return () => { if (countdownRef.current !== null) window.clearTimeout(countdownRef.current) }
  }, [phase, countdown, spawnNext])

  useEffect(() => () => clearTimers(), [clearTimers])

  const avgMs = reactionTimes.length
    ? Math.round(reactionTimes.reduce((s, v) => s + v, 0) / reactionTimes.length)
    : null

  return (
    <div className="test-page">
      {/* ── Header ── */}
      <header className="test-header">
        <button className="test-back-btn" onClick={onBack} type="button">← HOME</button>
        <div className="test-header-center">
          <span className="test-eyebrow">TEST 01</span>
          <h1 className="test-title">반응 아레나</h1>
        </div>
        <div className="test-progress-wrap">
          <span className="test-progress-label">{round} / {TOTAL_ROUNDS}</span>
          <div className="test-progress-bar">
            <span style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }} />
          </div>
        </div>
      </header>

      {/* ── Asterisk Field ── */}
      <div className="asterisk-stage">
        {/* SVG lines */}
        <svg className="asterisk-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {LINES.map((l, i) => (
            <line
              key={i}
              x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Clickable points */}
        {POINTS.map((p) => {
          const isActive = p.id === activeId
          return (
            <button
              key={p.id}
              className={`asterisk-point${isActive ? ' asterisk-point-active' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => handlePointClick(p.id)}
              type="button"
              aria-label={`Point ${p.id}`}
            >
              <span className="asterisk-point-core" />
              {isActive && <span className="asterisk-point-ring" />}
            </button>
          )
        })}

        {/* Overlays */}
        {phase === 'intro' && (
          <div className="asterisk-overlay">
            <p className="test-eyebrow">F1 드라이버 훈련 방식</p>
            <h2>반응 아레나</h2>
            <p>별 모양의 9개 포인트 중 하나가 무작위로 점등됩니다.<br />빠르게 클릭하세요. 총 {TOTAL_ROUNDS}회 진행됩니다.</p>
            <button
              className="test-primary-btn"
              onClick={() => { setPhase('countdown'); setCountdown(3) }}
              type="button"
            >
              START
            </button>
          </div>
        )}

        {phase === 'countdown' && (
          <div className="asterisk-overlay asterisk-overlay-count">
            <span className="countdown-num">{countdown > 0 ? countdown : 'GO'}</span>
          </div>
        )}

        {phase === 'active' && (
          <div className="asterisk-live-hud">
            {lastMs !== null && (
              <span className="asterisk-last-ms">{lastMs} ms</span>
            )}
          </div>
        )}
      </div>

      {/* ── Feedback flash ── */}
      {feedback && (
        <div className={`test-feedback${feedback.ok ? ' test-feedback-ok' : ' test-feedback-miss'}`}>
          {feedback.text}
        </div>
      )}

      {/* ── Live stats bar ── */}
      {(phase === 'active' || phase === 'done') && (
        <div className="test-stat-bar">
          <article className="test-stat-chip">
            <span>HIT</span>
            <strong>{hits}</strong>
          </article>
          <article className="test-stat-chip">
            <span>MISS</span>
            <strong>{misses}</strong>
          </article>
          <article className="test-stat-chip">
            <span>AVG</span>
            <strong>{avgMs !== null ? `${avgMs} ms` : '--'}</strong>
          </article>
          <article className="test-stat-chip">
            <span>ACC</span>
            <strong>
              {hits + misses > 0 ? `${Math.round((hits / (hits + misses)) * 100)}%` : '--'}
            </strong>
          </article>
        </div>
      )}
    </div>
  )
}
