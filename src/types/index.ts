export interface BusinessInfo {
  name: string;
  logo?: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  taxNumber?: string;
}

export interface ClientInfo {
  name: string;
  company?: string;
  address: string;
  email: string;
  phone: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PaymentInfo {
  method: 'razorpay' | 'upi' | 'custom';
  razorpayId?: string;
  upiId?: string;
  customUrl?: string;
  qrCodeData?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  businessInfo: BusinessInfo;
  clientInfo: ClientInfo;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  terms?: string;
  status: 'paid' | 'unpaid';
  paymentInfo?: PaymentInfo;
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
}