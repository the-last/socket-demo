<template>
  <section>
    <el-form :label-position="top = 'right'" label-width="110px" :model="transferOwn">
      <el-form-item label="转出账户">
        <el-select v-model.trim="transferOwn.outUserId" placeholder="请选择转出方用户ID">
          <el-option v-for="(item, index) in userList" :value="item" :lable="index" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易的资产ID">
        <el-select v-model.trim="transferOwn.assetId" placeholder="请输入交易的资产ID">
          <el-option v-for="item in assetsList" :value="item" :lable="item" :key="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转出资产份额">
        <el-autocomplete style="width: 90%;"
          v-model="transferOwn.count"
          :fetch-suggestions="assetSearch"
          placeholder="请输入转出资产份额"
        ></el-autocomplete>
        <span class="u-share">（份额: {{ assetsLot }} ）</span>
      </el-form-item>
      <el-form-item label="转入账户">
        <el-autocomplete style="width: 90%;"
          v-model="transferOwn.inUserId"
          :fetch-suggestions="querySearch"
          placeholder="请输入转入账户ID"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="转入资产份额">
        
        <el-autocomplete style="width: 90%;"
          v-model="transferOwn.wrongCount"
          :fetch-suggestions="assetSearch"
          placeholder="请输入转入资产份额"
        ></el-autocomplete>

      </el-form-item>
      <el-form-item label="交易信息">
        <el-input id="transferInner" type="textarea" v-model.trim="transferOwn.extensionInfo" placeholder="请输入交易信息" :rows="5" :maxlength="300"></el-input>
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
      rangeState: false,
      transferOwn: {
        outUserId: null,
        assetId: null,
        count: null,
        wrongCount: null,
        inUserId: null,
        extensionInfo: null
      },
      enableButton: false,
      userList: [],
      assetsList: [],
      assetsLot: '转出账户资产为空*.*',
      index: 1
    }
  },
  computed: {
    ...mapGetters({
      _user: '_user'
    })
  },
  mounted () {
    this.getRangeState()
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
          message: '网络错误'
        })
      }
    }).catch(err => {
      console.log('行内转账，获取账户列表时出错：', err)
    })
  },
  watch: {
    'transferOwn.outUserId' (accountId) {
      if (accountId) {
        let url = '/api/wallet/listAssetIds'
        this.$http.post(url, {}).then(res => {
          let resData = res.data
          let code = parseInt(resData.code)
          if (code === 200) {
            this.assetsList = this.$lodash.sortBy(resData.data, function (item) { return item })
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
          if (parseInt(resData.code) === 200) {
            let nodata = this.$isEmptyObject(resData.data)
            if (!nodata) {
              this.assetsLot = resData.data
            } else {
              this.assetsLot = '转出账户资产为空*.*'
            }
          }
        }).catch(err => {
          console.log('跨行转账 获取账户余额时出粗:', err)
        })
      }
    }
  },
  methods: {
    ...mapActions([
      'setRangeProof'
    ]),
    getRangeState () {
      this.rangeState = this._user.rangeProofState
    },
    rangeSwitch () {
      this.optionRangeProof(this.rangeState)
    },
    optionRangeProof (newValue) {
      let openRangeProof = 'api/admin/rfopen'
      let closeRangeProof = 'api/admin/rfclose'
      let url = newValue ? openRangeProof : closeRangeProof
      this.$http.post(url, {}, {
        validateStatus: function (status) {
          return status <= 510
        }
      }).then(res => {
        let resData = res.data
        let code = parseInt(resData.code)
        if (code === 200) {
          let tip = newValue ? 'Range Proof 已打开！' : 'Range Proof 已关闭！'
          this.$toast.success(tip)
          this.setRangeProof(newValue)
        }
        if (parseInt(res.status) > 401) {
          this.$toast.error('网络出错！')
          this.getRangeState()
        }
      }).catch(err => {
        console.log('设置RangeProof时出错：', err)
      })
    },
    submitForm () {
      let url2
      if (this.transferOwn.count !== this.transferOwn.wrongCount) {
        url2 = '/api/wallet/assetWrongTransfer'
      } else {
        url2 = '/api/wallet/assetTransferInnerBank'
      }
      this.$http.post(url2, this.transferOwn).then(res => {
        let resData = res.data
        let code = parseInt(resData.code)
        if (code === 200) {
          let transferCopy = {
            outUserId: null,
            assetId: null,
            count: null,
            wrongCount: null,
            inUserId: null,
            extensionInfo: null
          }
          this.assetsLot = null
          this.transferOwn = transferCopy
          this.$toast.success({
            message: '交易请求发送成功'
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
        console.log('行内转账，提交转账时出错：', err)
      })
    },
    querySearch (queryString, cb) {
      let array = []
      this.userList.forEach(function (item) {
        let object = {
          'value': null,
          'test': null
        }
        object.value = item
        object.test = 'test'
        array.push(object)
      })
      cb(array)
      array = []
    },
    assetSearch (assetString, cb) {
      let arr = [{
        'value': '1',
        'test': 'test'
      }, {
        'value': '2',
        'test': 'test'
      }, {
        'value': '3',
        'test': 'test'
      }, {
        'value': '4',
        'test': 'test'
      }, {
        'value': '5',
        'test': 'test'
      }]
      cb(arr)
      arr = []
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
