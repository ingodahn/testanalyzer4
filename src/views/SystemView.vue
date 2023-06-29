<template>
    <tool-bar :disabled="toolbarOptions.disabled"></tool-bar>
    <imathas-testreader v-if="system == 'imathas'" @testRead="gotoAnalysis"></imathas-testreader>
    <ilias-testreader v-if="system == 'ilias'" @testRead="gotoAnalysis"></ilias-testreader>
    <olat-testreader v-if="system == 'olat'" @testRead="gotoAnalysis"></olat-testreader>
    <opal-testreader v-if="system == 'opal'" @testRead="gotoAnalysis"></opal-testreader>
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
const OlatTestreader = defineAsyncComponent(
    () => import("@/components/olat/Testreader.vue")
)
const OpalTestreader = defineAsyncComponent(
    () => import("@/components/opal/Testreader.vue")
)

export default {
    components: {
        ToolBar,
        ImathasTestreader,
        IliasTestreader,
        OlatTestreader,
        OpalTestreader
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
        gotoSettings(Test) {
            Test.update();
            this.$root.$data.Test = Test
            this.$router.push({ name: "Settings" })
        },
        gotoAnalysis(Test) {
            Test.update();
            this.$root.$data.Test = Test
            this.$router.push({ name: "Analysis" })
        }
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