<template>
  <div>
    <search-pane
      :show="showSearchPane"
      @search="handleSearchRepairOrder"
      @reset="resetRepairOrderQueryParams"
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
      @handleCreate="handleCreateRepairOrder"
      @refresh="fetchRepairOrderPage"
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
              @handleDelete="handleDeleteRepairOrder(scope.row.recordId)"
              @handleUpdate="handleUpdateRepairOrder(scope.row)"
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
        @pagination="fetchRepairOrderPage"
      />
    </table-card>

    <form-dialog
      v-model="dialogFormVisible"
      :type="formType"
      @create="createRepairOrder"
      @update="updateRepairOrder"
    >
      <el-form
        ref="repairOrderForm"
        :rules="formRules"
        :model="tempRepairOrder"
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
                v-model="tempRepairOrder.elevatorId"
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
        </el-row>
        <el-form-item
          prop="reson"
          label="故障原因"
        >
          <el-input
            v-model="tempRepairOrder.reason"
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
import { addRepairOrder, deleteRepairOrder, pageRepairOrders, updateRepairOrder } from '@/api/repair-order'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import { listCompanies } from '@/api/company'
import { listUnits } from '@/api/unit'
import TableOptionItem from '@/components/table/TableOptionItem'
import { listWorkerGroups } from '@/api/worker-group'
import { listElevators } from '@/api/elevator'

export default {
  name: 'RepairOrder',
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
      tempRepairOrder: {

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
      currentQueryDate: '',
      typeOption: [
        '维保中报修',
        '维保工报修',
        '物业报修'
      ],
      stateOption: {
        0: '已创建',
        1: '已领取',
        2: '抵达现场',
        3: '已完成',
        4: '已确认',
        5: '已取消'
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
      if (newValue === null) {
        this.queryParams.startTime = undefined
        this.queryParams.endTime = undefined
      } else {
        this.queryParams.startTime = newValue[0]
        this.queryParams.endTime = newValue[1]
      }
    },
    tempCompany(newValue, oldValue) {
      this.tempRepairOrder.companyName = newValue.name
      this.tempRepairOrder.companyId = newValue.companyId
    },

    tempGroup(newValue, oldValue) {
      this.tempRepairOrder.groupName = newValue.name
      this.tempRepairOrder.groupId = newValue.groupId
    }
  },
  mounted() {
    for (const stateOptionKey in this.stateOption) {
      console.log(stateOptionKey)
    }
    this.fetchRepairOrderPage()
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
    fetchRepairOrderPage() {
      pageRepairOrders(this.queryParams).then(response => {
        this.repairOrderList = response.data.list
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
    handleSearchRepairOrder() {
      this.fetchRepairOrderPage()
    },
    resetRepairOrderQueryParams() {
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
    resetTempRepairOrder() {
      this.tempRepairOrder = {}
      this.tempGroup = null
      this.tempCompany = null
    },
    handleCreateRepairOrder() {
      this.resetTempRepairOrder()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['repairOrderForm'].clearValidate()
      })
    },
    createRepairOrder() {
      this.$refs['repairOrderForm'].validate((valid) => {
        if (valid) {
          addRepairOrder(this.tempRepairOrder).then(() => {
            this.fetchRepairOrderPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateRepairOrder(row) {
      this.tempRepairOrder = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['repairOrderForm'].clearValidate()
      })
    },
    updateRepairOrder() {
      this.$refs['repairOrderForm'].validate((valid) => {
        if (valid) {
          const tempRepairOrder = Object.assign({}, this.tempRepairOrder)
          updateRepairOrder(tempRepairOrder).then(() => {
            this.fetchRepairOrderPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleteRepairOrder(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRepairOrder(id).then(() => {
          this.dialogFormVisible = false
          this.fetchRepairOrderPage()
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
