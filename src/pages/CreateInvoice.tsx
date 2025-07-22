import React from 'react';
import InvoiceForm from '../components/InvoiceForm';

const CreateInvoice: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="mt-2 text-gray-600">Fill in the details below to create a new invoice.</p>
      </div>
      
      <InvoiceForm />
    </div>
  );
};

export default CreateInvoice;