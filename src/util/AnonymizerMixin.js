// AnonymizerMixin
import { saveAs } from "file-saver";

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
      }
  }
}

export default AnonymizerMixin;