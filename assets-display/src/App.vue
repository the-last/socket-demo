<template>
  <div id="app">
    <app-header></app-header>
    <app-menu></app-menu>
  </div>
</template>

<script>

import { AppHeader, AppMenu } from './components/main'

export default {
  name: 'app',

  components: {
    AppHeader,
    AppMenu
  }
}
</script>

<style lang='scss' scoped>
@import "./style/app.scss";
</style>

<style lang='scss'>
@import "./style/element.scss";
</style>
