<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>
  export default {
    name: 'App',
    data () {
      return {
      }
    },

    methods: {
      goBack () {
        window.history.length > 1
                ? this.$router.go(-1)
                : this.$router.push('/')
      },
      goHome (){
        this.$router.push('/')
      }
    }
  }
</script>
