import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import InvoiceForm from '../components/InvoiceForm';

const EditInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getInvoiceById } = useApp();
  
  const invoice = id ? getInvoiceById(id) : undefined;

  if (!invoice) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Invoice</h1>
        <p className="mt-2 text-gray-600">Update the details for invoice {invoice.invoiceNumber}.</p>
      </div>
      
      <InvoiceForm invoice={invoice} />
    </div>
  );
};

export default EditInvoice;