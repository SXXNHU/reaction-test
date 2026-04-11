import f1Logo from '../assets/f1_logo.png'
import type { ModeKey } from '../gameData'

type Props = {
  onStartTest: () => void
  onArena: (mode: ModeKey) => void
}

const ARENA_MODES: Array<{ key: ModeKey; label: string; tag: string; desc: string }> = [
  { key: 'classic',   label: 'Classic Reflex', tag: '20 SHOTS',      desc: '기본 반응속도 측정' },
  { key: 'sprint',    label: 'Sprint 30s',      tag: '30 SECONDS',    desc: '30초 스프린트 점수 도전' },
  { key: 'survival',  label: 'Survival',        tag: '3 LIVES',       desc: '3목숨 서바이벌 모드' },
  { key: 'precision', label: 'Precision',       tag: 'SMALL ORBS',    desc: '소형 타겟 정밀 훈련' },
  { key: 'dual',      label: 'Dual Target',     tag: 'FAKE TARGETS',  desc: '판단력 + 반응속도 복합' },
]

export default function HomePage({ onStartTest, onArena }: Props) {
  return (
    <div className="home-page">
      {/* ── HERO ─────────────────────────────── */}
      <section className="home-hero">
        <div className="home-video-wrap">
          <img
            className="home-video"
            src={f1Logo}
            alt="Formula 1 logo"
          />
          <div className="home-video-overlay" />
        </div>

        <div className="home-hero-content">
          <div className="home-f1-logo">
            <span className="home-f1-mark">F1</span>
            <span className="home-f1-label">REACTION ARENA</span>
          </div>
          <h1 className="home-hero-title">
            REDLINE<br />REFLEXES
          </h1>
          <p className="home-hero-sub">F1 드라이버 반응속도 평가 시스템</p>
          <p className="home-hero-desc">
            두 단계 테스트를 통해 당신의 반응속도를 분석하고<br />
            가장 닮은 현역 F1 드라이버를 찾아드립니다.
          </p>
          <button className="home-start-btn" onClick={onStartTest}>
            <span>START TEST</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6 3.5L13.5 9 6 14.5V3.5z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── MINI GAMES ───────────────────────── */}
      <section className="home-arcade">
        <div className="home-arcade-header">
          <span className="home-section-eyebrow">TRAINING ARCADE</span>
          <h2 className="home-arcade-title">개별 훈련 모드</h2>
          <p className="home-arcade-desc">테스트 없이 원하는 모드만 골라서 연습하세요</p>
        </div>

        <div className="home-arcade-grid">
          {ARENA_MODES.map((m) => (
            <button
              key={m.key}
              className="home-arcade-card"
              onClick={() => onArena(m.key)}
              type="button"
            >
              <span className="home-arcade-tag">{m.tag}</span>
              <strong className="home-arcade-name">{m.label}</strong>
              <p className="home-arcade-hint">{m.desc}</p>
              <span className="home-arcade-arrow">→</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
