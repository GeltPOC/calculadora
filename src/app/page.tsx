'use client'

import { useState, useEffect, useCallback } from 'react'

type Operator = '+' | '-' | '×' | '÷' | null

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [expression, setExpression] = useState('')
  const [justCalculated, setJustCalculated] = useState(false)

  const calculate = useCallback((a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : NaN
      default: return b
    }
  }, [])

  const formatNumber = (num: number): string => {
    if (isNaN(num)) return 'Error'
    if (!isFinite(num)) return 'Error'
    const str = num.toPrecision(12)
    const parsed = parseFloat(str)
    if (Math.abs(parsed) >= 1e12 || (Math.abs(parsed) < 1e-7 && parsed !== 0)) {
      return parsed.toExponential(6)
    }
    return String(parsed)
  }

  const inputDigit = useCallback((digit: string) => {
    if (justCalculated && !waitingForOperand) {
      setDisplay(digit)
      setExpression('')
      setJustCalculated(false)
      return
    }
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
      return
    }
    setDisplay(prev => {
      if (prev === '0' && digit !== '.') return digit
      if (digit === '.' && prev.includes('.')) return prev
      if (prev.length >= 12) return prev
      return prev + digit
    })
    setJustCalculated(false)
  }, [waitingForOperand, justCalculated])

  const inputOperator = useCallback((op: Operator) => {
    const current = parseFloat(display)
    if (prevValue !== null && operator && !waitingForOperand) {
      const result = calculate(prevValue, current, operator)
      const formatted = formatNumber(result)
      setDisplay(formatted)
      setPrevValue(result)
      setExpression(`${formatted} ${op}`)
    } else {
      setPrevValue(current)
      setExpression(`${display} ${op}`)
    }
    setOperator(op)
    setWaitingForOperand(true)
    setJustCalculated(false)
  }, [display, prevValue, operator, waitingForOperand, calculate])

  const handleEquals = useCallback(() => {
    if (prevValue === null || operator === null) return
    const current = parseFloat(display)
    const result = calculate(prevValue, current, operator)
    const formatted = formatNumber(result)
    setExpression(`${prevValue} ${operator} ${display} =`)
    setDisplay(formatted)
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setJustCalculated(true)
  }, [prevValue, operator, display, calculate])

  const handleClear = useCallback(() => {
    setDisplay('0')
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setExpression('')
    setJustCalculated(false)
  }, [])

  const handleToggleSign = useCallback(() => {
    setDisplay(prev => {
      const num = parseFloat(prev)
      return formatNumber(-num)
    })
    setJustCalculated(false)
  }, [])

  const handlePercent = useCallback(() => {
    setDisplay(prev => {
      const num = parseFloat(prev)
      return formatNumber(num / 100)
    })
    setJustCalculated(false)
  }, [])

  const handleBackspace = useCallback(() => {
    if (waitingForOperand || justCalculated) return
    setDisplay(prev => {
      if (prev.length === 1 || (prev.length === 2 && prev.startsWith('-'))) return '0'
      return prev.slice(0, -1)
    })
  }, [waitingForOperand, justCalculated])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key)
      else if (e.key === '.') inputDigit('.')
      else if (e.key === '+') inputOperator('+')
      else if (e.key === '-') inputOperator('-')
      else if (e.key === '*') inputOperator('×')
      else if (e.key === '/') { e.preventDefault(); inputOperator('÷') }
      else if (e.key === 'Enter' || e.key === '=') handleEquals()
      else if (e.key === 'Escape') handleClear()
      else if (e.key === 'Backspace') handleBackspace()
      else if (e.key === '%') handlePercent()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [inputDigit, inputOperator, handleEquals, handleClear, handleBackspace, handlePercent])

  const fontSize = display.length > 9 ? 'text-2xl' : display.length > 6 ? 'text-3xl' : 'text-5xl'

  const btnBase = 'flex items-center justify-center rounded-2xl text-xl font-semibold cursor-pointer select-none transition-all duration-100 active:scale-95 h-16'

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e]">
      <div className="w-80 rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Display */}
        <div className="px-6 pt-8 pb-4 text-right">
          <div className="text-xs text-gray-500 h-5 mb-1 truncate">{expression || '\u00a0'}</div>
          <div className={`${fontSize} font-light text-white tracking-tight transition-all duration-150 truncate`}>
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3 p-4">
          {/* Row 1 */}
          <button onClick={handleClear} className={`${btnBase} col-span-1`} style={{ background: 'rgba(165,165,165,0.3)', color: '#1a1a1a', backgroundColor: '#a5a5a5' }}>
            {prevValue !== null || display !== '0' ? 'C' : 'AC'}
          </button>
          <button onClick={handleToggleSign} className={`${btnBase}`} style={{ background: '#a5a5a5', color: '#1a1a1a' }}>+/-</button>
          <button onClick={handlePercent} className={`${btnBase}`} style={{ background: '#a5a5a5', color: '#1a1a1a' }}>%</button>
          <button onClick={() => inputOperator('÷')} className={`${btnBase}`} style={{ background: operator === '÷' && waitingForOperand ? '#fff' : '#ff9f0a', color: operator === '÷' && waitingForOperand ? '#ff9f0a' : '#fff' }}>÷</button>

          {/* Row 2 */}
          <button onClick={() => inputDigit('7')} className={`${btnBase}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>7</button>
          <button onClick={() => inputDigit('8')} className={`${btnBase}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>8</button>
          <button onClick={() => inputDigit('9')} className={`${btnBase}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>9</button>
          <button onClick={() => inputOperator('×')} className={`${btnBase}`} style={{ background: operator === '×' && waitingForOperand ? '#fff' : '#ff9f0a', color: operator === '×' && waitingForOperand ? '#ff9f0a' : '#fff' }}>×</button>

          {/* Row 3 */}
          <button onClick={() => inputDigit('4')} className={`${btnBase}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>4</button>
          <button onClick={() => inputDigit('5')} className={`${btnBase}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>5</button>
          <button onClick={() => inputDigit('6')} className={`${btnBase}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>6</button>
          <button onClick={() => inputOperator('-')} className={`${btnBase}`} style={{ background: operator === '-' && waitingForOperand ? '#fff' : '#ff9f0a', color: operator === '-' && waitingForOperand ? '#ff9f0a' : '#fff' }}>-</button>

          {/* Row 4 */}
          <button onClick={() => inputDigit('1')} className={`${btnBase}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>1</button>
          <button onClick={() => inputDigit('2')} className={`${btnBase}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>2</button>
          <button onClick={() => inputDigit('3')} className={`${btnBase}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>3</button>
          <button onClick={() => inputOperator('+')} className={`${btnBase}`} style={{ background: operator === '+' && waitingForOperand ? '#fff' : '#ff9f0a', color: operator === '+' && waitingForOperand ? '#ff9f0a' : '#fff' }}>+</button>

          {/* Row 5 */}
          <button onClick={() => inputDigit('0')} className={`${btnBase} col-span-2`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', justifyContent: 'flex-start', paddingLeft: '1.5rem' }}>0</button>
          <button onClick={() => inputDigit('.')} className={`${btnBase}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>.</button>
          <button onClick={handleEquals} className={`${btnBase}`} style={{ background: '#ff9f0a', color: '#fff' }}>=</button>
        </div>

        <div className="pb-4 text-center">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Soporta teclado ⌨️</p>
        </div>
      </div>
    </main>
  )
}
