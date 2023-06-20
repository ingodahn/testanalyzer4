<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <div id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
                        {{ dropMessage }}
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
import * as Excel from 'exceljs'

export default {
    name: "Reader",
    data() {
        return {
            loading: false,
            error: false,
            errorMessage: "",
            lineArray: this.$root.$data.lineArray,
            gotType: null
        };
    },
    props: {
        data: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: "csv"
        },
        delimiter: {
            type: String,
            default: ","
        }
    },
    emits: ["dataRead"],
    mounted() {
        if (this.data) {
            this.handleData(this.data);
        }
    },
    methods: {
        handleDrop: function (e) {
            let component = this;
            try {
                e.stopPropagation();
                e.preventDefault();
                this.loading = true;
                var files = e.dataTransfer.files,
                    f = files[0],
                    dataString;
                let type = f.name.split(".").pop();
                this.gotType=type
                const filetypeRegex = new RegExp(this.type, "i");
                if (!type.match(filetypeRegex)) throw { name: "loadError", message: "File must be a " + this.type + " file" };
                var reader = new FileReader();
                reader.onload = e => {
                    // 1. Getting file
                    dataString = e.target.result;
                    this.handleData(dataString);
                };
                if (this.type == "xls|xlsx") {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsText(f);
                }
            } catch (er) {
                component.handleLoadError(er);
            }
        },

        fixdata(data) {
            var o = "",
                l = 0,
                w = 10240;
            for (; l < data.byteLength / w; ++l)
                o += String.fromCharCode.apply(
                    null,
                    new Uint8Array(data.slice(l * w, l * w + w))
                );
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        },
        handleData(dataString) {
            try {
                switch (this.type) {
                    case "csv":
                        const csv_1 = dataString.replace(/^\s*\n/gm, "");
                        this.parseCSV(csv_1, this.delimiter);
                        break;
                    case "xls|xlsx":
                    case "xlsx":
                        this.parseXLSX(this.fixdata(dataString));
                        break;
                    default:
                        throw { name: "loadError", message: "File must be a " + this.type + " file" };
                }

            } catch (er) {
                throw { name: "loadError", message: "Error parsing CSV file: " + er.message + "" };

            }
        },
        handleLoadError(er) {
            this.loading = false;
            this.error = true;
            this.errorMessage = er.message;
        },


        parseCSV(dataString, del = ",") {
            try {
                csv({
                    noheader: true,
                    output: "csv",
                    delimiter: del
                })
                    .fromString(dataString)
                    .then(csvRow => {
                        // We might emit the data here
                        //this.lineArray = csvRow
                        this.$root.$data.lineArray = csvRow;
                        this.$emit('dataRead')
                    })
            } catch (er) {
                throw { name: "loadError", message: "Error parsing " + this.type + " file: " + er.message + "" };
            }
        },
        parseXLSX(dataBuffer) {
            try {
                const workbook = new Excel.Workbook();
                workbook.xlsx.load(dataBuffer).then(() => {
                    console.log('loaded')
                    const worksheet = workbook.worksheets[0];
                    let A = []
                    for (let i = 1; i <= worksheet.rowCount; i++) {
                        let B=[]
                        for (let j = 1; j <= worksheet.columnCount; j++) {
                            let x=worksheet.getRow(i).getCell(j).value;
                            let y=(x==undefined)?"":x
                            B.push(y)
                        }
                        A.push(B)
                    }
                    this.$root.$data.lineArray = A;
                    this.$emit('dataRead',this.gotType)
                })
            } catch (er) {
                throw { name: "loadError", message: "Error parsing " + this.type + " file: " + er.message + "" };
            }
        },
/*
        parseXLSX: async (dataBuffer,A) => {
            try {
                console.log("parseXLSX")
                // load from buffer
                const workbook = new Excel.Workbook();
                await workbook.xlsx.load(dataBuffer);
                const worksheet = workbook.worksheets[0];
                console.log(worksheet.rowCount)
                console.log(worksheet.columnCount)
                console.log(worksheet.getRow(1).values)
                let A=[]
                for (let i = 1; i <= worksheet.rowCount; i++) {
                    A.push(worksheet.getRow(i).values)
                }
                console.log(A)
                
                        //this.$emit('dataRead')
            } catch (er) {
                throw { name: "loadError", message: "Error parsing xlsx file: " + er.message + "" };
            }
        },
*/
        handleDragover(e) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = "copy";
        }
    },
    computed: {
        dropMessage() {
            return (this.type == "csv") ? this.$t("IMathAS.p3") : "xls- oder xlsx-Datei mit der Maus hier ablegen"
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