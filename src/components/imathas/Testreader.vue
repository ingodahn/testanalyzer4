<template>
    <h3>IMathAS Testreader</h3>
    <context></context>
    <v-container>

        <div v-if="ShowUpload">
            <h2>
                {{ $t("IMathAS.data") }}

                <v-btn color="primary"
                    onclick="location.href='https://dahn-research.eu/TestAnalyzerSampleData/TestdatenIMathAS.csv'"
                    class="hvr-grow">
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
import Reader from "@/components/Reader.vue"

export default {
    name: "IMathASTestreader",
    data() {
        return {
            ShowUpload: true
        }
    },
    components: {
        Context,
        Reader
    },
    methods: {
        handleData(data) {
            console.log('Testreader got data', data)
        }
    }
}
</script>

<style scoped>
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
</style>