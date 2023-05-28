<template>
    <v-container class="collapsed-text">
        <div class="collapsed-text__title" @click="isCollapsed = !isCollapsed">
                <h2>
                    <slot name="title"></slot>
                </h2>
                <v-spacer></v-spacer>
                <v-btn icon >
                    <v-icon v-if="isCollapsed">mdi-chevron-down</v-icon>
                    <v-icon v-else>mdi-chevron-up</v-icon>
                </v-btn>
    </div>
    <div class="collapsed-text__content" v-if="!isCollapsed">
        <slot></slot>
    </div>
    <div class="collapsed-text__content" v-else>
        <slot name="collapsed"></slot>
    </div>
    <div class="collapsed-text__toggle" @click="isCollapsed = !isCollapsed">
        <slot name="toggle"></slot>
    </div>
</v-container></template>
<script>
export default {
    name: 'CollapsedText',
    props: {
        collapsed: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isCollapsed: this.collapsed
        }
    }
}
</script>

<style scoped>
.collapsed-text__title {
    background-color: #2481a8;
    color: white;
    display: flex;
    align-items: center;
    padding: 0.5em;
    margin-bottom: 1rem;
    width: 100%;
}
</style>