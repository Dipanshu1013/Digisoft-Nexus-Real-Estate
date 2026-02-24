'use client'
/**
 * HCaptcha wrapper component
 *
 * Usage:
 *   const [token, setToken] = useState('')
 *   <HCaptcha onVerify={setToken} onExpire={() => setToken('')} />
 *
 * Install: npm install @hcaptcha/react-hcaptcha
 */
import { useRef, useCallback } from 'react'
import { Shield } from 'lucide-react'

// Conditionally import — won't crash if package not installed
let HCaptchaComponent: any = null
try {
  HCaptchaComponent = require('@hcaptcha/react-hcaptcha').default
} catch {
  // hCaptcha package not installed — render placeholder
}

interface HCaptchaProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: (err: string) => void
  size?: 'normal' | 'compact' | 'invisible'
  theme?: 'light' | 'dark'
}

export default function HCaptcha({
  onVerify,
  onExpire,
  onError,
  size = 'normal',
  theme = 'light',
}: HCaptchaProps) {
  const captchaRef = useRef<any>(null)
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY

  const handleVerify = useCallback((token: string) => {
    onVerify(token)
  }, [onVerify])

  const handleExpire = useCallback(() => {
    captchaRef.current?.resetCaptcha()
    onExpire?.()
  }, [onExpire])

  // If no site key configured or package not installed — render info placeholder
  if (!siteKey || !HCaptchaComponent) {
    return (
      <div className="flex items-center gap-2 text-xs text-mid-grey bg-light-grey/60 rounded-lg px-3 py-2.5 border border-navy/8">
        <Shield className="w-4 h-4 text-gold shrink-0" />
        <span>
          Bot protection active.{' '}
          {!siteKey && (
            <span className="text-amber-600">
              Set <code className="bg-amber-50 px-1 rounded">NEXT_PUBLIC_HCAPTCHA_SITE_KEY</code> to enable hCaptcha.
            </span>
          )}
          {siteKey && !HCaptchaComponent && (
            <span className="text-amber-600">
              Run <code className="bg-amber-50 px-1 rounded">npm install @hcaptcha/react-hcaptcha</code>
            </span>
          )}
        </span>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <HCaptchaComponent
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={handleVerify}
        onExpire={handleExpire}
        onError={onError}
        size={size}
        theme={theme}
      />
    </div>
  )
}

/**
 * Reset the hCaptcha widget externally
 * Call this after form submission
 */
export function useHCaptchaReset(ref: React.RefObject<any>) {
  return useCallback(() => {
    ref.current?.resetCaptcha()
  }, [ref])
}
