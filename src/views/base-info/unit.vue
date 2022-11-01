<template>
  <div>
    <search-pane
      :show="showSearchPane"
      @search="handleSearchUnit"
      @reset="resetUnitQueryParams"
    >
      <div />
      <search-item>
        <PDInput
          v-model="queryParams.name"
          input-width="180px"
          description="单位名称"
        />
      </search-item>
    </search-pane>

    <table-tool-bar
      v-model="showSearchPane"
      @handleCreate="handleCreateUnit"
      @refresh="fetchUnitPage"
    />

    <table-card>
      <el-table
        ref="filterTable"
        :data="unitList"
        style="width: 100%"
      >

        <el-table-column
          prop="name"
          label="单位名称"
        />
        <el-table-column
          prop="province"
          label="省"
        />
        <el-table-column
          prop="city"
          label="市"
        />
        <el-table-column
          prop="district"
          label="区"
        />
        <el-table-column
          prop="street"
          label="街道"
        />
        <el-table-column
          prop="address"
          label="地址"
        />

        <el-table-column
          label="操作"
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <table-option-group
              @handleDelete="handleDeleteUnit(scope.row.unitId)"
              @handleUpdate="handleUpdateUnit(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="fetchUnitPage"
      />
    </table-card>

    <form-dialog
      v-model="dialogFormVisible"
      :type="formType"
      @create="createUnit"
      @update="updateUnit"
    >
      <el-form
        ref="unitForm"
        :rules="formRules"
        :model="tempUnit"
      >
        <el-form-item prop="name">
          <label slot="label">单位名称</label>
          <el-col :span="8">
            <el-input
              v-model="tempUnit.name"
            />
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="province">
              <label slot="label" v-html="'省&emsp;'" />
              <el-col :span="18">
                <el-input
                  v-model="tempUnit.province"
                  disabled
                  placeholder="搜索地址自动填入"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="city">
              <label slot="label" v-html="'市&emsp;'" />
              <el-col :span="18">
                <el-input
                  v-model="tempUnit.city"
                  disabled
                  placeholder="搜索地址自动填入"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="district" label="区/县">
              <el-col :span="18">
                <el-input
                  v-model="tempUnit.district"
                  disabled
                  placeholder="搜索地址自动填入"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="city" label="街道">
              <el-col :span="18">
                <el-input
                  v-model="tempUnit.street"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <bmap-selector
          v-model="tempUnit.address"
          style="width: 94%"
          @getAddress="getAddress"
        />
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
import { addUnit, deleteUnit, pageUnits, updateUnit } from '@/api/unit'
import FormDialog from '@/components/FormDialog/FormDialog'
import TableOptionGroup from '@/components/table/TableOptionGroup'
import Pagination from '@/components/Pagination'
import BmapSelector from '@/views/map/components/BmapSelector'

export default {
  name: 'Unit',
  components: { BmapSelector, Pagination, TableOptionGroup, FormDialog, TableToolBar, TableCard, PDInput, SearchItem, SearchPane },
  data() {
    return {
      // search attr
      showSearchPane: true,
      queryParams: {
        pageSize: 5,
        pageNum: 1
      },
      total: 10,
      test: '',

      // form attr
      tempUnit: {
        address: '',
        province: '',
        city: '',
        district: '',
        street: ''

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
      unitList: []
    }
  },
  mounted() {
    console.log(BmapSelector)
    console.log(this)
    this.fetchUnitPage()
  },
  methods: {

    fetchUnitPage() {
      pageUnits(this.queryParams).then(response => {
        this.unitList = response.data.list
        this.totalCount = response.data.total
      })
    },

    // region search relative function
    handleSearchUnit() {
      this.fetchUnitPage()
    },
    resetUnitQueryParams() {
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

    getAddress(addrInfo) {
      Object.assign(this.tempUnit, addrInfo.point)
      console.log(this.tempUnit)
      const { province, city, district, street } = addrInfo.addressComponents
      this.$set(this.tempUnit, 'province', province)
      this.$set(this.tempUnit, 'city', city)
      this.$set(this.tempUnit, 'district', district)
      this.$set(this.tempUnit, 'street', street)
    },

    resetTempUnit() {
      this.tempUnit = {}
    },
    handleCreateUnit() {
      this.resetTempUnit()
      this.formType = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['unitForm'].clearValidate()
      })
    },
    createUnit() {
      this.$refs['unitForm'].validate((valid) => {
        if (valid) {
          addUnit(this.tempUnit).then(() => {
            this.fetchUnitPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdateUnit(row) {
      this.tempUnit = Object.assign({}, row)
      this.formType = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['unitForm'].clearValidate()
      })
    },
    updateUnit() {
      this.$refs['unitForm'].validate((valid) => {
        if (valid) {
          const tempUnit = Object.assign({}, this.tempUnit)
          updateUnit(tempUnit).then(() => {
            this.fetchUnitPage()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleteUnit(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUnit(id).then(() => {
          this.dialogFormVisible = false
          this.fetchUnitPage()
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
