<template>
<section class="login">
  <article class="baas-dialog-wrapper">
  <section ref="dialog">
    <div class="el-dialog__header">
      <span class="el-dialog__title">资产管理平台</span>
    </div>
    <div class="bass-dialog-body">
      <section @keyup.enter="login">
        <el-form :model="loginData" label-position="top"
          ref="loginForm" label-width="100px" class="login-form">
          <el-form-item label="用户名" style="margin-bottom: 1.75rem;">
            <el-input v-model.trim="loginData.username" autoComplete="off" autofocus></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model.trim="loginData.password" :maxlength="20" autoComplete="off"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="bass-dialog-operation">
        <el-button type="primary" @click="login">登录</el-button>
      </section>
    </div>
  </section>
  </article>
</section>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'app-menu',

  data () {
    return {
      loginData: {
        username: null,
        password: null
      }
    }
  },
  mounted () {
    this.loginData.username = null
    this.loginData.password = null
  },
  methods: {
    ...mapActions([
      'userLogin'
    ]),
    login () {
      this.$http.post('/admin/user/login', this.loginData).then(res => {
        let resData = res.data
        if (resData.rtnCode === 200) {
          let userId = resData.data.userId
          this.userLogin(userId)
        } else if (resData.rtnCode === 303) {
          this.$message({
            message: '用户名或密码不正确',
            type: 'warning'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang='scss'>
@import '../style/variables.scss';

.login {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  .baas-dialog-wrapper {
    text-align: left;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    overflow: auto;
    margin: 0;
    z-index: 1024;
    background-color: rgba(245, 245, 245, 1);
    .el-dialog__header{
      padding: 2rem;
    }
    > section {
      position: absolute;
      left: 50%;
      top: 15%;
      height: auto;
      width: 25rem;
      border: 1px solid #D3DCE6;
      transform: translateX(-50%);
      background: $white-color;
      border-radius: 4px;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12), 0 0 6px 0 rgba(0,0,0,0.04);

      > h1 {
        font-size: 2rem;
        padding: 4rem 7.3rem 3rem 2rem;
        /*color: $grey-darker;*/
        letter-spacing: 0;
        line-height: 20px;
      }
    }
  }
}
.bass-dialog-body {
  padding: 0 2rem 2rem;
  border-bottom: 1px solid #EFF2F7;
  > .bass-dialog-operation {
    text-align: right;
    > a {
      font-size: 0.875rem;
    }
    > button {
      margin-top: 2rem;
      width: 100%;
    }
  }
  .el-form {
    .el-form-item {
      .el-input {
        > input {
          box-shadow: 0 0 0px 1000px $white-color inset;
        }
      }
    }
  }
}
.bass-dialog-fotter {
  text-align: center;
  .register-btn {
    display: block;
    font-size: 0.875rem;
    margin: 0 auto;
    padding: 2rem 0;
  }
}
.el-dialog__header {
    padding: 2rem 4rem;
}
</style>
