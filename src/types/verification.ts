export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'not_started';

export interface VerificationDetails {
  status: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface InsuranceInfo {
  status: VerificationStatus;
  provider?: string;
  policyNumber?: string;
  expiryDate?: string;
  coverageAmount?: number;
}

export interface LicenseInfo {
  status: VerificationStatus;
  licenseNumber?: string;
  issuedBy?: string;
  expiryDate?: string;
  licenseType?: string;
}

export interface BackgroundCheckInfo {
  status: VerificationStatus;
  completedAt?: string;
  provider?: string;
  validUntil?: string;
}

export interface GuideVerificationData {
  insurance: InsuranceInfo;
  license: LicenseInfo;
  backgroundCheck: BackgroundCheckInfo;
  yearsOfExperience: number;
  totalBookings: number;
  averageResponseTime: number; // in minutes
  verificationScore: number; // 0-100
}
