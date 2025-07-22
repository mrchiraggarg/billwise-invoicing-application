import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Invoice, BusinessInfo, ClientInfo, LineItem, PaymentInfo } from '../types';
import { useApp } from '../context/AppContext';
import BusinessInfoForm from './BusinessInfoForm';
import ClientInfoForm from './ClientInfoForm';
import LineItemsForm from './LineItemsForm';
import PaymentSection from './PaymentSection';
import { format } from 'date-fns';
import { Save, Eye } from 'lucide-react';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSave?: (invoice: Invoice) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSave }) => {
  const navigate = useNavigate();
  const { addInvoice, updateInvoice, businessInfo, templates } = useApp();
  
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 days from now
    templateId: 'modern',
    status: 'unpaid' as const,
    notes: '',
    terms: '',
    taxRate: 18
  });

  const [currentBusinessInfo, setCurrentBusinessInfo] = useState<BusinessInfo>(
    businessInfo || {
      name: '',
      address: '',
      email: '',
      phone: '',
      website: '',
      taxNumber: '',
      logo: ''
    }
  );

  const [currentClientInfo, setCurrentClientInfo] = useState<ClientInfo>({
    name: '',
    company: '',
    address: '',
    email: '',
    phone: ''
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | undefined>();

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date,
        dueDate: invoice.dueDate,
        templateId: invoice.templateId,
        status: invoice.status,
        notes: invoice.notes || '',
        terms: invoice.terms || '',
        taxRate: invoice.taxRate
      });
      setCurrentBusinessInfo(invoice.businessInfo);
      setCurrentClientInfo(invoice.clientInfo);
      setLineItems(invoice.lineItems);
      setPaymentInfo(invoice.paymentInfo);
    }
  }, [invoice]);

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentBusinessInfo.name || !currentBusinessInfo.email || !currentClientInfo.name) {
      alert('Please fill in all required fields');
      return;
    }

    const { subtotal, taxAmount, total } = calculateTotals();
    
    const invoiceData: Invoice = {
      id: invoice?.id || crypto.randomUUID(),
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      dueDate: formData.dueDate,
      businessInfo: currentBusinessInfo,
      clientInfo: currentClientInfo,
      lineItems,
      subtotal,
      taxRate: formData.taxRate,
      taxAmount,
      total,
      notes: formData.notes,
      terms: formData.terms,
      status: formData.status,
      paymentInfo,
      templateId: formData.templateId,
      createdAt: invoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (onSave) {
      onSave(invoiceData);
    } else if (invoice) {
      updateInvoice(invoice.id, invoiceData);
    } else {
      addInvoice(invoiceData);
    }

    navigate('/');
  };

  const handlePreview = () => {
    const { subtotal, taxAmount, total } = calculateTotals();
    
    const invoiceData: Invoice = {
      id: invoice?.id || crypto.randomUUID(),
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      dueDate: formData.dueDate,
      businessInfo: currentBusinessInfo,
      clientInfo: currentClientInfo,
      lineItems,
      subtotal,
      taxRate: formData.taxRate,
      taxAmount,
      total,
      notes: formData.notes,
      terms: formData.terms,
      status: formData.status,
      paymentInfo,
      templateId: formData.templateId,
      createdAt: invoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in sessionStorage for preview
    sessionStorage.setItem('preview-invoice', JSON.stringify(invoiceData));
    window.open('/preview', '_blank');
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Number *
            </label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template
            </label>
            <select
              value={formData.templateId}
              onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} - {template.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'paid' | 'unpaid' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
              min="0"
              max="100"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <BusinessInfoForm
          businessInfo={currentBusinessInfo}
          onChange={setCurrentBusinessInfo}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <ClientInfoForm
          clientInfo={currentClientInfo}
          onChange={setCurrentClientInfo}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <LineItemsForm
          lineItems={lineItems}
          onChange={setLineItems}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <PaymentSection
          paymentInfo={paymentInfo}
          onChange={setPaymentInfo}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Payment terms and conditions..."
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{subtotal.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Tax ({formData.taxRate}%)</p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{taxAmount.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <p className="text-sm">Total</p>
            <p className="text-xl font-bold">
              ₹{total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePreview}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </button>
        
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          {invoice ? 'Update Invoice' : 'Save Invoice'}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;