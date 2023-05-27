<template>
    <tool-bar :disabled="toolbarOptions.disabled"></tool-bar>
    <imathas-testreader v-if="system == 'IMathAS'" @testRead="gotoSettings"></imathas-testreader>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import ToolBar from '@/components/ToolBar.vue'
const ImathasTestreader = defineAsyncComponent(
    () => import("@/components/imathas/Testreader.vue")
)

export default {
    components: {
        ToolBar,
        ImathasTestreader
    },
    data() {
        return {
            Test: this.$root.$data.Test,
            system: null
        }
    },
    mounted() {
        const mySystem = this.$route.params.system
        if (this.$root.$data.Config.systems.includes(mySystem)) {
            this.system = mySystem
        } else {
            this.$router.push("/")
        }
    },
    methods: {
        gotoAnalysis() {
            this.$router.push({ name: "Analysis" })
        },
        gotoSettings(Test) {
            Test.update();
            this.$root.$data.Test = Test
            this.$router.push({ name: "Settings" })
        },
    },
    computed: {
        toolbarOptions() {
            const options = {
                disabled: {
                    drawer: true,
                    file: true,
                    settings: false,
                    analysis: false,
                    layout: false,
                    grouping:false,
                    report: false
                }
            }
            if (!this.Test) {
                options.disabled.settings = true
                options.disabled.analysis = true
                options.disabled.layout = true,
                options.disabled.grouping = true
            }
            return options
        }
    }
}

</script>