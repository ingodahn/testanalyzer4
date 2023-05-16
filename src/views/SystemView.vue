<template>
    <tool-bar :disabled="toolbarOptions.disabled"></tool-bar>
    <imathas-testreader @testRead="gotoSettings"></imathas-testreader>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import ToolBar from '@/components/ToolBar.vue'
const ImathasTestreader = defineAsyncComponent(
    () => import("@/components/imathas/Testreader.vue")
)
//import ImathasInstructions from "@/components/IMathAs/instructions.vue"
export default {
    components: {
        ToolBar,
        ImathasTestreader
    },
    data () {
        return {
            Test: this.$root.$data.Test
        }
    },
    methods: {
        gotoAnalysis() {
            console.log('TestReader emitted testRead at', JSON.parse(JSON.stringify(this.$root.$data.Test)))
            this.$router.push({ name: "Analysis" })
        },
        gotoSettings(Test) {
            Test.update();
            this.$root.$data.Test = Test
            console.log('TestReader emitted testRead for Settings at', JSON.parse(JSON.stringify(this.$root.$data.Test)))
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
                    report: false
                }
            }
            if (!this.Test) {
                options.disabled.settings = true
                options.disabled.analysis = true
                options.disabled.hints = true
                options.disabled.print = true
                options.disabled.report = true
            }
            return options
        }
    }
}

</script>