<template>
  <section>
    <el-form ref="form" v-model.trim="formLabelAlign" label-width="80px">
      <el-form-item label="用户">
        <el-select class="u-input" v-model.trim="formLabelAlign.userId" placeholder="请选择账户">
          <el-option v-for="item in listUser" :value="item" :lable="item" :key="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资产">
        <el-select v-model.trim="formLabelAlign.assetId" placeholder="请选择资产">
          <el-option v-for="item in assetsList" :value="item" :lable="item" :key="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="份额">
        <el-input v-model.trim="formLabelAlign.count" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">确认分配</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      listUser: [],
      formLabelAlign: {
        userId: '',
        assetId: '',
        count: ''
      },
      assetsList: []
    }
  },
  methods: {
    submitForm () {
      let url = '/api/admin/assign'
      this.formLabelAlign.userId = document.getElementById('userId_list').value
      this.$http.post(url, this.formLabelAlign).then(res => {
        let dd = parseInt(res.data.code)
        if (dd === 200) {
          this.$toast.success({
            message: '资产分配成功'
          })
          document.getElementById('userId_list').value = ''
          this.formLabelAlign.assetId = ''
          this.formLabelAlign.count = ''
        } else {
          this.$toast.error({
            message: '资产分配失败'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getAssets () {
      // 查询链上所有资产id列表
      let url = 'api/wallet/listAssetIds'
      this.$http.post(url, {}).then(res => {
        let resData = res.data
        let code = parseInt(resData.code)
        if (code === 200) {
          this.assetsList = this.$lodash.sortBy(resData.data, function (item) { return item })
        } else {
          this.$toast.success({
            message: '已获取资产列表'
          })
        }
      }).catch(err => {
        console.log('行内转账，获取zichan列表时出错：', err)
      })
    }
  },
  computed: {
    ...mapGetters({
      _user: '_user'
    })
  },
  mounted () {
    let url = '/api/admin/listUsers'
    this.$http.post(url, {}).then(res => {
      let resData = res.data
      if (parseInt(resData.code) === 200) {
        this.listUser = this.$lodash.sortBy(resData.data, function (item) { return item })
      } else {
        this.$toast.success({
          message: resData.message
        })
      }
    }).catch(err => {
      console.log('资产分配，获取账户列表时出错：', err)
    })
    this.getAssets()
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
  padding: 2rem 2rem 0 0;
}

section .el-form > .el-form-item__content > .el-select > .el-input__inner {
  height: 3.5rem !important;
  border: 1px solid #e4e4e4;
  border-radius: 3px;
}
</style>
