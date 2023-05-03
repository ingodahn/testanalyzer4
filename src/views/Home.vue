<template>
  <v-responsive>
    
    <v-container fluid tag="section" aria-labelledby="title">
      
        <v-row>
          <v-col cols="10" offset="1">
            <div id="context" v-if="showContext">
              <context/>
              <system-selector/>
            </div>
          </v-col>
        </v-row>
      
    </v-container>
  </v-responsive>
</template>

<script>
import Context from '@/components/Context.vue'
import SystemSelector from '@/components/SystemSelector.vue'
  export default {
    data: () => ({
      showContext: true,
    }),
    components: {
      Context,
      SystemSelector,
    },
  }
</script>

<style>
p {
  margin-bottom: 16px;
}
</style>