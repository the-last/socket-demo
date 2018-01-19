<template>
  <section>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'app-header',
  data () {
    return {
      activeIndex: '1'
    }
  },
  computed: {
    ...mapGetters({
      _user: '_user'
    })
  },
  methods: {
    ...mapActions([
      'userLogout',
      'userTyper'
    ]),
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    setUserType (userType) {
      this.userTyper(userType)
      this.userType = userType
      // this.$router.push('/Home')
      this.$router.replace('/Home')
      window.location.reload()
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../style/variables.scss";

</style>
