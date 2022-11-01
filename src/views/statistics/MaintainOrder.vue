<template>
  <div>
    <search-pane
      :show="showSearchPane"
      @search="handleSearchMaintainOrder"
      @reset="resetMaintainOrderQueryParams"
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
            v-for="(value,key) in stateOption"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </search-item>
      <search-item
        label="维保类型"
      >
        <el-select
          v-model="queryParams.type"
          size="mini"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="value in typeOption"
            :key="value"
            :label="value"
            :value="value"
          />
        </el-select>
      </search-item>
      <search-item
        label="维保周期"
      >
        <el-select
          v-model="queryParams.duration"
          size="mini"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="index in durationOption"
            :key="index"
            :label="durationOption[index]"
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
          v-model="queryParams.terminalId"
          input-width="180px"
          description="终端设备id"
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
        label="计划时间"
      >
        <el-date-picker
          v-model="currentQueryPlanDate"
          size="mini"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </search-item>
      <search-item
        label="领取时间"
      >
        <el-date-picker
          v-model="currentQueryReceiveDate"
          size="mini"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </search-item>

      <search-item
        label="完成时间"
      >
        <el-date-picker
          v-model="currentQueryFinishDate"
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
      @handleCreate="handleCreateMaintainOrder"
      @refresh="fetchMaintainOrderPage"
    />

    <table-card>
      <el-table
        ref="filterTable"
        :data="repairOrderList"
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
          prop="terminalId"
          label="终端设备编号"
          show-tooltip-when-overflow
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              size="mini"
            >
              {{ scope.row.terminalId }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="registrationCode"
          label="电梯注册代码"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="reporter"
          label="报修人"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="occurTime"
          label="发生时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="occurTime"
          label="维修时间"
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
          prop="description"
          label="问题描述"
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
              {{ stateOption[scope.row.state] }}
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
              @handleDelete="handleDeleteMaintainOrder(scope.row.recordId)"
              @handleUpdate="handleUpdateMaintainOrder(scope.row)"
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
        @pagination="fetchMaintainOrderPage"
      />
    </table-card>

    <form-dialog
      v-model="dialogFormVisible"
      :type="formType"
      @create="createMaintainOrder"
      @update="updateMaintainOrder"
    >
      <el-form
        ref="repairOrderForm"
        :rules="formRules"
        :model="tempMaintainOrder"
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
                v-model="tempMaintainOrder.elevatorId"
                size="mini"
                clearable
                filterable
                placeholder="维保电梯"
              >
                <el-option
                  v-for="item in elevatorList"
                  :key="item.elevatorId"
                  :label="item.installPosition"
                  :value="item.elevatorId"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="group" label="维保时间">
              <el-date-picker
                v-model="tempMaintainOrder.maintainTime"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
              />
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
import { addMaintainOrder, deleteMaintainOrder, pageMaintainOrders, updateMaintainOrder } from '@/api/maintain-order'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import { listCompanies } from '@/api/company'
import { listUnits } from '@/api/unit'
import TableOptionItem from '@/components/table/TableOptionItem'
import { listElevators } from '@/api/elevator'
import { listWorkerGroups } from '@/api/worker-group'

export default {
  name: 'MaintainOrder',
  components: { TableOptionItem, Pagination, TableOptionGroup, FormDialog, TableToolBar, TableCard, PDInput, SearchItem, SearchPane },
  data() {
    return {
      // search attr
      showSearchPane: true,
      queryParams: {
        pageSize: 10,
        pageNum: 1
      },
      total: 10,

      currentQueryPlanDate: '',
      currentQueryReceiveDate: '',
      currentQueryFinishDate: '',

      // form attr
      tempMaintainOrder: {

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
      repairOrderList: [],

      // common
      typeOption: [
        '半月保养',
        '季度保养',
        '半年保养',
        '年度保养'
      ],
      stateOption: {
        0: '未完成',
        1: '已完成',
        2: '异常结束',
        3: '已确认'
      },
      durationOption: {
        0: '首次保养',
        1: '等待保养',
        2: '超期保养',
        3: '即将保养',
        4: '正常周期内',
        5: '正常周期外'
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
    currentQueryPlanDate(newValue, oldValue) {
      this.changeQueryTime(newValue, 'planStartTime', 'planEndTime')
    },
    currentQueryReceiveDate(newValue, oldValue) {
      this.changeQueryTime(newValue, 'receiveStartTime', 'receiveEndTime')
    },
    currentQueryFinishDate(newValue, oldValue) {
      this.changeQueryTime(newValue, 'finishStartTime', 'finishEndTime')
    },

    // form
    tempCompany(newValue, oldValue) {
      this.tempMaintainOrder.companyName = newValue.name
      this.tempMaintainOrder.companyId = newValue.companyId
    },

    tempGroup(newValue, oldValue) {
      this.tempMaintainOrder.groupName = newValue.name
      this.tempMaintainOrder.groupId = newValue.groupId
    }
  },
  mounted() {
    this.fetchMaintainOrderPage()
    this.fetchCompanyList()
    this.fetchUnitList()
    this.fetchElevatorList()
  },
  methods: {

    fetchUnitList() {
      listUnits().then(response => {
        this.unitList = response.data
      })
    },

    fetchElevatorList() {
      listElevators().then(response => {
        this.elevatorList = response.data
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
    fetchMaintainOrderPage() {
      pageMaintainOrders(this.queryParams).then(response => {
        this.repairOrderList = response.data.list
        this.total = response.data.total
      })
    },

    // region search relative function
    handleSearchMaintainOrder() {
      this.fetchMaintainOrderPage()
    },
    resetMaintainOrderQueryParams() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 5
      }
    },
    handleClear(param) {
      this.queryParams[param] = undefined
    },
    changeQueryTime(newValue, start, end) {
      if (newValue === null) {
        this.queryParams[start] = undefined
        this.queryParams[end] = undefined
      } else {
        this.queryParams[start] = newValue[0]
        this.queryParams[end] = newValue[1]
      }
    },
    // endregion

    // region form relative function
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
    resetTempMaintainOrder() {
      this.tempMaintainOrder = {}
      this.tempGroup = null
      this.tempCompany = null
    },
    handleCreateMaintainOrder() {
      this.resetTempMaintainOrder()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['repairOrderForm'].clearValidate()
      })
    },
    createMaintainOrder() {
      this.$refs['repairOrderForm'].validate((valid) => {
        if (valid) {
          addMaintainOrder(this.tempMaintainOrder).then(() => {
            this.fetchMaintainOrderPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateMaintainOrder(row) {
      this.tempMaintainOrder = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['repairOrderForm'].clearValidate()
      })
    },
    updateMaintainOrder() {
      this.$refs['repairOrderForm'].validate((valid) => {
        if (valid) {
          const tempMaintainOrder = Object.assign({}, this.tempMaintainOrder)
          updateMaintainOrder(tempMaintainOrder).then(() => {
            this.fetchMaintainOrderPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleteMaintainOrder(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMaintainOrder(id).then(() => {
          this.dialogFormVisible = false
          this.fetchMaintainOrderPage()
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
