<template>
  <div class="main">
    <div class="el-form-item">
      <span v-html="description+':&nbsp;&nbsp;&nbsp;&nbsp;'" />
      <el-input
        v-model="text"
        size="mini"
        :style="{width: currentInputWidth}"
        clearable
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'PDInput',
  props: {
    icon: String,
    name: String,
    type: {
      type: String,
      default: 'text'
    },
    description: String,
    value: [String, Number],
    inputWidth: String,
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean,
    min: String,
    max: String,
    step: String,
    minlength: Number,
    maxlength: Number,
    required: {
      type: Boolean,
      default: true
    },
    autoComplete: {
      type: String,
      default: 'off'
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentDescription: this.description,
      currentInputWidth: this.inputWidth,
      focus: false,
      fillPlaceHolder: null
    }
  },
  computed: {
    text: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.main {
  font-size: 14px;
  display: flex;
  span {
    text-align: center;
    display: inline;
  }
}
</style>
