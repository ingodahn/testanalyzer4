<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <div id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
                        {{ $t("IMathAS.p3") }}
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
                    <v-alert v-if="error" type="error" dismissible>
                        {{ errorMessage }}
                    </v-alert>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import csv from 'csvtojson';

export default {
    name: "Reader",
    data() {
        return {
            loading: false,
            error: false,
            errorMessage: "",
            lineArray: null
        };
    },
    methods: {
        handleDrop: function (e) {
            console.log('Handling Drop')
            let component = this;
            try {
                e.stopPropagation();
                e.preventDefault();
                this.loading = true;
                var files = e.dataTransfer.files,
                    f = files[0],
                    csv;
                let type = f.name.split(".").pop();
                if (!type.match(/csv/i)) throw {name: "loadError", message: "File must be a CSV file"};
                var reader = new FileReader();
                reader.onload = e => {
                        // 1. Getting file
                        csv = e.target.result;
                        this.handleData(csv);
                };
                reader.readAsText(f);
            } catch (er) {
                component.handleLoadError(er);
            }
        },
        handleData(csvData) {
            try {
                const csv_1 = csvData.replace(/^\s*\n/gm, "");
                let lineArray=[];
                this.parseCSV(csv_1, ",");
            } catch (er) {
                throw {name: "loadError", message: "Error parsing CSV file: " + er.message + ""};

            }
        },
        handleLoadError(er) {
            this.loading = false;
            this.error = true;
            this.errorMessage = er.message;
        },
        
        
        parseCSV(csvData, del = ",") {
            try {
                csv({
                    noheader: true,
                    output: "csv",
                    delimiter: del
                })
                    .fromString(csvData)
                    .then(csvRow => {
                        // We might emit the data here
                        //this.lineArray = csvRow
                        this.$root.$data.lineArray=csvRow;
                        this.$emit('dataRead')
                    })
            } catch (er) {
                throw {name: "loadError", message: "Error parsing CSV file: " + er.message + ""};
            }
        },
       
        handleDragover(e) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = "copy";
        }
    }
}
</script>

<style>
#drop {
    border: 2px dashed #bbb;
    border-radius: 5px;
    padding: 25px;
    text-align: center;
    font: 20pt bold, "Vollkorn";
    color: #bbb;
}
</style>