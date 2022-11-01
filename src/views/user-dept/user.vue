<template>
  <div>
    <search-pane
      :show="showFlag"
      @search="handleSearch"
      @reset="resetQueryParams"
    >
      <search-item>
        <PDInput
          v-model="queryParams.username"
          input-width="180px"
          description="用户名"
        />
      </search-item>

      <search-item>
        <PDInput
          v-model="queryParams.phone"
          input-width="180px"
          description="手机号码"
        />
      </search-item>
      <search-item
        label="公司名称"
      >
        <el-cascader
          v-model="queryParams.companyId"
          class="company-cascader"
          size="mini"
          :options="companyOption"
          :show-all-levels="false"
          :props="{
            emitPath:false,
            label:'name',value:'companyId',children:'children'}"
        />
      </search-item>
      <search-item
        label="创建时间"
      >
        <el-date-picker
          v-model="currentQueryDate"
          size="mini"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </search-item>
    </search-pane>
    <table-tool-bar
      v-model="showFlag"
      @handleCreate="handleCreateUser"
      @refresh="fetchUserPage"
    />
    <table-card>
      <el-table
        ref="filterTable"
        :data="userList"
        style="width: 100%"
      >

        <el-table-column
          prop="userId"
          label="用户id"
        />
        <el-table-column
          prop="username"
          label="用户账号"
        />
        <el-table-column
          prop="nickName"
          label="用户昵称"
        />
        <el-table-column
          prop="companyName"
          label="公司"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
        />
        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.state ? 'primary': 'danger'"
              disable-transitions
            >
              {{ scope.row.state ? '正常' : '停用' }}
            </el-tag>

          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <table-option-group
              type="link"
              @handleDelete="handleDeleteUser(scope.row.userId)"
              @handleUpdate="handleUpdateUser(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="fetchUserPage"
      />
    </table-card>
    <form-dialog
      v-model="dialogFormVisible"
      :type="formType"
      @create="createUser"
      @update="updateUser"
    >
      <el-form
        ref="dataForm"
        :rules="formRules"
        :model="tempUser"
      >

        <el-row
          v-if="formType === 'create'"
        >
          <el-col :span="12">
            <el-form-item prop="username" label="用户账号">
              <el-col :span="18">
                <el-input
                  v-model="tempUser.username"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="password" label="密码">
              <el-col :span="18">
                <el-input
                  v-model="tempUser.password"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="nickName" label="用户昵称">
              <el-col :span="18">
                <el-input
                  v-model="tempUser.nickName"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="state" label="状态">
              <el-radio-group v-model="tempUser.state" size="medium">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="email" label="用户邮箱">
              <el-col :span="18">
                <el-input
                  v-model.trim="tempUser.email"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="phone" label="手机号码">
              <el-col :span="18">
                <el-input
                  v-model="tempUser.phone"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row
          v-if="formType === 'create'"
        >
          <el-col :span="12">
            <el-form-item prop="company" label="公司">
              <el-cascader
                v-model="tempUser.companyId"
                class="company-cascader"
                size="mini"
                :options="companyOption"
                :show-all-levels="false"
                :props="{
                  emitPath:false,
                  label:'name',value:'companyId',children:'children'}"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="roleId" label="角色">
              <el-select
                v-model="tempUser.roleId"
                size="mini"
                clearable
                filterable
                placeholder="角色"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </form-dialog>
  </div>
</template>

<script>
import SearchPane from '@/components/SearchPane/SearchPane'
import SearchItem from '@/components/SearchPane/SearchItem'
import PDInput from '@/components/SearchPane/PDInput'
import TableCard from '@/components/table/TableCard'
import TableToolBar from '@/components/table/TableToolBar'
import { addUser, deleteUser, pageUsers, updateUser } from '@/api/user'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import { listRoles } from '@/api/role'
import { listCompanies } from '@/api/company'

export default {
  name: 'User',
  components: { Pagination, TableOptionGroup, FormDialog, TableToolBar, TableCard, PDInput, SearchItem, SearchPane },
  data() {
    return {
      // search
      showFlag: true,
      queryParams: {
        pageSize: 5,
        pageNum: 1
      },
      total: 10,

      // form
      tempUser: {
        username: '',
        password: '',
        nickName: '',
        email: '',
        phone: '',
        companyId: '',
        roleId: '',
        state: ''
      },
      dialogFormVisible: false,
      formType: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      formRules: {},
      userList: [],
      companyOption: [
        {
          // 此处为公司类型,因为el-cascader指定绑定值的键需要唯一，故变量名为companyId和companyName
          companyId: 1,
          name: '维保公司',
          children: [
            {
              companyId: 'qzwx',
              name: '泉州物信维保公司'
            }
          ]
        },
        {
          companyId: 2,
          name: '维修公司',
          children: [
            {
              companyId: 'qzwx',
              name: '泉州物信维修公司'
            }
          ]
        }
      ],
      roleList: [],
      companyList: [],
      // common
      currentQueryDate: ''
    }
  },
  watch: {
    currentQueryDate(newValue, oldValue) {
      console.log(newValue, oldValue)
      if (newValue === null) {
        console.log('null')
        this.queryParams.startTime = undefined
        this.queryParams.endTime = undefined
      } else {
        this.queryParams.startTime = newValue[0]
        this.queryParams.endTime = newValue[1]
      }
      console.log(this.queryParams)
    },
    currentCompany(newValue, oldValue) {
      if (newValue === null) {
        console.log('null')
        this.tempUser.companyId = ''
      } else {
        this.tempUser.companyId = newValue[1]
      }
    }
  },
  mounted() {
    this.fetchUserPage()
    this.fetchRoleList()
    this.fetchCompanyList()
  },

  methods: {

    // request
    fetchUserPage() {
      pageUsers(this.queryParams).then(response => {
        this.userList = response.data.list
        this.total = response.data.total
      })
    },

    fetchRoleList() {
      listRoles().then(response => {
        this.roleList = response.data
      })
    },
    fetchCompanyList() {
      this.companyOption[0].children = []
      this.companyOption[1].children = []

      listCompanies().then(response => {
        const companyList = response.data

        this.companyList = companyList

        companyList.forEach((item) => {
          if (item.type === 1) {
            this.companyOption[0].children.push(item)
          }
          if (item.type === 2) {
            this.companyOption[1].children.push(item)
          }
        })
      })
    },
    // region search relative function
    handleSearch() {
      this.fetchUserPage()
    },
    resetQueryParams() {
      this.queryParams = {
        pageSize: 5,
        pageNum: 1
      }
    },
    handleClear(param) {
      this.queryParams[param] = undefined
    },
    // endregion

    // region form relative function
    resetTempUser() {
      this.tempUser = {
        username: '',
        password: '',
        nickName: '',
        email: '',
        phone: '',
        companyId: '',
        roleId: '',
        state: ''
      }
    },
    handleCreateUser() {
      this.resetTempUser()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addUser(this.tempUser).then(() => {
            pageUsers(this.queryParams).then(response => {
              this.userList = response.data.list
              this.totalCount = response.data.total
            })
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateUser(row) {
      this.tempUser = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempObj = Object.assign({}, this.tempUser)
          updateUser(tempObj).then(() => {
            this.fetchUserPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleteUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(() => {
          this.dialogFormVisible = false
          this.fetchUserPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
    // endregion
  }
}

</script>

<style lang="scss" scoped>
.company-cascader {
  width: inherit;
}
</style>
