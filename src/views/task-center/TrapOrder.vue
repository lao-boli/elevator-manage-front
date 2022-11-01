<template>
  <div>
    <search-pane
      :show="showSearchPane"
      @search="handleSearchTrapOrder"
      @reset="resetTrapOrderQueryParams"
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
        label="困人状态"
      >
        <el-select
          v-model="queryParams.state"
          size="mini"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in typeList"
            :key="item.name"
            :label="item.name"
            :value="item.id"
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
        label="发生时间"
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
      @handleCreate="handleCreateTrapOrder"
      @refresh="fetchTrapOrderPage"
    />

    <table-card>
      <el-table
        ref="filterTable"
        :data="trapOrderList"
        style="width: 100%"
      >
        <el-table-column
          prop="recordId"
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
          prop="companyName"
          label="维保公司"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="groupName"
          label="维保班组"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="occurTime"
          label="发生时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="arriveTime"
          label="到达时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="finishTime"
          label="完成时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="duration"
          label="持续时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="confirmTime"
          label="确认时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="Misreport"
          label="是否误报"
        >
          <template slot-scope="scope">
            {{ scope.row.misreport ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
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
              @handleDelete="handleDeleteTrapOrder(scope.row.recordId)"
              @handleUpdate="handleUpdateTrapOrder(scope.row)"
            >
              <template v-slot:none>
                <table-option-item
                  label="详情"
                  @handleClick="showTrapOrderDetail(scope.row)"
                />
                <table-option-item
                  label="查看视频"
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
        @pagination="fetchTrapOrderPage"
      />
    </table-card>

    <form-dialog
      v-model="dialogFormVisible"
      :type="formType"
      @create="createTrapOrder"
      @update="updateTrapOrder"
      @confirm="dialogFormVisible = false"
    >
      <el-form
        v-if="formType === 'create'"
        ref="trapOrderForm"
        :rules="formRules"
        :model="tempTrapOrder"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="维保电梯">
              <el-select
                v-model="tempTrapOrder.elevatorId"
                size="mini"
                clearable
                filterable
                placeholder="困人电梯"
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
            <el-form-item prop="group" label="发生时间">
              <el-date-picker
                v-model="tempTrapOrder.occurTime"
                size="mini"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          prop="remark"
          label="备注"
        >
          <el-input
            v-model="tempTrapOrder.remark"
            type="textarea"
            :rows="3"
            autosize
          />
        </el-form-item>
      </el-form>
      <div
        v-if="formType === 'other'"
        class="trap-detail"
      >
        <el-steps
          :active="tempTrapOrder.state"
          process-status="finish"
          align-center
          size="mini"
        >
          <el-step
            title="发生困人"
            :description="tempTrapOrder.trapTime"
          />
          <el-step title="前往救援" />
          <el-step title="已到场" />
          <el-step
            title="救援结束"
            :description="tempTrapOrder.finishTime"
          />
        </el-steps>
        <el-card
          header="困人详情"
          shadow="never"
        >
          <el-descriptions
            title="基本信息"
            :column="2"
            border
          >
            <el-descriptions-item label="设备安装位置">{{ tempTrapOrder.installPosition }}</el-descriptions-item>
            <el-descriptions-item label="归属区域">{{ tempTrapOrder.region }}</el-descriptions-item>
            <el-descriptions-item label="设备注册代码">{{ tempTrapOrder.registrationCode }}</el-descriptions-item>
            <el-descriptions-item label="设备编号">
              {{ tempTrapOrder.elevatorId }}
            </el-descriptions-item>
          </el-descriptions>
          <el-divider />
          <el-descriptions
            title="归属信息"
            :column="2"
            border
          >
            <el-descriptions-item label="维保公司">{{ tempTrapOrder.companyName }}</el-descriptions-item>
            <el-descriptions-item label="维保班组">{{ tempTrapOrder.groupName }}</el-descriptions-item>
          </el-descriptions>
          <el-divider />
          <el-descriptions
            title="救援信息"
            :column="2"
            border
          >
            <el-descriptions-item label="困人时间">{{ tempTrapOrder.trapTime }}</el-descriptions-item>
            <el-descriptions-item label="领取时间">{{ tempTrapOrder.receiveTime }}</el-descriptions-item>
            <el-descriptions-item label="救援时间">{{ tempTrapOrder.arriveTime }}</el-descriptions-item>
            <el-descriptions-item label="完成时间">{{ tempTrapOrder.finishTime }}</el-descriptions-item>
            <el-descriptions-item label="确认时间">{{ tempTrapOrder.confirmTime }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
    </form-dialog>
  </div>
</template>

<script>
import SearchPane from '@/components/SearchPane/SearchPane'
import SearchItem from '@/components/SearchPane/SearchItem'
import PDInput from '@/components/SearchPane/PDInput'
import TableCard from '@/components/table/TableCard'
import TableToolBar from '@/components/table/TableToolBar'
import { addTrapOrder, deleteTrapOrder, pageTrapOrders, updateTrapOrder } from '@/api/trap-order'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import { listCompanies } from '@/api/company'
import { listUnits } from '@/api/unit'
import TableOptionItem from '@/components/table/TableOptionItem'
import { listElevators } from '@/api/elevator'

export default {
  name: 'TrapOrder',
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
      tempTrapOrder: {

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
      trapOrderList: [],

      // common
      currentQueryDate: '',
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
      typeList: [],
      elevatorList: [],
      unitList: []
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
    }
  },
  mounted() {
    this.fetchTrapOrderPage()
    this.fetchCompanyList()
    this.fetchElevatorList()
    this.fetchUnitList()
  },
  methods: {

    fetchElevatorList() {
      listElevators().then(response => {
        this.elevatorList = response.data
      })
    },
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
    fetchTrapOrderPage() {
      pageTrapOrders(this.queryParams).then(response => {
        this.trapOrderList = response.data.list
        this.totalCount = response.data.total
      })
    },

    // region search relative function
    handleSearchTrapOrder() {
      this.fetchTrapOrderPage()
    },
    resetTrapOrderQueryParams() {
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
    resetTempTrapOrder() {
      this.tempTrapOrder = {}
    },
    handleCreateTrapOrder() {
      this.resetTempTrapOrder()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['trapOrderForm'].clearValidate()
      })
    },
    createTrapOrder() {
      this.$refs['trapOrderForm'].validate((valid) => {
        if (valid) {
          addTrapOrder(this.tempTrapOrder).then(() => {
            this.fetchTrapOrderPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateTrapOrder(row) {
      this.tempTrapOrder = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['trapOrderForm'].clearValidate()
      })
    },
    updateTrapOrder() {
      this.$refs['trapOrderForm'].validate((valid) => {
        if (valid) {
          const tempTrapOrder = Object.assign({}, this.tempTrapOrder)
          updateTrapOrder(tempTrapOrder).then(() => {
            this.fetchTrapOrderPage()
            this.dialogFormVisible = false
          })
        }
      })
    },

    handleDeleteTrapOrder(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTrapOrder(id).then(() => {
          this.dialogFormVisible = false
          this.fetchTrapOrderPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showTrapOrderDetail(row) {
      this.tempTrapOrder = Object.assign({}, row)
      this.formType = 'other'
      this.dialogFormVisible = true
    }
    // endregion
  }
}

</script>

<style lang="scss" scoped>
</style>
