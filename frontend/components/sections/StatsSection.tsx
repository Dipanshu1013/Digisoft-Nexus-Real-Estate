'use client'
import { useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { Building2, Users, TrendingUp, Award } from 'lucide-react'

const stats = [
  { icon: Building2, value: 500,  suffix: '+',    label: 'Premium Projects',      sublabel: 'Across Gurugram & NCR' },
  { icon: Users,     value: 1200, suffix: '+',    label: 'Happy Families',        sublabel: 'Successfully Settled' },
  { icon: TrendingUp,value: 50,   suffix: 'Cr+',  label: 'Property Value Closed', sublabel: 'In Last 12 Months', prefix: '₹' },
  { icon: Award,     value: 10,   suffix: '+',    label: 'Years of Excellence',   sublabel: 'Trusted Advisor' },
]

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="bg-cream py-14 border-y border-navy/6" ref={ref}>
      <div className="container-site">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-navy/5 border border-navy/8 flex items-center justify-center mb-4 group-hover:bg-navy/10 transition-colors">
                <stat.icon className="w-5 h-5 text-navy" />
              </div>
              <div className="font-display text-3xl md:text-4xl font-semibold text-navy mb-1">
                {stat.prefix || ''}
                {inView ? (
                  <CountUp end={stat.value} duration={2} separator="," />
                ) : '0'}
                {stat.suffix}
              </div>
              <div className="font-syne text-sm font-semibold text-navy mb-0.5">{stat.label}</div>
              <div className="text-xs text-mid-grey">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
