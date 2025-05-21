
import React from "react";

interface BillPrintServiceProps {
  printRef: React.RefObject<HTMLDivElement>;
  billNumber: string;
}

export const handlePrint = ({ printRef, billNumber }: BillPrintServiceProps) => {
  const printContent = document.createElement('div');
  printContent.innerHTML = printRef.current?.innerHTML || '';
  
  const windowFeatures = 'left=0,top=0,width=800,height=600';
  const printWindow = window.open('', '_blank', windowFeatures);
  
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice #${billNumber}</title>
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 10px;
              margin: 0;
              font-size: 12px;
            }
            .invoice-container {
              max-width: 100%;
              margin: 0 auto;
              border: 1px solid #000;
              padding: 10px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 5px;
            }
            .logo {
              width: 60px;
              height: 60px;
            }
            .company-details {
              text-align: right;
              font-size: 10px;
            }
            .invoice-title {
              text-align: center;
              font-weight: bold;
              margin: 5px 0;
              font-size: 14px;
            }
            h2 {
              margin-bottom: 5px;
              font-size: 14px;
            }
            h3 {
              margin-bottom: 3px;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 10px;
            }
            th, td {
              padding: 3px 5px;
              text-align: left;
              border: 1px solid #ddd;
              font-size: 10px;
            }
            th {
              background-color: #4A7ADB;
              color: white;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .section-header {
              background-color: #4A7ADB;
              color: white;
              padding: 3px 5px;
              margin: 5px 0;
              font-weight: bold;
            }
            .bill-sections {
              display: flex;
              justify-content: space-between;
            }
            .bill-to {
              width: 48%;
            }
            .invoice-details {
              width: 48%;
              text-align: right;
            }
            .separator {
              border-top: 1px solid #000;
              margin: 10px 0;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              margin-top: 15px;
            }
            .bank-details, .signature {
              width: 48%;
            }
            .terms {
              margin: 10px 0;
            }
            .amount-section {
              display: flex;
              justify-content: space-between;
            }
            .amount-words {
              width: 60%;
            }
            .amount-table {
              width: 38%;
            }
            .amount-table table {
              border-collapse: collapse;
              width: 100%;
            }
            .amount-table td {
              padding: 3px;
              border: 1px solid #ddd;
            }
            .signature-image {
              max-width: 100px;
              max-height: 40px;
            }
            p {
              margin: 2px 0;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};
