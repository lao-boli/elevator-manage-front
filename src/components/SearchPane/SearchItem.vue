
<template>
  <div class="search-item">
    <span v-if="label !== ''">{{ label }}:  </span>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SearchItem',
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.search-item {
  flex: initial;
  padding-right: 10px;
  padding-bottom: 10px;
  color: #606266;
  font-size: 14px;
  font-weight: bold;
  span {
    padding-right: 10px;
  }
}
</style>
