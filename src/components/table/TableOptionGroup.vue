<template>
  <div class="main">
    <div
      v-if="type === 'button'"
      class="option-group"
    >
      <div class="item">
        <el-button
          class="item"
          type="primary"
          size="mini"
          @click="handleUpdate"
        >
          修改
        </el-button>
      </div>
      <div class="item">
        <el-button
          type="danger"
          size="mini"
          @click="handleDelete"
        >
          删除
        </el-button>
      </div>
      <slot name="button" />
    </div>

    <div
      v-if="type === 'link'"
      class="option-group"
    >
      <el-link
        class="item"
        icon="el-icon-edit"
        type="primary"
        size="mini"
        @click="handleUpdate"
      >
        <div>修改</div>
      </el-link>
      <el-link
        class="item"
        icon="el-icon-delete"
        type="primary"
        size="mini"
        @click="handleDelete"
      >删除</el-link>
      <slot name="link" />
    </div>
    <div v-if="type === 'none'" class="option-group">
      <slot name="none" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableOptionGroup',
  props: {
    type: {
      /**
       * [button,link,none]
       */
      type: String,
      default: 'link'
    }
  },
  methods: {
    handleDelete() {
      this.$emit('handleDelete')
    },
    handleUpdate() {
      this.$emit('handleUpdate')
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
}
.option-group {
  display: flex;
  justify-content: initial;
  .item {
    font-size: 12px;
    padding-right: 10px;
  }
}

</style>
