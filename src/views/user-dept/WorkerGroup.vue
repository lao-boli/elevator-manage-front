<template>
  <div>
    <search-pane
      :show="showFlag"
      @search="handleSearch"
      @reset="resetQueryParams"
    >
      <search-item>
        <PDInput
          v-model="queryParams.name"
          input-width="180px"
          description="用户名"
        />
      </search-item>

      <search-item>
        <PDInput
          v-model="queryParams.groupId"
          input-width="180px"
          description="班组代号"
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

    </search-pane>
    <table-tool-bar
      v-model="showFlag"
      @handleCreate="handleCreateWorkerGroup"
      @refresh="fetchWorkerGroupPage"
    />
    <table-card>
      <el-table
        ref="filterTable"
        :data="workerGroupList"
        style="width: 100%"
      >

        <el-table-column
          prop="groupId"
          label="班组代号"
        />
        <el-table-column
          prop="name"
          label="班组名称"
        />
        <el-table-column
          prop="companyName"
          label="公司"
        />
        <el-table-column
          prop="leader"
          label="班组组长"
        />
        <el-table-column
          prop="contactInfo"
          label="联系方式"
        />
        <el-table-column
          prop="number"
          label="班组人数"
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
              @handleDelete="handleDeleteWorkerGroup(scope.row.groupId)"
              @handleUpdate="handleUpdateWorkerGroup(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="fetchWorkerGroupPage"
      />
    </table-card>
    <form-dialog
      v-model="dialogFormVisible"
      :type="formType"
      @create="createWorkerGroup"
      @update="updateWorkerGroup"
    >
      <el-form
        ref="dataForm"
        :rules="formRules"
        :model="tempWorkerGroup"
      >

        <el-form-item prop="name" label="班组名称">
          <el-col :span="10">
            <el-input
              v-model="tempWorkerGroup.name"
              size="mini"
            />
          </el-col>
        </el-form-item>

        <el-form-item prop="company" label="公司">
          <el-cascader
            v-model="tempWorkerGroup.companyId"
            class="company-cascader"
            size="mini"
            :options="companyOption"
            :show-all-levels="false"
            :props="{
              emitPath:false,
              label:'name',value:'companyId',children:'children'}"
          />
        </el-form-item>

        <el-form-item prop="remark" label="备注">
          <el-col :span="18">
            <el-input
              v-model="tempWorkerGroup.remark"
              size="mini"
              type="textarea"
            />
          </el-col>
        </el-form-item>
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
import { addWorkerGroup, deleteWorkerGroup, pageWorkerGroups, updateWorkerGroup } from '@/api/worker-group'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import { listRoles } from '@/api/role'
import { listCompanies } from '@/api/company'

export default {
  name: 'WorkerGroup',
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
      tempWorkerGroup: {
        workerGroupname: '',
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
      workerGroupList: [],
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
        this.tempWorkerGroup.companyId = ''
      } else {
        this.tempWorkerGroup.companyId = newValue[1]
      }
    }
  },
  mounted() {
    this.fetchWorkerGroupPage()
    this.fetchRoleList()
    this.fetchCompanyList()
  },

  methods: {

    // request
    fetchWorkerGroupPage() {
      pageWorkerGroups(this.queryParams).then(response => {
        this.workerGroupList = response.data.list
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
      this.fetchWorkerGroupPage()
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
    resetTempWorkerGroup() {
      this.tempWorkerGroup = {
        workerGroupname: '',
        password: '',
        nickName: '',
        email: '',
        phone: '',
        companyId: '',
        roleId: '',
        state: ''
      }
    },
    handleCreateWorkerGroup() {
      this.resetTempWorkerGroup()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createWorkerGroup() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addWorkerGroup(this.tempWorkerGroup).then(() => {
            pageWorkerGroups(this.queryParams).then(response => {
              this.workerGroupList = response.data.list
              this.totalCount = response.data.total
            })
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateWorkerGroup(row) {
      this.tempWorkerGroup = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateWorkerGroup() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempObj = Object.assign({}, this.tempWorkerGroup)
          updateWorkerGroup(tempObj).then(() => {
            this.fetchWorkerGroupPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleteWorkerGroup(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWorkerGroup(id).then(() => {
          this.dialogFormVisible = false
          this.fetchWorkerGroupPage()
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
