// src/utils/pdfUtils.js
import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateBoqPdf = (data, marketPrices, id, summary, cementBrand, paintTypes, tileTypes, formatNumber, getMaterialInfo, getUnitFromKey, formatTitle) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Customized Bill of Quantities", 14, 22);
    
    // Add Project Info
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Project ID: ${id}`, 14, 38);
    
    // Add summary section
    doc.setFontSize(14);
    doc.text("Customization Summary", 14, 48);
    doc.setFontSize(12);
    doc.text(`Original Total Cost: Rs.${formatNumber(summary.originalCost)}`, 14, 56);
    doc.text(`Customized Total Cost: Rs.${formatNumber(summary.customizedCost)}`, 14, 62);
    doc.text(`Difference: ${summary.difference > 0 ? '+' : ''}${formatNumber(summary.difference)}`, 14, 68);
    
    // Add materials selection info
    doc.setFontSize(14);
    doc.text("Customization Details", 14, 78);
    doc.setFontSize(12);
    doc.text(`Selected Cement Brand: ${cementBrand}`, 14, 86);
    
    // Prepare paint selections info
    let yOffset = 92;
    if (Object.keys(paintTypes).length > 0) {
      doc.text("Paint Selections:", 14, yOffset);
      yOffset += 6;
      Object.entries(paintTypes).forEach(([key, value]) => {
        const truncatedKey = key.length > 40 ? key.substring(0, 40) + "..." : key;
        doc.text(`• ${truncatedKey}: ${value}`, 20, yOffset);
        yOffset += 6;
      });
    }
    
    // Prepare tile selections info
    if (Object.keys(tileTypes).length > 0) {
      doc.text("Tile Selections:", 14, yOffset);
      yOffset += 6;
      Object.entries(tileTypes).forEach(([key, value]) => {
        const truncatedKey = key.length > 40 ? key.substring(0, 40) + "..." : key;
        doc.text(`• ${truncatedKey}: ${value}`, 20, yOffset);
        yOffset += 6;
      });
    }
    
    // Add BOQ table data
    yOffset += 8;
    doc.setFontSize(14);
    doc.text("Bill of Quantities", 14, yOffset);
    yOffset += 10;
    
    // Process each category for the table
    Object.keys(data).forEach((category) => {
      // Category header
      doc.setFontSize(12);
      doc.text(formatTitle(category), 14, yOffset);
      yOffset += 8;
      
      // Create table rows
      const tableData = [];
      const tableColumns = [
        { header: 'Materials', dataKey: 'material' },
        { header: 'Qty', dataKey: 'quantity' },
        { header: 'Unit', dataKey: 'unit' },
        { header: 'Original Price', dataKey: 'origPrice' },
        { header: 'Custom Price', dataKey: 'customPrice' },
        { header: 'Custom Cost', dataKey: 'customCost' }
      ];
      
      Object.entries(data[category] || {}).forEach(([key, value]) => {
        const originalMaterialInfo = getMaterialInfo(key);
        const customMaterialInfo = getMaterialInfo(key, true);
        const unit = getUnitFromKey(key) || originalMaterialInfo.unit || "";
        
        const originalPrice = originalMaterialInfo.price !== "Price not found" ? originalMaterialInfo.price : "N/A";
        const customizedPrice = customMaterialInfo.price !== "Price not found" ? customMaterialInfo.price : "N/A";
        const customizedCost = customizedPrice !== "N/A" ? 
          Number(value * customizedPrice).toLocaleString() : "N/A";
        
        tableData.push({
          material: key.charAt(0).toUpperCase() + key.slice(1),
          quantity: formatNumber(value),
          unit: unit,
          origPrice: formatNumber(originalPrice),
          customPrice: formatNumber(customizedPrice),
          customCost: customizedCost
        });
      });
      
      // Add the table for this category
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      
      doc.autoTable({
        startY: yOffset,
        head: [tableColumns.map(col => col.header)],
        body: tableData.map(row => tableColumns.map(col => row[col.dataKey])),
        theme: 'striped',
        headStyles: { fillColor: [66, 133, 244] },
      });
      
      yOffset = doc.lastAutoTable.finalY + 10;
    });
    
    // Save the PDF
    doc.save(`Customized_BOQ_${id}_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};