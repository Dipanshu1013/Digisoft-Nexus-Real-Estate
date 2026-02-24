import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface ProgressBarProps {
  stages: { num: number; label: string }[]
  currentStage: number
  className?: string
}

export default function ProgressBar({ stages, currentStage, className = '' }: ProgressBarProps) {
  const progressPct = ((currentStage - 1) / (stages.length - 1)) * 100

  return (
    <div className={`w-full ${className}`}>
      {/* Stage labels */}
      <div className="flex justify-between mb-2">
        {stages.map((s) => (
          <span
            key={s.num}
            className={`text-[10px] font-syne font-semibold transition-colors ${
              s.num <= currentStage ? 'text-gold' : 'text-mid-grey'
            }`}
          >
            {s.num === currentStage ? s.label : s.num < currentStage ? '✓' : s.num}
          </span>
        ))}
      </div>

      {/* Track */}
      <div className="relative h-1.5 bg-navy/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-1.5">
        {stages.map((s) => (
          <div
            key={s.num}
            className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
              s.num < currentStage
                ? 'bg-gold'
                : s.num === currentStage
                ? 'bg-gold ring-2 ring-gold/30 ring-offset-1'
                : 'bg-navy/15'
            }`}
          >
            {s.num < currentStage && (
              <svg className="w-2 h-2 text-navy" fill="currentColor" viewBox="0 0 12 12">
                <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
