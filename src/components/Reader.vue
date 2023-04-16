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
import LanguageSwitcher from './LanguageSwitcher.vue';
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
        handleData(csvData) {
            console.log('Handling Data')
            let component = this
            try {
                const csv_1 = csvData.replace(/^\s*\n/gm, "");
                let lineArray=[];
                this.parseCSV(csv_1, ",");
                console.log('Data parsed')
            } catch (er) {
                if (er == "loadError") component.handleLoadError(er);
            }
        },
        handleLoadError(er) {
            console.log('Handling Load Error', er.errorMessage)
            this.loading = false;
            this.error = true;
            this.errorMessage = er.errorMessage;
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
                if (er == "loadError") component.handleLoadError(er);
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