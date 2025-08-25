import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { HairAnalysisResult } from './ai-service';

// Define colors for Hairmama branding
const COLORS = {
  primary: '#6366f1', // Indigo
  secondary: '#8b5cf6', // Purple
  accent: '#ec4899', // Pink
  success: '#10b981', // Emerald
  warning: '#f59e0b', // Amber
  danger: '#ef4444', // Red
  dark: '#1f2937', // Gray-800
  light: '#f9fafb', // Gray-50
  white: '#ffffff',
  border: '#e5e7eb', // Gray-200
};

export const generateHairAnalysisPDF = (analysisResults: HairAnalysisResult, userName?: string) => {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: 'Hairmama Hair Analysis Report',
    subject: 'AI-Powered Hair Health Assessment',
    author: 'Hairmama AI',
    creator: 'Hairmama',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add text with proper wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, y: number) => {
    doc.setFillColor(COLORS.primary);
    doc.rect(margin, y - 5, 3, 15, 'F');
    doc.setTextColor(COLORS.primary);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(title, margin + 10, y + 5);
    doc.setTextColor(COLORS.dark);
    doc.setFont(undefined, 'normal');
    return y + 20;
  };

  // Helper function to add health score circle
  const addHealthScoreCircle = (score: number, x: number, y: number) => {
    const radius = 25;
    const centerX = x + radius;
    const centerY = y + radius;
    
    // Determine color based on score
    let color;
    if (score >= 80) color = COLORS.success;
    else if (score >= 60) color = COLORS.warning;
    else if (score >= 40) color = COLORS.danger;
    else color = COLORS.danger;
    
    // Draw circle
    doc.setDrawColor(color);
    doc.setLineWidth(3);
    doc.circle(centerX, centerY, radius, 'S');
    
    // Draw score text
    doc.setTextColor(color);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(score.toString(), centerX, centerY + 3, { align: 'center' });
    
    // Draw "/100" text
    doc.setFontSize(10);
    doc.text('/100', centerX, centerY + 15, { align: 'center' });
    
    doc.setTextColor(COLORS.dark);
    doc.setFont(undefined, 'normal');
  };

  // Page 1: Header and Overview
  // Logo/Title area
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(COLORS.white);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('Hairmama', margin, 25);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('AI-Powered Hair Health Analysis', margin, 35);
  
  yPosition = 60;

  // Report title
  doc.setTextColor(COLORS.dark);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Hair Analysis Report', margin, yPosition);
  yPosition += 15;

  // Report metadata
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(COLORS.dark);
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Generated on: ${reportDate}`, margin, yPosition);
  yPosition += 8;
  doc.text(`AI Model: ${analysisResults.modelName}`, margin, yPosition);
  yPosition += 8;
  if (userName) {
    doc.text(`Client: ${userName}`, margin, yPosition);
    yPosition += 8;
  }
  yPosition += 10;

  // Health Score Section
  yPosition = addSectionHeader('Health Score Overview', yPosition);
  
  // Add health score circle
  addHealthScoreCircle(analysisResults.healthScore, margin, yPosition);
  
  // Health status text
  const getHealthStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };
  
  doc.setTextColor(COLORS.dark);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Status: ${getHealthStatus(analysisResults.healthScore)}`, margin + 60, yPosition + 15);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Condition: ${analysisResults.condition}`, margin + 60, yPosition + 25);
  
  yPosition += 60;

  // Hair Details Section
  yPosition = addSectionHeader('Hair Details', yPosition);
  
  const hairDetails = [
    ['Texture', analysisResults.details.texture],
    ['Thickness', analysisResults.details.thickness],
    ['Curl Pattern', analysisResults.details.curlPattern],
    ['Moisture', analysisResults.details.moisture],
    ['Shine', analysisResults.details.shine],
    ['Color', `${analysisResults.details.color} (${analysisResults.details.colorCondition})`],
    ['Length', analysisResults.details.length],
    ['Growth Stage', analysisResults.details.growthStage],
    ['Damage Level', analysisResults.details.damage],
    ['Density', analysisResults.details.density],
    ['Volume', analysisResults.details.volume],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Property', 'Value']],
    body: hairDetails,
    theme: 'grid',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 60 },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  // Damage Types Section
  if (analysisResults.details.damageTypes.length > 0) {
    yPosition = addSectionHeader('Damage Types', yPosition);
    const damageText = analysisResults.details.damageTypes.join(', ');
    yPosition = addWrappedText(damageText, margin, yPosition, contentWidth, 11);
    yPosition += 10;
  }

  // Scalp Health Section
  if (analysisResults.details.scalpIssues.length > 0) {
    yPosition = addSectionHeader('Scalp Issues', yPosition);
    const scalpText = analysisResults.details.scalpIssues.join(', ');
    yPosition = addWrappedText(scalpText, margin, yPosition, contentWidth, 11);
    yPosition += 10;
  }

  // Check if we need a new page for insights
  if (yPosition > pageHeight - 150) {
    doc.addPage();
    yPosition = margin;
  }

  // Insights Section
  yPosition = addSectionHeader('AI Insights', yPosition);
  
  const insights = [
    ['Texture', analysisResults.insights.textureInsights],
    ['Moisture', analysisResults.insights.moistureInsights],
    ['Color', analysisResults.insights.colorInsights],
    ['Length', analysisResults.insights.lengthInsights],
    ['Damage', analysisResults.insights.damageInsights],
    ['Scalp', analysisResults.insights.scalpInsights],
    ['Density', analysisResults.insights.densityInsights],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Aspect', 'Insight']],
    body: insights,
    theme: 'striped',
    headStyles: {
      fillColor: [139, 92, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 25 },
      1: { cellWidth: 75 },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page for recommendations
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  // Recommendations Section
  yPosition = addSectionHeader('Recommendations', yPosition);

  const recommendationCategories = [
    { title: 'Immediate Actions', items: analysisResults.recommendations.immediate },
    { title: 'Long-term Care', items: analysisResults.recommendations.longTerm },
    { title: 'Preventive Care', items: analysisResults.recommendations.preventive },
    { title: 'Product Recommendations', items: analysisResults.recommendations.products },
    { title: 'Natural Remedies', items: analysisResults.recommendations.naturalRemedies },
    { title: 'Protective Styles', items: analysisResults.recommendations.protectiveStyles },
  ];

  recommendationCategories.forEach((category, index) => {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(COLORS.secondary);
    doc.text(category.title, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(COLORS.dark);
    
    category.items.forEach((item, itemIndex) => {
      const itemText = `${itemIndex + 1}. ${item}`;
      yPosition = addWrappedText(itemText, margin + 5, yPosition, contentWidth - 5, 10);
      yPosition += 3;
    });
    
    yPosition += 8;
  });

  // Check if we need a new page for comprehensive analysis
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  // Comprehensive Analysis Section
  yPosition = addSectionHeader('Comprehensive Analysis', yPosition);
  yPosition = addWrappedText(analysisResults.analysis, margin, yPosition, contentWidth, 11);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(COLORS.border);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(COLORS.dark);
    doc.text(`Page ${i} of ${totalPages}`, margin, pageHeight - 20);
    doc.text('Generated by Hairmama AI', pageWidth - margin, pageHeight - 20, { align: 'right' });
    doc.text('hairmama.ai', pageWidth - margin, pageHeight - 15, { align: 'right' });
  }

  return doc;
};

export const downloadPDF = (analysisResults: HairAnalysisResult, userName?: string) => {
  const doc = generateHairAnalysisPDF(analysisResults, userName);
  const fileName = `hairmama-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};


