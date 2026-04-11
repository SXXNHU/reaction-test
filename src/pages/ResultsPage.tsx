import { useState } from 'react'
import type { Test1Result, Test2Result } from '../App'
import { CURRENT_F1_DRIVERS } from '../data/f1Drivers'
import type { DriverArchetype, DriverProfile } from '../data/f1Drivers'

// ── Driver Matching ───────────────────────────────────────────
function getArchetype(combinedAvg: number, accuracy: number): DriverArchetype {
  if (accuracy >= 94)           return 'precision'
  if (combinedAvg < 195)        return 'aggression'
  if (combinedAvg < 220 && accuracy >= 84) return 'tempo'
  if (combinedAvg < 255)        return 'judgement'
  if (accuracy >= 78)           return 'endurance'
  return 'recovery'
}

function getTier(avg: number, accuracy: number): number {
  const score = (Math.max(0, 700 - avg) / 500) * 0.55 + (accuracy / 100) * 0.45
  if (score >= 0.88) return 5
  if (score >= 0.76) return 4
  if (score >= 0.62) return 3
  if (score >= 0.48) return 2
  return 1
}

function matchDriver(avg: number, accuracy: number): DriverProfile {
  const arch   = getArchetype(avg, accuracy)
  const tier   = getTier(avg, accuracy)
  const scored = CURRENT_F1_DRIVERS.map((d) => {
    let s = Math.abs(d.tier - tier) * 2
    if (d.archetypes.includes(arch)) s -= 3
    return { d, s }
  }).sort((a, b) => a.s - b.s)
  const pool = scored.filter((e) => e.s <= scored[0].s + 1).slice(0, 4)
  return pool[Math.floor(Math.random() * pool.length)].d
}

type RankInfo = { key: string; label: string; sub: string }

function getRank(avg: number, accuracy: number): RankInfo {
  const rating = (Math.max(0, 700 - avg) / 500) * 0.55 + (accuracy / 100) * 0.45
  if (rating >= 0.88) return { key: 'S+', label: 'Elite Driver',  sub: '거의 프로 수준의 반응속도입니다.' }
  if (rating >= 0.76) return { key: 'S',  label: 'Apex Reflex',   sub: '프론트로 출발 같은 폭발적 반응입니다.' }
  if (rating >= 0.62) return { key: 'A',  label: 'Track Hunter',  sub: '속도와 정확도의 이상적 균형입니다.' }
  if (rating >= 0.48) return { key: 'B',  label: 'Quick Hands',   sub: '충분히 빠르며 더 나아질 여지가 있습니다.' }
  if (rating >= 0.34) return { key: 'C',  label: 'Rookie',        sub: '기본 반응은 갖춰졌습니다. 리듬을 키우세요.' }
  return                      { key: 'D',  label: 'Slow Start',    sub: '워밍업이 필요합니다. 다시 도전해보세요.' }
}

// ── Helpers ───────────────────────────────────────────────────
function fmt(ms: number | null): string {
  return ms === null ? '--' : `${Math.round(ms)} ms`
}

function fmtAcc(acc: number): string {
  return `${acc.toFixed(1)}%`
}

type Props = {
  test1: Test1Result
  test2: Test2Result
  onRestart: () => void
}

