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
        </v-container>
    </div>
</template>

<script>
export default {
    name: "Reader",
    data() {
        return {
            loading: false,
            error: false,
            errorMessage: ""
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
                //this.cancelError();
                var files = e.dataTransfer.files,
                    f = files[0],
                    csv;
                let type = f.name.split(".").pop();
                if (!type.match(/csv/i)) throw "loadError";
                var reader = new FileReader();
                reader.onload = e => {
                    try {
                        // 1. Getting file
                        csv = e.target.result;
                        this.handleData(csv);
                    } catch (er) {
                        if (er == "loadError") component.handleLoadError();
                    }
                };
                reader.readAsText(f);
            } catch (er) {
                if (er == "loadError") component.handleLoadError();
            }
        },
        handleData(csv) {
            console.log('Handling Data')
            let component = this
            try {
                const csv_1 = csv.replace(/^\s*\n/gm, "");
                const lineArray = this.parseCSV(csv_1, ",");
                component.$emit('dataRead', lineArray)
                console.log('Data parsed', lineArray)
            } catch (er) {
                if (er == "loadError") component.handleLoadError(er);
            }
            this.$emit('dataRead', csv)
        },
        handleLoadError(er) {
            console.log('Handling Load Error', er.errorMessage)
            this.loading = false;
            this.error = true;
            this.errorMessage = er;
        },
        
        /* parseCSV(str, delimiter = ",") {
            console.log('Parsing Data-0')
            const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
            const rows = str.slice(str.indexOf("\n") + 1).split("\n");
            return rows.map(row => {
                const values = row.split(delimiter);
                return headers.reduce((object, header, index) => {
                    object[header] = values[index];
                    return object;
                }, {});
            });
        }, */
        
        parseCSV(csv, del = ",") {
            console.log('Parsing Data-1')
            let parse = require("csv-parse/lib/sync");
            console.log('Parsing Data')
            let lineArray = [];
            try {
                lineArray = parse(csv, {
                    delimiter: del,
                    trim: true,
                    relax_column_count: true
                });
            } catch {
                throw "loadError";
            }
            console.log('Data parsed', lineArray)
            return lineArray;
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