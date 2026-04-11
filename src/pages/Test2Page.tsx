import { useCallback, useEffect, useRef, useState } from 'react'
import type { Test2Result } from '../App'

const TOTAL_TRIALS   = 5
const LIGHT_ON_MS    = 800   // time between each light illuminating
const MIN_WAIT_MS    = 800   // minimum wait after all 5 lit
const MAX_WAIT_MS    = 3200  // maximum wait after all 5 lit

type TrialPhase = 'idle' | 'lighting' | 'waiting' | 'react' | 'done'

type TrialRecord = {
  reactionMs: number | null
  isFalseStart: boolean
}

type Props = {
  onComplete: (result: Test2Result) => void
  onBack: () => void
}

export default function Test2Page({ onComplete, onBack }: Props) {
  const [phase, setPhase]       = useState<'intro' | 'running' | 'finished'>('intro')
  const [trialPhase, setTrialPhase] = useState<TrialPhase>('idle')
  const [litCount, setLitCount] = useState(0)
  const [trials, setTrials]     = useState<TrialRecord[]>([])
  const [currentMs, setCurrentMs] = useState<number | null>(null)
  const [falseStart, setFalseStart] = useState(false)
  const [showFlash, setShowFlash]   = useState<string | null>(null)

  const lightsOutAtRef = useRef<number | null>(null)
  const timerRef       = useRef<number | null>(null)
  const flashRef       = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) { window.clearTimeout(timerRef.current); timerRef.current = null }
  }, [])

  const flash = useCallback((msg: string, ms = 1000) => {
    setShowFlash(msg)
    if (flashRef.current !== null) window.clearTimeout(flashRef.current)
    flashRef.current = window.setTimeout(() => setShowFlash(null), ms)
  }, [])

  // ── Run a single trial ────────────────────────────────────────
  const runTrial = useCallback(() => {
    setLitCount(0)
    setFalseStart(false)
    setCurrentMs(null)
    lightsOutAtRef.current = null
    setTrialPhase('lighting')

    // Light up 5 lights one by one
    let count = 0
    const lightNext = () => {
      count += 1
      setLitCount(count)
      if (count < 5) {
        timerRef.current = window.setTimeout(lightNext, LIGHT_ON_MS)
      } else {
        // All 5 lit → wait random delay then GO
        const wait = MIN_WAIT_MS + Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS)
        setTrialPhase('waiting')
        timerRef.current = window.setTimeout(() => {
          lightsOutAtRef.current = performance.now()
          setLitCount(0)       // lights out
          setTrialPhase('react')
        }, wait)
      }
    }
    timerRef.current = window.setTimeout(lightNext, LIGHT_ON_MS)
  }, [])

  // ── Advance to next trial or finish ──────────────────────────
  const nextTrialOrFinish = useCallback((record: TrialRecord, allTrials: TrialRecord[]) => {
    const updated = [...allTrials, record]
    setTrials(updated)
    setCurrentMs(record.reactionMs)

    if (updated.length >= TOTAL_TRIALS) {
      // Done – compute result
      setPhase('finished')
      setTrialPhase('done')
      const validTimes = updated
        .filter((t) => !t.isFalseStart && t.reactionMs !== null)
        .map((t) => t.reactionMs as number)
      const avg = validTimes.length
        ? validTimes.reduce((s, v) => s + v, 0) / validTimes.length
        : 0
      onComplete({
        reactionTimes: validTimes,
        averageMs:     avg,
        falseStarts:   updated.filter((t) => t.isFalseStart).length,
      })
    } else {
      // Short break then next trial
      timerRef.current = window.setTimeout(() => runTrial(), 1200)
    }
  }, [onComplete, runTrial])

  // ── Spacebar listener ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return
      e.preventDefault()

      if (trialPhase === 'lighting' || trialPhase === 'waiting') {
        // False start
        clearTimer()
        setFalseStart(true)
        flash('⚠ FALSE START — 너무 빨라요!', 1400)
        // Record as false start and move on
        setTimeout(() => nextTrialOrFinish({ reactionMs: null, isFalseStart: true }, trials), 1600)
      } else if (trialPhase === 'react' && lightsOutAtRef.current !== null) {
        const ms = performance.now() - lightsOutAtRef.current
        clearTimer()
        flash(`${Math.round(ms)} ms`, 900)
        nextTrialOrFinish({ reactionMs: Math.round(ms), isFalseStart: false }, trials)
        setTrialPhase('idle')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [trialPhase, trials, clearTimer, flash, nextTrialOrFinish])

  useEffect(() => () => clearTimer(), [clearTimer])

  const validTrials = trials.filter((t) => !t.isFalseStart && t.reactionMs !== null)
  const avgMs = validTrials.length
    ? Math.round(validTrials.reduce((s, t) => s + (t.reactionMs ?? 0), 0) / validTrials.length)
    : null

  return (
    <div className="test-page test-page-dark">
      {/* ── Header ── */}
      <header className="test-header">
        <button className="test-back-btn" onClick={onBack} type="button">← HOME</button>
        <div className="test-header-center">
          <span className="test-eyebrow">TEST 02</span>
          <h1 className="test-title">출발 신호</h1>
        </div>
        <div className="test-progress-wrap">
          <span className="test-progress-label">{trials.length} / {TOTAL_TRIALS}</span>
          <div className="test-progress-bar">
            <span style={{ width: `${(trials.length / TOTAL_TRIALS) * 100}%` }} />
          </div>
        </div>
      </header>

      {/* ── Cockpit background ── */}
      <div className="cockpit-stage">
        <div
          className="cockpit-bg"
          style={{ backgroundImage: "url('/src/assets/f1-cockpit.jpg')" }}
        />
        <div className="cockpit-overlay" />

        {/* ── F1 Lights ── */}
        <div className="f1-lights-wrap">
          <div className="f1-lights-panel">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`f1-light${litCount > i ? ' f1-light-lit' : ''}${trialPhase === 'react' ? ' f1-light-out' : ''}`}
              />
            ))}
          </div>
          {trialPhase === 'react' && (
            <p className="f1-lights-cue">SPACEBAR</p>
          )}
          {(trialPhase === 'lighting' || trialPhase === 'waiting') && (
            <p className="f1-lights-wait">대기 중…</p>
          )}
        </div>

        {/* ── Intro overlay ── */}
        {phase === 'intro' && (
          <div className="cockpit-intro">
            <span className="test-eyebrow">F1 STARTING LIGHTS</span>
            <h2>출발 신호 테스트</h2>
            <p>
              5개의 빨간 등이 하나씩 켜집니다.<br />
              모든 등이 꺼지는 순간 <strong>SPACEBAR</strong>를 누르세요.<br />
              총 {TOTAL_TRIALS}회 진행되며 반응속도를 측정합니다.
            </p>
            <p className="cockpit-intro-warn">등이 켜지는 동안 누르면 False Start!</p>
            <button
              className="test-primary-btn"
              onClick={() => { setPhase('running'); runTrial() }}
              type="button"
            >
              READY
            </button>
          </div>
        )}

        {/* ── Result per trial ── */}
        {currentMs !== null && phase === 'running' && (
          <div className="cockpit-trial-result">
            <span>Trial {trials.length}</span>
            <strong>{falseStart ? 'FALSE START' : `${currentMs} ms`}</strong>
          </div>
        )}

        {/* ── Flash feedback ── */}
        {showFlash && (
          <div className={`test-feedback test-feedback-cockpit${falseStart ? ' test-feedback-miss' : ' test-feedback-ok'}`}>
            {showFlash}
          </div>
        )}
      </div>

      {/* ── Stats bar ── */}
      {trials.length > 0 && (
        <div className="test-stat-bar">
          {trials.map((t, i) => (
            <article key={i} className={`test-stat-chip${t.isFalseStart ? ' test-stat-chip-bad' : ''}`}>
              <span>TRIAL {i + 1}</span>
              <strong>{t.isFalseStart ? 'FS' : t.reactionMs !== null ? `${t.reactionMs} ms` : '--'}</strong>
            </article>
          ))}
          {avgMs !== null && (
            <article className="test-stat-chip test-stat-chip-avg">
              <span>AVG</span>
              <strong>{avgMs} ms</strong>
            </article>
          )}
        </div>
      )}
    </div>
  )
}
