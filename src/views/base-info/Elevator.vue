<template>
  <div>
    <search-pane
      :show="showSearchPane"
      @search="handleSearchElevator"
      @reset="resetElevatorQueryParams"
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
        label="状态"
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
      <search-item>
        <PDInput
          v-model="queryParams.registrationCode"
          input-width="180px"
          description="电梯注册代码"
        />
      </search-item>
      <search-item>
        <PDInput
          v-model="queryParams.assetId"
          input-width="180px"
          description="资产编号"
        />
      </search-item>

      <search-item
        label="电梯类型"
      >
        <el-select
          v-model="queryParams.type"
          size="mini"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="index in typeOption"
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
          v-model="queryParams.terminalId"
          input-width="180px"
          description="终端设备id"
        />
      </search-item>
      <search-item label="电梯品牌">
        <el-select
          v-model="queryParams.brand"
          size="mini"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in brandOption"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </search-item>
      <search-item label="使用场所">
        <el-select
          v-model="queryParams.usagePlace"
          size="mini"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in usagePlaceOption"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </search-item>

    </search-pane>

    <table-tool-bar
      v-model="showSearchPane"
      @handleCreate="handleCreateElevator"
      @refresh="fetchElevatorPage"
    />

    <table-card>
      <el-table
        ref="filterTable"
        :data="elevatorList"
        style="width: 100%"
      >
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
          prop="assetId"
          label="电梯资产编号"
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
          prop="brand"
          label="品牌"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="usagePlace"
          label="使用场所"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="annualInspectionDate"
          label="年检时间"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="maintainCompanyName"
          label="公司"
          show-tooltip-when-overflow
        />
        <el-table-column
          prop="maintainGroupName"
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
          label="状态"
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
              @handleDelete="handleDeleteElevator(scope.row.elevatorId)"
              @handleUpdate="handleUpdateElevator(scope.row)"
            >
              <template v-slot:link>
                <table-option-item
                  type="link"
                  label="实时状态"
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
        @pagination="fetchElevatorPage"
      />
    </table-card>

    <form-dialog
      v-model="dialogFormVisible"
      :type="formType"
      @create="createElevator"
      @update="updateElevator"
    >
      <el-form
        ref="elevatorForm"
        :rules="formRules"
        :model="tempElevator"
        label-width="120px"
        label-position="right"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item prop="unitName" label="归属单位">
              <el-select
                v-model="tempElevator.unitId"
                size="mini"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in unitList"
                  :key="item.unitId"
                  :label="item.name"
                  :value="item.unitId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="group" label="安装位置">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.installPosition"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="监测设备编号">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.terminalId"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="unitName" label="品牌">
              <el-select
                v-model="tempElevator.brand"
                size="mini"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in brandOption"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="usagePlace" label="使用场所">
              <el-select
                v-model="tempElevator.usagePlace"
                size="mini"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in usagePlaceOption"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="type" label="电梯类型">
              <el-select
                v-model="tempElevator.type"
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
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="注册代码">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.registrationCode"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="annualInspectionDate" label="最后年检日期">
              <el-date-picker
                v-model="tempElevator.annualInspectionDate"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="资产编号">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.assetId"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="group" label="登记证编号">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.re"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="救援编号">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.rescueId"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="group" label="控制柜编号">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.controlCabinetId"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="控制柜型号">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.controlCabinetType"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="group" label="代理商">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.agent"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="额定速度">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.maxSpeed"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="group" label="额定载重">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.ratedLoad"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="电梯层数">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.layer"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="group" label="电梯站数">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.station"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="电梯层门数">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.doorNumber"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="group" label="紧急救援电话">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.rescuePhone"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="出厂编号">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.productId"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productDate" label="出厂日期">
              <el-date-picker
                v-model="tempElevator.productDate"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="改造厂家">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.reformCompany"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="reformDate" label="改造日期">
              <el-date-picker
                v-model="tempElevator.reformDate"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="安装公司">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.installCompany"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="installDate" label="安装日期">
              <el-date-picker
                v-model="tempElevator.installDate"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="安全管理员">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.safeManager"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="group" label="电梯司机">
              <el-col :span="20">
                <el-input
                  v-model="tempElevator.driver"
                  size="mini"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="state" label="有无摄像头">
              <el-radio-group
                v-model="tempElevator.isWithCamera"
                size="mini"
              >
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="state" label="有无有屏设备">
              <el-radio-group
                v-model="tempElevator.isWithScreenedDevice"
                size="mini"
              >
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="group" label="维保公司">
              <el-select
                v-model="tempMaintainCompany"
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
                v-model="tempMaintainGroup"
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
        <el-form-item
          prop="remark"
          label="备注"
        >
          <el-input
            v-model="tempElevator.remark"
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
import { addElevator, deleteElevator, pageElevators, updateElevator } from '@/api/elevator'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import { listCompanies } from '@/api/company'
import { listUnits } from '@/api/unit'
import TableOptionItem from '@/components/table/TableOptionItem'
import { listWorkerGroups } from '@/api/worker-group'

