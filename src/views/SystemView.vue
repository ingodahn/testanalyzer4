<template>
    <h2>SystemView {{ $route.params.system }}</h2>
    <imathas-testreader @testRead="gotoAnalysis"></imathas-testreader>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const ImathasTestreader = defineAsyncComponent(
    () => import("@/components/imathas/Testreader.vue")
)
//import ImathasInstructions from "@/components/IMathAs/instructions.vue"
export default {
    components: {
        ImathasTestreader
    },
    methods: {
        gotoAnalysis() {
            console.log('TestReader emitted testRead at', JSON.parse(JSON.stringify(this.$root.$data.Test)))
            this.$router.push({ name: "Analysis" })
        }
    }
}

</script>