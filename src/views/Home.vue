<template>
  <v-responsive>
    <v-container fluid tag="section" aria-labelledby="title">
      <test />
      <v-main>
        <v-row>
          <v-col cols="4" offset="4">
            <login-form />
          </v-col>
        </v-row>
      </v-main>
    </v-container>
  </v-responsive>
</template>

<script setup>
import Test from "@/components/Test.vue";
import LoginForm from "@/components/LoginForm.vue";
</script>