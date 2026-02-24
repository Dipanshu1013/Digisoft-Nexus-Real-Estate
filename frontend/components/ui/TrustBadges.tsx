import { Shield, Award, Star, BadgeCheck, TrendingUp } from 'lucide-react'

interface TrustBadgesProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md'
}

export default function TrustBadges({ variant = 'light', size = 'md' }: TrustBadgesProps) {
  const isDark = variant === 'dark'
  const isSmall = size === 'sm'

  const badges = [
    { icon: Shield, label: 'RERA Verified' },
    { icon: BadgeCheck, label: 'Govt. Approved' },
    { icon: Award, label: 'Best Deals' },
    { icon: Star, label: '4.8★ Rated' },
    { icon: TrendingUp, label: 'Trusted Since 2014' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      {badges.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className={`flex items-center gap-1.5 ${
            isSmall ? 'text-[10px]' : 'text-xs'
          } font-syne font-medium ${
            isDark ? 'text-white/60' : 'text-dark-grey'
          }`}
        >
          <Icon
            className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${
              isDark ? 'text-gold' : 'text-gold'
            }`}
          />
          {label}
        </div>
      ))}
    </div>
  )
}