export default function ResultsPage({ test1, test2, onRestart }: Props) {
  const combinedAvg = (test1.averageMs * 0.5 + (test2.averageMs || test1.averageMs) * 0.5)
  const rank        = getRank(combinedAvg, test1.accuracy)
  const driver      = matchDriver(combinedAvg, test1.accuracy)

  const [showModal,   setShowModal]   = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  const shareText = [
    '[F1 Reaction Arena · 드라이버 프로파일링]',
    `등급: ${rank.key} ${rank.label}`,
    `반응속도 (아레나): ${fmt(test1.averageMs)}  정확도: ${fmtAcc(test1.accuracy)}`,
    `반응속도 (출발등): ${fmt(test2.averageMs)}`,
    `종합 평균: ${fmt(combinedAvg)}`,
    `가장 닮은 드라이버: ${driver.name} / ${driver.team}`,
  ].join('\n')

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  return (
    <div className="results-page">
      {/* ── Header ── */}
      <header className="results-header">
        <div className="results-f1-mark">F1</div>
        <div>
          <span className="test-eyebrow">DRIVER PROFILE REPORT</span>
          <h1 className="results-headline">드라이버 분석 완료</h1>
        </div>
        <button className="test-back-btn" onClick={onRestart} type="button">↺ 다시 시작</button>
      </header>

      {/* ── Rank Banner ── */}
      <section className="rank-banner">
        <div className="rank-key">{rank.key}</div>
        <div className="rank-text">
          <strong>{rank.label}</strong>
          <p>{rank.sub}</p>
        </div>
        <div className="rank-avg">
          <span>종합 평균</span>
          <strong>{fmt(combinedAvg)}</strong>
        </div>
      </section>

      {/* ── Results Grid ── */}
      <div className="results-grid">
        {/* Test 1 */}
        <section className="result-card">
          <div className="result-card-label">
            <span className="test-eyebrow">TEST 01</span>
            <h2>반응 아레나</h2>
          </div>
          <div className="result-stat-row">
            <article className="r-stat">
              <span>평균</span>
              <strong>{fmt(test1.averageMs)}</strong>
            </article>
            <article className="r-stat">
              <span>정확도</span>
              <strong>{fmtAcc(test1.accuracy)}</strong>
            </article>
            <article className="r-stat">
              <span>HIT / MISS</span>
              <strong>{test1.hits} / {test1.misses}</strong>
            </article>
            <article className="r-stat">
              <span>BEST</span>
              <strong>{test1.reactionTimes.length ? fmt(Math.min(...test1.reactionTimes)) : '--'}</strong>
            </article>
          </div>
          {/* Reaction time distribution */}
          {test1.reactionTimes.length > 0 && (
            <div className="r-dist">
              {test1.reactionTimes.slice(-12).map((v, i) => (
                <div key={i} className="r-dist-col">
                  <span style={{ height: `${Math.min(100, Math.max(10, ((600 - v) / 400) * 100))}%` }} />
                  <small>{Math.round(v)}</small>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Test 2 */}
        <section className="result-card">
          <div className="result-card-label">
            <span className="test-eyebrow">TEST 02</span>
            <h2>출발 신호</h2>
          </div>
          <div className="result-stat-row">
            <article className="r-stat">
              <span>평균</span>
              <strong>{fmt(test2.averageMs)}</strong>
            </article>
            <article className="r-stat">
              <span>시도 횟수</span>
              <strong>{test2.reactionTimes.length}</strong>
            </article>
            <article className="r-stat">
              <span>BEST</span>
              <strong>{test2.reactionTimes.length ? fmt(Math.min(...test2.reactionTimes)) : '--'}</strong>
            </article>
            <article className="r-stat">
              <span>FALSE START</span>
              <strong>{test2.falseStarts}</strong>
            </article>
          </div>
          {/* Per-trial breakdown */}
          <div className="r-trials">
            {test2.reactionTimes.map((ms, i) => (
              <article key={i} className="r-trial-chip">
                <span>T{i + 1}</span>
                <strong>{fmt(ms)}</strong>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* ── Driver Profile CTA ── */}
      <section className="driver-cta-section">
        <div className="driver-cta-info">
          <span className="test-eyebrow">DRIVER MATCH</span>
          <h2>가장 닮은 F1 드라이버</h2>
          <p>두 테스트 결과를 분석하여 현역 F1 드라이버와 비교합니다</p>
        </div>
        <button className="driver-reveal-btn" onClick={() => setShowModal(true)} type="button">
          드라이버 확인하기 →
        </button>
      </section>

      {/* ── Share Card ── */}
      <section className="share-section">
        <div className="share-card-content">
          <span className="test-eyebrow">SHARE</span>
          <p className="share-preview">{shareText}</p>
          <button
            className={`share-copy-btn${shareCopied ? ' share-copy-btn-done' : ''}`}
            onClick={() => void handleShare()}
            type="button"
          >
            {shareCopied ? '✓ 복사됨' : '결과 복사하기'}
          </button>
        </div>
      </section>

      {/* ── Driver Modal ── */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="driver-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowModal(false)} type="button">✕</button>

            <div className="modal-header">
              <span className="test-eyebrow">YOUR F1 MATCH</span>
              <div className="modal-rank-badge">{rank.key}</div>
            </div>

            <div className="modal-driver-number">#{driver.number}</div>
            <h2 className="modal-driver-name">{driver.name}</h2>
            <p className="modal-driver-meta">{driver.team} · {driver.nationality}</p>

            <div className="modal-driver-title">{driver.title}</div>
            <p className="modal-driver-summary">{driver.summary}</p>

            <div className="modal-archetypes">
              {driver.archetypes.map((a) => (
                <span key={a} className="modal-archetype-tag">{a}</span>
              ))}
            </div>

            <div className="modal-stats">
              <article>
                <span>종합 평균</span>
                <strong>{fmt(combinedAvg)}</strong>
              </article>
              <article>
                <span>아레나</span>
                <strong>{fmt(test1.averageMs)}</strong>
              </article>
              <article>
                <span>출발등</span>
                <strong>{fmt(test2.averageMs)}</strong>
              </article>
              <article>
                <span>정확도</span>
                <strong>{fmtAcc(test1.accuracy)}</strong>
              </article>
            </div>

            <div className="modal-match-note">
              이번 테스트에서 당신의 반응 패턴은{' '}
              <strong>{driver.name}</strong>과 가장 유사합니다.
            </div>

            <div className="modal-actions">
              <button
                className={`share-copy-btn${shareCopied ? ' share-copy-btn-done' : ''}`}
                onClick={() => void handleShare()}
                type="button"
              >
                {shareCopied ? '✓ 복사됨' : '공유하기'}
              </button>
              <button className="test-secondary-btn" onClick={onRestart} type="button">
                다시 도전
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
