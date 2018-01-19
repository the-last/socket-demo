<template>
  <section>
    <el-form :label-position="right = 'right'" label-width="110px" :model="transferInter">
      <el-form-item label="转出账户">
        <el-select v-model="transferInter.outUserId" placeholder="请输入转出方用户ID">
          <el-option v-for="item in userList" :value="item" :lable="item" :key="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易的资产ID">
        <el-select v-model="transferInter.assetId" placeholder="请输入交易的资产ID">
          <el-option v-for="item in assetsList" :value="item" :lable="item" :key="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易的资产份额">
        <el-autocomplete style="width: 90%;"
          v-model="transferInter.count"
          :fetch-suggestions="assetSearch"
          placeholder="请输入转出的资产份额"
        ></el-autocomplete>
        <span class="u-share">（份额: {{ assetsLot }} ）</span>
      </el-form-item>
      <el-form-item label="转入账户的所属机构ID">
        <el-autocomplete style="width: 85%;"
          v-model="transferInter.inBankId"
          :fetch-suggestions="orgSearch"
          placeholder="请输入目标账户所属机构的ID"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="转入账户">
        <el-autocomplete style="width: 90%;"
          v-model="transferInter.inUserId"
          :fetch-suggestions="accountSearch"
          placeholder="请输入转入账户ID"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="交易信息">
        <el-input type="textarea" v-model="transferInter.extensionInfo" :rows="5" :maxlength="400"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="enableButton" @click="submitForm">确认转账</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      transferInter: {
        outUserId: null,
        assetId: null,
        count: null,
        inBankId: null,
        inUserId: null,
        extensionInfo: null
      },
      enableButton: false,
      userList: [],
      assetsList: [],
      assetsLot: '转出账户资产为空*.*'
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
      let code = parseInt(resData.code)
      if (code === 200) {
        this.userList = this.$lodash.sortBy(resData.data, function (item) { return item })
      } else if (code === 403) {
        this.$toast.success({
          message: '参数错误'
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
      console.log('行内转账，获取账户列表时出错：', err)
    })
  },
  watch: {
    'transferInter.outUserId' (accountId) {
      if (accountId) {
        let url = '/api/wallet/listAssetIds'
        this.$http.post(url, {}).then(res => {
          let resData = res.data
          let code = parseInt(resData.code)
          if (code === 200) {
            this.assetsList = this.$lodash.sortBy(resData.data, function (item) { return item })
          } else if (code === 403) {
            this.$toast.success({
              message: '参数错误'
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
        let url2 = '/api/wallet/getUserPositionOnChain'
        this.$http.post(url2, {
          'userId': accountId
        }).then(res => {
          let resData = res.data
          let code = parseInt(resData.code)
          if (code === 200) {
            let nodata = this.$isEmptyObject(resData.data)
            if (!nodata) {
              this.assetsLot = resData.data
            } else {
              this.assetsLot = '转出账户资产为空*.*'
            }
          } else if (code === 403) {
            this.$toast.success({
              message: '参数错误'
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
          console.log('跨行转账 获取账户余额时出粗:', err)
        })
      }
    }
  },
  methods: {
    ...mapActions([
      'userTyper'
    ]),
    orgSearch (orgstring, cs) {
      let arr = [
        {
          'value': 'demo2'
        }
      ]
      cs(arr)
      arr = []
    },
    assetSearch (assetString, cb) {
      let arr = [{
        'value': 1
      }, {
        'value': 2
      }, {
        'value': 3
      }, {
        'value': 4
      }, {
        'value': 5
      }]
      cb(arr)
      arr = []
    },
    accountSearch (accountString, cb) {
      let arr = [{
        'value': 'Alice'
      }, {
        'value': 'Bob'
      }]
      cb(arr)
      arr = []
    },
    submitForm () {
      let url = '/api/wallet/assetTransferInterBank'
      this.$http.post(url, this.transferInter).then(res => {
        let resData = res.data
        let code = parseInt(resData.code)
        if (code === 200) {
          let transferCopy = {
            outUserId: null,
            assetId: null,
            count: null,
            inBankId: null,
            inUserId: null,
            extensionInfo: null
          }
          this.assetsLot = null
          this.transferInter = transferCopy
          this.$toast.success({
            message: '交易请求发送成功'
          })
        } else if (code === 403) {
          this.$toast.success({
            message: '参数错误'
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
        console.log('网络出错', err)
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
  margin: 0 auto;
  box-sizing: border-box;
  padding-top: 2rem;
}

.el-form--label-top {
  padding: 0 2rem;
}
.el-button--primary {
  background-color: $table-top;
  border-color: $header-tit;
}
.el-input__inner {
  color: $gray-color;
}
#in_userId {
  width: 99.6%;
  font-size: .875rem;
  line-height: 2.4;
  border-radius: .25rem;
  text-indent: .625rem;
  border: 1px solid #bfcbd9;
  position: relative;
}
#in_userId::-webkit-input-placeholder {
  color: #bdbae0;
  position: absolute;
  top: 0px;
  left: 10px;
}
#in_userId:-moz-placeholder {
  color: #bdbae0;
}
#in_userId::-moz-placeholder {
  color: #bdbae0;
}
#in_userId:-ms-input-placeholder {
  color: #bdbae0;
}


.el-select {
  width: 90%;
}
.el-input {
  width: 90%;
}
.el-textarea {
  width: 90%;
}

.el-autocomplete {
  width: 90%;
}
.u-share {
  position: absolute;
  font-size: 1rem;
  top: -1.9375rem;
  left: 0.9375rem;
  color: darkgray;
}
</style>
