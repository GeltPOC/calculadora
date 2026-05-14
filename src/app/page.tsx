'use client'

import { useState, useCallback } from 'react'

type CalcState = {
  display: string
  expression: string
  waitingForOperand: boolean
  operator: string | null
  prevValue: number | null
  justCalculated: boolean
}

const initialState: CalcState = {
  display: '0',
  expression: '',
  waitingForOperand: false,
  operator: null,
  prevValue: null,
  justCalculated: false
}

export default function CalculadoraPage() {
  const [dark, setDark] = useState(false)
  const [calc, setCalc] = useState<CalcState>(initialState)

  const handleDigit = useCallback((digit: string) => {
    setCalc(prev => {
      if (prev.waitingForOperand || prev.justCalculated) {
        return {
          ...prev,
          display: digit,
          waitingForOperand: false,
          justCalculated: false
        }
      }
      const newDisplay = prev.display === '0' ? digit : prev.display + digit
      return { ...prev, display: newDisplay }
    })
  }, [])

  const handleDecimal = useCallback(() => {
    setCalc(prev => {
      if (prev.waitingForOperand || prev.justCalculated) {
        return { ...prev, display: '0.', waitingForOperand: false, justCalculated: false }
      }
      if (prev.display.includes('.')) return prev
      return { ...prev, display: prev.display + '.' }
    })
  }, [])

  const handleOperator = useCallback((op: string) => {
    setCalc(prev => {
      const current = parseFloat(prev.display)
      if (prev.prevValue !== null && !prev.waitingForOperand && !prev.justCalculated) {
        const result = compute(prev.prevValue, current, prev.operator!)
        const resultStr = formatResult(result)
        return {
          display: resultStr,
          expression: `${resultStr} ${op}`,
          operator: op,
          prevValue: result,
          waitingForOperand: true,
          justCalculated: false
        }
      }
      return {
        ...prev,
        expression: `${prev.display} ${op}`,
        operator: op,
        prevValue: current,
        waitingForOperand: true,
        justCalculated: false
      }
    })
  }, [])

  const handleEquals = useCallback(() => {
    setCalc(prev => {
      if (prev.operator === null || prev.prevValue === null) return prev
      const current = parseFloat(prev.display)
      const result = compute(prev.prevValue, current, prev.operator)
      const resultStr = formatResult(result)
      return {
        display: resultStr,
        expression: `${prev.expression} ${prev.display} =`,
        operator: null,
        prevValue: null,
        waitingForOperand: false,
        justCalculated: true
      }
    })
  }, [])

  const handleClear = useCallback(() => {
    setCalc(initialState)
  }, [])

  const handlePlusMinus = useCallback(() => {
    setCalc(prev => {
      const val = parseFloat(prev.display) * -1
      return { ...prev, display: formatResult(val) }
    })
  }, [])

  const handlePercent = useCallback(() => {
    setCalc(prev => {
      const val = parseFloat(prev.display) / 100
      return { ...prev, display: formatResult(val) }
    })
  }, [])

  const handleBackspace = useCallback(() => {
    setCalc(prev => {
      if (prev.justCalculated) return initialState
      if (prev.display.length <= 1) return { ...prev, display: '0' }
      return { ...prev, display: prev.display.slice(0, -1) }
    })
  }, [])

  // Theme classes
  const bg = dark ? 'bg-gray-950' : 'bg-gray-100'
  const calcBg = dark ? 'bg-gray-900' : 'bg-white'
  const displayBg = dark ? 'bg-gray-800' : 'bg-gray-50'
  const displayText = dark ? 'text-white' : 'text-gray-900'
  const exprText = dark ? 'text-gray-400' : 'text-gray-500'
  const shadowClass = dark ? 'shadow-2xl shadow-black/60' : 'shadow-2xl shadow-gray-300'

  // Button variant classes
  const btnOperator = dark
    ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white'
    : 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-white'
  const btnFunction = dark
    ? 'bg-gray-600 hover:bg-gray-500 active:bg-gray-700 text-white'
    : 'bg-gray-300 hover:bg-gray-200 active:bg-gray-400 text-gray-900'
  const btnNumber = dark
    ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white'
    : 'bg-gray-200 hover:bg-gray-100 active:bg-gray-300 text-gray-900'
  const btnEquals = dark
    ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white'
    : 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-white'

  const btnBase = 'rounded-2xl text-xl font-semibold transition-all duration-150 select-none cursor-pointer flex items-center justify-center h-16 w-full active:scale-95'

  const toggleBg = dark
    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${bg}`}>
      <div className={`w-80 rounded-3xl p-5 ${calcBg} ${shadowClass} transition-colors duration-300`}>
        {/* Header with toggle */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-semibold tracking-widest uppercase ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Calculadora
          </span>
          <button
            onClick={() => setDark(d => !d)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${toggleBg}`}
            aria-label="Cambiar tema"
          >
            {dark ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
                <span>Día</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                </svg>
                <span>Noche</span>
              </>
            )}
          </button>
        </div>

        {/* Display */}
        <div className={`rounded-2xl p-4 mb-4 ${displayBg} transition-colors duration-300`}>
          <div className={`text-right text-xs h-5 mb-1 truncate ${exprText}`}>
            {calc.expression || '\u00A0'}
          </div>
          <div className={`text-right text-4xl font-light truncate ${displayText} transition-colors duration-300`}>
            {calc.display.length > 12 ? parseFloat(calc.display).toExponential(4) : calc.display}
          </div>
        </div>

        {/* Buttons grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <button onClick={handleClear} className={`${btnBase} ${btnFunction}`}>AC</button>
          <button onClick={handlePlusMinus} className={`${btnBase} ${btnFunction}`}>+/-</button>
          <button onClick={handlePercent} className={`${btnBase} ${btnFunction}`}>%</button>
          <button onClick={() => handleOperator('÷')} className={`${btnBase} ${btnOperator}`}>÷</button>

          {/* Row 2 */}
          <button onClick={() => handleDigit('7')} className={`${btnBase} ${btnNumber}`}>7</button>
          <button onClick={() => handleDigit('8')} className={`${btnBase} ${btnNumber}`}>8</button>
          <button onClick={() => handleDigit('9')} className={`${btnBase} ${btnNumber}`}>9</button>
          <button onClick={() => handleOperator('×')} className={`${btnBase} ${btnOperator}`}>×</button>

          {/* Row 3 */}
          <button onClick={() => handleDigit('4')} className={`${btnBase} ${btnNumber}`}>4</button>
          <button onClick={() => handleDigit('5')} className={`${btnBase} ${btnNumber}`}>5</button>
          <button onClick={() => handleDigit('6')} className={`${btnBase} ${btnNumber}`}>6</button>
          <button onClick={() => handleOperator('−')} className={`${btnBase} ${btnOperator}`}>−</button>

          {/* Row 4 */}
          <button onClick={() => handleDigit('1')} className={`${btnBase} ${btnNumber}`}>1</button>
          <button onClick={() => handleDigit('2')} className={`${btnBase} ${btnNumber}`}>2</button>
          <button onClick={() => handleDigit('3')} className={`${btnBase} ${btnNumber}`}>3</button>
          <button onClick={() => handleOperator('+')} className={`${btnBase} ${btnOperator}`}>+</button>

          {/* Row 5 */}
          <button
            onClick={() => handleDigit('0')}
            className={`${btnBase} ${btnNumber} col-span-2 !justify-start pl-6`}
          >0</button>
          <button onClick={handleDecimal} className={`${btnBase} ${btnNumber}`}>.</button>
          <button onClick={handleEquals} className={`${btnBase} ${btnEquals}`}>=</button>

          {/* Row 6 - Backspace */}
          <button onClick={handleBackspace} className={`${btnBase} ${btnFunction} col-span-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function compute(a: number, b: number, op: string): number {
  switch (op) {
    case '+': return a + b
    case '−': return a - b
    case '×': return a * b
    case '÷': return b !== 0 ? a / b : 0
    default: return b
  }
}

function formatResult(val: number): string {
  if (!isFinite(val)) return 'Error'
  const str = String(val)
  if (str.length > 12) {
    return parseFloat(val.toPrecision(10)).toString()
  }
  return str
}
