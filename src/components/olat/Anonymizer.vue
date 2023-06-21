<template>
    <v-container>
        <v-row>
            <p>{{ $t('Problem.msg11') }}</p>
        </v-row>
        <v-row>
            <v-btn @click="anonymize" color="primary" :disabled="anonymized">{{ $t('Problem.msg7') }}</v-btn>
        </v-row>
        <v-row v-if="anonymized" v-html="checkAnonymization">
        </v-row>
        <v-alert v-if="anonymizeError" type="error" dismissible>
            {{ anonymizeError.message }}
        </v-alert>
    </v-container>
</template>

<script>
import AnonymizerMixin from '@/util/AnonymizerMixin';
export default {
    name: 'OlatAnonymizer',
    data() {
        return {
            LineArray: this.$root.$data.lineArray,
            anonymized: false,
            anonymizeError: false,
        }
    },
    mixins: [AnonymizerMixin],
    methods: {
        // Anonymize and save
        anonymize: function () {
            try {
                let firstRows = new Object(),
                    selfTest = this.isSelfTest;
                    console.log("selfTest", selfTest)
                for (let lineNr = 2; lineNr < this.LineArray.length; lineNr++) {
                    let line = this.LineArray[lineNr];
                    if (typeof (line[0]) == 'number') {
                        let pii = selfTest ? line[1] : line[1] + " " + line[2];
                        if (!Object.prototype.hasOwnProperty.call(firstRows, pii))
                            firstRows[pii] = lineNr;
                        let ns = firstRows[pii].toString();
                        if (selfTest) {
                            line[1] = "Name_" + ns;
                        } else {
                            line[1] = "Vorname_" + ns;
                            line[2] = "Name_" + ns;
                            line[3] = "k.A.";
                            line[4] = "k.A.";
                            line[5] = "k.A.";
                            line[8] = "k.A.";
                        }
                    }
                }

                if (this.type == "xls") {
                    let outLines = this.LineArray.map(line => line.join("\t"));
                    let outData = outLines.join("\n") + "\nLegende" + this.legend;
                    let blob = new Blob([outData], {
                        type:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8"
                    });
                    saveAs(blob, "olat_anonymous.xls");
                    return;
                }
                this.writeXLS(this.LineArray, "Open OLAT", "olat_anonymous.xlsx");
            } catch (er) {
                this.anonymizeError = {
                    name: "anonymizeError",
                    message: "Error anonymizing Excel file: " + er.message + ""
                };

            }

        },
        anonymizeXX: function () {
            try {
                let firstRows = new Object();
                let shuffled = this.LineArray[0][0] == this.LineArray[2][0];
                for (let lineNr = 1; lineNr < this.LineArray.length; lineNr++) {
                    let line = this.LineArray[lineNr];
                    let pii = line[0];
                    if (!Object.prototype.hasOwnProperty.call(firstRows, pii))
                        firstRows[pii] = lineNr;
                    let ns = firstRows[pii].toString();
                    line[0] = "Name_" + ns;
                    line[1] = "k.A.";
                    if (shuffled) lineNr++;
                }
                this.anonymized = true;
                this.writeCSV(this.LineArray, ";", "ilias_anonymous.csv");
                return;
            } catch (er) {
                this.anonymizeError = {
                    name: "anonymizeError",
                    message: "Error anonymizing CSV file: " + er.message + ""
                };

            }
        }
    },
    computed: {
        checkAnonymization() {
            return this.$t('Problem.msg5')
        },
        isSelfTest: function () {
            let ar = this.LineArray;
            return (ar.length > 1) & (ar[1].length > 2) & (ar[1][2] == "Nachname")
                ? false
                : true;
        }
    }
}  
</script>