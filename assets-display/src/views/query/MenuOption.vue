<template>
  <div>
    <section class="nav-option">
      <!-- 发行部分 -->
      <div class="item-option"
        @mouseout="isRelease = false"
        @mouseover="isRelease = true">
        <img class="img01" src="../../assets/version01/release-2.png" alt="发行">
        <img class="img01-copy" src="../../assets/version01/release-1.png" alt="发行">
        <span>发行</span>
        <img class="img02" src="../../assets/version01/pull.png" alt="箭头">
        <img class="img02-copy" src="../../assets/version01/pull-blue.png" alt="箭头">
        <ul class="m-list" v-show="isRelease">
          <li class="u-list" @click="switchItem = 'release'">
            资产发行
          </li>
          <li class="u-list" @click="switchItem = 'alot'">
            资产分配
          </li>
        </ul>
      </div>
      <!-- 转账部分 -->
      <div class="item-option">
        <img class="img01" src="../../assets/version01/transfer-2.png" alt="转账">
        <img class="img01-copy" src="../../assets/version01/transfer-1.png" alt="转账">
        <span>转账</span>
        <img class="img02" src="../../assets/version01/pull.png" alt="箭头">
        <img class="img02-copy" src="../../assets/version01/pull-blue.png" alt="箭头">
        <ul class="m-list">
          <li class="u-list" @click="switchItem = 'transferown'">
            行内转账
          </li>
          <li class="u-list" @click="switchItem = 'transferinter'">
            跨行转账
          </li>
        </ul>
      </div>
      <!-- 查询部分 -->
      <div class="item-option">
        <img class="img01" src="../../assets/version01/query-1.png" alt="查询">
        <img class="img01-copy" src="../../assets/version01/query-2.png" alt="查询">
        <span>查询</span>
        <img class="img02" src="../../assets/version01/pull.png" alt="箭头">
        <img class="img02-copy" src="../../assets/version01/pull-blue.png" alt="箭头">
        <ul class="m-list">
          <li class="u-list" @click="switchItem = 'list'">
            资产列表
          </li>
          <li class="u-list">
            历史记录
          </li>
        </ul>
      </div>
    </section>
    <div v-if="! switchItem" class="nav-item-pic">
      <img src="../../assets/version01/nav-bgk.png" alt="导航衬托图片">
    </div>
    <div v-if="switchItem === 'release'" class="nav-item-pic">
      <assets-release></assets-release>
    </div>
    <div v-if="switchItem === 'alot'" class="nav-item-pic">
      <assets-alot></assets-alot>
    </div>
    <div v-if="switchItem === 'transferown'" class="nav-item-pic">
      <transfer-own></transfer-own>
    </div>
    <div v-if="switchItem === 'transferinter'" class="nav-item-pic">
      <transfer-inter></transfer-inter>
    </div>
    <div v-if="switchItem === 'list'" class="nav-item-pic">
      <assets-list></assets-list>
    </div>
  </div>
</template>

<script>
import AssetsAlot from '@/views/supervision/AssetsAlot.vue'
import AssetsRelease from '@/views/supervision/AssetsRelease.vue'
import TransferInter from '@/views/transfer/TransferInter.vue'
import TransferOwn from '@/views/transfer/TransferOwn.vue'
import AssetsList from './AssetsList.vue'
export default {
  name: 'menu-option',
  data () {
    return {
      isRelease: false,
      switchItem: ''
    }
  },
  components: {
    AssetsAlot,
    AssetsRelease,
    TransferInter,
    TransferOwn,
    AssetsList
  }
}
</script>

<style lang="scss" scoped>
.nav-option {
  display: block;
  width: 100%;
  background-image: linear-gradient(-141deg, #1CCEF7 0%, #7561FA 100%);
  height: 7.125rem;
  box-sizing: border-box;
  white-space: nowrap;
  
  .item-option {
    position: relative;
    display: inline-flex;
    flex-direction: row;
    width: 33%;
    font-size: 2rem;
    color: white;
    align-items: center;
    height: 100%;
    &:hover {
      background-color: white;
      color: #4B41D5;
      .img02 {
        display: none;
      }
      .img02-copy {
        display: inline-block;
        width: 1.25rem;
        height: .625rem;
      }
      .img01 {
        display: none;
      }
      .img01-copy {
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;
        padding: 0px .6875rem 0 1.875rem;
      }
      .m-list {
        display: block;
        position: absolute;
        top: 7.1125rem;
        left: 0px;
        z-index: 979;
        margin: 0px;
        padding: 0px;
        list-style-type: none;
        .u-list {
          padding: 0px;
          margin: 0px;
          height: 5.625rem;
          line-height: 5.625rem;
          width: 14.65rem;
          text-align: center;
          font-size: 1.75rem;
          color: #393939;
          background-color: white;
          box-sizing: border-box;
          &:hover {
            color: #4B41D5;
          }
        }
      }
    }
    >span {
      width: 4rem;
      padding-right: 1.5rem
    }
    .img01 {
      width: 2.5rem;
      height: 2.5rem;
      padding: 0px .6875rem 0 1.875rem;
    }
    .img01-copy {
      display: none;
    }
    .img02 {
      width: 1.25rem;
      height: .625rem;
    }
    .img02-copy {
      display: none;
    }
    .m-list {
      display: none;
    }
  }
}
.nav-item-pic {
  display: block;
  width: 100%;
  height: 70vh;
  background-color: rgb(79, 82, 226);
  > img {
    display: block;
    margin: auto;
    padding: 7rem 0 0rem;
    width: 40.5rem;
    height: 37.3125rem;
  }
}
</style>
