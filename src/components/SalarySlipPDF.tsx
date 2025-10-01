import type React from "react"
import { Document, Page, Text, View, StyleSheet, Image, pdf } from "@react-pdf/renderer"
import logo from '../../public/images/corporate-link-logo.png';

// Brand palette to mimic the reference JPEG (max 5 colors)
const BRAND_BLUE = "#3B82F6" // primary blue
const BRAND_CYAN = "#22D3EE" // cyan accent (subtle use)
const BRAND_MAGENTA = "#E91E63" // magenta/pink accent
const NEUTRAL_DARK = "#0F172A" // slate-900
const NEUTRAL_LIGHT = "#F3F4F6" // gray-100
const BODY_MAROON = "#7A2248" // maroon-like tone for text (echoes JPEG body)

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    fontSize: 10,
    fontFamily: "Helvetica",
    borderWidth: 1, // thin border around the page
    borderColor: NEUTRAL_DARK,
  },

  // Decorative header accents inspired by the reference
  headerDecor: {
    position: "relative",
    minHeight: 120,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 32,
  },
  topBarLeft: {
    position: "absolute",
    left: 0,
    top: 10,
    width: 200,
    height: 18,
    backgroundColor: BRAND_BLUE,
  },
  topBarRight: {
    position: "absolute",
    right: 0,
    top: 34,
    width: 150,
    height: 12,
    backgroundColor: BRAND_CYAN,
  },
  // Header content: big SALARY SLIP on the left, employee identity on the right
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "column",
    gap: 6,
  },
  slipTitle: {
    fontSize: 28,
    color: BRAND_BLUE,
    fontWeight: 700,
    letterSpacing: 1,
  },
  slipSubId: {
    marginTop: 2,
    color: "#60A5FA",
  },

  headerRight: {
    alignItems: "flex-end",
  },
  identityName: {
    fontSize: 14,
    color: BRAND_MAGENTA,
    fontWeight: 700,
  },
  identityLines: {
    marginTop: 4,
    color: NEUTRAL_DARK,
    textAlign: "right",
  },

  // Company block (top-left small brand)
  companyBlock: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  companyName: {
    fontSize: 12,
    color: NEUTRAL_DARK,
    fontWeight: 700,
  },

  // Employee info (kept from original, visually simplified to align with reference spacing)
  employeeSection: {
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    gap: 24,
  },
  employeeColumn: { flex: 1 },
  employeeRow: { flexDirection: "row", marginBottom: 8 },
  employeeLabel: { width: 120, color: "#374151", fontWeight: 600 },
  employeeValue: { flex: 1, color: "#374151" },

  // Section header "ribbon" like the reference table header
  columnRibbon: {
    alignSelf: "stretch",
    backgroundColor: BRAND_BLUE,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  columnRibbonText: {
    color: "#ffffff",
    fontWeight: 700,
    letterSpacing: 0.5,
  },

  // Two-column main table wrapper (Earnings | Deductions)
  tableSection: {
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  mainTable: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  // Earnings
  earningsSection: { flex: 1 },
  earningsHeader: { paddingVertical: 0 }, // replaced by sectionHeaderPill
  earningsContent: { backgroundColor: NEUTRAL_LIGHT },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cellSerial: {
    width: 48,
    textAlign: "center",
    paddingVertical: 10,
    backgroundColor: "#E5E7EB",
    fontWeight: 600,
    borderRightWidth: 1,
    borderRightColor: "#CBD5E1",
    color: BODY_MAROON, // echo JPEG text tone
  },
  cellDesc: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    color: BODY_MAROON,
  },
  cellAmount: {
    width: 70,
    textAlign: "center",
    paddingVertical: 10,
    fontWeight: 700,
    color: BRAND_MAGENTA, // keeps the magenta emphasis
  },
  rowHighlight: { backgroundColor: "#EAEFFB" },

  // Deductions
  deductionsSection: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
  },

  // Summary box on the right, like invoice totals (mapped to salary fields)
  summaryWrap: {
    paddingHorizontal: 32,
    paddingTop: 10,
    alignItems: "flex-end",
  },
  summaryBox: {
    width: 240,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingTop: 8,
    gap: 4,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  summaryLabel: { color: BODY_MAROON }, // align with JPEG body tone
  summaryValue: { color: NEUTRAL_DARK, fontWeight: 700 },
  summaryGrand: { fontWeight: 800 },

  // Signature
  signatureSection: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 18,
    paddingRight: 220,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signatureText: { color: "#374151", fontWeight: 600 },
})

interface SalarySlipData {
  name: string
  designation: string
  location: string
  account: string
  grossSalary: number
  fuelEntitlement: number | null
  fuelRate: number
  fuelAmount: number
  commissionAmount: number
  overtimeHours: number
  overtimeAmount: number
  sundayCount: number
  sundayAmount: number
  sundayFuel: number
  leaveCount: number
  leaveDeduction: number
  halfDayCount: number
  halfDayDeduction: number
  loanDeduction: number
  netSalary: number
  totalEarnings: number
  totalDeductions: number
  monthName: string
  year: number
  companyName: string
  generatedDate: string
  id?: string
  month?: number
}

interface SalarySlipPDFProps {
  data: SalarySlipData
}

