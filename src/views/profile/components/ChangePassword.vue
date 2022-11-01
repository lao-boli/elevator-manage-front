<template>
  <el-form>
    <el-form-item prop="oldPassword" label="旧密码">
      <el-col :span="18">
        <el-input
          v-model.trim="tempUser.oldPassword"
        />
      </el-col>
    </el-form-item>

    <el-form-item prop="newPassword" label="新密码">
      <el-col :span="18">
        <el-input
          v-model.trim="tempUser.newPassword"
        />
      </el-col>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="submit"
      >
        修改密码
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { changePassword } from '@/api/user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  data() {
    return {
      tempUser: {
        userId: '',
        oldPassword: '',
        newPassword: ''
      }
    }
  },
  created() {
    this.tempUser.userId = this.user.userId
  },
  methods: {
    submit() {
      changePassword(this.tempUser)
    }
  }
}
</script>
