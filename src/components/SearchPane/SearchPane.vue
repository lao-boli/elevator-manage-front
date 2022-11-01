<template>
  <div>
    <el-collapse-transition>
      <el-card
        v-if="show"
      >
        <div class="pane">
          <slot />
          <search-item class="btn-group">
            <el-button
              type="primary"
              size="mini"
              @click="search"
            >
              <i class="el-icon-search" />
              搜索
            </el-button>

            <el-button
              type="primary"
              size="mini"
              @click="reset"
            >
              <i class="el-icon-refresh-left" />
              重置
            </el-button>
          </search-item>
        </div>
      </el-card>

    </el-collapse-transition>
  </div>
</template>

<script>
import SearchItem from '@/components/SearchPane/SearchItem'
export default {
  name: 'SearchPane',
  components: { SearchItem },
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    search() {
      this.$emit('search')
    },
    reset() {
      this.$emit('reset')
    }

  }
}
</script>

<style scoped>
.pane {
  width: inherit;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin: 10px 10px 10px 10px;
  transition: height 0.5s;
}
.btn-group {
  flex-direction: row-reverse;
  margin-left: auto;
}
</style>
