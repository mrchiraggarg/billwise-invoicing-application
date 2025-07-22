import React from 'react';
import { Invoice } from '../../types';
import { format } from 'date-fns';
import StatusBadge from '../StatusBadge';
import QRCode from 'react-qr-code';

interface ModernTemplateProps {
  invoice: Invoice;
  className?: string;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ invoice, className = '' }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  return (
    <div className={`bg-white min-h-screen ${className}`}>
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            {invoice.businessInfo.logo && (
              <img 
                src={invoice.businessInfo.logo} 
                alt="Logo" 
                className="h-16 w-auto object-contain"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {invoice.businessInfo.name}
              </h1>
              <p className="text-gray-600">{invoice.businessInfo.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">INVOICE</h2>
            <div className="flex items-center space-x-2 justify-end">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">From</h3>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">{invoice.businessInfo.name}</p>
                <p className="whitespace-pre-line">{invoice.businessInfo.address}</p>
                <p>{invoice.businessInfo.phone}</p>
                <p>{invoice.businessInfo.email}</p>
                {invoice.businessInfo.website && (
                  <p className="text-blue-600">{invoice.businessInfo.website}</p>
                )}
                {invoice.businessInfo.taxNumber && (
                  <p>GST: {invoice.businessInfo.taxNumber}</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Bill To</h3>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">{invoice.clientInfo.name}</p>
                {invoice.clientInfo.company && (
                  <p>{invoice.clientInfo.company}</p>
                )}
                <p className="whitespace-pre-line">{invoice.clientInfo.address}</p>
                <p>{invoice.clientInfo.phone}</p>
                <p>{invoice.clientInfo.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-600">Invoice Number</p>
            <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
          </div>
          <div className="bg-white border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-600">Invoice Date</p>
            <p className="font-semibold text-gray-900">{formatDate(invoice.date)}</p>
          </div>
          <div className="bg-white border-l-4 border-red-500 pl-4">
            <p className="text-sm text-gray-600">Due Date</p>
            <p className="font-semibold text-gray-900">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
            <div className="grid grid-cols-12 gap-4 font-medium">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
          </div>
          
          <div className="border-x border-b rounded-b-lg">
            {invoice.lineItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`grid grid-cols-12 gap-4 px-6 py-4 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="col-span-6 text-gray-900">{item.description}</div>
                <div className="col-span-2 text-center text-gray-700">{item.quantity}</div>
                <div className="col-span-2 text-center text-gray-700">{formatCurrency(item.unitPrice)}</div>
                <div className="col-span-2 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-md">
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {invoice.paymentInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                {invoice.paymentInfo.method === 'upi' && invoice.paymentInfo.upiId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">UPI ID</p>
                    <p className="font-mono text-sm bg-white px-2 py-1 rounded">
                      {invoice.paymentInfo.upiId}
                    </p>
                  </div>
                )}
                {invoice.paymentInfo.method === 'razorpay' && invoice.paymentInfo.razorpayId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Razorpay Link</p>
                    <p className="font-mono text-sm bg-white px-2 py-1 rounded">
                      {invoice.paymentInfo.razorpayId}
                    </p>
                  </div>
                )}
                {invoice.paymentInfo.method === 'custom' && invoice.paymentInfo.customUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Payment Link</p>
                    <p className="font-mono text-sm bg-white px-2 py-1 rounded break-all">
                      {invoice.paymentInfo.customUrl}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {invoice.paymentInfo.qrCodeData && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Scan to Pay</h3>
                <div className="bg-white p-4 border rounded-lg inline-block">
                  <QRCode value={invoice.paymentInfo.qrCodeData} size={128} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {invoice.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
                <p className="text-gray-700 whitespace-pre-line">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;