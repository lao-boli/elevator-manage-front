<template>
  <div class="dashboard-editor-container">
    <panel-group @handleRoute="handleRoute" />

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="chart-pane">
            <rose-chart
              id="brandChart"
              title="电梯品牌占比统计"
              name="电梯品牌"
              :chart-data="brandStatistics"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="chart-pane">
            <rose-chart
              id="companyElevatorChart"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="chart-pane">
            <rose-chart
              id="onlineChart"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import RoseChart from '@/components/Charts/RoseChart'
import { getBrandStatistics } from '@/api/elevator'

export default {
  name: 'DataSummary',
  components: {
    RoseChart,
    PanelGroup
  },
  data() {
    return {
      brandStatistics: []
    }
  },
  mounted() {
    getBrandStatistics().then(response => {
      this.brandStatistics = response.data
    })
  },
  methods: {
    handleRoute(to) {
      this.$router.push({
        name: to
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    height: 350px;
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.chart-pane {
  display: flex;
  width: 100%;
  height: 100%;
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
