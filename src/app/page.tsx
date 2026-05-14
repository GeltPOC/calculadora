'use client'

import { useState, useCallback, useEffect } from 'react'

type AngleMode = 'deg' | 'rad'

function toRad(x: number, mode: AngleMode) {
  return mode === 'deg' ? (x * Math.PI) / 180 : x
}

function factorial(n: number): number {
  if (n < 0) return NaN
  if (!Number.isInteger(n)) return NaN
  if (n > 170) return Infinity
  if (n === 0 || n === 1) return 1
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

function formatResult(n: number): string {
  if (isNaN(n)) return 'Error'
  if (!isFinite(n)) return n > 0 ? 'Infinito' : '-Infinito'
  if (Math.abs(n) < 1e-10 && n !== 0) return n.toExponential(6)
  if (Math.abs(n) >= 1e14) return n.toExponential(6)
  const s = parseFloat(n.toPrecision(12)).toString()
  return s
}

export default function Calculadora() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [operator, setOperator] = useState<string | null>(null)
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [memory, setMemory] = useState(0)
  const [angleMode, setAngleMode] = useState<AngleMode>('deg')
  const [isShift, setIsShift] = useState(false)
  const [justCalculated, setJustCalculated] = useState(false)

  const currentValue = parseFloat(display)

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand || justCalculated) {
      setDisplay(digit)
      setWaitingForOperand(false)
      setJustCalculated(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }, [display, waitingForOperand, justCalculated])

  const inputDecimal = useCallback(() => {
    if (waitingForOperand || justCalculated) {
      setDisplay('0.')
      setWaitingForOperand(false)
      setJustCalculated(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand, justCalculated])

  const clear = useCallback(() => {
    setDisplay('0')
    setExpression('')
    setOperator(null)
    setPrevValue(null)
    setWaitingForOperand(false)
    setJustCalculated(false)
  }, [])

  const clearEntry = useCallback(() => {
    setDisplay('0')
    setWaitingForOperand(false)
  }, [])

  const backspace = useCallback(() => {
    if (waitingForOperand || justCalculated) return
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0')
    } else {
      setDisplay(display.slice(0, -1))
    }
  }, [display, waitingForOperand, justCalculated])

  const toggleSign = useCallback(() => {
    const val = parseFloat(display)
    setDisplay(formatResult(-val))
  }, [display])

  const percent = useCallback(() => {
    const val = parseFloat(display)
    if (prevValue !== null && operator) {
      setDisplay(formatResult((prevValue * val) / 100))
    } else {
      setDisplay(formatResult(val / 100))
    }
    setJustCalculated(true)
  }, [display, prevValue, operator])

  const applyBinaryOp = useCallback((op: string) => {
    const val = parseFloat(display)
    if (prevValue !== null && operator && !waitingForOperand) {
      let result = 0
      switch (operator) {
        case '+': result = prevValue + val; break
        case '-': result = prevValue - val; break
        case '×': result = prevValue * val; break
        case '÷': result = val === 0 ? NaN : prevValue / val; break
        case 'xⁿ': result = Math.pow(prevValue, val); break
        case 'ⁿ√x': result = Math.pow(val, 1 / prevValue!); break
        default: result = val
      }
      const res = formatResult(result)
      setPrevValue(result)
      setDisplay(res)
      setExpression(`${res} ${op}`)
    } else {
      setPrevValue(val)
      setExpression(`${display} ${op}`)
    }
    setOperator(op)
    setWaitingForOperand(true)
    setJustCalculated(false)
  }, [display, prevValue, operator, waitingForOperand])

  const calculate = useCallback(() => {
    const val = parseFloat(display)
    if (prevValue === null || operator === null) return
    let result = 0
    switch (operator) {
      case '+': result = prevValue + val; break
      case '-': result = prevValue - val; break
      case '×': result = prevValue * val; break
      case '÷': result = val === 0 ? NaN : prevValue / val; break
      case 'xⁿ': result = Math.pow(prevValue, val); break
      case 'ⁿ√x': result = Math.pow(val, 1 / prevValue); break
      default: result = val
    }
    const res = formatResult(result)
    setExpression(`${prevValue} ${operator} ${val} =`)
    setDisplay(res)
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setJustCalculated(true)
  }, [display, prevValue, operator])

  const applyUnary = useCallback((fn: string) => {
    const val = parseFloat(display)
    let result: number
    switch (fn) {
      case 'sin':  result = Math.sin(toRad(val, angleMode)); break
      case 'cos':  result = Math.cos(toRad(val, angleMode)); break
      case 'tan':  result = Math.tan(toRad(val, angleMode)); break
      case 'asin': result = angleMode === 'deg' ? Math.asin(val) * 180 / Math.PI : Math.asin(val); break
      case 'acos': result = angleMode === 'deg' ? Math.acos(val) * 180 / Math.PI : Math.acos(val); break
      case 'atan': result = angleMode === 'deg' ? Math.atan(val) * 180 / Math.PI : Math.atan(val); break
      case 'log':  result = Math.log10(val); break
      case 'ln':   result = Math.log(val); break
      case 'sqrt': result = Math.sqrt(val); break
      case 'cbrt': result = Math.cbrt(val); break
      case 'x2':   result = val * val; break
      case 'x3':   result = val * val * val; break
      case '10x':  result = Math.pow(10, val); break
      case 'ex':   result = Math.exp(val); break
      case 'inv':  result = val === 0 ? NaN : 1 / val; break
      case 'abs':  result = Math.abs(val); break
      case 'fact': result = factorial(val); break
      case 'neg':  result = -val; break
      default: result = val
    }
    const res = formatResult(result)
    setExpression(`${fn}(${display})`)
    setDisplay(res)
    setJustCalculated(true)
    setWaitingForOperand(false)
  }, [display, angleMode])

  const inputConstant = useCallback((c: string) => {
    const val = c === 'π' ? Math.PI : Math.E
    setDisplay(formatResult(val))
    setWaitingForOperand(false)
    setJustCalculated(true)
  }, [])

  // Memory
  const memClear = () => setMemory(0)
  const memRecall = () => { setDisplay(formatResult(memory)); setJustCalculated(true) }
  const memAdd = () => setMemory(memory + currentValue)
  const memSub = () => setMemory(memory - currentValue)
  const memStore = () => setMemory(currentValue)

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key)
      else if (e.key === '.') inputDecimal()
      else if (e.key === '+') applyBinaryOp('+')
      else if (e.key === '-') applyBinaryOp('-')
      else if (e.key === '*') applyBinaryOp('×')
      else if (e.key === '/') { e.preventDefault(); applyBinaryOp('÷') }
      else if (e.key === 'Enter' || e.key === '=') calculate()
      else if (e.key === 'Backspace') backspace()
      else if (e.key === 'Escape') clear()
      else if (e.key === '%') percent()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [inputDigit, inputDecimal, applyBinaryOp, calculate, backspace, clear, percent])

  const Btn = ({ label, onClick, cls, wide }: { label: string; onClick: () => void; cls?: string; wide?: boolean }) => (
    <button
      onClick={onClick}
      className={`${cls ?? 'btn-num'} ${wide ? 'col-span-2' : ''} w-full`}
    >
      {label}
    </button>
  )

  return (
    <div className="w-full max-w-md" style={{ background: '#16213e', borderRadius: '1.5rem', padding: '1.25rem', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold" style={{ color: '#e94560' }}>CALC<span style={{ color: '#7eb8f7' }}>SCI</span></span>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setAngleMode('deg')}
            className={`btn-mode px-2 py-1 text-xs ${angleMode === 'deg' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >DEG</button>
          <button
            onClick={() => setAngleMode('rad')}
            className={`btn-mode px-2 py-1 text-xs ${angleMode === 'rad' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >RAD</button>
          <button
            onClick={() => setIsShift(!isShift)}
            className={`btn-mode px-2 py-1 text-xs ml-1 ${isShift ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}
          >2ND</button>
        </div>
      </div>

      {/* Display */}
      <div style={{ background: '#0d1b35', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '0.75rem', border: '1px solid #1a3060' }}>
        <div className="text-right text-xs min-h-4" style={{ color: '#7eb8f7', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {expression || '\u00a0'}
        </div>
        <div className="text-right font-bold leading-none" style={{ color: '#eaeaea', fontSize: display.length > 14 ? '1.1rem' : display.length > 10 ? '1.5rem' : '2rem', wordBreak: 'break-all' }}>
          {display}
        </div>
        {memory !== 0 && (
          <div className="text-right text-xs mt-1" style={{ color: '#6bcf7f' }}>M: {formatResult(memory)}</div>
        )}
      </div>

      {/* Memory row */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        <Btn label="MC" onClick={memClear} cls="btn-mem" />
        <Btn label="MR" onClick={memRecall} cls="btn-mem" />
        <Btn label="MS" onClick={memStore} cls="btn-mem" />
        <Btn label="M+" onClick={memAdd} cls="btn-mem" />
        <Btn label="M-" onClick={memSub} cls="btn-mem" />
      </div>

      {/* Scientific row 1 */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        <Btn label={isShift ? 'asin' : 'sin'} onClick={() => applyUnary(isShift ? 'asin' : 'sin')} cls="btn-sci" />
        <Btn label={isShift ? 'acos' : 'cos'} onClick={() => applyUnary(isShift ? 'acos' : 'cos')} cls="btn-sci" />
        <Btn label={isShift ? 'atan' : 'tan'} onClick={() => applyUnary(isShift ? 'atan' : 'tan')} cls="btn-sci" />
        <Btn label={isShift ? 'ln' : 'log'} onClick={() => applyUnary(isShift ? 'ln' : 'log')} cls="btn-sci" />
        <Btn label={isShift ? 'eˣ' : '10ˣ'} onClick={() => applyUnary(isShift ? 'ex' : '10x')} cls="btn-sci" />
      </div>

      {/* Scientific row 2 */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        <Btn label="x²" onClick={() => applyUnary('x2')} cls="btn-sci" />
        <Btn label="x³" onClick={() => applyUnary('x3')} cls="btn-sci" />
        <Btn label="xⁿ" onClick={() => applyBinaryOp('xⁿ')} cls="btn-sci" />
        <Btn label="√" onClick={() => applyUnary('sqrt')} cls="btn-sci" />
        <Btn label="∛" onClick={() => applyUnary('cbrt')} cls="btn-sci" />
      </div>

      {/* Scientific row 3 */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        <Btn label="|x|" onClick={() => applyUnary('abs')} cls="btn-sci" />
        <Btn label="n!" onClick={() => applyUnary('fact')} cls="btn-sci" />
        <Btn label="1/x" onClick={() => applyUnary('inv')} cls="btn-sci" />
        <Btn label="π" onClick={() => inputConstant('π')} cls="btn-sci" />
        <Btn label="e" onClick={() => inputConstant('e')} cls="btn-sci" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-4 gap-1 mt-1">
        <Btn label="AC" onClick={clear} cls="btn-clear" />
        <Btn label="CE" onClick={clearEntry} cls="btn-clear" />
        <Btn label="⌫" onClick={backspace} cls="btn-clear" />
        <Btn label="÷" onClick={() => applyBinaryOp('÷')} cls="btn-op" />

        <Btn label="7" onClick={() => inputDigit('7')} />
        <Btn label="8" onClick={() => inputDigit('8')} />
        <Btn label="9" onClick={() => inputDigit('9')} />
        <Btn label="×" onClick={() => applyBinaryOp('×')} cls="btn-op" />

        <Btn label="4" onClick={() => inputDigit('4')} />
        <Btn label="5" onClick={() => inputDigit('5')} />
        <Btn label="6" onClick={() => inputDigit('6')} />
        <Btn label="−" onClick={() => applyBinaryOp('-')} cls="btn-op" />

        <Btn label="1" onClick={() => inputDigit('1')} />
        <Btn label="2" onClick={() => inputDigit('2')} />
        <Btn label="3" onClick={() => inputDigit('3')} />
        <Btn label="+" onClick={() => applyBinaryOp('+')} cls="btn-op" />

        <Btn label="+/−" onClick={toggleSign} />
        <Btn label="0" onClick={() => inputDigit('0')} />
        <Btn label="." onClick={inputDecimal} />
        <Btn label="=" onClick={calculate} cls="btn-eq" />
      </div>

      <div className="text-center mt-3 text-xs" style={{ color: '#444e6a' }}>Presiona 2ND para funciones inversas</div>
    </div>
  )
}
