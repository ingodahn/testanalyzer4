// Path: src\layouts\TheDefaultLayout.vue

<script lang="ts">
import { defineComponent } from "vue";
import AppBar from "@/components/AppBar.vue";

export default defineComponent({
    name: "TheDefaultLayout",
    components: {
        AppBar,
    },
    methods: {
        toTop() {
            window.scrollTo(0, 0);
        },
        onScroll(e) {
            console.log('scrolling')
            if (typeof window === "undefined") return;
            const top = window.pageYOffset || e.target.scrollTop || 0;
            this.fab = top > 20;
        },
    },
    data() {
        return {
            fab: false,
        };
    },
    computed: {
        system() {
            const test = this.$root.$data.Test;
            return test ? test.system : "";
        },
    },
});
</script>

<template>
    <v-layout>

        <app-bar :key="system" />

        
        <v-main>
            <!--The <slot> element is a slot outlet that indicates 
                where the "VIEW" content should be rendered.-->
            <slot></slot>
            <v-btn v-scroll="onScroll" v-show="fab" fab dark fixed bottom right color="primary" @click="toTop">
                <v-icon>mdi-arrow-up-bold-outline</v-icon>
            </v-btn>
            <v-btn
        fab
        color="primary"
        dark
        large
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
        </v-main>
        
      

        <v-footer color="#2481a8" app>
            <span style="color: white">
                &copy;Ingo Dahn (Dahn-Research),
            </span>

            <span style="color: white" v-html='$t("Footer.license")'></span>
        </v-footer>
    </v-layout>
</template>

```
