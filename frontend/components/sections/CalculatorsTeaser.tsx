import Link from 'next/link'
import { Calculator, TrendingUp, FileText, ArrowRight } from 'lucide-react'

const calculators = [
  {
    icon: Calculator,
    title: 'EMI Calculator',
    description: 'Calculate your monthly EMI, total payable, and see year-by-year breakdown instantly.',
    href: '/calculator/emi',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
  },
  {
    icon: TrendingUp,
    title: 'ROI Calculator',
    description: 'Estimate your investment returns including rental yield and property appreciation.',
    href: '/calculator/roi',
    color: 'bg-gold/8 border-gold/20',
    iconBg: 'bg-gold/15',
    iconColor: 'text-gold-600',
  },
  {
    icon: FileText,
    title: 'Stamp Duty Calculator',
    description: 'State-wise stamp duty and registration charges — calculate your total purchase cost.',
    href: '/calculator/stamp-duty',
    color: 'bg-emerald-50 border-emerald-100',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
  },
]

export default function CalculatorsTeaser() {
  return (
    <section className="section bg-warm-white">
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-label mb-2">Smart Decision Making</p>
            <h2 className="section-title">Financial Planning Tools</h2>
          </div>
          <Link href="/calculator/emi" className="btn btn-ghost text-navy flex items-center gap-1 shrink-0">
            All Calculators <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {calculators.map((calc) => (
            <Link key={calc.href} href={calc.href}>
              <div className={`rounded-xl3 border p-6 h-full hover:-translate-y-1 hover:shadow-luxury-md transition-all duration-300 ${calc.color}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${calc.iconBg}`}>
                  <calc.icon className={`w-6 h-6 ${calc.iconColor}`} />
                </div>
                <h3 className="font-syne font-semibold text-base text-navy mb-2">{calc.title}</h3>
                <p className="text-sm text-dark-grey leading-relaxed mb-4">{calc.description}</p>
                <div className="flex items-center gap-1 text-sm font-syne font-semibold text-navy">
                  Use Calculator <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
