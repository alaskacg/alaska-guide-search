import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIVerificationExplainer } from './AIVerificationExplainer';
import { VerificationBadge } from './VerificationBadge';
import { GuideVerificationCard } from './GuideVerificationCard';
import { GuideVerificationData } from '@/types/verification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Trust Components Demo
 * 
 * A demo page showcasing all three trust components in action.
 * Use this as a reference or add it to your routes for testing.
 */

// Sample guide data
const sampleVerifiedGuide: GuideVerificationData = {
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

const samplePendingGuide: GuideVerificationData = {
  insurance: {
    status: 'pending',
    provider: 'Alaska Outdoor Insurance Co.',
  },
  license: {
    status: 'verified',
    licenseNumber: 'AK-GUIDE-2024-999',
    issuedBy: 'Alaska Department of Fish & Game',
    expiryDate: '2025-03-15T23:59:59Z',
    licenseType: 'Assistant Guide',
  },
  backgroundCheck: {
    status: 'verified',
    completedAt: '2024-02-01T10:00:00Z',
    provider: 'National Background Check Inc.',
    validUntil: '2025-02-01T23:59:59Z',
  },
  yearsOfExperience: 3,
  totalBookings: 42,
  averageResponseTime: 120,
  verificationScore: 72,
};

export function TrustComponentsDemo() {
  const [activeTab, setActiveTab] = useState('explainer');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Trust Components Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive showcase of all AI verification trust components
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="explainer">Explainer</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="cards">Verification Cards</TabsTrigger>
          </TabsList>

          {/* AI Verification Explainer */}
          <TabsContent value="explainer" className="space-y-8">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>AIVerificationExplainer Component</CardTitle>
                <CardDescription>
                  Complete explainer section for "Why Only 25% Deposit?"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  This component includes comparison charts, 3-step process, statistics, and FAQ section.
                  Perfect for landing pages, trust pages, or booking flows.
                </p>
              </CardContent>
            </Card>

            <AIVerificationExplainer />
          </TabsContent>

          {/* Verification Badges */}
          <TabsContent value="badges" className="space-y-8">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>VerificationBadge Component</CardTitle>
                <CardDescription>
                  Reusable badges for displaying verification status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sizes */}
                <div>
                  <h3 className="font-semibold mb-3">Different Sizes</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Small</p>
                      <VerificationBadge status="verified" size="sm" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Medium</p>
                      <VerificationBadge status="verified" size="md" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Large</p>
                      <VerificationBadge status="verified" size="lg" />
                    </div>
                  </div>
                </div>

                {/* Statuses */}
                <div>
                  <h3 className="font-semibold mb-3">Different Statuses</h3>
                  <div className="flex flex-wrap gap-3">
                    <VerificationBadge status="verified" size="md" />
                    <VerificationBadge status="pending" size="md" />
                    <VerificationBadge status="rejected" size="md" />
                    <VerificationBadge status="not_started" size="md" />
                  </div>
                </div>

                {/* With Details */}
                <div>
                  <h3 className="font-semibold mb-3">With Details Modal (Click to Open)</h3>
                  <div className="flex flex-wrap gap-3">
                    <VerificationBadge
                      status="verified"
                      size="lg"
                      showDetails
                      details={{
                        status: 'verified',
                        verifiedAt: '2024-02-15T10:00:00Z',
                        verifiedBy: 'AI Verification System',
                        notes: 'All credentials verified successfully. Insurance, license, and background check passed with 98% trust score.',
                      }}
                    />
                    <VerificationBadge
                      status="pending"
                      size="lg"
                      showDetails
                      details={{
                        status: 'pending',
                        notes: 'Verification in progress. Expected completion within 24 hours.',
                      }}
                    />
                  </div>
                </div>

                {/* Code Example */}
                <div className="mt-6 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{`<VerificationBadge 
  status="verified" 
  size="lg"
  showDetails
  details={{
    status: 'verified',
    verifiedAt: '2024-02-15T10:00:00Z',
    verifiedBy: 'AI System',
    notes: 'All credentials verified'
  }}
/>`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Cards */}
          <TabsContent value="cards" className="space-y-8">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>GuideVerificationCard Component</CardTitle>
                <CardDescription>
                  Comprehensive verification information display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Shows insurance, license, background check, and performance metrics.
                  Available in full and compact modes.
                </p>
              </CardContent>
            </Card>

            {/* Verified Guide - Full */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Excellent Guide (Score: 98) - Full Card
              </h3>
              <div className="max-w-3xl mx-auto">
                <GuideVerificationCard data={sampleVerifiedGuide} />
              </div>
            </div>

            {/* Verified Guide - Compact */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Excellent Guide - Compact Card
              </h3>
              <div className="max-w-2xl mx-auto">
                <GuideVerificationCard data={sampleVerifiedGuide} compact />
              </div>
            </div>

            {/* Pending Guide */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Good Guide (Score: 72) - Pending Insurance
              </h3>
              <div className="max-w-3xl mx-auto">
                <GuideVerificationCard data={samplePendingGuide} />
              </div>
            </div>

            {/* Side by Side Comparison */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Side-by-Side Comparison
              </h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                <GuideVerificationCard data={sampleVerifiedGuide} compact />
                <GuideVerificationCard data={samplePendingGuide} compact />
              </div>
            </div>

            {/* Code Example */}
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Code Example</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{`const guideData: GuideVerificationData = {
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

<GuideVerificationCard data={guideData} />
<GuideVerificationCard data={guideData} compact />`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
