'use client'

import { type ReactNode, useState } from 'react'

export function PasswordGate({ children, expected }: { children: ReactNode; expected: string }) {
  const [value, setValue] = useState('')
  const [locked, setLocked] = useState(true)

  if (!expected || !locked) return <>{children}</>

  return (
    <form
      className="password-gate"
      onSubmit={(event) => {
        event.preventDefault()
        if (value === expected) setLocked(false)
      }}
    >
      <label>
        <span>Password</span>
        <input value={value} onChange={(event) => setValue(event.target.value)} type="password" />
      </label>
      <button type="submit">Enter</button>
    </form>
  )
}
