<template>
  <div>
    <search-pane
      :show="showSearchPane"
      @search="handleSearchCompany"
      @reset="resetCompanyQueryParams"
    >

      <search-item>
        <PDInput
          v-model="queryParams.name"
          input-width="180px"
          description="公司名称"
        />
      </search-item>

      <search-item label="状态">
        <el-select
          v-model="queryParams.state"
          size="small"
          clearable
          filterable
          placeholder="公司状态"
        >
          <el-option
            v-for="item in stateList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </search-item>
    </search-pane>

    <table-tool-bar
      v-model="showSearchPane"
      @handleCreate="handleCreateCompany"
      @refresh="fetchCompanyPage"
    />

    <table-card>
      <el-table
        ref="filterTable"
        :data="companyList"
        style="width: 100%"
      >

        <el-table-column
          prop="name"
          label="公司"
        />

        <el-table-column
          label="公司类型"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.type === 1 ? 'primary': 'success'"
              disable-transitions
            >
              {{ scope.row.type === 1 ? '维保公司' : '维修公司' }}
            </el-tag>
          </template>
        </el-table-column>
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
          width="300"
        >
          <template slot-scope="scope">
            <table-option-group
              @handleDelete="handleDeleteCompany(scope.row.id)"
              @handleUpdate="handleUpdateCompany(scope.row)"
            >
              <template v-slot:link>
                <table-option-item
                  icon="el-icon-setting"
                  label="分配电梯"
                />

                <table-option-item
                  icon="el-icon-setting"
                  label="查看电梯"
                />
              </template>
            </table-option-group>
          </template>

        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="fetchCompanyPage"
      />
    </table-card>

    <form-dialog
      v-model="dialogFormVisible"
      :type="formType"
      @create="createCompany"
      @update="updateCompany"
    >
      <el-form
        ref="companyForm"
        :rules="formRules"
        :model="tempCompany"
      />
    </form-dialog>
  </div>
</template>

<script>
import SearchPane from '@/components/SearchPane/SearchPane'
import SearchItem from '@/components/SearchPane/SearchItem'
import PDInput from '@/components/SearchPane/PDInput'
import TableCard from '@/components/table/TableCard'
import TableToolBar from '@/components/table/TableToolBar'
import { addCompany, deleteCompany, pageCompanies, updateCompany } from '@/api/company'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import TableOptionItem from '@/components/table/TableOptionItem'

export default {
  name: 'Company',
  components: { TableOptionItem, Pagination, TableOptionGroup, FormDialog, TableToolBar, TableCard, PDInput, SearchItem, SearchPane },
  data() {
    return {
      // search attr
      showSearchPane: true,
      queryParams: {
        pageSize: 5,
        pageNum: 1
      },
      total: 10,

      stateList: [{
        label: '正常',
        value: 1
      },
      {
        label: '停用',
        value: 0
      }
      ],

      // form attr
      tempCompany: {

      },
      dialogFormVisible: false,
      formType: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      formRules: {

      },

      // table attr
      companyList: []

    }
  },
  mounted() {
    this.fetchCompanyPage()
  },
  methods: {

    fetchCompanyPage() {
      pageCompanies(this.queryParams).then(response => {
        this.companyList = response.data.list
        this.totalCount = response.data.total
      })
    },

    // region search relative function
    handleSearchCompany() {
      this.fetchCompanyPage()
    },
    resetCompanyQueryParams() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 5
      }
    },
    handleClear(param) {
      this.queryParams[param] = undefined
    },
    // endregion

    // region form relative function
    resetTempCompany() {
      this.tempCompany = {}
    },
    handleCreateCompany() {
      this.resetTempCompany()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['companyForm'].clearValidate()
      })
    },
    createCompany() {
      this.$refs['companyForm'].validate((valid) => {
        if (valid) {
          addCompany(this.tempCompany).then(() => {
            this.fetchCompanyPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateCompany(row) {
      this.tempCompany = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['companyForm'].clearValidate()
      })
    },
    updateCompany() {
      this.$refs['companyForm'].validate((valid) => {
        if (valid) {
          const tempCompany = Object.assign({}, this.tempCompany)
          updateCompany(tempCompany).then(() => {
            this.fetchCompanyPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleteCompany(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCompany(id).then(() => {
          this.dialogFormVisible = false
          this.fetchCompanyPage()
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
</style>
