import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, CheckCircle, AlertCircle, Loader2, Scan, KeyRound } from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  guideName: string;
  serviceName: string;
  date: string;
  totalPrice: number;
  depositPaid: number;
  status: string;
  checkInCode?: string;
}

interface CheckInSystemProps {
  booking: Booking;
  role: 'customer' | 'guide';
  onCheckIn?: (bookingId: string, remainderAmount: number) => Promise<void>;
  onStatusUpdate?: (bookingId: string, status: string) => Promise<void>;
}

export default function CheckInSystem({ 
  booking, 
  role, 
  onCheckIn,
  onStatusUpdate 
}: CheckInSystemProps) {
  const [scanMode, setScanMode] = useState<'qr' | 'manual'>('qr');
  const [manualCode, setManualCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scannerActive, setScannerActive] = useState(false);

  const checkInCode = booking.checkInCode || generateCheckInCode(booking.id);
  const remainderAmount = booking.totalPrice - booking.depositPaid;

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  function generateCheckInCode(bookingId: string): string {
    const hash = bookingId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return Math.abs(hash).toString(36).toUpperCase().slice(0, 8);
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScannerActive(true);
        requestAnimationFrame(scanQRCode);
      }
    } catch (err) {
      setError('Camera access denied. Please use manual code entry.');
      setScanMode('manual');
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScannerActive(false);
  }

  function scanQRCode() {
    if (!scannerActive || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = detectQRCode(imageData);

      if (code) {
        handleCodeDetected(code);
        return;
      }
    }

    requestAnimationFrame(scanQRCode);
  }

  function detectQRCode(imageData: ImageData): string | null {
    try {
      const jsQR = (window as any).jsQR;
      if (!jsQR) return null;

      const code = jsQR(imageData.data, imageData.width, imageData.height);
      return code?.data || null;
    } catch {
      return null;
    }
  }

  async function handleCodeDetected(code: string) {
    stopCamera();
    await verifyAndCheckIn(code);
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCode.trim()) {
      setError('Please enter a check-in code');
      return;
    }
    await verifyAndCheckIn(manualCode.trim().toUpperCase());
  }

  async function verifyAndCheckIn(code: string) {
    setIsVerifying(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (code !== checkInCode) {
        throw new Error('Invalid check-in code. Please try again.');
      }

      if (booking.status === 'checked_in') {
        throw new Error('This booking has already been checked in.');
      }

      setIsProcessing(true);

      if (onCheckIn) {
        await onCheckIn(booking.id, remainderAmount);
      }

      if (onStatusUpdate) {
        await onStatusUpdate(booking.id, 'checked_in');
      }

      setSuccess(true);
      setManualCode('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check-in failed. Please try again.');
    } finally {
      setIsVerifying(false);
      setIsProcessing(false);
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check-In Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            {role === 'customer' 
              ? 'You have been checked in successfully.' 
              : `${booking.customerName} has been checked in.`}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <p className="text-gray-500">Booking ID</p>
                <p className="font-medium text-gray-900">{booking.id.slice(0, 8)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Remainder Paid</p>
                <p className="font-medium text-green-600">{formatCurrency(remainderAmount)}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSuccess(false)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (role === 'customer') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Check-In Code
          </h2>
          <p className="text-gray-600">
            Show this QR code to your guide at check-in
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6">
          <div className="flex justify-center mb-4">
            <QRCodeSVG 
              value={checkInCode}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Manual Code</p>
            <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
              {checkInCode}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Service</span>
              <span className="font-medium text-gray-900">{booking.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guide</span>
              <span className="font-medium text-gray-900">{booking.guideName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-900">
                {new Date(booking.date).toLocaleDateString()}
              </span>
            </div>
            <div className="border-t border-blue-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Paid</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(booking.depositPaid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remainder Due</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(remainderAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          <p className="font-medium mb-1">💳 Payment at Check-In</p>
          <p>The remainder amount of {formatCurrency(remainderAmount)} will be charged when you check in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Check-In Customer
        </h2>
        <p className="text-gray-600">
          Scan QR code or enter code manually
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setScanMode('qr');
              setError(null);
              if (!scannerActive) startCamera();
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              scanMode === 'qr'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            Scan QR
          </button>
          <button
            onClick={() => {
              setScanMode('manual');
              setError(null);
              stopCamera();
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              scanMode === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Manual Entry
          </button>
        </div>

        {scanMode === 'qr' ? (
          <div className="relative">
            {!scannerActive ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Scan className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <button
                  onClick={startCamera}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Camera
                </button>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-blue-500 rounded-lg">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-600 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-600 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-600 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-600 rounded-br-lg" />
                  </div>
                </div>

                <button
                  onClick={stopCamera}
                  className="absolute top-2 right-2 bg-red-600 text-white py-1 px-3 rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-In Code
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="Enter 8-character code"
                maxLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg text-center tracking-wider uppercase"
                disabled={isVerifying || isProcessing}
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || isProcessing || !manualCode.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying || isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isProcessing ? 'Processing Payment...' : 'Verifying...'}
                </>
              ) : (
                'Verify & Check In'
              )}
            </button>
          </form>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Booking Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Customer</span>
            <span className="font-medium text-gray-900">{booking.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service</span>
            <span className="font-medium text-gray-900">{booking.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date</span>
            <span className="font-medium text-gray-900">
              {new Date(booking.date).toLocaleDateString()}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between text-base">
              <span className="text-gray-700 font-medium">Remainder to Collect</span>
              <span className="font-bold text-green-600">
                {formatCurrency(remainderAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isVerifying && (
        <div className="mt-4 text-center text-sm text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
          Verifying check-in code...
        </div>
      )}
    </div>
  );
}
