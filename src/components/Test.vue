<template>
  <div>
    <v-app-bar app color="primary" class="px-10" dark>
      <div class="d-flex align-center">
        <h2>My Company {{ $t("Test.title") }}</h2>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="https://mycompany.com/contact-us" target="_blank" text>
        <span class="mr-2">Contact US</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <language-switcher />

    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn color="primary" dark v-bind="props">Menu</v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" @click="selectItem(item)">
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
  
<script>
import LanguageSwitcher from "@/components/LanguageSwitcher.vue"
export default {
  data: () => ({
    /*
    items: [
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me 2' },
    ],
    */
    items: ['Item 1', 'Item 2', 'Item 3'],
  }),
  components: {
    LanguageSwitcher
  },
  methods: {
    selectItem(item) {
      console.log(`Selected item ${item}`);
    },
  },
}
</script>
  