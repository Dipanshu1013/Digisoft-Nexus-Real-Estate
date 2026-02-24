'use client'
import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate?: Date
  initialHours?: number
  variant?: 'compact' | 'full'
  label?: string
}

export default function CountdownTimer({
  targetDate,
  initialHours = 47,
  variant = 'full',
  label = 'Offer expires in',
}: CountdownTimerProps) {
  const getTimeLeft = () => {
    const target = targetDate || new Date(Date.now() + initialHours * 60 * 60 * 1000)
    const diff = Math.max(0, target.getTime() - Date.now())
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      secs: Math.floor((diff % (1000 * 60)) / 1000),
    }
  }

  const [time, setTime] = useState(getTimeLeft)

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(t)
  }, [])

  if (variant === 'compact') {
    return (
      <span className="font-syne font-bold tabular-nums">
        {String(time.hours).padStart(2, '0')}:{String(time.mins).padStart(2, '0')}:{String(time.secs).padStart(2, '0')}
      </span>
    )
  }

  const units = [
    ...(time.days > 0 ? [{ value: time.days, label: 'Days' }] : []),
    { value: time.hours, label: 'Hours' },
    { value: time.mins, label: 'Mins' },
    { value: time.secs, label: 'Secs' },
  ]

  return (
    <div>
      {label && (
        <p className="text-xs text-white/60 font-syne uppercase tracking-wider mb-2">{label}</p>
      )}
      <div className="flex items-center gap-2">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-2">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg w-12 h-12 flex items-center justify-center">
                <span className="font-syne font-bold text-lg text-white tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </span>
              </div>
              <p className="text-[9px] font-syne text-white/50 mt-1 uppercase tracking-wider">
                {unit.label}
              </p>
            </div>
            {i < units.length - 1 && (
              <span className="text-white/40 text-lg font-bold mb-3">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
