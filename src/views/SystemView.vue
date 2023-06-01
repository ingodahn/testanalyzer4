<template>
    <tool-bar :disabled="toolbarOptions.disabled"></tool-bar>
    <imathas-testreader v-if="system == 'imathas'" @testRead="gotoSettings"></imathas-testreader>
    <ilias-testreader v-if="system == 'ilias'" @testRead="gotoSettings"></ilias-testreader>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import ToolBar from '@/components/ToolBar.vue'
const ImathasTestreader = defineAsyncComponent(
    () => import("@/components/imathas/Testreader.vue")
)
const IliasTestreader = defineAsyncComponent(
    () => import("@/components/ilias/Testreader.vue")
)

export default {
    components: {
        ToolBar,
        ImathasTestreader,
        IliasTestreader
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
                    allLayout: false,
                    hintsLayout: false,
                    printLayout: false,
                    grouping:false,
                    report: false
                }
            }
            if (!this.Test) {
                options.disabled.settings = true
                options.disabled.analysis = true
                options.disabled.allLayout = true,
                options.disabled.hintsLayout = true,
                options.disabled.printLayout = true,
                options.disabled.grouping = true
            }
            return options
        }
    }
}

</script>