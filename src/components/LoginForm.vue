<template>
    <v-container class="pt-10">
      <v-form @submit.prevent="handleSubmit">
        <legend>Welcome back!</legend>
        <v-text-field v-model="form.username" label="Username" name="username" />
        <v-text-field
          v-model="form.password"
          label="Password"
          name="password"
          type="password"
        />
        <v-btn type="submit">Login</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { reactive } from "vue";
  
  const form = reactive({
    username: "",
    password: "",
  });
  
  const handleSubmit = () => {
    // make api request
    console.log(form);
  };
  </script>
  
  <style lang="scss" scoped>
  </style>