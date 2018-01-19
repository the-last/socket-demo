<template>
  <article class="container">
    <section>
      <div class="main-left">
        <logo-option> </logo-option>
        <menu-option></menu-option>
      </div>
      <div class="main-content">
        <div class="m-block">
          <block-chain></block-chain>
        </div>
        <div class="u-history">
          <history-records></history-records>
        </div>
      </div>
    </section>
    <app-main></app-main>
  </article>
</template>

<script>
import AppMain from './AppMain'
import HistoryRecords from '@/views/query/HistoryRecords.vue'
import BlockChain from '@/views/query/BlockChain.vue'
import MenuOption from '@/views/query/MenuOption.vue'
import LogoOption from '@/views/query/LogoOption.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'app-menu',
  data () {
    return {
      tabPosition: 'bottom'
    }
  },
  computed: {
    ...mapGetters({
      _user: '_user'
    })
  },
  components: {
    AppMain,
    HistoryRecords,
    BlockChain,
    MenuOption,
    LogoOption
  }
}
</script>

<style lang='scss'>
@import "../style/variables.scss";

.container {
  margin: 0 auto;
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('../assets/version01/big-bgk.png') no-repeat;
  // background-size: 100% 100%;
  background-size: cover;
  > section {
    height: 100%;
    .main-left {
      position: relative;
      display: block;
      float: left;
      width: 37vw;
      height: 100%;
      background-color: transparent;
      box-sizing: border-box;
      margin: 0 1.875rem 0 3rem;
      &:after {
        display: block;
        width: 0px;
        height: 0px;
        overflow: hidden;
        clear: both;
        font-size: 0px;
      }
    }

    .main-content {
      display: block;
      box-sizing: border-box;
      padding: .9375rem .9375rem .9375rem;
      color: #444;
      overflow-y: auto;
      width: 58vw;
      .m-block {
        display: block;
        overflow: hidden;
        width: 99%;
        margin: auto;
        padding: 1.25rem 0px 0px;
        box-sizing: border-box;
      }

      .u-history {
        display: block;
      }
    }
  }
  .guide-content {
    text-align: left;
  }
  .el-menu {
    text-align: left;
    height: 90%;
    overflow-y: auto;
    > .el-menu-item .el-submenu {
      height: 3rem !important;
      line-height: 3rem !important;
    }
  }
  .option-content {
    width: 20rem;
    margin-right: .5rem;
  }
  .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active {
    color: #20a0ff;
    a {
      color: #20a0ff;
    }
  }
}

.icon-item {
  display: inline;
  margin: 0px 11px 0 0;
  vertical-align: text-bottom;
}
.el-col-5 {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0px;
  min-width: 10rem;
  background: $leftbar-bg;
  height: 100%;
  overflow: hidden;
}
.el-col-17 {
  height: 100%;
}
.el-row {
  height: 100%;
}
.el-menu--dark {
  background: transparent;
}
.el-menu--dark .el-submenu__title {
  color: $leftbar-text;
  border-left: #2c3b41 2px solid;
}

.el-menu--dark .el-submenu__title:hover {
  border-left: $table-top 2px solid;
  background: $leftbar-active;
}
.el-menu--dark .el-submenu .el-menu {
  background: #2c3b41;
  padding: 1rem 0;
}
.el-menu--dark .el-submenu .el-menu .el-menu-item:hover {
  background: transparent;
  color: #fff;
}
.is-opened .el-menu--dark .el-submenu__title {
  background: $leftbar-active;
}
.el-menu--dark .el-menu-item, .el-menu--dark .el-submenu__title {
  color: $leftbar-text;
}
.container .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .container .el-menu-item.is-active {
  color: #fff;
}
.el-submenu.is-active .el-submenu__title{
  border-left: $table-top 2px solid;
  background: $leftbar-active;
  color: #fff;
}

.el-menu-item, .el-submenu__title {
  height: 2.75rem;
  line-height: 2.75rem;
}
.el-submenu .el-menu-item {
  height: 2.25rem;
  line-height: 2.25rem;
  font-size: .8125rem;
}
.adminstyle {
  font-size: .75rem;
  font-weight: normal;
  color: $leftbar-text;
  text-align: left;
  padding: 1rem 0 1rem 1rem;
  > span {
    margin-left: .5rem;
    color: white;
    font-size: $font-text;
  }
}
.mainnav {
  font-size: 1.25rem;
  color: #ffffff;
  background: $mainnav-bg;
  height: 5.625rem;
  line-height: 5.625rem;
  padding-left: 1rem;
  margin: 0;
}

.main-content::-webkit-scrollbar {
  display: none;
}
.fa-icon {
  margin-right: .625rem;
  position: relative;
  bottom: -3px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s
}
.fade-enter, .fade-leave-to {
  opacity: 0.5
}
</style>
