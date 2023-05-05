<template>
    <v-container class="scroll-y">
        <v-row justify="end">
            <v-btn icon title="Back to top" @click="toTop()"><v-icon>mdi-arrow-up-bold-outline</v-icon></v-btn>
        </v-row>
    </v-container>
</template>
<script>
export default {
    methods: {
        toTop() {
            window.scrollTo(0, 0);
        },
        onScroll(e) {
            if (typeof window === "undefined") return;
            const top = window.pageYOffset || e.target.scrollTop || 0;
            this.fab = top > 20;
        },
    },
};
</script>