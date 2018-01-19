<template>
  <section>
    <h1>
      区块记录 <span>/区块高度 {{ blockHeight }}</span>
    </h1>
    <div class="m-bc">
      <div class="m-loop" ref="blockLoop">
        <div class="u-bc" v-for="(item, key) in blockItems" :key="key">
          <span class="col">
            <span class="row">序号</span>
            <span class="row">{{ item.number }}</span>
          </span>
          <span class="col">
            <span class="row">Hash值</span>
            <span class="row">{{ item.hash }}</span>
          </span>
          <span class="col">
            <span class="row">有效个数</span>
            <span class="row">{{ item.validateCount }}</span>
          </span>
          <span class="col">
            <span class="row">无效个数</span>
            <span class="row">{{ item.unValidateCount }}</span>
          </span>    
          <div class="logo" v-if="key !== 0">
            <span class="chain-tip top"></span>
            <span class="chain-tip">
              <img src="../../assets/version01/arrow-back.png" alt="回溯箭头">
            </span>
            <span class="chain-tip bottom"></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BlockChain',
  data () {
    return {
      channelName: null,
      blockItems: [],
      blockItemsCopy: [],
      blockObject: {},
      blockHeight: 0,
      headerBlock: {
        height: null,
        current_hash: null,
        previous_hash: null
      },
      blockCount: 5,
      altitude: 0
    }
  },
  mounted () {
    this.getAllChannels()
    setInterval(() => {
      this.pollingStart()
    }, 2000)
  },
  methods: {
    animationA () {
      let left = 0
      var anit = setInterval(() => {
        left -= 5

        if (this.$refs['blockLoop']) {
          this.$refs['blockLoop'].setAttribute('style', 'left: ' + left / 16 + 'rem')
        }
        if (left === -265) {
          this.blockItems.shift()
          clearInterval(anit)
          if (this.$refs['blockLoop']) {
            this.$refs['blockLoop'].setAttribute('style', 'left: 0rem')
          }
        }
      }, 20)
    },
    getAllChannels () {
      let getChannelIp = this.$blockHistoryIp + 'channels?peer=' + this.$peerServerIp
      this.$http.get(getChannelIp).then(res => {
        let code = res.status
        if (code === 200) {
          let newArr = res.data
          this.channelName = newArr[0].name
          this.getChannelHeader(this.channelName)
        }
      })
    },
    getChannelHeader (name) {
      let getChannelIp = this.$blockHistoryIp + 'channels/' + name + '?peer=' + this.$peerServerIp
      this.$http.get(getChannelIp).then(res => {
        let code = res.status
        if (code === 200) {
          localStorage.setItem('height', res.data.height)
          this.blockHeight = res.data.height
          this.headerBlock.current_hash = res.data.current_block_hash
          this.headerBlock.previous_hash = res.data.previous_block_hash
          this.getBlocks(name, this.headerBlock.current_hash)
        }
      })
    },
    pollingWebsocketStart () {
      // let ws = new WebSocket('ws:172.24.241.21:10088/blkexplorer/api/v1/ws')
    },
    pollingStart () {
      let getChannelIp = this.$blockHistoryIp + 'channels/' + this.channelName + '?peer=' + this.$peerServerIp
      this.$http.get(getChannelIp).then(res => {
        let code = res.status
        if (code === 200) {
          let hg = localStorage.getItem('height')
          this.altitude = res.data.height - hg + 1
          let currentHash = res.data.current_block_hash
          if (this.altitude !== 0) {
            // 同步更新区块高度值
            this.blockHeight = res.data.height
            localStorage.setItem('height', res.data.height)
            this.pollingBlocks(this.channelName, currentHash)
          }
        }
      })
    },
    pollingBlocks (name, hash) {
      this.altitude--
      if (this.altitude > 0) {
        let getBlockIp = this.$blockHistoryIp + 'channels/' + name + '/blocks/' + hash + '?peer=' + this.$peerServerIp
        if (this.blockItems.length < this.blockCount) {
          this.$http.get(getBlockIp).then(res => {
            let code = res.status
            if (code === 200) {
              let num = res.data.number
              let preHash = res.data.previous_hash
              let vCount = 0
              let unCount = 0
              let total = res.data.transactions.length
              res.data.transactions.forEach((value) => {
                if (value.validation_result === 'VALID') {
                  ++vCount
                }
              })
              unCount = total - vCount
              this.blockObject = {
                hash: hash,
                number: num,
                validateCount: vCount,
                unValidateCount: unCount
              }
              this.blockItemsCopy.push(this.blockObject)
              this.pollingBlocks(name, preHash)
            }
          })
        }
      } else if (this.altitude === 0) {
        let interval = setInterval(() => {
          if (this.blockItemsCopy.length !== 0) {
            this.blockItems.push(this.blockItemsCopy.pop())
            this.animationA()
            localStorage.setItem('startHistoryPolling', 1)
          } else {
            clearInterval(interval)
          }
        }, 1000)
      }
    },
    getBlocks (name, hash) {
      let getBlockIp = this.$blockHistoryIp + 'channels/' + name + '/blocks/' + hash + '?peer=' + this.$peerServerIp
      if (this.blockItems.length < this.blockCount) {
        this.$http.get(getBlockIp).then(res => {
          let code = res.status
          if (code === 200) {
            let num = res.data.number
            let preHash = res.data.previous_hash
            let vCount = 0
            let unCount = 0
            let total = res.data.transactions.length
            res.data.transactions.forEach((value) => {
              if (value.validation_result === 'VALID') {
                ++vCount
              }
            })
            unCount = total - vCount
            this.blockObject = {
              hash: hash,
              number: num,
              validateCount: vCount,
              unValidateCount: unCount
            }
            this.blockItems.unshift(this.blockObject)
            this.getBlocks(name, preHash)
          }
        })
      } else if (this.blockItems.length === this.blockCount) {
        this.animationA()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  h1 {
    display: block;
    border-left: .5625rem solid #00D6FE;
    padding-left: 1.3125rem;
    color: white;
    font-size: 2rem;
    height: 2rem;
    line-height: 2rem;
    margin: 7.5rem 0 1.5rem;
    > span {
      padding-left: 1.5rem;
      font-size: 1.5rem;
      font-weight: 100;
    }
  }
  display: block;
  width: 99%;
  height: 100%;
  text-align: left;
  .m-bc {
    position: relative;
    display: block;
    width: 100%;
    height: 15.2rem;
    text-align: left;
    white-space: nowrap;
    .m-loop {
      position: absolute;
      left: 0px;
      top: 0px;
      .u-bc {
        position: relative;
        display: inline-block;
        width: 15rem;
        height: 15rem;
        min-width: 15rem;
        min-height: 15rem;
        padding: 2.9375rem 1.625rem;
        margin: 0 1rem .625rem;
        border-radius: 3px;
        box-sizing: border-box;
        background-color: white;
        white-space: normal;
        font-size: 1rem;
        .col {
          display: inline-block;
          width: 45%;
          box-sizing: border-box;
          height: 5rem;
          overflow: hidden;
          .row {
            display: block;
            padding-left: 4px;
            text-align: left;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            &:last-of-type {
              color: #00D6FE;
              margin-top: .625rem;
            }
          }
        }
        
        > .logo {
          position: absolute;
          left: -2rem;
          top: 0px;
          width: 1.875rem;
          height: 100%;
          .chain-tip {
            position: absolute;
            top: 40%;
            right: -0.5rem;
            width: 2.75rem;
            height: .3125rem;
            border-radius: 8px;
            background-color: transparent;
            &.top {
              top: 2rem;
              background: url('../../assets/version01/chain-tip.png') no-repeat;
              background-size: 100% 100%;
            }
            &.bottom {
              top: 85%;
              background: url('../../assets/version01/chain-tip.png') no-repeat;
              background-size: 100% 100%;
            }
            > img {
              display: inline-block;
              margin: 60% 0 0 1rem;
              width: .8125rem;
              height: .75rem;
            }
          }
        }
      }
    }
  }
}
</style>
