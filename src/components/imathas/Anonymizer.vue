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
    name: 'Anonymizer',
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
                let firstRows = new Object();
                for (let lineNr = 2; lineNr < this.LineArray.length; lineNr++) {
                    let line = this.LineArray[lineNr];
                    let pii = line[0];
                    if (!Object.prototype.hasOwnProperty.call(firstRows, pii))
                        firstRows[pii] = lineNr;
                    let ns = firstRows[pii].toString();
                    line[0] = "Name_" + ns;
                    //if (line[3].length) line[3] = "anonymized";
                }
                this.anonymized = true;
                this.writeCSV(this.LineArray, ",", "imathas_anonymous.csv");

            } catch (er) {
                this.anonymizeError = { name: "anonymizeError", message: "Error anonymizing CSV file: " + er.message + "" };
            }
        }
    },
    computed: {
        checkAnonymization() {
            return this.$t('Problem.msg5')
        }
    }
}
</script>