<template>
  <section>
    <form class="m-form">
      <div>
        <span class="u-left">资产编号: </span>
        <input class="u-right" v-model.trim="formLabelAlign.assetId" placeholder="例: aaa123"></input>
      </div>
      <div>
        <span class="u-left">资产名称: </span>
        <input class="u-right" v-model.trim="formLabelAlign.assetInfo" placeholder="例: 银行资产1号"></input>
      </div>
      <div>
        <span class="u-left">资产说明: </span>
        <input class="u-right" type="textarea" v-model.trim="formLabelAlign.assetDesc" placeholder="例: 测试产品" :rows="10"></input>
      </div>
      <div>
        <button class="el-button btn-position" type="button" @click.prevent.stop="submitForm">确认发行</button>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        assetId: '',
        assetInfo: '',
        assetDesc: ''
      }
    }
  },
  methods: {
    submitForm () {
      this.$http.post('/api/admin/issue', this.formLabelAlign).then(res => {
        let code = parseInt(res.data.code)
        if (code === 200) {
          this.$toast.success({
            message: '资产发布成功'
          })
          this.formLabelAlign.assetId = ''
          this.formLabelAlign.assetInfo = ''
          this.formLabelAlign.assetDesc = ''
        } else {
          this.$toast.error({
            message: '资产发布失败'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../style/variables.scss';

section {
  display: block;
  background-color: white;
  overflow: hidden;
  width: 100%;
  margin: auto;
  box-sizing: border-box;
  padding-top: 2rem;
}
.m-form {
  display: block;
  width: 100%;
  height: auto;
  padding: 1.5rem;
  font-size: 1.5rem;
  color: #4a4a4a;
  box-sizing: border-box;
  > div {
    display: flex;
    flex-direction: row;
    margin: 2rem 0;
    
    .u-left, .u-right {
      flex: 1;
      height: 3.5rem;
      line-height: 3.5rem;
    }
    .u-right {
      flex: 5;
      border-radius: 3px;
      border: 1px solid #4a4a4a;
      margin-left: .8125rem;
      outline: none;
      text-indent: .5em;
      font-size: 1.5rem;
      &::-webkit-input-placeholder {
        color: #bdbae0;
        font-size: 1.5rem;
      }
      &:-moz-placeholder {
        color: #bdbae0;
        font-size: 1.5rem;
      }
      &::-moz-placeholder {
        color: #bdbae0;
        font-size: 1.5rem;
      }
      &:-ms-input-placeholder {
        color: #bdbae0;
        font-size: 1.5rem;
      }
    }
    .btn-postion {
      float: right;
    }
    &:after {
      content: 'after';
      display: block;
      width: 0px;
      height: 0px;
      overflow: hidden;
      clear: both;
    }
  }
}
</style>
