<template>
  <div class="tool-bar">
    <div class="left">
      <el-button
        v-if="hide !== 'add'"
        type="primary"
        size="mini"
        @click="handleCreate"
      >
        <i class="el-icon-plus" />
        添加
      </el-button>
    </div>
    <div class="right">
      <el-button
        size="mini"
        type="primary"
        @click="handleShow"
      >
        {{ show ? '隐藏' : '展开' }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="refresh"
      >刷新</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableToolBar',
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    type: {
      /**
       * [button,link]
       */
      type: String,
      default: 'button'
    },

    /**
     * [add]
     */
    hide: {
      type: String
    }

  },

  computed: {
    showFlag: {
      get() {
        return this.show
      },
      set(newValue) {
        this.$emit('change', newValue)
      }
    }
  },
  methods: {
    handleShow() {
      this.showFlag = !this.showFlag
    },
    handleCreate() {
      this.$emit('handleCreate')
    },
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  width: inherit;
  display: flex;
  padding: 10px;
  .left {
  }
  .right {
    margin-left: auto;
  }
}

</style>
