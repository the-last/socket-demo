<template>
  <section>
  <div class="m-middle">
    <img src="../assets/logoicon.png">
    <p class="u-title">金融壹账通 - 资产管理平台</p>
  </div>
  <div class="m-bottom">
    <p class="u-copyright">Copyright &copy; PingAn Insurance (Group) Company of China, Ltd.</p>
  </div>
  </section>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../style/variables.scss';

.m-middle {
  margin: 10rem auto 0;
  text-align: center;
  > img {
    display: inline-block;
    width: 5.5rem;
    height: 5.5rem;
  }
  .u-title {
    color: #3c8dbc;
    font-size: 1.8rem;
    font-weight: bolder;
  }
}
.m-bottom {
  margin: 14rem auto 0;
  .u-copyright {
    width: 100%;
    text-align: center;
  }
}
</style>
