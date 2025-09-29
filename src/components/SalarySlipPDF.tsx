import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Define styles for the PDF that match slip.tsx design
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  // Header Section with Company Branding
  headerSection: {
    backgroundColor: '#f3f4f6', // gray-100
    padding: 32,
    position: 'relative',
    minHeight: 120,
  },
  // Company Logo and Name
  companyLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  companyTagline: {
    textAlign: 'center',
    marginTop: 8,
  },
  companyTaglineText: {
    fontSize: 14,
    fontWeight: 600,
  },
  taglineIT: {
    color: '#000000',
  },
  taglineService: {
    color: '#fbbf24', // yellow-400
  },
  // PaySlip Header
  payslipHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  payslipHeaderContainer: {
    backgroundColor: '#000000',
    color: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  payText: {
    color: '#fbbf24', // yellow-400
    fontSize: 20,
    fontWeight: 'bold',
  },
  slipText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#000000',
    paddingHorizontal: 8,
  },
  // Employee Information
  employeeSection: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    flexDirection: 'row',
    gap: 32,
  },
  employeeColumn: {
    flex: 1,
  },
  employeeRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  employeeLabel: {
    fontWeight: 600,
    color: '#374151', // gray-800
    width: 120,
  },
  employeeValue: {
    color: '#374151', // gray-800
    flex: 1,
  },
  // Earnings and Deductions Table
  tableSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  mainTable: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
  },
  // Earnings Section
  earningsSection: {
    flex: 1,
  },
  earningsHeader: {
    backgroundColor: '#fbbf24', // yellow-400
    textAlign: 'center',
    paddingVertical: 12,
  },
  earningsHeaderContent: {
    flexDirection: 'row',
  },
  serialHeader: {
    width: 48,
    backgroundColor: '#d1d5db', // gray-300
    color: '#000000',
    fontWeight: 'bold',
    paddingVertical: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#9ca3af', // gray-400
  },
  earningsHeaderTitle: {
    flex: 1,
    color: '#000000',
    fontWeight: 'bold',
    paddingVertical: 8,
    textAlign: 'center',
  },
  earningsContent: {
    backgroundColor: '#f3f4f6', // gray-100
  },
  earningsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db', // gray-300
  },
  earningsRowLast: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb', // gray-200
  },
  serialCell: {
    width: 48,
    backgroundColor: '#d1d5db', // gray-300
    textAlign: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#9ca3af', // gray-400
    fontWeight: 600,
  },
  earningsDescCell: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#d1d5db', // gray-300
  },
  earningsAmountCell: {
    width: 60,
    textAlign: 'center',
    paddingVertical: 12,
    fontWeight: 600,
  },
  earningsDescCellBold: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#d1d5db', // gray-300
    fontWeight: 600,
  },
  earningsAmountCellBold: {
    width: 60,
    textAlign: 'center',
    paddingVertical: 12,
    fontWeight: 'bold',
  },
  // Deductions Section
  deductionsSection: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#d1d5db', // gray-300
  },
  deductionsHeader: {
    backgroundColor: '#fbbf24', // yellow-400
    textAlign: 'center',
    paddingVertical: 12,
  },
  deductionsHeaderTitle: {
    color: '#000000',
    fontWeight: 'bold',
    paddingVertical: 8,
    textAlign: 'center',
  },
  deductionsContent: {
    backgroundColor: '#f3f4f6', // gray-100
  },
  deductionsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db', // gray-300
  },
  deductionsRowSpecial: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb', // gray-200
  },
  deductionsDescCell: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#d1d5db', // gray-300
  },
  deductionsAmountCell: {
    width: 60,
    textAlign: 'center',
    paddingVertical: 12,
    fontWeight: 600,
  },
  deductionsDescCellBold: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#d1d5db', // gray-300
    fontWeight: 600,
  },
  deductionsAmountCellBold: {
    width: 60,
    textAlign: 'center',
    paddingVertical: 12,
    fontWeight: 'bold',
  },
  // HR Signature
  signatureSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signatureText: {
    fontWeight: 600,
    color: '#374151', // gray-800
    textAlign: 'right',
  },
  // Footer
  footer: {
    backgroundColor: '#000000',
    color: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLeft: {
    fontSize: 9,
  },
  footerRight: {
    fontSize: 9,
    textAlign: 'right',
  },
  footerText: {
    color: '#fbbf24', // yellow-400
    marginBottom: 2,
  },
});

interface SalarySlipData {
  name: string;
  designation: string;
  location: string;
  account: string;
  grossSalary: number;
  fuelEntitlement: number | null;
  fuelRate: number;
  fuelAmount: number;
  commissionAmount: number;
  overtimeHours: number;
  overtimeAmount: number;
  sundayCount: number;
  sundayAmount: number;
  sundayFuel: number;
  leaveCount: number;
  leaveDeduction: number;
  halfDayCount: number;
  halfDayDeduction: number;
  loanDeduction: number;
  netSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  monthName: string;
  year: number;
  companyName: string;
  generatedDate: string;
  id?: string;
  month?: number;
}

interface SalarySlipPDFProps {
  data: SalarySlipData;
}

