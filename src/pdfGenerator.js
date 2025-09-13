// src/pdfGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export const generatePdf = async (user, balance) => {
  if (!user || !user.uid) {
    alert("Maklumat pengguna tidak dijumpai.");
    return;
  }

  const userOvertimeRef = collection(db, 'users', user.uid, 'overtimeEntries');
  const q = query(userOvertimeRef, orderBy('taskDate', 'asc'));
  const querySnapshot = await getDocs(q);
  const entries = [];
  querySnapshot.forEach((doc) => {
    entries.push(doc.data());
  });

  if (entries.length === 0) {
    alert("Tiada rekod kerja lebih masa untuk dijana.");
    return;
  }

  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(10);
  doc.text("PENGIRAAN PERMOHONAN CUTI GANTIAN", 14, 15);
  doc.text("LAMPIRAN A", 250, 15);
  doc.setFontSize(11);
  doc.text(`NAMA: ${user.name}`, 14, 25);
  doc.text(`JABATAN/UNIT: ${user.department}`, 14, 31);

  const tableColumn = ["BIL.", "TUGASAN RASMI /TARIKH/TEMPAT", "TARIKH/ HARI", "TUGASAN YANG DILAKSANAKAN", "TEMPOH (DARI-HINGGA)", "JUMLAH MASA (JAM/MINIT)"];
  const tableRows = [];
  let totalHoursWorked = 0;

  entries.forEach((entry, index) => {
    const duration = entry.durationHours;
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);

    const entryData = [
      index + 1, entry.taskDescription, entry.taskDate,
      entry.taskDescription, `${entry.startTime} - ${entry.endTime}`,
      `${hours} Jam ${minutes} Minit`
    ];
    tableRows.push(entryData);
    totalHoursWorked += duration;
  });

  autoTable(doc, {
    startY: 40, head: [tableColumn], body: tableRows,
    theme: 'grid', styles: { fontSize: 8 },
    headStyles: { fillColor: [211, 211, 211], textColor: [0, 0, 0] }
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  const summaryData = {
      bakiDibawa: 0, 
      jumlahJamBekerja: totalHoursWorked,
      jumlahTerkumpul: balance,
      jumlahTuntutan: totalHoursWorked - balance,
      bakiJamBekerja: balance
  };

  doc.setFontSize(10);
  doc.text("JUMLAH HARI CUTI GANTIAN YANG INGIN DIMOHON: ______ HARI", 14, finalY);
  doc.text("BAKI JAM BEKERJA YANG DIBAWA KE HADAPAN", 14, finalY + 10);
  doc.text(`${summaryData.bakiDibawa.toFixed(2)} JAM`, 100, finalY + 10);
  doc.text("JUMLAH JAM BEKERJA", 14, finalY + 15);
  doc.text(`${summaryData.jumlahJamBekerja.toFixed(2)} JAM`, 100, finalY + 15);
  doc.text("JUMLAH TERKUMPUL JAM BEKERJA", 14, finalY + 20);
  doc.text(`${summaryData.jumlahTerkumpul.toFixed(2)} JAM`, 100, finalY + 20);
  doc.text("JUMLAH JAM TUNTUTAN", 150, finalY + 10);
  doc.text(`${summaryData.jumlahTuntutan.toFixed(2)} JAM`, 220, finalY + 10);
  doc.text("BAKI JAM BEKERJA", 150, finalY + 15);
  doc.text(`${summaryData.bakiJamBekerja.toFixed(2)} JAM`, 220, finalY + 15);

  doc.text("PENGAKUAN PEMOHON", 14, finalY + 35);
  doc.text("Saya mengaku bahawa saya telah melaksanakan tugas rasmi seperti di atas.", 14, finalY + 40);
  doc.text("________________________", 14, finalY + 60);
  doc.text("Tandatangan Pemohon", 14, finalY + 65);
  doc.text("PENGESAHAN KETUA JABATAN/UNIT", 150, finalY + 35);
  doc.text("Saya mengesahkan pegawai telah melaksanakan tugas-tugas seperti yang dinyatakan.", 150, finalY + 40);
  doc.text("________________________", 150, finalY + 60);
  doc.text("Tandatangan Ketua Jabatan/Unit", 150, finalY + 65);

  doc.save(`Laporan_Cuti_Gantian_${user.name}.pdf`);
};