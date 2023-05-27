<template>
    <tool-bar :disabled="toolbarOptions.disabled" ></tool-bar>
    <Grouping id="grouping"></Grouping>
</template>

<script>
import ToolBar from "@/components/ToolBar.vue";
import Grouping from "@/components/Grouping.vue";
export default {
    name: 'GroupingView',
    components: {
        ToolBar,
        Grouping
    },
    data () {
        return {
            toolbarOptions : {
                disabled: {
                    drawer: true,
                    file: false,
                    settings: false,
                    analysis: false,
                    layout: true,
                    grouping: true,
                    report: false
                }
            },
            ScoredSorted: this.$root.$data.ScoredSorted,
        }
    },
}
</script>