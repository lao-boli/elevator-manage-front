<template>
  <div>
    <search-pane
      :show="showSearchPane"
      @search="handleSearchAnnualInspectionOrder"
      @reset="resetAnnualInspectionOrderQueryParams"
    >
      <search-item
        label="所属单位"
      >
        <el-select
          v-model="queryParams.unitId"
          size="mini"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in unitList"
            :key="item.name"
            :label="item.name"
            :value="item.unitId"
          />
        </el-select>
      </search-item>
      <search-item
        label="工单状态"
      >
        <el-select
          v-model="queryParams.state"
          size="mini"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="index in stateOption"
            :key="index"
            :label="stateOption[index]"
            :value="index"
          />
        </el-select>
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

      <search-item>
        <PDInput
          v-model="queryParams.installPosition"
          input-width="180px"
          description="电梯安装位置"
        />
      </search-item>

      <search-item>
        <PDInput
          v-model="queryParams.registrationCode"
          input-width="180px"
          description="电梯注册代码"
        />
      </search-item>

      <search-item>
        <PDInput
          v-model="queryParams.orderId"
          input-width="180px"
          description="工单ID"
        />
      </search-item>

      <search-item
        label="维修时间"
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
      v-model="showSearchPane"
      @handleCreate="handleCreateAnnualInspectionOrder"
      @refresh="fetchAnnualInspectionOrderPage"
    />

    <table-card>
      <el-table
        ref="filterTable"
        :data="annualInspectionOrderList"
        style="width: 100%"
      >
        <el-table-column
          prop="orderId"
          label="工单编号"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="unitName"
          label="电梯所属单位"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="installPosition"
          label="电梯安装位置"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="inspectionTime"
          label="年检时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="finishTime"
          label="完成时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="confirmTime"
          label="确认时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="companyName"
          label="公司"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="groupName"
          label="班组"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="state"
          label="工单状态"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.state ? 'primary': 'danger'"
              disable-transitions
            >
              {{ scope.row.state ? '已处理' : '未处理' }}
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
              type="none"
              @handleDelete="handleDeleteAnnualInspectionOrder(scope.row.recordId)"
              @handleUpdate="handleUpdateAnnualInspectionOrder(scope.row)"
            />
            <table-option-item
              type="link"
              label="详情"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="fetchAnnualInspectionOrderPage"
      />
    </table-card>

    <form-dialog
      v-model="dialogFormVisible"
      :type="formType"
      @create="createAnnualInspectionOrder"
      @update="updateAnnualInspectionOrder"
    >
      <el-form
        ref="annualInspectionOrderForm"
        :rules="formRules"
        :model="tempAnnualInspectionOrder"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="维保公司">
              <el-select
                v-model="tempCompany"
                size="mini"
                clearable
                filterable
                placeholder="维保公司"
                value-key="companyId"
                @change="handleCompanyChange"
                @clear="handleCompanyClear"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.companyId"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="group" label="维保班组">
              <el-select
                v-model="tempGroup"
                size="mini"
                value-key="groupId"
                clearable
                filterable
                placeholder="维保班组"
              >
                <el-option
                  v-for="item in groupList"
                  :key="item.groupId"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="维保电梯">
              <el-select
                v-model="tempAnnualInspectionOrder.elevatorId"
                size="mini"
                clearable
                filterable
                placeholder="维保电梯"
              >
                <el-option
                  v-for="item in elevatorList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.elevatorId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="group" label="维保电梯">
              <el-select
                v-model="tempAnnualInspectionOrder.elevatorId"
                size="mini"
                clearable
                filterable
                placeholder="维保电梯"
              >
                <el-option
                  v-for="item in elevatorList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.elevatorId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          prop="reson"
          label="故障原因"
        >
          <el-input
            v-model="tempAnnualInspectionOrder.reason"
            type="textarea"
            :rows="3"
            autosize
          />
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
import { addAnnualInspectionOrder, deleteAnnualInspectionOrder, pageAnnualInspectionOrders, updateAnnualInspectionOrder } from '@/api/annual-inspection-order'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import { listCompanies } from '@/api/company'
import { listUnits } from '@/api/unit'
import TableOptionItem from '@/components/table/TableOptionItem'
import { listWorkerGroups } from '@/api/worker-group'