const SalarySlipPDF: React.FC<SalarySlipPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header geometric accents */}
      <View style={styles.headerDecor}>

        <View style={styles.headerContent}>
          {/* Left: Logo above company name */}
          <View style={styles.headerLeft}>
            <Image src={logo.src} style={{ width: 48, height: 48 }} />
            <Text style={styles.companyName}>Corporate Link</Text>
          </View>

          {/* Right: Payslip heading only */}
          <View style={styles.headerRight}>
            <Text style={styles.slipTitle}>Payslip</Text>
          </View>
        </View>
      </View>


      {/* Employee info rows (kept same fields, condensed spacing) */}
      <View style={styles.employeeSection}>
        <View style={styles.employeeColumn}>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Employee Name :</Text>
            <Text style={styles.employeeValue}>{data.name}</Text>
          </View>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Employee ID :</Text>
            <Text style={styles.employeeValue}>{data.id || "N/A"}</Text>
          </View>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Job Title :</Text>
            <Text style={styles.employeeValue}>{data.designation}</Text>
          </View>
        </View>

        <View style={styles.employeeColumn}>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Salary Month :</Text>
            <Text style={styles.employeeValue}>
              {data.monthName} {data.year}
            </Text>
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

      {/* Tables with ribbon headers like the JPEG */}
      <View style={styles.tableSection}>
        <View style={styles.mainTable}>
          <View style={styles.earningsSection}>
            <View style={styles.columnRibbon}>
              <Text style={styles.columnRibbonText}>EARNINGS</Text>
            </View>
            <View style={styles.earningsContent}>
              <View style={styles.row}>
                <Text style={styles.cellSerial}>01</Text>
                <Text style={styles.cellDesc}>Gross Salary</Text>
                <Text style={styles.cellAmount}>{data.grossSalary.toLocaleString()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellSerial}>02</Text>
                <Text style={styles.cellDesc}>Fuel Allowance</Text>
                <Text style={styles.cellAmount}>{data.fuelAmount.toLocaleString()}</Text>
              </View>
              {/* <View style={styles.row}>
                <Text style={styles.cellSerial}>03</Text>
                <Text style={styles.cellDesc}>Medical Allowance</Text>
                <Text style={styles.cellAmount}>{data.commissionAmount.toLocaleString()}</Text>
              </View> */}
              <View style={styles.row}>
                <Text style={styles.cellSerial}>03</Text>
                <Text style={styles.cellDesc}>Additional</Text>
                <Text style={styles.cellAmount}>{( data.overtimeAmount + data.sundayAmount).toLocaleString()}</Text>
              </View>
              <View style={[styles.row, styles.rowHighlight]}>
                <Text style={styles.cellSerial}>04</Text>
                <Text style={styles.cellDesc}>Bonus / Commission</Text>
                <Text style={styles.cellAmount}>{data.commissionAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellSerial}>05</Text>
                <Text style={styles.cellDesc}>Total Earnings</Text>
                <Text style={styles.cellAmount}>{data.totalEarnings.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.deductionsSection}>
            {/* Deductions column */}
            <View style={styles.columnRibbon}>
              <Text style={styles.columnRibbonText}>DEDUCTIONS</Text>
            </View>
            <View style={styles.earningsContent}>
              <View style={styles.row}>
                <Text style={styles.cellDesc}>Late Deduction</Text>
                <Text style={styles.cellAmount}>{data.halfDayDeduction.toLocaleString()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellDesc}>Absent Deduction</Text>
                <Text style={styles.cellAmount}>{data.leaveDeduction.toLocaleString()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellDesc}>Including Tax</Text>
                <Text style={styles.cellAmount}>{data.loanDeduction.toLocaleString()}</Text>
              </View>
              <View style={[styles.row, styles.rowHighlight]}>
                <Text style={styles.cellDesc}>Total Deductions</Text>
                <Text style={styles.cellAmount}>{data.totalDeductions.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Right-side summary box (mirrors invoice's subtotal/tax/total pattern) */}
      <View style={styles.summaryWrap}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
            <Text style={styles.summaryValue}>{data.totalEarnings.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Deductions</Text>
            <Text style={styles.summaryValue}>{data.totalDeductions.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.summaryGrand]}>Net Salary</Text>
            <Text style={[styles.summaryValue, styles.summaryGrand]}>{data.netSalary.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Signature (kept) */}
      <View style={styles.signatureSection}>
        <Text style={styles.signatureText}>HR Sign</Text>
      </View>
    </Page>
  </Document>
)


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
  try {
    console.log('PDF Generation: Starting with data:', data);

    const doc = <SalarySlipPDF data={data} />;
    const asPdf = pdf(doc);

    console.log('PDF Generation: Creating blob...');
    const blob = await asPdf.toBlob();

    console.log('PDF Generation: Blob created, size:', blob.size);

    // Open in new tab
    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, '_blank');

    if (!newTab) {
      console.log('PDF Generation: Popup blocked, falling back to download');
      // Fallback to download if popup blocked
      const link = document.createElement('a');
      link.href = url;
      link.download = `salary-slip-${data.name}-${data.monthName}-${data.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log('PDF Generation: Opened in new tab successfully');
    }

    // Clean up after a delay
    setTimeout(() => URL.revokeObjectURL(url), 10000);

    console.log('PDF Generation: Completed successfully');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
}; export default SalarySlipPDF;