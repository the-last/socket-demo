<template>
  <section>
    <h1>交易历史</h1>
    <div class="b-item b-title">
      <span>资产编号</span>
      <span>转出账户</span>
      <span>转入账户</span>
      <span>转账份额</span>
      <span>日期</span>
      <span>交易状态</span>
    </div>
    <div class="b-item" v-for="(item, key) in queryResult" :key="key"  :class="{ unfocus: key>2, unshow: key>5 }">
      <span>{{ item.assetId }}</span>
      <span>{{ item.outAccount }}</span>
      <span>{{ item.inAccount }}</span>
      <span>{{ item.transAmount }}</span>
      <span>{{ item.requestDate }}</span>
      <span>{{ item.status === 1 ? '交易成功' : '交易失败' }}</span>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'HistoryRecords',
  data () {
    return {
      isAssetId: false,
      labelPosition: 'right',
      queryResult: [],
      queryNewResult: [],
      formLabelAlign: {
        assetId: ''
      },
      assetsCount: 0,
      allowObject: {
        assetId: '',
        outAccount: '',
        inAccount: '',
        transAmount: '',
        requestDate: '',
        status: ''
      },
      assetsList: [],
      transferIn: '',
      transferOut: ''
    }
  },
  computed: {
    ...mapGetters({
      _user: '_user'
    })
  },
  mounted () {
    this.initHistory()
    this.getLocal()
  },
  methods: {
    ...mapActions([
      'history'
    ]),
    getLocal () {
      setInterval(() => {
        let startHistory = localStorage.getItem('startHistoryPolling')
        if (startHistory === 1) {
          localStorage.setItem('startHistoryPolling', 0)
          this.startHistoryPolling()
        }
      }, 1000)
    },
    startHistoryPolling () {
      setInterval(() => {
        this.initHistory()
      }, 10000)
    },
    initHistory () {
      let url = '/api/wallet/listAssetIds'
      this.$http.post(url, {}).then(res => {
        let resData = res.data
        let code = parseInt(resData.code)
        if (code === 200) {
          this.assetsList = this.$lodash.sortBy(resData.data, function (item) { return item })
          this.assetsCount = this.assetsList.length
          this.submitForm(this.assetsList[--this.assetsCount])
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
        console.log('行内转账，获取资产列表时出错：', err)
      })
      this.allowObject = {
        assetId: '',
        outAccount: '',
        inAccount: '',
        transAmount: '',
        requestDate: '',
        status: ''
      }
    },
    clearInfo () {
      this.transferIn = ''
      this.transferOut = ''
    },
    submitForm (id) {
      --this.assetsCount
      console.log(this.assetsCount)
      if (this.assetsCount >= 0) {
        this.queryNewResult = []
        this.urlmain = '/api/wallet/queryTransferResult'
        this.$http.post(this.urlmain, {
          'assetId': id
        }).then(responeText => {
          let resData = responeText.data
          if (parseInt(resData.code) === 200 && resData.data.length !== 0) {
            let transferArray = resData.data
            let len = transferArray.length
            for (let i = 0; i < transferArray.length; i++) {
              let value = transferArray[i]
              let tai = value.transferAccountInfoList
              let outAccount
              let inAct
              let temporary = []
              tai.forEach((ve, index, array) => {
                if (parseInt(ve.type) === 0) {
                  temporary.push(ve)
                }
              })
              outAccount = temporary[0]
              tai.forEach((vl, index, array) => {
                if (parseInt(vl.type) === 1) {
                  inAct = vl
                }
              })

              const outAccountId = outAccount.account
              const inAccountId = inAct.account
              let outName
              let inName
              let out = this.getUserName(outAccountId)
              out.then(val => {
                outName = val
              }).catch(val => {
                outName = val
              })

              let inN = this.getUserName(inAccountId)
              inN.then(val => {
                inName = val
              }).catch(val => {
                inName = val
              })
              // }

              let st = setTimeout(() => {
                this.allowObject.inAccount = inName
                this.allowObject.outAccount = outName
                this.allowObject.transAmount = inAct.amount
                this.allowObject.assetId = value.assetId
                this.allowObject.requestDate = value.requestDate
                this.allowObject.status = value.status
                console.log('queryNewResult length', this.queryNewResult.length)
                if (this.queryNewResult.length <= len) {
                  this.queryNewResult.push(this.allowObject)
                } else {
                  // this.$toast.error({ message: '请勿重复操作...' })
                  return
                }
                this.allowObject = {
                  assetId: '',
                  outAccount: '',
                  inAccount: '',
                  transAmount: '',
                  requestDate: '',
                  status: ''
                }
                clearTimeout(st)
                this.submitForm(this.assetsList[this.assetsCount])
              }, 1000)
            }
          } else {
            this.submitForm(this.assetsList[this.assetsCount])
          }
        }).catch(err => {
          console.log('获取转账历史记录报错:', err)
        })
      } else {
        if (this.queryResult.length === 0) {
          this.queryResult = this.queryNewResult
        } else if (this.queryNewResult.length - 1 === this.queryResult.length) {
          setTimeout(() => {
            let u = this.queryNewResult.shift()
            this.queryResult.unshift(u)
            u = null
          }, 500)
        }
      }
    },
    getUserName (accountId) {
      let account = accountId
      return new Promise((resolve, reject) => {
        this.$http.post('/api/wallet/queryUser', {
          'accountId': accountId
        }).then(res => {
          let resData = res.data
          if (parseInt(resData.code) === 200) {
            resolve(resData.id)
          } else {
            reject(account)
          }
        }).catch(err => {
          console.log('获取用户名出错', err)
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../style/variables.scss';
section {
  h1 {
    display: block;
    border-left: .5625rem solid #00D6FE;
    padding-left: 1.3125rem;
    color: white;
    font-size: 2rem;
    height: 2rem;
    line-height: 2rem;
    margin: 2rem 0 1.5rem;
    > span {
      padding-left: 1.5rem;
      font-size: 1.5rem;
      font-weight: 100;
    }
  }
}
.b-item {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  width: 99%;
  height: 4.175rem;
  line-height: 4.175rem;
  margin-bottom: -0.14rem;
  margin-top: -0.14rem;
  border-radius: .125rem;
  border: .0125rem solid blue;
  text-align: center;
  background-color: white;
  > span {
    flex: 1;
    border: 0px;
    margin: 0px;
    padding: 0px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &.unfocus {
    border-color: #a5a5a5;
    background-color: #efeff3;
    color: #c5c5c5;
  }
  &.unshow {
    display: none;
  }
}
.b-title {
  color: white;
  background-image: linear-gradient(-150deg, #1CCEF7 0%, #7561FA 100%);
}
</style>
