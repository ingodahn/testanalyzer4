// AnonymizerMixin
import { saveAs } from "file-saver";
import Excel from "exceljs";

const AnonymizerMixin = {
  methods: {
    writeCSV: function(lineArray, del, fileName) {
        let outLines = lineArray.map(line =>
          line
            .map(entry => entry.replaceAll(del, "").replaceAll('"', ""))
            .join(del)
        );
        let outData = outLines.join("\n");
        let blob = new Blob([outData], {
          type: "text/plain; charset=utf-8"
        });
        saveAs(blob, fileName);
      },
      writeXLS: function(lineArray, system, fileName) {  // TODO implement this 
        const wb = new Excel.Workbook();
        wb.title = system+" Spreadsheet";
        wb.creator = "Testanalyzer";
        const sheet = wb.addWorksheet(system+" Results");
        for (let i = 0; i < lineArray.length; i++) {
          sheet.addRow(lineArray[i]);
        }
        wb.xlsx.writeBuffer().then(buffer => saveAs(new Blob([buffer]), fileName))
        .catch(err => console.log('Error writing excel export', err))
      },
  }
}

export default AnonymizerMixin;