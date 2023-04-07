<template>
    <h2>System {{ $route.params.system }}</h2>
    <imathas-instructions />
</template>

<script>
import { defineAsyncComponent } from 'vue'
const ImathasInstructions = defineAsyncComponent(
    () => import("@/components/IMathAs/instructions.vue")
)
//import ImathasInstructions from "@/components/IMathAs/instructions.vue"
export default {
    components: {
        ImathasInstructions
    }
}

</script>