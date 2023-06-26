<template>
    <v-container>
        <collapsed-text>
            <template #title>
                {{ $t('Test.context') }}
            </template>
            <template #default>
                <context></context>
            </template>
        </collapsed-text>
        <collapsed-text>
            <template #title>
                {{ $t("Test.data") }}
            </template>
            <template #default>
                <p>
                    Zur Auswertung der Testergebnisse archivieren Sie zunächst den Test in
                    Open OPAL in eine
                    <i>.xls-Datei</i> oder <i>.csv-Datei</i>.
                    <v-btn icon="true" elevation="8" size="medium" variant="outlined" @click="showExport = !showExport">
                        <v-icon size="large">{{ showExport ? "mdi-chevron-up" : "mdi-chevron-down"
                        }}</v-icon>
                    </v-btn>


                    <Export v-if="showExport"></Export>


                </p>
                <p>
                    Ziehen Sie diese Datei mit der Maus in diese Webseite auf die Fläche
                    unten.
                </p>
            </template>
        </collapsed-text>
        <reader @dataRead="handleData" :data="data" :type="type" delimiter=";" key="data.length"></reader>
        <v-container>
            <v-btn color="primary"
                onclick="location.href='https://dahn-research.eu/TestAnalyzerSampleData/TestdatenOpal.xls'"
                class="hvr-grow">
                Demo-Daten
            </v-btn>
        </v-container>
    </v-container>
</template>

<script>
import Export from "@/components/opal/Export.vue";
import CollapsedText from "@/components/CollapsedText.vue";
import Context from "@/components/Context.vue"
import Reader from "@/components/Reader.vue"
import { TestObject, Question, Line } from "@/util/Reader";
import ReaderErrors from "@/util/ReaderErrors";

export default {
    name: "OpalTestreader",
    emits: ["testRead"],
    data() {
        return {
            showExport: false,
            type: 'csv|xls',
            data: ""
        }
    },
    components: {
        Context,
        Reader,
        CollapsedText,
        Export
    },
    methods: {
        handleData() {
            this.$emit("testRead", this.test)
        }

    }
}
</script>