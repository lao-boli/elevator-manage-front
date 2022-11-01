<template>

  <div>
    <el-card>

      <baidu-map
        class="map"
        :center="currentCenter"
        :zoom="22"
        :scroll-wheel-zoom="true"
        @ready="init"
      >

        <bm-control
          anchor="BMAP_ANCHOR_TOP_RIGHT"
          :offset="{width:20,height:30}"
        >
          <el-button-group>
            <el-dropdown
              trigger="click"
              @command="handleChooseUnit"
            >
              <el-button size="small" type="primary">
                已部署单位<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="unit in unitList"
                  :key="unit.unitId"
                  :command="unit"
                >
                  {{ unit.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>

        </bm-control>

        <div
          v-for="unit in unitOptions"
          :key="unit.unitId"
        >
          <bm-marker
            :position="{lng:unit.lng, lat: unit.lat}"
            :dragging="false"
            @click="infoWindowOpen(unit)"
          />
          <el-card>
            ${unit.name}
          </el-card>
          <bm-info-window
            :position="{lng:unit.lng, lat: unit.lat}"
            :show="unit.show"
            @open="infoWindowOpen(unit)"
            @close="infoWindowClose(unit)"
          >
            <div class="title">
              {{ unit.name }}
            </div>
            <div class="content">
              <div class="item" />
            </div>
          </bm-info-window>
        </div>

      </baidu-map>
    </el-card>

  </div>
</template>

<script>
import { listUnits } from '@/api/unit'
export default {
  props: {
  },
  data() {
    return {
      currentCenter: {
        lng: 118.649691,
        lat: 24.941118
      },
      unitList: [],
      unitOptions: [],
      show: false,
      tempBmMaker: null,
      location: '',
      BMap: null,
      map: null,
      infoBox: null,
      keyword: ''
    }
  },
  mounted() {
    listUnits().then(response => {
      this.unitList = response.data
      this.unitList.forEach((unit) => {
        const unitOption = {
          show: false
        }
        Object.assign(unitOption, unit)
        this.unitOptions.push(unitOption)
      })
    })
  },
  methods: {
    init(entity) {
      const { BMap, map } = entity
      this.map = map
      this.BMap = map
    },

    refresh() {
      this.reload()
    },

    infoWindowOpen(unit) {
      unit.show = true
    },
    infoWindowClose(unit) {
      unit.show = false
    },

    handleChooseUnit(unit) {
      this.currentCenter.lat = unit.lat
      this.currentCenter.lng = unit.lng
    },

    toUnitDetail(marker, unit) {
      if (this.infoBox) {
        this.infoBox.close()
      }
    }

  }
}
</script>
<style scoped>
.map {
  width: 100%;
  height: 470px;
}
.title {
  font-size: 14px;
  font-weight: bold;
  color: #409EFF;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