export default {
  name: 'Elevator',
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
      tempElevator: {
        name: '',
        installPosition: '',
        usagePlace: '',
        registrationCode: '',
        installCompany: '',
        brand: '',
        maxBearing: '',
        ratedLoad: '',
        layer: '',
        station: '',
        terminalId: '',
        areaId: '',
        state: '',
        usageArea: '',
        assetId: '',
        controlCabinetType: '',
        controlCabinetId: '',
        emergencyPhone: '',
        safeManager: '',
        driver: '',
        productionDate: '',
        productionId: '',
        isWithCamera: '',
        isWithScreenedDevice: '',
        productId: '',
        unitId: '',
        mainCompanyId: '',
        maintainGroupId: '',
        repairCompanyId: '',
        repairGroupId: '',
        rescuePhone: '',
        rescueId: '',
        reformCompany: '',
        agent: '',
        type: '',
        ratedSpeed: '',
        doorNumber: '',
        annualInspectionDate: '',
        installDate: '',
        productDate: '',
        reformDate: ''

      },

      tempMaintainCompany: null,
      tempMaintainGroup: null,
      dialogFormVisible: false,
      formType: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      formRules: {

      },

      // table attr
      elevatorList: [],

      // common
      currentQueryDate: '',
      brandOption: [
        '江南嘉捷',
        '三菱',
        '奥的斯',
        '西子奥的斯',
        '杭州西奥',
        '巨人通力',
        '广日',
        '日立',
        '蒂森',
        '迅达',
        '通力',
        '东芝',
        '富士',
        '富士达',
        '西继迅达',
        '现代',
        '康力',
        '博林特',
        '星玛',
        '三洋',
        '优耐德',
        '快速',
        '巨立',
        '帝奥',
        '申龙',
        '韦伯',
        '永大',
        '西尼',
        '西门子',
        '米高',
        '曼隆',
        '江南嘉捷',
        '爱登堡',
        '阿尔法',
        '崇友',
        '莱茵',
        '快意',
        '菱王',
        '浙江梅轮',
        '奥玛斯电梯',
        '奥思玛电梯',
        '怡达快速',
        '无锡蓝翎',
        '快意电梯',
        '三荣电梯',
        '凯思博电梯',
        '东南电梯',
        '重庆迈高电梯',
        '奥立达电梯',
        '斯迈特',
        '江南快速',
        '德尔法',
        '立达博仕',
        '瑞生',
        '福州快科',
        '苏州三立',
        '苏州菱怡',
        '喜来登',
        '温州天菱',
        '上海美菱达',
        '中兰通',
        '三胜康恩德',
        '三凌',
        '三升',
        '凯斯博',
        '联盟电梯',
        '浙江富奥',
        '浙江奥菱达',
        '宁波宏大',
        '深圳国奥',
        '联奥',
        '奥立达',
        '其他品牌',
        '永迅电梯',
        '恒达富士',
        '广州',
        '韩国',
        '新时达',
        '悍马',
        '林肯',
        '盖普',
        '怡达',
        '珠江富士',
        '中菱',
        '中奥',
        '快速',
        '富士制御',
        '开灵',
        '斯迈普',
        '上海中迅赛勒瓦'
      ],
      typeOption: [
        '客运梯',
        '家用梯',
        '防爆梯',
        '洁净梯',
        '防腐梯',
        '核岛梯',
        '大桥梯',
        '船用梯',
        '液压梯',
        '汽车梯',
        '杂物梯',
        '自动扶梯',
        '自动人行道',
        '其他'
      ],
      usagePlaceOption: [
        '学校',
        '医院',
        '宾馆',
        '商场超市',
        '商业住宅',
        '安置房',
        '政府机关',
        '办公楼',
        '厂房',
        '其他'
      ],
      stateOption: {
        0: '离线',
        1: '在线',
        2: '在线有数据',
        3: '在线无数据'
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
      groupList: []
    }
  },

  watch: {
    currentQueryDate(newValue, oldValue) {
      if (newValue === null) {
        console.log('null')
        this.queryParams.startTime = undefined
        this.queryParams.endTime = undefined
      } else {
        this.queryParams.startTime = newValue[0]
        this.queryParams.endTime = newValue[1]
      }
    },
    tempMaintainCompany(newValue, oldValue) {
      this.tempElevator.maintainCompanyName = newValue.name
      this.tempElevator.maintainCompanyId = newValue.companyId
    },

    tempMaintainGroup(newValue, oldValue) {
      this.tempElevator.maintainGroupName = newValue.name
      this.tempElevator.maintainGroupId = newValue.groupId
    }
  },
  mounted() {
    this.fetchElevatorPage()
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
    fetchElevatorPage() {
      pageElevators(this.queryParams).then(response => {
        this.elevatorList = response.data.list
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
      this.tempMaintainGroup = ''
    },
    handleSearchElevator() {
      this.fetchElevatorPage()
    },
    resetElevatorQueryParams() {
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
    resetTempElevator() {
      this.tempElevator = {}
      this.tempMaintainGroup = null
      this.tempMaintainCompany = null
    },
    handleCreateElevator() {
      this.resetTempElevator()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['elevatorForm'].clearValidate()
      })
    },
    createElevator() {
      this.$refs['elevatorForm'].validate((valid) => {
        if (valid) {
          addElevator(this.tempElevator).then(() => {
            this.fetchElevatorPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateElevator(row) {
      this.tempElevator = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['elevatorForm'].clearValidate()
      })
    },
    updateElevator() {
      this.$refs['elevatorForm'].validate((valid) => {
        if (valid) {
          const tempElevator = Object.assign({}, this.tempElevator)
          updateElevator(tempElevator).then(() => {
            this.fetchElevatorPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleteElevator(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteElevator(id).then(() => {
          this.dialogFormVisible = false
          this.fetchElevatorPage()
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
