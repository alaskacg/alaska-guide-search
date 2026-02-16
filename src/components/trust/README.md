# AI Verification Trust Components

Production-ready React components for displaying AI-powered verification and trust information in the Alaska Guide Search platform.

## Components

### 1. AIVerificationExplainer

A comprehensive explainer section that showcases why Alaska Guide Search only requires a 25% deposit compared to industry standard 50-100%.

**Features:**
- Side-by-side comparison with traditional platforms
- 3-step AI verification process visualization
- Trust statistics with animated counters
- FAQ accordion section
- Beautiful animations using Framer Motion
- Fully responsive design

**Usage:**
```tsx
import { AIVerificationExplainer } from '@/components/trust';

function TrustPage() {
  return <AIVerificationExplainer />;
}
```

---

### 2. VerificationBadge

A reusable badge component for displaying verification status with tooltips and optional detailed modals.

**Props:**
- `status`: `'verified' | 'pending' | 'rejected' | 'not_started'`
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `showDetails`: `boolean` - Enable click-to-view detailed modal
- `details`: `VerificationDetails` - Additional verification information
- `className`: `string` - Additional CSS classes

**Features:**
- Color-coded status indicators
- Icons for different verification states
- Tooltip with status description
- Optional detailed breakdown modal
- Smooth animations

**Usage:**
```tsx
import { VerificationBadge } from '@/components/trust';

// Simple badge
<VerificationBadge status="verified" size="md" />

// With details modal
<VerificationBadge 
  status="verified" 
  size="lg"
  showDetails
  details={{
    status: 'verified',
    verifiedAt: '2024-02-15T10:00:00Z',
    verifiedBy: 'AI System',
    notes: 'All credentials verified successfully'
  }}
/>
```

---

### 3. GuideVerificationCard

A comprehensive card displaying a guide's verification information including insurance, license, background check, and performance metrics.

**Props:**
- `data`: `GuideVerificationData` - Guide's verification and performance data
- `className`: `string` - Additional CSS classes
- `compact`: `boolean` - Show compact version (default: `false`)

**Features:**
- Insurance status & expiry tracking
- License verification display
- Background check status
- Years of experience
- Total bookings completed
- Response time metrics
- Trust score (0-100) with color-coded rating
- Expiry warnings for credentials
- Performance metrics with icons
- Full and compact display modes

**Usage:**
```tsx
import { GuideVerificationCard } from '@/components/trust';
import { GuideVerificationData } from '@/types/verification';

const guideData: GuideVerificationData = {
  insurance: {
    status: 'verified',
    provider: 'Alaska Outdoor Insurance Co.',
    policyNumber: 'AK-2024-123456',
    expiryDate: '2025-12-31T23:59:59Z',
    coverageAmount: 2000000,
  },
  license: {
    status: 'verified',
    licenseNumber: 'AK-GUIDE-2024-789',
    issuedBy: 'Alaska Department of Fish & Game',
    expiryDate: '2025-06-30T23:59:59Z',
    licenseType: 'Master Guide',
  },
  backgroundCheck: {
    status: 'verified',
    completedAt: '2024-01-15T10:00:00Z',
    provider: 'National Background Check Inc.',
    validUntil: '2025-01-15T23:59:59Z',
  },
  yearsOfExperience: 15,
  totalBookings: 487,
  averageResponseTime: 45,
  verificationScore: 98,
};

// Full card
<GuideVerificationCard data={guideData} />

// Compact version
<GuideVerificationCard data={guideData} compact />
```

## Type Definitions

All TypeScript types are defined in `/src/types/verification.ts`:

- `VerificationStatus`: Status of verification
- `VerificationDetails`: Detailed verification information
- `InsuranceInfo`: Insurance verification data
- `LicenseInfo`: License verification data
- `BackgroundCheckInfo`: Background check data
- `GuideVerificationData`: Complete guide verification data

## Dependencies

All required dependencies are already included in the project:

- `framer-motion` - Animations
- `lucide-react` - Icons
- `date-fns` - Date formatting
- `@radix-ui/*` via shadcn/ui - UI primitives
- `tailwindcss` - Styling

## Styling

Components use:
- Tailwind CSS utility classes
- shadcn/ui design system
- Framer Motion for animations
- Custom color-coded status indicators
- Responsive breakpoints

## Examples

See `/src/components/trust/TrustComponentsExample.tsx` for complete usage examples including:

1. Standalone explainer page
2. Verification badges in different contexts
3. Guide profile integration
4. Full page integration example
5. Handling pending/expiring credentials

## Integration Points

### Guide Profile Page
```tsx
import { GuideVerificationCard, VerificationBadge } from '@/components/trust';

function GuideProfile() {
  return (
    <>
      {/* Header with badge */}
      <VerificationBadge status="verified" size="lg" showDetails />
      
      {/* Sidebar with verification details */}
      <GuideVerificationCard data={guideData} />
    </>
  );
}
```

### Trust/Safety Page
```tsx
import { AIVerificationExplainer } from '@/components/trust';

function TrustPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <AIVerificationExplainer />
    </div>
  );
}
```

### Booking Flow
```tsx
import { AIVerificationExplainer } from '@/components/trust';

function BookingPage() {
  return (
    <>
      {/* Your booking form */}
      
      {/* Trust explainer to reduce booking friction */}
      <div className="mt-12">
        <AIVerificationExplainer />
      </div>
    </>
  );
}
```

## Customization

All components accept a `className` prop for additional styling:

```tsx
<GuideVerificationCard 
  data={guideData} 
  className="max-w-2xl mx-auto shadow-xl"
/>
```

## Accessibility

- All interactive elements are keyboard accessible
- ARIA labels on icons and buttons
- Proper heading hierarchy
- Color contrast meets WCAG AA standards
- Focus indicators on all focusable elements

## Performance

- Components use React best practices
- Framer Motion animations are GPU-accelerated
- Lazy rendering for modal content
- Optimized re-render logic

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Created:** February 2024  
**Status:** Production Ready ✅
