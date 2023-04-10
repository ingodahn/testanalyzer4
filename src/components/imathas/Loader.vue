<template>
  <context></context>
  <v-container>

    <div v-if="ShowUpload">
      <h2>
        {{ $t("IMathAS.data") }}

        <v-btn color="primary"
          onclick="location.href='https://dahn-research.eu/TestAnalyzerSampleData/TestdatenIMathAS.csv'" class="hvr-grow">
          {{ $t("IMathAS.demo") }}
        </v-btn>
      </h2>
      <p v-html="$t('IMathAS.p1')"></p>
      <img class="center" src="./assets/csvEinstellung.png" />
      <p>
        {{ $t("IMathAS.p2") }}
      </p>
    </div>
    <reader @dataRead="handleData"></reader>
  </v-container>
</template>

<script>
import Context from "@/components/Context.vue"
import { CSV} from "@/util/Reader.js"
//import { Question, Line, ReaderErrors, CSV } from "@/util/Reader.js";

export default {
  name: "ImathasLoader",
  data() {
    return {
      ShowUpload: true
    }
  },
  mixins: [CSV],
  components: {
    Context,
    Reader
  },
  methods: {
    /**
     * 
     * @param {*} csv 
     * @returns Test-Data as JSON-Object with the following structure:
     */
    handleData(csv) {
      console.log("handleData: " + csv)
    }
    /*
    handleData: function (csv) {
      let component = this;
      try {
        const csv_1 = csv.replace(/^\s*\n/gm, "");
        // 2. Stripping off and storing Legende if necessary
        // 3. Parsing File into csv if necessary

        // 4. Parsing csv into array of arrays of items
        this.lineArray = CSV.parseCSV(csv_1, ",");

        // 5. table2test
        //var test = table2Test(this.lineArray);

        //  6. Emit signal (or modify Test object's parts?)
        this.$emit("testRead", test);
        this.loading = false;
        this.Error.type = "loaded";
      } catch (er) {
        if (er == "loadError") component.handleLoadError();
        if (er == "processError") component.handleProcessError();
      }
    },
    handleLoadError() {
      this.Error.type = "loadError";
      this.Error.message = this.$t("IMathAS.loadError");
      console.log("Error: " + this.Error.message)
      this.loading = false;
    },
    habdleProcessError() {
      this.Error.type = "processError";
      this.Error.message = this.$t("IMathAS.processError");
      console.log("Error: " + this.Error.message)
      this.loading = false;
    },
    */
  }
}
</script>

<style>
/* Grow */
.hvr-grow {
  display: inline-block;
  vertical-align: middle;
  transform: translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  backface-visibility: hidden;
  -moz-osx-font-smoothing: grayscale;
  transition-duration: 0.3s;
  transition-property: transform;
}

.hvr-grow:hover,
.hvr-grow:focus,
.hvr-grow:active {
  transform: scale(1.1);
}

.custom-file-upload,
.readerButton {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  margin-right: 6px;
  cursor: pointer;
  background-color: hsl(198, 65%, 40%);
  color: white;
  border-radius: 10px;
}

.readerButton.anonymize {
  background-color: green;
}

.realData {
  display: none;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#drop {
  border: 2px dashed #bbb;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  font: 20pt bold, "Vollkorn";
  color: #bbb;
}

.spinner {
  margin: 0 auto;
  width: 100px;
}
</style>