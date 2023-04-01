<template>
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
  </template>
  
  <script setup>
  //
  </script>
  