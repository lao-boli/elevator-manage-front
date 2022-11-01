<template>
  <el-form>
    <el-form-item prop="nickName" label="用户昵称">
      <el-col :span="18">
        <el-input
          v-model.trim="tempUser.nickName"
        />
      </el-col>
    </el-form-item>

    <el-form-item prop="phone" label="手机号码">
      <el-col :span="18">
        <el-input
          v-model.trim="tempUser.phone"
        />
      </el-col>
    </el-form-item>

    <el-form-item prop="email" label="用户邮箱">
      <el-col :span="18">
        <el-input
          v-model.trim="tempUser.email"
        />
      </el-col>
    </el-form-item>

    <el-form-item prop="state" label="性别">
      <el-radio-group v-model="tempUser.gender">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="0">女</el-radio>
      </el-radio-group>
      <el-form-item>
        <el-button
          type="primary"
          @click="submit"
        >
          更新信息
        </el-button>
      </el-form-item>
    </el-form-item></el-form>
</template>

<script>
import { updateUser } from '@/api/user'

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
      tempUser: {}
    }
  },
  created() {
    this.tempUser = this.user
  },
  methods: {
    submit() {
      updateUser(this.tempUser).then(() => {
      })
    }
  }
}
</script>