export default {
  name: 'AnnualInspectionOrder',
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

      // form attr
      tempAnnualInspectionOrder: {

      },
      tempCompany: null,
      tempGroup: null,
      dialogFormVisible: false,
      formType: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      formRules: {

      },

      // table attr
      annualInspectionOrderList: [],

      // common
      currentQueryDate: '',
      stateOption: {
        0: '已创建',
        1: '已完成',
        2: '已确认'
      },
      companyOption: [
        {
          // 此处为公司类型,因为el-cascader指定绑定值的键需要唯一，故变量名为companyId和companyName
          companyId: 1,
          name: '维保公司',
          children: []
        },
        {
          companyId: 2,
          name: '维修公司',
          children: []
        }
      ],
      unitList: [],
      companyList: [],
      groupList: [],
      elevatorList: []
    }
  },

  watch: {
    currentQueryDate(newValue, oldValue) {
      console.log(newValue, oldValue)
      if (newValue === null) {
        this.queryParams.startTime = undefined
        this.queryParams.endTime = undefined
      } else {
        this.queryParams.startTime = newValue[0]
        this.queryParams.endTime = newValue[1]
      }
    },

    // form
    tempCompany(newValue, oldValue) {
      this.tempAnnualInspectionOrder.companyName = newValue.name
      this.tempAnnualInspectionOrder.companyId = newValue.companyId
    },

    tempGroup(newValue, oldValue) {
      this.tempAnnualInspectionOrder.groupName = newValue.name
      this.tempAnnualInspectionOrder.groupId = newValue.groupId
    }
  },
  mounted() {
    this.fetchAnnualInspectionOrderPage()
    this.fetchCompanyList()
    this.fetchUnitList()
  },
  methods: {

    fetchUnitList() {
      listUnits().then(response => {
        this.unitList = response.data
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
    fetchAnnualInspectionOrderPage() {
      pageAnnualInspectionOrders(this.queryParams).then(response => {
        this.annualInspectionOrderList = response.data.list
        this.totalCount = response.data.total
      })
    },

    // region search relative function
    handleCompanyChange(company) {
      if (company) {
        listWorkerGroups({ companyId: company.companyId }).then(response => {
          this.groupList = response.data
        })
      }
    },

    handleCompanyClear(companyId) {
      this.groupList = []
      this.tempGroup = ''
    },
    handleSearchAnnualInspectionOrder() {
      this.fetchAnnualInspectionOrderPage()
    },
    resetAnnualInspectionOrderQueryParams() {
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
    resetTempAnnualInspectionOrder() {
      this.tempAnnualInspectionOrder = {}
      this.tempGroup = null
      this.tempCompany = null
    },
    handleCreateAnnualInspectionOrder() {
      this.resetTempAnnualInspectionOrder()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['annualInspectionOrderForm'].clearValidate()
      })
    },
    createAnnualInspectionOrder() {
      this.$refs['annualInspectionOrderForm'].validate((valid) => {
        if (valid) {
          addAnnualInspectionOrder(this.tempAnnualInspectionOrder).then(() => {
            this.fetchAnnualInspectionOrderPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateAnnualInspectionOrder(row) {
      this.tempAnnualInspectionOrder = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['annualInspectionOrderForm'].clearValidate()
      })
    },
    updateAnnualInspectionOrder() {
      this.$refs['annualInspectionOrderForm'].validate((valid) => {
        if (valid) {
          const tempAnnualInspectionOrder = Object.assign({}, this.tempAnnualInspectionOrder)
          updateAnnualInspectionOrder(tempAnnualInspectionOrder).then(() => {
            this.fetchAnnualInspectionOrderPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleteAnnualInspectionOrder(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAnnualInspectionOrder(id).then(() => {
          this.dialogFormVisible = false
          this.fetchAnnualInspectionOrderPage()
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
