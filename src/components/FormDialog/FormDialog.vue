<template>
  <el-dialog
    :title="currentTitle"
    :visible.sync="formVisible"
    :width="width"
    :append-to-body="true"
    @open="handleTitle"
  >
    <slot />
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleConfirm">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'FormDialog',
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    title: String,
    type: {
      /**
       * [create,update,other]
       */
      type: String,
      default: 'create'
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '700px'
    }

  },
  data() {
    return {
      currentTitle: '',
      titleMap: {
        'create': '新增',
        'update': '更新'
      }
    }
  },

  computed: {
    formVisible: {
      get() {
        return this.visible
      },
      set(newValue) {
        console.log('set')
        this.$emit('change', newValue)
      }
    }
  },
  mounted() {
  },
  methods: {
    handleTitle() {
      if (this.title) {
        this.currentTitle = this.title
        return
      }
      if (this.type === 'create') {
        this.currentTitle = '新增'
      } else if (this.type === 'update') {
        this.currentTitle = '更新'
      } else {
        this.currentTitle = this.title
      }
    },
    handleConfirm() {
      if (this.type === 'create') {
        this.create()
      } else if (this.type === 'update') {
        this.update()
      } else {
        this.confirm()
      }
    },
    create() {
      this.$emit('create')
    },
    update() {
      this.$emit('update')
    },
    confirm() {
      this.$emit('confirm')
    }

  }
}
</script>

<style scoped>

</style>
