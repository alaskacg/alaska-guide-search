import { motion } from 'framer-motion';
import {
  Shield,
  FileCheck,
  UserCheck,
  Calendar,
  Star,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { VerificationBadge } from './VerificationBadge';
import { GuideVerificationData } from '@/types/verification';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, addDays } from 'date-fns';

interface GuideVerificationCardProps {
  data: GuideVerificationData;
  className?: string;
  compact?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

function isExpiringSoon(dateString?: string): boolean {
  if (!dateString) return false;
  const expiryDate = new Date(dateString);
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
}

function isExpired(dateString?: string): boolean {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
}

export function GuideVerificationCard({ data, className, compact = false }: GuideVerificationCardProps) {
  const verificationItems = [
    {
      icon: Shield,
      label: 'Insurance',
      status: data.insurance.status,
      details: [
        data.insurance.provider && `Provider: ${data.insurance.provider}`,
        data.insurance.policyNumber && `Policy: ${data.insurance.policyNumber}`,
        data.insurance.expiryDate && `Expires: ${format(new Date(data.insurance.expiryDate), 'MMM dd, yyyy')}`,
        data.insurance.coverageAmount && `Coverage: $${data.insurance.coverageAmount.toLocaleString()}`,
      ].filter(Boolean),
      expiryDate: data.insurance.expiryDate,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: FileCheck,
      label: 'License',
      status: data.license.status,
      details: [
        data.license.licenseType && `Type: ${data.license.licenseType}`,
        data.license.licenseNumber && `License: ${data.license.licenseNumber}`,
        data.license.issuedBy && `Issued by: ${data.license.issuedBy}`,
        data.license.expiryDate && `Expires: ${format(new Date(data.license.expiryDate), 'MMM dd, yyyy')}`,
      ].filter(Boolean),
      expiryDate: data.license.expiryDate,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: UserCheck,
      label: 'Background Check',
      status: data.backgroundCheck.status,
      details: [
        data.backgroundCheck.provider && `Provider: ${data.backgroundCheck.provider}`,
        data.backgroundCheck.completedAt &&
          `Completed: ${format(new Date(data.backgroundCheck.completedAt), 'MMM dd, yyyy')}`,
        data.backgroundCheck.validUntil && `Valid until: ${format(new Date(data.backgroundCheck.validUntil), 'MMM dd, yyyy')}`,
      ].filter(Boolean),
      expiryDate: data.backgroundCheck.validUntil,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
  ];

  const stats = [
    {
      icon: Calendar,
      label: 'Experience',
      value: `${data.yearsOfExperience} ${data.yearsOfExperience === 1 ? 'year' : 'years'}`,
      color: 'text-blue-600',
    },
    {
      icon: Star,
      label: 'Bookings',
      value: data.totalBookings.toLocaleString(),
      color: 'text-yellow-600',
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: data.averageResponseTime < 60
        ? `${data.averageResponseTime} min`
        : `${Math.round(data.averageResponseTime / 60)} hr`,
      color: 'text-green-600',
    },
  ];

  if (compact) {
    return (
      <Card className={cn('shadow-sm', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Verification Status
            </CardTitle>
            <div className={cn('text-2xl font-bold', getScoreColor(data.verificationScore))}>
              {data.verificationScore}
              <span className="text-sm font-normal text-gray-500">/100</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {verificationItems.map((item) => (
              <VerificationBadge key={item.label} status={item.status} size="sm" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className={cn('text-lg font-bold', stat.color)}>{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('shadow-md hover:shadow-lg transition-shadow duration-300', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              Verification Details
            </CardTitle>
            <CardDescription>AI-verified credentials and safety information</CardDescription>
          </div>
          <div className="text-center">
            <div className={cn('text-4xl font-bold', getScoreColor(data.verificationScore))}>
              {data.verificationScore}
            </div>
            <div className="text-sm text-gray-500">Trust Score</div>
            <Badge variant="outline" className="mt-1">
              {getScoreLabel(data.verificationScore)}
            </Badge>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="space-y-2 mt-4">
          <Progress
            value={data.verificationScore}
            className={cn(
              'h-2',
              data.verificationScore >= 90 && '[&>div]:bg-green-600',
              data.verificationScore >= 70 && data.verificationScore < 90 && '[&>div]:bg-yellow-600',
              data.verificationScore < 70 && '[&>div]:bg-red-600'
            )}
          />
          <p className="text-xs text-gray-500">
            Based on document verification, background checks, and performance metrics
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Verification Items */}
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {verificationItems.map((verificationItem, index) => {
            const Icon = verificationItem.icon;
            const expired = isExpired(verificationItem.expiryDate);
            const expiringSoon = isExpiringSoon(verificationItem.expiryDate);

            return (
              <motion.div key={verificationItem.label} variants={item}>
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0', verificationItem.bgColor)}>
                    <Icon className={cn('h-5 w-5', verificationItem.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{verificationItem.label}</h4>
                      <VerificationBadge status={verificationItem.status} size="sm" />
                    </div>
                    {verificationItem.details.length > 0 && (
                      <div className="space-y-1">
                        {verificationItem.details.map((detail, idx) => (
                          <p key={idx} className="text-xs text-gray-600">
                            {detail}
                          </p>
                        ))}
                      </div>
                    )}
                    {(expired || expiringSoon) && (
                      <div className={cn(
                        'flex items-center gap-1 mt-2 text-xs',
                        expired ? 'text-red-600' : 'text-yellow-600'
                      )}>
                        <AlertCircle className="h-3 w-3" />
                        {expired ? 'Expired' : 'Expiring soon'}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <Separator />

        {/* Performance Stats */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Performance Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  <div>
                    <div className={cn('text-xl font-bold', stat.color)}>{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Trust Indicator */}
        {data.verificationScore >= 90 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">
              <span className="font-semibold">Highly Trusted Guide:</span> All credentials verified and up-to-date
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
