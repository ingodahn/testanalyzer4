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
    name: 'OpalAnonymizer',
    data() {
        return {
            LineArray: this.$root.$data.lineArray,
            anonymized: false,
            anonymizeError: false,
        }
    },
    mixins: [AnonymizerMixin],
    methods: {
        anonymize() {
            try {
                let names = new Object();
                for (let lineNr = 2; lineNr < this.LineArray.length - 3; lineNr++) {
                    let pii =
                        this.LineArray[lineNr][1] +
                        this.LineArray[lineNr][2] +
                        this.LineArray[lineNr][3];
                    if (!Object.prototype.hasOwnProperty.call(names, pii)) {
                        names[pii] = {
                            name: "Name_" + lineNr.toString(),
                            given: "Vorname_" + lineNr.toString(),
                            matrikel: "Matrikel_" + lineNr.toString(),
                        };
                    }
                    this.LineArray[lineNr][1] = names[pii].name;
                    this.LineArray[lineNr][2] = names[pii].given;
                    this.LineArray[lineNr][3] = names[pii].matrikel;
                }

                this.writeCSV(this.LineArray, "\t", "opal_anonymous.csv");
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
