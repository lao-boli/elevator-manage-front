<template>
  <div>
    <search-pane
      :show="showSearchPane"
      @search="handleSearchAbnormalRecord"
      @reset="resetAbnormalRecordQueryParams"
    >
      <search-item
        label="所属单位"
      >
        <el-select
          v-model="queryParams.unitId"
          size="small"
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
        label="异常事件类型"
      >
        <el-select
          v-model="queryParams.type"
          size="small"
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
      @handleCreate="handleCreateAbnormalRecord"
      @refresh="fetchAbnormalRecordPage"
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
            :data="abnormalRecordList"
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
              label="异常事件类型"
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
              label="异常状态"
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
                  @handleDelete="handleDeleteAbnormalRecord(scope.row.recordId)"
                  @handleUpdate="handleUpdateAbnormalRecord(scope.row)"
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
            @pagination="fetchAbnormalRecordPage"
          />
        </table-card>
      </el-tab-pane>
      <el-tab-pane
        label="图表"
        name="chart"
      >
        <el-card header="异常类型占比">
          <div class="chart-tab">
            <div class="chart-pane">
              <rose-chart
                id="typeChart"
                :chart-data="typeStatistics"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </el-card>

        <el-card header="异常次数统计">
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
      @create="createAbnormalRecord"
      @update="updateAbnormalRecord"
    >
      <el-form
        ref="abnormalRecordForm"
        :rules="formRules"
        :model="tempAbnormalRecord"
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
import { addAbnormalRecord, deleteAbnormalRecord, pageAbnormalRecords, updateAbnormalRecord } from '@/api/abnormal-record'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import { listCompanies } from '@/api/company'
import { listUnits } from '@/api/unit'
import TableOptionItem from '@/components/table/TableOptionItem'
import RoseChart from '@/components/Charts/RoseChart'
import BarChart from '@/components/Charts/BarChart'

export default {
  name: 'AbnormalRecord',
  components: { BarChart, RoseChart, TableOptionItem, Pagination, TableOptionGroup, FormDialog, TableToolBar, TableCard, PDInput, SearchItem, SearchPane },
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
      tempAbnormalRecord: {

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
      abnormalRecordList: [],

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
        '安全回路断',
        '门锁回路不通',
        '关门故障',
        '电梯超速',
        '反复开关门',
        '长时间遮挡光幕',
        '制动系统故障'
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
    this.fetchAbnormalRecordPage()
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
    fetchAbnormalRecordPage() {
      pageAbnormalRecords(this.queryParams).then(response => {
        this.abnormalRecordList = response.data.list
        this.total = response.data.total
      })
    },

    // region search relative function
    handleSearchAbnormalRecord() {
      this.fetchAbnormalRecordPage()
    },
    resetAbnormalRecordQueryParams() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10
      }
    },
    handleClear(param) {
      this.queryParams[param] = undefined
    },
    // endregion

    // region form relative function
    resetTempAbnormalRecord() {
      this.tempAbnormalRecord = {}
    },
    handleCreateAbnormalRecord() {
      this.resetTempAbnormalRecord()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['abnormalRecordForm'].clearValidate()
      })
    },
    createAbnormalRecord() {
      this.$refs['abnormalRecordForm'].validate((valid) => {
        if (valid) {
          addAbnormalRecord(this.tempAbnormalRecord).then(() => {
            this.fetchAbnormalRecordPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateAbnormalRecord(row) {
      this.tempAbnormalRecord = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['abnormalRecordForm'].clearValidate()
      })
    },
    updateAbnormalRecord() {
      this.$refs['abnormalRecordForm'].validate((valid) => {
        if (valid) {
          const tempAbnormalRecord = Object.assign({}, this.tempAbnormalRecord)
          updateAbnormalRecord(tempAbnormalRecord).then(() => {
            this.fetchAbnormalRecordPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleteAbnormalRecord(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAbnormalRecord(id).then(() => {
          this.dialogFormVisible = false
          this.fetchAbnormalRecordPage()
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
