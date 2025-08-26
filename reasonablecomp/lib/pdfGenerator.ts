import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalcRequest, CalcResult } from './calc/types';

export function generateCompensationPDF(
  request: CalcRequest,
  result: CalcResult,
  generatedAt: Date = new Date()
): jsPDF {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: 'Reasonable Compensation Analysis - Cardiff Tax Pros',
    subject: 'S-Corp Owner Compensation Documentation',
    author: 'Cardiff Tax Pros',
    creator: 'Professional Compensation Analysis Tool'
  });

  // Header with Cardiff Tax Pros branding
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('Cardiff Tax Pros', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('Professional Tax Services', 105, 30, { align: 'center' });
  
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 128); // Blue color
  doc.text('Reasonable Compensation Analysis', 105, 45, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${generatedAt.toLocaleDateString()} at ${generatedAt.toLocaleTimeString()}`, 105, 55, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Documentation for IRS Compliance - ${result.approach.charAt(0).toUpperCase() + result.approach.slice(1)} Approach`, 105, 65, { align: 'center' });

  let yPosition = 80;

  // Company Information Section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 128);
  doc.text('Company Information', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const companyInfo = [
    ['Owner Name:', request.client.name],
    ['State:', request.client.state],
    ['Metro Area:', request.client.metro || 'Not specified'],
    ['Industry:', request.client.industryLabel || 'Not specified'],
    ['Annual Revenue:', `$${request.financials.revenue.toLocaleString()}`],
    ['Net Profit:', `$${request.financials.netProfit.toLocaleString()}`],
    ['Number of Employees:', request.company.employees.toString()],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: companyInfo,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 100 }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Owner Profile Section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 128);
  doc.text('Owner Profile', 20, yPosition);
  yPosition += 10;

  const ownerInfo = [
    ['Years of Experience:', request.owner.experienceYears.toString()],
    ['Hours per Week:', request.owner.hoursPerWeek.toString()],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: ownerInfo,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 100 }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Approach-Specific Sections
  if (result.approach === "market") {
    // Role Distribution Section for Market Approach
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 128);
    doc.text('Role Distribution Analysis', 20, yPosition);
    yPosition += 10;

    const roleData = Object.entries(request.roleMix).map(([role, share]) => [
      role.charAt(0).toUpperCase() + role.slice(1),
      `${(share * 100).toFixed(1)}%`,
      `$${Math.round((result.marketComposite || 0) * share).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Role', 'Time Allocation', 'Market Value']],
      body: roleData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 128], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 50, halign: 'center' },
        2: { cellWidth: 50, halign: 'right' }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  } else {
    // Cost Breakdown Section for Cost Approach
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 128);
    doc.text('Cost Approach Breakdown', 20, yPosition);
    yPosition += 10;

    if (result.costBreakdown) {
      const costData = [
        ['Base Hourly Rate:', `$${result.costBreakdown.baseHourly.toFixed(2)}`],
        ['Overhead (30%):', `$${result.costBreakdown.overhead.toFixed(2)}`],
        ['Profit Margin (20%):', `$${result.costBreakdown.profit.toFixed(2)}`],
        ['Total Hourly Rate:', `$${result.costBreakdown.totalHourly.toFixed(2)}`],
        ['Annual Hours:', `${request.owner.hoursPerWeek * 52}`],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [],
        body: costData,
        theme: 'plain',
        styles: { fontSize: 10 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 80 },
          1: { cellWidth: 80, halign: 'right' }
        }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }
  }

  // Compensation Results Section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 128);
  doc.text('Compensation Analysis Results', 20, yPosition);
  yPosition += 10;

  const compResults = [
    result.approach === "market" 
      ? ['Market Composite:', `$${(result.marketComposite || 0).toLocaleString()}`]
      : ['Total Hourly Rate:', `$${(result.costBreakdown?.totalHourly || 0).toFixed(2)}`],
    ['Target Compensation:', `$${result.target.toLocaleString()}`],
    ['Monthly Target:', `$${Math.round(result.target / 12).toLocaleString()}`],
    ['Low Range (90%):', `$${result.range.low.toLocaleString()}`],
    ['Low Range Monthly:', `$${Math.round(result.range.low / 12).toLocaleString()}`],
    ['High Range (115%):', `$${result.range.high.toLocaleString()}`],
    ['High Range Monthly:', `$${Math.round(result.range.high / 12).toLocaleString()}`],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: compResults,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 100, halign: 'right' }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Modifiers Section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 128);
  doc.text('Applied Modifiers', 20, yPosition);
  yPosition += 10;

  const modifiersData = [
    ['Experience Modifier:', result.modifiers.experience.toFixed(3)],
    ['Company Size Modifier:', result.modifiers.companySize.toFixed(3)],
    ['Revenue Signal Modifier:', result.modifiers.revenueSignal.toFixed(3)],
    ['Hours Normalization:', result.modifiers.hoursNorm.toFixed(3)],
    ['Total Modifier Product:', (result.modifiers.experience * result.modifiers.companySize * result.modifiers.revenueSignal * result.modifiers.hoursNorm).toFixed(3)],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: modifiersData,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 80, halign: 'right' }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Benefits Section
  if (result.benefits.considered) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 128);
    doc.text('Benefits Analysis', 20, yPosition);
    yPosition += 10;

    const benefitsInfo = [
      ['Benefits Included:', 'Yes'],
      ['Annual Benefits Value:', `$${result.benefits.estimatedAnnual.toLocaleString()}`],
      ['Total Compensation + Benefits:', `$${(result.target + result.benefits.estimatedAnnual).toLocaleString()}`],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [],
      body: benefitsInfo,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { cellWidth: 80, halign: 'right' }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Methodology Notes
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 128);
  doc.text('Methodology & Notes', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Add data transparency information
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 128);
  doc.text('Data Sources & Transparency:', 20, yPosition);
  yPosition += 8;
  
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('• BLS (Bureau of Labor Statistics) - Official US Government data (95% confidence)', 25, yPosition);
  yPosition += 6;
  doc.text('• Enhanced market data from multiple public sources with confidence-weighted averaging', 25, yPosition);
  yPosition += 6;
  doc.text('• Industry-specific adjustments based on sector analysis (80% confidence)', 25, yPosition);
  yPosition += 6;
  doc.text('• All data is publicly available and automatically updated every 24 hours', 25, yPosition);
  yPosition += 6;
  doc.text('• Real-time data transparency log available in the application', 25, yPosition);
  yPosition += 10;
  
  // Add calculation notes
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 128);
  doc.text('Calculation Notes:', 20, yPosition);
  yPosition += 8;
  
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  result.notes.forEach((note: string, index: number) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`• ${note}`, 25, yPosition);
    yPosition += 7;
  });

  // IRS Compliance Statement
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 128);
  doc.text('IRS Compliance Statement', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('This document provides supporting evidence for reasonable compensation determination in accordance with IRS guidelines for S-Corporation owners. The analysis is based on market data, industry standards, and professional compensation practices.', 20, yPosition, { maxWidth: 170 });

  yPosition += 20;
  doc.text('This analysis should be retained with your tax records and may be requested by the IRS during audits or examinations.', 20, yPosition, { maxWidth: 170 });

  // Cardiff Tax Pros Contact Information
  yPosition += 25;
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('Need Help with Your S-Corp Taxes?', 105, yPosition, { align: 'center' });
  
  yPosition += 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Cardiff Tax Pros provides comprehensive tax services for S-Corporations:', 20, yPosition, { maxWidth: 170 });
  
  yPosition += 15;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('• Sales Tax Compliance & Filing', 25, yPosition);
  yPosition += 8;
  doc.text('• Payroll Tax Management', 25, yPosition);
  yPosition += 8;
  doc.text('• End of Year Tax Preparation', 25, yPosition);
  yPosition += 8;
  doc.text('• Tax Resolution & IRS Representation', 25, yPosition);
  yPosition += 8;
  doc.text('• S-Corp Formation & Maintenance', 25, yPosition);
  
  yPosition += 15;
  doc.setFontSize(12);
  doc.setTextColor(59, 130, 246);
  doc.text('Contact us today for a free consultation:', 105, yPosition, { align: 'center' });
  
  yPosition += 15;
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('info@cardiff.com', 105, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('www.cardifftax.com', 105, yPosition, { align: 'center' });

  return doc;
}

export function downloadCompensationPDF(
  request: CalcRequest,
  result: CalcResult,
  filename?: string
): void {
  const doc = generateCompensationPDF(request, result);
  const defaultFilename = `compensation-analysis-${request.client.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename || defaultFilename);
}

// New function for our current data structure
export function downloadSimpleCompensationPDF(
  results: any,
  filename?: string
): void {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: 'Reasonable Compensation Analysis - Cardiff Tax Pros',
    subject: 'S-Corp Owner Compensation Documentation',
    author: 'Cardiff Tax Pros',
    creator: 'Professional Compensation Analysis Tool'
  });

  let yPosition = 30;

  // Simple Header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Cardiff Tax Pros', 105, yPosition, { align: 'center' });
  
  yPosition += 15;
  doc.setFontSize(16);
  doc.text('Reasonable Compensation Analysis', 105, yPosition, { align: 'center' });
  
  yPosition += 20;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPosition, { align: 'center' });

  yPosition += 30;

  // Company Information Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Company Information', 20, yPosition);
  yPosition += 15;

  doc.setFontSize(10);
  
  const companyInfo = [
    ['Owner Name:', results.name || 'Not specified'],
    ['State:', results.state || 'Not specified'],
    ['Industry:', results.industry || 'Not specified'],
    ['Approach:', results.approach || 'Market'],
    ['Experience Years:', results.experienceYears ? `${results.experienceYears} years` : 'Not specified'],
    ['Hours per Week:', results.hoursPerWeek ? `${results.hoursPerWeek} hours` : 'Not specified'],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: companyInfo,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 100 }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Role Distribution Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Role Distribution Analysis', 20, yPosition);
  yPosition += 15;

  const roleData = results.roleBreakdown?.map((role: any) => [
    role.role.charAt(0).toUpperCase() + role.role.slice(1),
    `${role.percentage.toFixed(1)}%`,
    `$${role.salary.toLocaleString()}`
  ]) || [];

  if (roleData.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [['Role', 'Time Allocation', 'Salary']],
      body: roleData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 50, halign: 'center' },
        2: { cellWidth: 50, halign: 'right' }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Compensation Ranges Explanation
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Compensation Range Analysis', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(10);
  doc.text('The following ranges provide guidance for reasonable compensation based on market data:', 20, yPosition, { maxWidth: 170 });
  yPosition += 15;
  doc.text('• Conservative: 15% below market rate (lower risk, may be conservative for IRS)', 20, yPosition, { maxWidth: 170 });
  yPosition += 12;
  doc.text('• Market Rate: Based on industry and location data (balanced approach)', 20, yPosition, { maxWidth: 170 });
  yPosition += 12;
  doc.text('• Aggressive: 25% above market rate (higher risk, may need strong justification)', 20, yPosition, { maxWidth: 170 });
  
  yPosition += 20;

  // Compensation Results Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Compensation Analysis Results', 20, yPosition);
  yPosition += 15;

  const compResults = [
    ['Conservative Range (Annual):', `$${results.compensationRanges.low.toLocaleString()}`],
    ['Conservative Range (Monthly):', `$${Math.round(results.compensationRanges.low / 12).toLocaleString()}`],
    ['Market Rate (Annual):', `$${results.compensationRanges.medium.toLocaleString()}`],
    ['Market Rate (Monthly):', `$${Math.round(results.compensationRanges.medium / 12).toLocaleString()}`],
    ['Aggressive Range (Annual):', `$${results.compensationRanges.high.toLocaleString()}`],
    ['Aggressive Range (Monthly):', `$${Math.round(results.compensationRanges.high / 12).toLocaleString()}`],
    ['Benefits Included:', results.benefits > 0 ? `$${results.benefits.toLocaleString()}/year` : 'No'],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: compResults,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 80, halign: 'right' }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // IRS Compliance Statement
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('IRS Compliance Statement', 20, yPosition);
  yPosition += 15;

  doc.setFontSize(10);
  doc.text('This document provides supporting evidence for reasonable compensation determination in accordance with IRS guidelines for S-Corporation owners. The analysis is based on market data, industry standards, and professional compensation practices.', 20, yPosition, { maxWidth: 170 });

  yPosition += 25;
  doc.text('This analysis should be retained with your tax records and may be requested by the IRS during audits or examinations.', 20, yPosition, { maxWidth: 170 });

  // Cardiff Tax Pros Contact Information
  yPosition += 30;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Need Help with Your S-Corp Taxes?', 105, yPosition, { align: 'center' });
  
  yPosition += 20;
  doc.setFontSize(12);
  doc.text('Contact Cardiff Tax Pros for professional tax services:', 20, yPosition);
  
  yPosition += 20;
  doc.setFontSize(12);
  doc.text('Phone: +1 (858) 630-6960', 20, yPosition);
  
  yPosition += 15;
  doc.setFontSize(12);
  doc.text('Email: info@cardiff.com', 20, yPosition);
  
  yPosition += 15;
  doc.setFontSize(12);
  doc.text('Website: www.cardifftax.com', 20, yPosition);

  // Add page numbers if needed
  const pageCount = doc.getNumberOfPages();
  if (pageCount > 1) {
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    }
  }

  const defaultFilename = `compensation-analysis-${results.name?.replace(/\s+/g, '-') || 'owner'}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename || defaultFilename);
} 