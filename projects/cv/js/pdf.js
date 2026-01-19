/**
 * PDF Export Module
 * Handles PDF generation using jsPDF
 */

const PDFExport = {
  /**
   * Export resume as PDF
   */
  async exportPDF(resumeData, templateId) {
    try {
      // Check if jsPDF is loaded
      if (typeof window.jspdf === 'undefined') {
        throw new Error('jsPDF library not loaded');
      }

      Utils.showToast('Generating PDF...', 'info');

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      });

      // Get the resume HTML content
      const htmlContent = Templates.render(resumeData, templateId);
      
  // Create temporary container and sanitize HTML before inserting into the DOM
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.width = '8.5in';
  // Use sanitizer to remove scripts and unsafe attributes from template HTML
  Utils.sanitizeAndSetInnerHTML(tempContainer, htmlContent);
  document.body.appendChild(tempContainer);

      // Use html2canvas if available, otherwise fallback to text-based PDF
      if (typeof html2canvas !== 'undefined') {
        await this.exportWithCanvas(doc, tempContainer, resumeData);
      } else {
        this.exportTextBased(doc, resumeData, templateId);
      }

      // Cleanup
      document.body.removeChild(tempContainer);

      // Generate filename
      const filename = `${resumeData.content.contact.fullName || 'Resume'} - Resume.pdf`;
      
      // Save PDF
      doc.save(filename);
      Utils.showToast('PDF exported successfully!', 'success');
      
      return true;
    } catch (error) {
      console.error('PDF Export Error:', error);
      Utils.showToast('Failed to export PDF: ' + error.message, 'error');
      return false;
    }
  },

  /**
   * Export using canvas (better quality but requires html2canvas)
   */
  async exportWithCanvas(doc, container, resumeData) {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 8.5;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  },

  /**
   * Fallback text-based PDF export (works without html2canvas)
   */
  exportTextBased(doc, resumeData, templateId) {
    const { contact, summary, experience, education, skills } = resumeData.content;
    const margin = 0.75;
    let yPosition = margin;
    const pageHeight = 11;
    const pageWidth = 8.5;

    // Set font
    doc.setFont('helvetica');

    // Helper to check page break
    const checkPageBreak = (neededSpace) => {
      if (yPosition + neededSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(contact.fullName || 'Your Name', margin, yPosition);
    yPosition += 0.4;

    // Contact info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contactInfo = [
      contact.email,
      contact.phone,
      contact.location,
      contact.linkedin,
      contact.website
    ].filter(Boolean).join(' | ');
    
    if (contactInfo) {
      const lines = doc.splitTextToSize(contactInfo, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 0.15 + 0.3;
    }

    // Divider
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.02);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 0.3;

    // Professional Summary
    if (summary) {
      checkPageBreak(0.8);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
      yPosition += 0.25;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(summary, pageWidth - 2 * margin);
      doc.text(summaryLines, margin, yPosition);
      yPosition += summaryLines.length * 0.15 + 0.3;
    }

    // Work Experience
    if (experience && experience.length > 0) {
      checkPageBreak(1);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('WORK EXPERIENCE', margin, yPosition);
      yPosition += 0.3;

      experience.forEach(exp => {
        checkPageBreak(0.8);
        
        // Job title and dates
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.title || '', margin, yPosition);
        
        const dateRange = this.formatDateRange(exp.startDate, exp.endDate, exp.current);
        if (dateRange) {
          const dateWidth = doc.getTextWidth(dateRange);
          doc.text(dateRange, pageWidth - margin - dateWidth, yPosition);
        }
        yPosition += 0.2;

        // Company and location
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        const companyText = exp.company + (exp.location ? `, ${exp.location}` : '');
        doc.text(companyText, margin, yPosition);
        yPosition += 0.2;

        // Bullets
        if (exp.bullets && exp.bullets.length > 0) {
          doc.setFont('helvetica', 'normal');
          exp.bullets.forEach(bullet => {
            checkPageBreak(0.3);
            const bulletLines = doc.splitTextToSize('• ' + bullet, pageWidth - 2 * margin - 0.2);
            doc.text(bulletLines, margin + 0.2, yPosition);
            yPosition += bulletLines.length * 0.15 + 0.05;
          });
        }
        yPosition += 0.15;
      });
    }

    // Education
    if (education && education.length > 0) {
      checkPageBreak(1);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EDUCATION', margin, yPosition);
      yPosition += 0.3;

      education.forEach(edu => {
        checkPageBreak(0.5);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(edu.degree || '', margin, yPosition);
        
        if (edu.graduationDate) {
          const dateWidth = doc.getTextWidth(edu.graduationDate);
          doc.text(edu.graduationDate, pageWidth - margin - dateWidth, yPosition);
        }
        yPosition += 0.2;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        const schoolText = edu.institution + 
          (edu.location ? `, ${edu.location}` : '') +
          (edu.gpa ? ` | GPA: ${edu.gpa}` : '');
        doc.text(schoolText, margin, yPosition);
        yPosition += 0.25;
      });
    }

    // Skills
    const allSkills = Object.entries(skills || {})
      .filter(([_, skillList]) => skillList && skillList.length > 0);
    
    if (allSkills.length > 0) {
      checkPageBreak(1);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('SKILLS', margin, yPosition);
      yPosition += 0.3;

      doc.setFontSize(10);
      allSkills.forEach(([category, skillList]) => {
        checkPageBreak(0.3);
        doc.setFont('helvetica', 'bold');
        doc.text(category + ':', margin, yPosition);
        
        doc.setFont('helvetica', 'normal');
        const skillsText = skillList.join(', ');
        const skillLines = doc.splitTextToSize(skillsText, pageWidth - 2 * margin - 1);
        doc.text(skillLines, margin + 1, yPosition);
        yPosition += skillLines.length * 0.15 + 0.1;
      });
    }
  },

  /**
   * Format date range for PDF
   */
  formatDateRange(start, end, current) {
    if (!start) return '';
    const startDate = Utils.formatDate(start);
    const endDate = current ? 'Present' : (end ? Utils.formatDate(end) : '');
    return `${startDate} - ${endDate}`;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PDFExport;
}
