import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CartItem } from '@/contexts/CartContext';

export interface QuotationData {
  challanNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  cartItems: CartItem[];
  totalAmount: number;
  createdAt: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export const generateChallanNumber = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `HC${year}${randomNum}`;
};

export const generateQuotationPDF = async (data: QuotationData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Add watermark
  pdf.setFontSize(60);
  pdf.setTextColor(220, 220, 220);
  pdf.text('HELLO CRACKERS', pageWidth / 2, pageHeight / 2, { 
    align: 'center',
    angle: 45 
  });

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('HELLO CRACKERS', 20, 30);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Premium Quality Crackers | Tamil Nadu', 20, 40);
  pdf.text('Contact: +91 9876543210 | Email: info@hellocrackers.com', 20, 50);

  // Title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.paymentStatus === 'paid' ? 'REMITTANCE & CHALLAN' : 'QUOTATION', 20, 70);

  // Challan details
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Challan No: ${data.challanNumber}`, 20, 85);
  pdf.text(`Date: ${new Date(data.createdAt).toLocaleDateString('en-IN')}`, 20, 95);
  pdf.text(`Time: ${new Date(data.createdAt).toLocaleTimeString('en-IN')}`, 20, 105);
  pdf.text(`Status: ${data.paymentStatus.toUpperCase()}`, 140, 85);

  // Customer details
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CUSTOMER DETAILS:', 20, 125);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Name: ${data.customerName}`, 20, 135);
  pdf.text(`Email: ${data.customerEmail}`, 20, 145);
  pdf.text(`Phone: ${data.customerPhone}`, 20, 155);
  pdf.text(`Address: ${data.customerAddress}`, 20, 165);

  // Items table
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ITEMS:', 20, 185);

  // Table headers
  const tableStartY = 195;
  pdf.setFontSize(9);
  pdf.text('Product Name', 20, tableStartY);
  pdf.text('Qty', 120, tableStartY);
  pdf.text('Rate', 140, tableStartY);
  pdf.text('Amount', 170, tableStartY);

  // Table line
  pdf.line(20, tableStartY + 2, 190, tableStartY + 2);

  // Table rows
  let currentY = tableStartY + 10;
  data.cartItems.forEach((item, index) => {
    const amount = item.finalRate * item.quantity;
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.productName.substring(0, 35), 20, currentY);
    pdf.text(item.quantity.toString(), 120, currentY);
    pdf.text(`₹${item.finalRate}`, 140, currentY);
    pdf.text(`₹${amount}`, 170, currentY);
    currentY += 8;
  });

  // Total
  pdf.line(20, currentY, 190, currentY);
  currentY += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text(`TOTAL AMOUNT: ₹${data.totalAmount}`, 20, currentY);

  // Footer
  const footerY = pageHeight - 30;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Thank you for choosing Hello Crackers!', 20, footerY);
  pdf.text('For any queries, contact: +91 9876543210', 20, footerY + 10);

  // Download
  const fileName = data.paymentStatus === 'paid' 
    ? `Remittance_${data.challanNumber}.pdf`
    : `Quotation_${data.challanNumber}.pdf`;
  
  pdf.save(fileName);
};

export const generateRemittancePDF = async (data: QuotationData): Promise<void> => {
  // Same as quotation but with payment confirmation
  const remittanceData = { ...data, paymentStatus: 'paid' as const };
  await generateQuotationPDF(remittanceData);
};