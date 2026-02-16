import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  CheckCircle2,
  TrendingDown,
  Search,
  FileCheck,
  Award,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const verificationSteps = [
  {
    icon: Search,
    title: 'Automated Document Verification',
    description: 'AI scans and validates licenses, insurance, and certifications in real-time',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: FileCheck,
    title: 'Background & Safety Check',
    description: 'Comprehensive background screening and safety record verification',
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Award,
    title: 'Experience & Rating Analysis',
    description: 'AI analyzes booking history, reviews, and professional experience',
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
  },
];

const stats = [
  { label: 'Guide Approval Rate', value: 98, suffix: '%', color: 'text-green-600' },
  { label: 'Average Verification Time', value: 24, suffix: ' hours', color: 'text-blue-600' },
  { label: 'Documents Verified', value: 12, suffix: 'K+', color: 'text-purple-600' },
  { label: 'Customer Satisfaction', value: 4.9, suffix: '/5.0', color: 'text-yellow-600' },
];

const faqs = [
  {
    question: 'Why is the deposit only 25%?',
    answer:
      'Our AI-powered verification system reduces risk by thoroughly vetting every guide. This allows us to offer lower deposits while maintaining the highest safety and quality standards. Traditional platforms require 50-100% upfront because they lack comprehensive verification.',
  },
  {
    question: 'How accurate is AI verification?',
    answer:
      'Our AI verification system has a 99.2% accuracy rate in document validation. Every verification is also reviewed by our compliance team for added security. The system cross-references multiple databases and uses advanced pattern recognition to detect fraud.',
  },
  {
    question: 'What happens if a guide isn\'t verified?',
    answer:
      'Guides who don\'t meet our verification standards cannot accept bookings. We maintain strict criteria for insurance, licensing, and background checks. Only 2% of guides fail verification, and they receive detailed feedback to help them meet our standards.',
  },
  {
    question: 'Is my payment protected?',
    answer:
      'Absolutely. All payments are processed through Stripe with full buyer protection. The 25% deposit is held securely, and the remaining 75% isn\'t charged until your trip is confirmed. We also offer a full refund policy for cancellations within the specified timeframe.',
  },
  {
    question: 'How often are guides re-verified?',
    answer:
      'Guides undergo annual re-verification to ensure their credentials remain current. If insurance or licenses expire, their account is automatically suspended until updated documents are provided and verified.',
  },
];

export function AIVerificationExplainer() {
  const [activeAccordion, setActiveAccordion] = useState<string>('');

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">AI-Powered Trust & Safety</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight">Why Only 25% Deposit?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our advanced AI verification system eliminates risk, so you don't pay more upfront
        </p>
      </motion.div>

      {/* Comparison Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Traditional Platform */}
        <motion.div variants={item}>
          <Card className="border-2 border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 px-3 py-1 text-xs font-medium rounded-bl-lg">
              Traditional
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-gray-600" />
                </div>
                Other Platforms
              </CardTitle>
              <CardDescription>Manual verification, higher risk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deposit Required</span>
                  <span className="font-bold text-xl text-gray-900">50-100%</span>
                </div>
                <Progress value={75} className="h-2 bg-gray-200" />
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5" />
                  Slow manual verification (3-7 days)
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5" />
                  Limited background checks
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5" />
                  Higher fraud risk
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5" />
                  Pay more upfront for protection
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alaska Guide Search */}
        <motion.div variants={item}>
          <Card className="border-2 border-blue-500 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
              Recommended
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                Alaska Guide Search
              </CardTitle>
              <CardDescription>AI-powered verification, lower risk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deposit Required</span>
                  <span className="font-bold text-3xl text-blue-600">25%</span>
                </div>
                <Progress value={25} className="h-2 [&>div]:bg-blue-600" />
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Instant AI verification (24 hours)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Comprehensive background screening
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  99.2% fraud detection accuracy
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Pay less upfront, same protection
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* 3-Step Verification Process */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">How AI Verification Works</h3>
          <p className="text-gray-600">Our 3-step verification process ensures every guide meets the highest standards</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {verificationSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={cn('h-12 w-12 rounded-lg flex items-center justify-center mb-2', step.bgColor)}>
                    <step.icon className={cn('h-6 w-6', step.color)} />
                  </div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Step {index + 1}</div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold text-center mb-8">Trust by the Numbers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <div className={cn('text-3xl md:text-4xl font-bold mb-1', stat.color)}>
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="space-y-4"
      >
        <h3 className="text-2xl font-bold text-center">Frequently Asked Questions</h3>
        <Accordion
          type="single"
          collapsible
          value={activeAccordion}
          onValueChange={setActiveAccordion}
          className="space-y-2"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 rounded-lg px-6 data-[state=open]:bg-blue-50/50"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <span className="font-semibold pr-4">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}
