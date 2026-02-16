import { AIVerificationExplainer, VerificationBadge, GuideVerificationCard } from '@/components/trust';
import { GuideVerificationData } from '@/types/verification';

/**
 * Example Usage of Trust Components
 * 
 * This file demonstrates how to use the AI verification trust components
 * in your Alaska Guide Search application.
 */

// Example 1: Using the AI Verification Explainer
// Add this to a landing page, booking flow, or trust/safety page
function ExampleExplainerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <AIVerificationExplainer />
    </div>
  );
}

// Example 2: Using Verification Badges
function ExampleBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Simple badge with tooltip */}
      <VerificationBadge status="verified" size="md" />
      
      {/* Badge with detailed modal */}
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
      
      {/* Different statuses */}
      <VerificationBadge status="pending" size="sm" />
      <VerificationBadge status="rejected" size="sm" />
      <VerificationBadge status="not_started" size="sm" />
    </div>
  );
}

// Example 3: Using Guide Verification Card
function ExampleGuideProfile() {
  // Sample verification data for a guide
  const sampleGuideData: GuideVerificationData = {
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
    averageResponseTime: 45, // in minutes
    verificationScore: 98,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Full card */}
        <GuideVerificationCard data={sampleGuideData} />
        
        {/* Compact version */}
        <GuideVerificationCard data={sampleGuideData} compact />
      </div>
    </div>
  );
}

// Example 4: Integration in Guide Profile Page
function ExampleFullIntegration() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Guide Header with Verification Badge */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">John Smith</h1>
              <p className="text-gray-600">Master Guide - Fishing & Hunting</p>
            </div>
            <VerificationBadge status="verified" size="lg" showDetails />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Guide bio, photos, etc */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-600">
                I've been guiding in Alaska for over 15 years, specializing in 
                world-class fishing and hunting experiences...
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Card */}
            <GuideVerificationCard data={guideData} />
            
            {/* Booking widget, etc */}
          </div>
        </div>

        {/* Trust Explainer Section */}
        <div className="mt-16">
          <AIVerificationExplainer />
        </div>
      </div>
    </div>
  );
}

// Example 5: Data with pending/expiring credentials
function ExamplePendingGuide() {
  const pendingGuideData: GuideVerificationData = {
    insurance: {
      status: 'verified',
      provider: 'Alaska Outdoor Insurance Co.',
      policyNumber: 'AK-2024-123456',
      expiryDate: '2024-03-15T23:59:59Z', // Expiring soon
      coverageAmount: 1000000,
    },
    license: {
      status: 'pending',
      licenseNumber: 'AK-GUIDE-2024-999',
      issuedBy: 'Alaska Department of Fish & Game',
      licenseType: 'Assistant Guide',
    },
    backgroundCheck: {
      status: 'verified',
      completedAt: '2024-01-01T10:00:00Z',
      provider: 'National Background Check Inc.',
      validUntil: '2025-01-01T23:59:59Z',
    },
    yearsOfExperience: 3,
    totalBookings: 42,
    averageResponseTime: 120,
    verificationScore: 72,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <GuideVerificationCard data={pendingGuideData} />
    </div>
  );
}

export {
  ExampleExplainerPage,
  ExampleBadges,
  ExampleGuideProfile,
  ExampleFullIntegration,
  ExamplePendingGuide,
};
