<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="10" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="14" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本资料" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="changePassword">
                <change-password :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import ChangePassword from '@/views/profile/components/ChangePassword'

export default {
  name: 'Profile',
  components: { ChangePassword, UserCard, Activity, Timeline, Account },
  data() {
    return {

      user: {},
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },
  created() {
    // console.log(this.currentUser)
    this.user = this.currentUser
    console.log(this.user)
  },
  methods: {

  }
}
</script>

