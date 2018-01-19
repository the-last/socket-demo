<template>
  <section>
    <el-table :data="tableData" border :default-sort="{prop: 'assetId', order: 'ascending'}">
      <el-table-column prop="assetId" label="资产编号" width="180" sortable></el-table-column>
      <el-table-column prop="assetInfo" label="资产名称"></el-table-column>
    </el-table>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      tableData: []
    }
  },
  computed: {
    ...mapGetters({
      _user: '_user'
    })
  },
  mounted () {
    let url = '/api/wallet/listAssetIds'
    this.$http.post(url, {}).then(res => {
      let resData = res.data
      let code = parseInt(resData.code)
      if (code === 200) {
        var that = this
        resData.data.forEach(function (item) {
          let listdata = []
          listdata.push(item)
          let req = JSON.stringify(listdata)
          that.$http.post('api/wallet/queryAsset', {
            'assetId': req
          }).then(res => {
            let rd = res.data
            let codeinear = parseInt(rd.code)
            if (codeinear === 200) {
              that.tableData = that.tableData.concat(rd.data)
            } else if (codeinear === 403) {
              this.$toast.success({
                message: '参数为空'
              })
            } else if (codeinear === 410) {
              this.$toast.success({
                message: '余额不足'
              })
            } else {
              this.$toast.success({
                message: '网络出错'
              })
            }
          }).catch(err => {
            console.log(err)
          })
        })
      } else if (code === 403) {
        this.$toast.success({
          message: '参数为空'
        })
      } else if (code === 410) {
        this.$toast.success({
          message: '余额不足'
        })
      } else {
        this.$toast.success({
          message: '网络出错'
        })
      }
    }).catch(err => {
      console.log('行内转账，获取zichan列表时出错：', err)
    })
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
  margin: 0 auto;
  box-sizing: border-box;
  padding-top: 2rem;
}
.el-table--fit {
  width: 95%;
  margin: 0 auto 1rem;
}
.el-table--enable-row-transition .el-table__body td {
  font-size: .75rem;
  color: $gray-color;
}
</style>
