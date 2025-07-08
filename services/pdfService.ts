import { FormData } from '../types';

// This is a global declaration for jsPDF, which is loaded from a script tag in index.html
declare const jspdf: any;

export const generateConfirmationPDF = (formData: FormData): void => {
  if (typeof jspdf === 'undefined') {
    console.error('jsPDF not loaded');
    alert('A apărut o eroare la generarea PDF-ului. Vă rugăm reîncercați.');
    return;
  }

  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Confirmare Programare Medicala", 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text("Acesta este un document generat automat.", 105, 30, { align: 'center' });
  doc.line(20, 35, 190, 35);
  doc.setFontSize(14);
  doc.text("Detalii Programare:", 20, 45);
  doc.setFontSize(12);
  doc.text(`Nume Pacient: ${formData.fullName}`, 20, 55);
  doc.text(`CNP: ${formData.cnp.substring(0, 7)}******`, 20, 65);
  doc.text(`Specializare: ${formData.specialization}`, 20, 75);
  doc.text(`Medic: ${formData.doctor}`, 20, 85);
  doc.text(`Data: ${formData.appointmentDate?.toLocaleDateString('ro-RO')}`, 20, 95);
  doc.text(`Ora: ${formData.appointmentTime}`, 20, 105);
  doc.text("Motivul vizitei:", 20, 115);
  const symptomsLines = doc.splitTextToSize(formData.symptoms, 170);
  doc.text(symptomsLines, 20, 122);
  const finalY = 122 + (symptomsLines.length * 7) + 10;
  doc.line(20, finalY, 190, finalY);
  doc.setFontSize(10);
  doc.text("Vă rugăm să vă prezentați la cabinet cu 10 minute înainte de ora programată.", 20, finalY + 10);
  doc.text("Nu uitați actul de identitate în original și cardul de sănătate.", 20, finalY + 18);
  doc.save(`Confirmare_Programare_${formData.fullName.replace(/\s/g, '_')}.pdf`);
};
