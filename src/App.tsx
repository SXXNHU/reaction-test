import { useState } from 'react'
import type { ModeKey } from './gameData'
import HomePage from './pages/HomePage'
import Test1Page from './pages/Test1Page'
import Test2Page from './pages/Test2Page'
import ResultsPage from './pages/ResultsPage'
import GameArena from './pages/GameArena'

type PageKey = 'home' | 'test1' | 'test2' | 'results' | 'arena'

export type Test1Result = {
  reactionTimes: number[]
  hits: number
  misses: number
  averageMs: number
  accuracy: number
}

export type Test2Result = {
  reactionTimes: number[]
  averageMs: number
  falseStarts: number
}

export default function App() {
  const [page, setPage] = useState<PageKey>('home')
  const [test1Result, setTest1Result] = useState<Test1Result | null>(null)
  const [test2Result, setTest2Result] = useState<Test2Result | null>(null)
  const [arenaMode, setArenaMode] = useState<ModeKey>('classic')

  switch (page) {
    case 'home':
      return (
        <HomePage
          onStartTest={() => setPage('test1')}
          onArena={(mode) => { setArenaMode(mode); setPage('arena') }}
        />
      )
    case 'test1':
      return (
        <Test1Page
          onComplete={(result) => { setTest1Result(result); setPage('test2') }}
          onBack={() => setPage('home')}
        />
      )
    case 'test2':
      return (
        <Test2Page
          onComplete={(result) => { setTest2Result(result); setPage('results') }}
          onBack={() => setPage('test1')}
        />
      )
    case 'results':
      return (
        <ResultsPage
          test1={test1Result!}
          test2={test2Result!}
          onRestart={() => { setTest1Result(null); setTest2Result(null); setPage('home') }}
        />
      )
    case 'arena':
      return <GameArena initialMode={arenaMode} onBack={() => setPage('home')} />
    default:
      return null
  }
}
