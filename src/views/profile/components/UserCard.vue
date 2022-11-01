<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.role }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.nickName }}</div>
        <div class="user-role text-center text-muted">{{ user.role }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header" />
        <div class="user-bio-section-body">
          <div class="item">
            <span class="label">用户账号</span>
            <span class="value">{{ user.username }}</span>
          </div>
          <div class="item">
            <span class="label">用户昵称</span>
            <span class="value">{{ user.nickName }}</span>
          </div>
          <div class="item">
            <span>邮箱</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="item">
            <span>手机号码</span>
            <span class="value">{{ user.phone }}</span>
          </div>
          <div class="item">
            <span>用户公司</span>
            <span class="value">{{ user.companyName }}</span>
          </div>
          <div class="item">
            <span>创建日期</span>
            <span class="value">{{ user.createTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          nickName: '',
          email: '',
          phone: '',
          avatar: '',
          role: '',
          companyName: '',
          createTime: '',
          gender: ''
        }
      }
    }
  },
  created() {
    console.log(this.user)
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
     .user-bio-section-body {
       .item {
         display: flex;
         border-bottom: 1px solid #dfe6ec;
         padding-bottom: 10px;
         margin-bottom: 10px;
         font-weight: bold;
         .value {
           font-weight: normal;
           margin-left: auto;
         }
       }
     }
  }
}
</style>
