import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export function exportToExcel(headers:string[], data:object[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // 添加表头
  worksheet.addRow(headers);

  data.forEach(rowData => {
    worksheet.addRow(rowData);
  });

  // 设置列宽
  // worksheet.columns = [
  //   { width: 5 },
  //   { width: 15 },
  //   { width: 5 },
  //   { width: 15 },
  // ];

  // 将工作簿写入Buffer并转换为Blob对象，然后调用saveAs方法以触发浏览器下载
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'example.xlsx');
  }).catch((error) => {
    console.error('Error generating Excel file:', error);
  });
}
