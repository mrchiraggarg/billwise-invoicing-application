import React from 'react';
import { Invoice } from '../../types';
import { format } from 'date-fns';
import StatusBadge from '../StatusBadge';
import QRCode from 'react-qr-code';

interface ClassicTemplateProps {
  invoice: Invoice;
  className?: string;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ invoice, className = '' }) => {
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
        <div className="border-b-2 border-gray-900 pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              {invoice.businessInfo.logo && (
                <img 
                  src={invoice.businessInfo.logo} 
                  alt="Logo" 
                  className="h-16 w-auto object-contain"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                  {invoice.businessInfo.name}
                </h1>
                <p className="text-gray-600 mt-1">{invoice.businessInfo.email}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h2>
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="border border-gray-300 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                Invoice From
              </h3>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{invoice.businessInfo.name}</p>
                <p className="whitespace-pre-line">{invoice.businessInfo.address}</p>
                <p>Phone: {invoice.businessInfo.phone}</p>
                <p>Email: {invoice.businessInfo.email}</p>
                {invoice.businessInfo.website && (
                  <p>Website: {invoice.businessInfo.website}</p>
                )}
                {invoice.businessInfo.taxNumber && (
                  <p>GST No: {invoice.businessInfo.taxNumber}</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="border border-gray-300 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                Invoice To
              </h3>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{invoice.clientInfo.name}</p>
                {invoice.clientInfo.company && (
                  <p>{invoice.clientInfo.company}</p>
                )}
                <p className="whitespace-pre-line">{invoice.clientInfo.address}</p>
                <p>Phone: {invoice.clientInfo.phone}</p>
                <p>Email: {invoice.clientInfo.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-gray-300 p-4 text-center">
            <p className="text-sm text-gray-600 font-semibold uppercase">Invoice Number</p>
            <p className="text-lg font-bold text-gray-900">{invoice.invoiceNumber}</p>
          </div>
          <div className="border border-gray-300 p-4 text-center">
            <p className="text-sm text-gray-600 font-semibold uppercase">Invoice Date</p>
            <p className="text-lg font-bold text-gray-900">{formatDate(invoice.date)}</p>
          </div>
          <div className="border border-gray-300 p-4 text-center">
            <p className="text-sm text-gray-600 font-semibold uppercase">Due Date</p>
            <p className="text-lg font-bold text-gray-900">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-900">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="border border-gray-900 px-4 py-3 text-left font-bold uppercase text-sm">
                  Description
                </th>
                <th className="border border-gray-900 px-4 py-3 text-center font-bold uppercase text-sm">
                  Qty
                </th>
                <th className="border border-gray-900 px-4 py-3 text-center font-bold uppercase text-sm">
                  Unit Price
                </th>
                <th className="border border-gray-900 px-4 py-3 text-right font-bold uppercase text-sm">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border border-gray-300 px-4 py-3 text-gray-900">
                    {item.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-md">
            <table className="w-full border-collapse border border-gray-900">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-900 bg-gray-50">
                    Subtotal
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-900">
                    {formatCurrency(invoice.subtotal)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-900 bg-gray-50">
                    Tax ({invoice.taxRate}%)
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-900">
                    {formatCurrency(invoice.taxAmount)}
                  </td>
                </tr>
                <tr className="bg-gray-900 text-white">
                  <td className="border border-gray-900 px-4 py-3 font-bold uppercase">
                    Total
                  </td>
                  <td className="border border-gray-900 px-4 py-3 text-right font-bold text-xl">
                    {formatCurrency(invoice.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Information */}
        {invoice.paymentInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                Payment Information
              </h3>
              <div className="border border-gray-300 p-4">
                {invoice.paymentInfo.method === 'upi' && invoice.paymentInfo.upiId && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-2">UPI ID</p>
                    <p className="font-mono text-sm border border-gray-300 p-2 bg-gray-50">
                      {invoice.paymentInfo.upiId}
                    </p>
                  </div>
                )}
                {invoice.paymentInfo.method === 'razorpay' && invoice.paymentInfo.razorpayId && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-2">Razorpay Link</p>
                    <p className="font-mono text-sm border border-gray-300 p-2 bg-gray-50">
                      {invoice.paymentInfo.razorpayId}
                    </p>
                  </div>
                )}
                {invoice.paymentInfo.method === 'custom' && invoice.paymentInfo.customUrl && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-2">Payment Link</p>
                    <p className="font-mono text-sm border border-gray-300 p-2 bg-gray-50 break-all">
                      {invoice.paymentInfo.customUrl}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {invoice.paymentInfo.qrCodeData && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Scan to Pay
                </h3>
                <div className="border border-gray-300 p-4 inline-block">
                  <QRCode value={invoice.paymentInfo.qrCodeData} size={128} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-300 pt-8">
            {invoice.notes && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Notes
                </h3>
                <div className="border border-gray-300 p-4">
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Terms & Conditions
                </h3>
                <div className="border border-gray-300 p-4">
                  <p className="text-gray-700 whitespace-pre-line">{invoice.terms}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;