import React, { useState, useEffect } from 'react';
import { PaymentInfo } from '../types';
import QRCode from 'react-qr-code';

interface PaymentSectionProps {
  paymentInfo?: PaymentInfo;
  onChange: (info: PaymentInfo) => void;
  className?: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ 
  paymentInfo, 
  onChange, 
  className = '' 
}) => {
  const [formData, setFormData] = useState<PaymentInfo>({
    method: 'custom',
    customUrl: '',
    upiId: '',
    razorpayId: '',
    qrCodeData: ''
  });

  useEffect(() => {
    if (paymentInfo) {
      setFormData(paymentInfo);
    }
  }, [paymentInfo]);

  const handleChange = (field: keyof PaymentInfo, value: string) => {
    const newData = { ...formData, [field]: value };
    
    // Generate QR code data for UPI
    if (field === 'upiId' && value) {
      newData.qrCodeData = `upi://pay?pa=${value}`;
    }
    
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="custom"
                  checked={formData.method === 'custom'}
                  onChange={(e) => handleChange('method', e.target.value as PaymentInfo['method'])}
                  className="mr-2"
                />
                <span>Custom Payment Link</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.method === 'upi'}
                  onChange={(e) => handleChange('method', e.target.value as PaymentInfo['method'])}
                  className="mr-2"
                />
                <span>UPI (with QR Code)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={formData.method === 'razorpay'}
                  onChange={(e) => handleChange('method', e.target.value as PaymentInfo['method'])}
                  className="mr-2"
                />
                <span>Razorpay</span>
              </label>
            </div>
          </div>

          {formData.method === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment URL
              </label>
              <input
                type="url"
                value={formData.customUrl}
                onChange={(e) => handleChange('customUrl', e.target.value)}
                placeholder="https://your-payment-link.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {formData.method === 'upi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => handleChange('upiId', e.target.value)}
                  placeholder="your-upi-id@paytm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {formData.upiId && formData.qrCodeData && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code Preview
                  </label>
                  <div className="bg-white p-4 border rounded-lg inline-block">
                    <QRCode value={formData.qrCodeData} size={128} />
                  </div>
                </div>
              )}
            </div>
          )}

          {formData.method === 'razorpay' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razorpay Payment Link ID
              </label>
              <input
                type="text"
                value={formData.razorpayId}
                onChange={(e) => handleChange('razorpayId', e.target.value)}
                placeholder="Enter Razorpay payment link ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;