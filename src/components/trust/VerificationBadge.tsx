import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VerificationStatus, VerificationDetails } from '@/types/verification';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  details?: VerificationDetails;
  className?: string;
}

const statusConfig = {
  verified: {
    label: 'Verified',
    icon: CheckCircle2,
    color: 'bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20',
    iconColor: 'text-green-600',
    description: 'This guide has been verified by our AI system',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 hover:bg-yellow-500/20',
    iconColor: 'text-yellow-600',
    description: 'Verification is currently in progress',
  },
  rejected: {
    label: 'Not Verified',
    icon: XCircle,
    color: 'bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/20',
    iconColor: 'text-red-600',
    description: 'Verification was unsuccessful',
  },
  not_started: {
    label: 'Unverified',
    icon: AlertCircle,
    color: 'bg-gray-500/10 text-gray-700 border-gray-500/20 hover:bg-gray-500/20',
    iconColor: 'text-gray-600',
    description: 'Verification has not been completed',
  },
};

const sizeConfig = {
  sm: {
    badge: 'text-xs px-2 py-0.5',
    icon: 'h-3 w-3',
  },
  md: {
    badge: 'text-sm px-3 py-1',
    icon: 'h-4 w-4',
  },
  lg: {
    badge: 'text-base px-4 py-1.5',
    icon: 'h-5 w-5',
  },
};

export function VerificationBadge({
  status,
  size = 'md',
  showDetails = false,
  details,
  className,
}: VerificationBadgeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const config = statusConfig[status];
  const sizeStyle = sizeConfig[size];
  const Icon = config.icon;

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1.5 cursor-pointer transition-all duration-200',
        config.color,
        sizeStyle.badge,
        className
      )}
      onClick={() => showDetails && setIsModalOpen(true)}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <Icon className={cn(sizeStyle.icon, config.iconColor)} />
      </motion.div>
      <span className="font-medium">{config.label}</span>
    </Badge>
  );

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>
            <p>{config.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>
            <p>Click for details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Icon className={cn('h-5 w-5', config.iconColor)} />
                  Verification Details
                </DialogTitle>
                <DialogDescription>{config.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{status.replace('_', ' ')}</p>
                  </div>
                  {details?.verifiedAt && (
                    <div>
                      <p className="text-sm text-gray-500">Verified On</p>
                      <p className="font-medium">
                        {format(new Date(details.verifiedAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                  {details?.verifiedBy && (
                    <div>
                      <p className="text-sm text-gray-500">Verified By</p>
                      <p className="font-medium">{details.verifiedBy}</p>
                    </div>
                  )}
                </div>

                {details?.notes && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-md">{details.notes}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
