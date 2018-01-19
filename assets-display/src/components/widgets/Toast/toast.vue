<template>
  <transition name="el-message-fade">
    <div
      class="el-message"
      :class="customClass"
      v-show="visible"
      :style="{ top: '30%'}"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()">
      <i
        class="el-notification__icon"
        :class="[ typeClass, iconClass ]"
        v-if="type || iconClass">
      </i>
      <div class="el-notification__group" :class="{ 'is-with-icon': typeClass || iconClass }">
        <h2 class="el-notification__title" v-text="title"></h2>
        <div class="el-notification__content"><slot>{{ message }}</slot></div>
        <div class="el-notification__closeBtn el-icon-close" @click="close"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
let typeMap = {
  success: 'circle-check',
  info: 'information',
  warning: 'warning',
  error: 'circle-cross'
}

export default {
  data () {
    return {
      visible: false,
      title: '',
      message: '',
      duration: 2000,
      type: '',
      customClass: '',
      iconClass: '',
      onClose: null,
      closed: false,
      timer: null
    }
  },

  computed: {
    typeClass () {
      return this.type && typeMap[this.type] ? `el-icon-${typeMap[this.type]}` : ''
    }
  },

  watch: {
    closed (newVal) {
      if (newVal) {
        this.visible = false
        this.$el.addEventListener('transitionend', this.destroyElement)
      }
    }
  },

  methods: {
    destroyElement () {
      this.$el.removeEventListener('transitionend', this.destroyElement)
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },

    close () {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose()
      }
    },

    clearTimer () {
      clearTimeout(this.timer)
    },

    startTimer () {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close()
          }
        }, this.duration)
      }
    }
  },

  mounted () {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        if (!this.closed) {
          this.close()
        }
      }, this.duration)
    }
  }
}
</script>
