<template>
  <div class="main">
    <div v-if="type === 'button'">
      <el-button
        :type="itemType"
        :size="size"
        @click="handleClick"
      >
        {{ label }}
      </el-button>
    </div>
    <div
      v-if="type === 'link'"
    >
      <el-link
        class="item"
        :icon="icon"
        :type="itemType"
        :size="size"
        @click="handleClick"
      >
        {{ label }}
      </el-link>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'TableOptionItem',
  props: {
    type: {
      /**
       * [button,link]
       */
      type: String,
      default: 'link'
    },
    label: String,
    size: {
      type: String,
      default: 'mini'
    },
    itemType: {
      type: String,
      default: 'primary'
    },
    icon: String
  },
  methods: {
    handleClick() {
      this.$emit('handleClick')
    }
  }
}
</script>

<style scoped>
.item {
  font-size: 12px;
  padding-right: 10px;
}
</style>