const SalarySlipPDF: React.FC<SalarySlipPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section with Company Branding */}
      <View style={styles.headerSection}>
        {/* Company Logo and Name */}
        <View style={styles.companyLogo}>
          <Text style={styles.companyName}>MARKSOF</Text>
        </View>

        <View style={styles.companyTagline}>
          <Text style={styles.companyTaglineText}>
            <Text style={styles.taglineIT}>IT INNOVATION</Text>{' '}
            <Text style={styles.taglineService}>AS A SERVICE</Text>
          </Text>
        </View>
      </View>

      {/* PaySlip Header */}
      <View style={styles.payslipHeader}>
        <View style={styles.payslipHeaderContainer}>
          <Text style={styles.payText}>PAY</Text>
          <Text style={styles.slipText}>SLIP</Text>
        </View>
      </View>

      {/* Employee Information */}
      <View style={styles.employeeSection}>
        <View style={styles.employeeColumn}>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Employee Name :</Text>
            <Text style={styles.employeeValue}>{data.name}</Text>
          </View>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Employee ID :</Text>
            <Text style={styles.employeeValue}>{data.id || 'N/A'}</Text>
          </View>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Job Title :</Text>
            <Text style={styles.employeeValue}>{data.designation}</Text>
          </View>
        </View>

        <View style={styles.employeeColumn}>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Salary Date :</Text>
            <Text style={styles.employeeValue}>{data.monthName}</Text>
          </View>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Mode of Payment :</Text>
            <Text style={styles.employeeValue}>Online</Text>
          </View>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Leaves Available :</Text>
            <Text style={styles.employeeValue}>{data.leaveCount} / 12</Text>
          </View>
        </View>
      </View>

      {/* Earnings and Deductions Table */}
      <View style={styles.tableSection}>
        <View style={styles.mainTable}>
          {/* Earnings Section */}
          <View style={styles.earningsSection}>
            {/* Earnings Header */}
            <View style={styles.earningsHeader}>
              <View style={styles.earningsHeaderContent}>
                <Text style={styles.serialHeader}>S.L</Text>
                <Text style={styles.earningsHeaderTitle}>EARNINGS</Text>
              </View>
            </View>

            {/* Earnings Rows */}
            <View style={styles.earningsContent}>
              <View style={styles.earningsRow}>
                <Text style={styles.serialCell}>01</Text>
                <Text style={styles.earningsDescCell}>Basic Salary</Text>
                <Text style={styles.earningsAmountCell}>{data.grossSalary.toLocaleString()}</Text>
              </View>
              <View style={styles.earningsRow}>
                <Text style={styles.serialCell}>02</Text>
                <Text style={styles.earningsDescCell}>Fuel Allowance</Text>
                <Text style={styles.earningsAmountCell}>{data.fuelAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.earningsRow}>
                <Text style={styles.serialCell}>03</Text>
                <Text style={styles.earningsDescCell}>Medical Allowance</Text>
                <Text style={styles.earningsAmountCell}>{data.commissionAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.earningsRow}>
                <Text style={styles.serialCell}>04</Text>
                <Text style={styles.earningsDescCell}>Bonus</Text>
                <Text style={styles.earningsAmountCell}>{data.overtimeAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.earningsRowLast}>
                <Text style={styles.serialCell}>05</Text>
                <Text style={styles.earningsDescCellBold}>Total Amount</Text>
                <Text style={styles.earningsAmountCellBold}>{data.totalEarnings.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Deductions Section */}
          <View style={styles.deductionsSection}>
            {/* Deductions Header */}
            <View style={styles.deductionsHeader}>
              <Text style={styles.deductionsHeaderTitle}>DEDUCTION</Text>
            </View>

            {/* Deductions Rows */}
            <View style={styles.deductionsContent}>
              <View style={styles.deductionsRow}>
                <Text style={styles.deductionsDescCell}>Late Deduction</Text>
                <Text style={styles.deductionsAmountCell}>{data.halfDayDeduction.toLocaleString()}</Text>
              </View>
              <View style={styles.deductionsRow}>
                <Text style={styles.deductionsDescCell}>Absent Deduction</Text>
                <Text style={styles.deductionsAmountCell}>{data.leaveDeduction.toLocaleString()}</Text>
              </View>
              <View style={styles.deductionsRow}>
                <Text style={styles.deductionsDescCell}>Including Tax</Text>
                <Text style={styles.deductionsAmountCell}>{data.loanDeduction.toLocaleString()}</Text>
              </View>
              <View style={styles.deductionsRow}>
                <Text style={styles.deductionsDescCellBold}>Total Deduction</Text>
                <Text style={styles.deductionsAmountCellBold}>{data.totalDeductions.toLocaleString()}</Text>
              </View>
              <View style={styles.deductionsRowSpecial}>
                <Text style={styles.deductionsDescCellBold}>Amount Payable</Text>
                <Text style={styles.deductionsAmountCellBold}>{data.netSalary.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* HR Signature */}
      <View style={styles.signatureSection}>
        <Text style={styles.signatureText}>Hr Sign</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerText}>Plot # LS16 Ground Floor</Text>
          <Text style={styles.footerText}>Sector 5E, Orangi Town</Text>
          <Text style={styles.footerText}>Karachi 75800, Pakistan</Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.footerText}>www.maksof.com</Text>
          <Text style={styles.footerText}>info@maksof.com</Text>
          <Text style={styles.footerText}>(+92) 213-6661-104</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// Utility function to generate and download PDF
export const generateAndDownloadPDF = async (data: SalarySlipData) => {
  const doc = <SalarySlipPDF data={data} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `salary-slip-${data.name}-${data.monthName}-${data.year}.pdf`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
  
  return blob;
};

// Utility function to open PDF in new tab
export const generateAndOpenPDF = async (data: SalarySlipData) => {
  const doc = <SalarySlipPDF data={data} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  
  // Open in new tab
  const url = URL.createObjectURL(blob);
  const newTab = window.open(url, '_blank');
  
  if (!newTab) {
    // Fallback to download if popup blocked
    const link = document.createElement('a');
    link.href = url;
    link.download = `salary-slip-${data.name}-${data.monthName}-${data.year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Clean up after a delay
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  
  return blob;
};

export default SalarySlipPDF;