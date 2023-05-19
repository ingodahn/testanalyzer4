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
            console.log('toolbarOptions', this.Test)
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
                options.disabled.layout = true
            }
            return options
        }
    }
}

</script>