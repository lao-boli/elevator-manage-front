<template>
  <div>
    <search-pane
      :show="showSearchPane"
      @search="handleSearchFaultRecord"
      @reset="resetFaultRecordQueryParams"
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
        label="故障事件类型"
      >
        <el-select
          v-model="queryParams.type"
          size="mini"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in typeOption"
            :key="item"
            :label="item"
            :value="item"
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
      hide="add"
      @handleCreate="handleCreateFaultRecord"
      @refresh="fetchFaultRecordPage"
    />

    <el-tabs
      type="border-card"
      active-name="chart"
    >
      <el-tab-pane
        label="表格"
        name="table"
      >
        <table-card>
          <el-table
            ref="filterTable"
            :data="faultRecordList"
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
              prop="type"
              label="故障事件类型"
              show-tooltip-when-overflow
            />
            <el-table-column
              prop="occurTime"
              label="发生时间"
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
              label="故障状态"
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
                  @handleDelete="handleDeleteFaultRecord(scope.row.recordId)"
                  @handleUpdate="handleUpdateFaultRecord(scope.row)"
                />
                <table-option-item
                  type="link"
                  label="查看视频"
                />
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="fetchFaultRecordPage"
          />
        </table-card>
      </el-tab-pane>
      <el-tab-pane
        label="图表"
        name="chart"
      >
        <el-card header="故障类型占比">
          <div class="chart-tab">
            <div class="chart-pane">
              <rose-chart
                id="typeChart"
                name="故障类型"
                :chart-data="typeStatistics"
              />
            </div>
          </div>
        </el-card>

        <el-card header="故障次数统计">
          <div class="chart-tab">
            <div class="chart-pane">
              <bar-chart
                id="countChart"
                :chart-data="countStatistics"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <form-dialog
      v-model="dialogFormVisible"
      :type="formType"
      @create="createFaultRecord"
      @update="updateFaultRecord"
    >
      <el-form
        ref="faultRecordForm"
        :rules="formRules"
        :model="tempFaultRecord"
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
import {
  addFaultRecord,
  deleteFaultRecord,
  getTypeStatistics,
  pageFaultRecords,
  updateFaultRecord
} from '@/api/fault-record'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import { listCompanies } from '@/api/company'
import { listUnits } from '@/api/unit'
import TableOptionItem from '@/components/table/TableOptionItem'
import RoseChart from '@/components/Charts/RoseChart'
import BarChart from '@/components/Charts/BarChart'

export default {
  name: 'FaultRecord',
  components: {
    RoseChart,
    BarChart, TableOptionItem, Pagination, TableOptionGroup, FormDialog, TableToolBar, TableCard, PDInput, SearchItem, SearchPane },
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
      tempFaultRecord: {

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
      faultRecordList: [],

      // chart
      typeStatistics: [],
      faultStatistics: [],

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
      typeOption: [
        '电梯在开锁区域外停止',
        '轿厢意外移动',
        '电梯运行中安全回路断路',
        '电梯运行中门锁回路断路',
        '轿厢冲顶',
        '轿厢蹲底',
        '电梯运转时间限制器动作',
        '开门故障',
        '其他阻止电梯再运行的故障'
      ],
      unitList: []
    }
  },

  watch: {
    currentQueryDate(newValue, oldValue) {
      if (newValue === null) {
        this.queryParams.occurStartTime = undefined
        this.queryParams.occurEndTime = undefined
      } else {
        this.queryParams.occurStartTime = newValue[0]
        this.queryParams.occurEndTime = newValue[1]
      }
    }
  },
  mounted() {
    this.fetchFaultRecordPage()
    this.fetchCompanyList()
    this.fetchUnitList()
    this.fetchTypeStatistics()
  },
  methods: {

    fetchTypeStatistics() {
      getTypeStatistics().then(response => {
        this.typeStatistics = response.data
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
    fetchFaultRecordPage() {
      pageFaultRecords(this.queryParams).then(response => {
        this.faultRecordList = response.data.list
        this.totalCount = response.data.total
      })
    },

    // region search relative function
    handleSearchFaultRecord() {
      this.fetchFaultRecordPage()
    },
    resetFaultRecordQueryParams() {
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
    resetTempFaultRecord() {
      this.tempFaultRecord = {}
    },
    handleCreateFaultRecord() {
      this.resetTempFaultRecord()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['faultRecordForm'].clearValidate()
      })
    },
    createFaultRecord() {
      this.$refs['faultRecordForm'].validate((valid) => {
        if (valid) {
          addFaultRecord(this.tempFaultRecord).then(() => {
            this.fetchFaultRecordPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateFaultRecord(row) {
      this.tempFaultRecord = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['faultRecordForm'].clearValidate()
      })
    },
    updateFaultRecord() {
      this.$refs['faultRecordForm'].validate((valid) => {
        if (valid) {
          const tempFaultRecord = Object.assign({}, this.tempFaultRecord)
          updateFaultRecord(tempFaultRecord).then(() => {
            this.fetchFaultRecordPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleteFaultRecord(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFaultRecord(id).then(() => {
          this.dialogFormVisible = false
          this.fetchFaultRecordPage()
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

.chart-tab {
  display: flex;
  justify-content: center;
}
.chart-pane {
  display: flex;
  width: 100%;
  height: 400px;
}
</style>
