import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Invoice, BusinessInfo, InvoiceTemplate } from '../types';

interface AppContextType {
  invoices: Invoice[];
  businessInfo: BusinessInfo | null;
  templates: InvoiceTemplate[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateBusinessInfo: (info: BusinessInfo) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultTemplates: InvoiceTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional with accent colors'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with formal styling'
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [templates] = useState<InvoiceTemplate[]>(defaultTemplates);

  useEffect(() => {
    // Load data from localStorage
    const savedInvoices = localStorage.getItem('billwise-invoices');
    const savedBusinessInfo = localStorage.getItem('billwise-business-info');

    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }

    if (savedBusinessInfo) {
      setBusinessInfo(JSON.parse(savedBusinessInfo));
    }
  }, []);

  const saveInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    localStorage.setItem('billwise-invoices', JSON.stringify(newInvoices));
  };

  const saveBusinessInfo = (info: BusinessInfo) => {
    setBusinessInfo(info);
    localStorage.setItem('billwise-business-info', JSON.stringify(info));
  };

  const addInvoice = (invoice: Invoice) => {
    const newInvoices = [...invoices, invoice];
    saveInvoices(newInvoices);
  };

  const updateInvoice = (id: string, updatedInvoice: Partial<Invoice>) => {
    const newInvoices = invoices.map(invoice =>
      invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
    );
    saveInvoices(newInvoices);
  };

  const deleteInvoice = (id: string) => {
    const newInvoices = invoices.filter(invoice => invoice.id !== id);
    saveInvoices(newInvoices);
  };

  const updateBusinessInfo = (info: BusinessInfo) => {
    saveBusinessInfo(info);
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  return (
    <AppContext.Provider value={{
      invoices,
      businessInfo,
      templates,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      updateBusinessInfo,
      getInvoiceById
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};