<template>
    <h2>SystemView {{ $route.params.system }}</h2>
    <imathas-testreader />
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
    }
}

</script>