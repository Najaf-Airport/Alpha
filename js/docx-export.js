const {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Packer,
  AlignmentType,
  BorderStyle
} = docx;

// ✅ تصدير رحلة واحدة
export async function exportSingleFlightToDocx(flightData) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: "تقرير رحلة", bold: true, size: 36, color: "2C3E50" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: `المستخدم: ${flightData.userName || 'غير معروف'}`, bold: true, size: 24 })],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 }
          }),
          new Table({
            rows: [
              ...["date", "fltNo", "onChocksTime", "openDoorTime", "startCleaningTime", "completeCleaningTime", "readyBoardingTime", "startBoardingTime", "completeBoardingTime", "closeDoorTime", "offChocksTime", "notes"]
                .map((field) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: `${field}:`, alignment: AlignmentType.RIGHT })] }),
                      new TableCell({ children: [new Paragraph({ text: flightData[field] || 'N/A', alignment: AlignmentType.RIGHT })] })
                    ]
                  })
                )
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "D3D3D3" },
              insideVertical: { style: BorderStyle.SINGLE, size: 6, color: "D3D3D3" }
            }
          }),
          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({
            children: [new TextRun({ text: "تولدت بواسطة نظام إدارة الطائرات في مطار النجف الأشرف الدولي.", size: 20, color: "777777" })],
            alignment: AlignmentType.CENTER
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `تقرير_رحلة_${flightData.fltNo}_${flightData.date}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ✅ تصدير بيانات المشرف (Placeholder بسيط حتى يتجنب الخطأ)
export async function exportAdminDataToDocx(type, data, month, user) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: "تقرير المسؤول - سيتم تطويره لاحقًا", bold: true })],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({ text: `النوع: ${type}, الشهر: ${month}, المستخدم: ${user}` })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `تقرير_المسؤول_${type}_${month}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
