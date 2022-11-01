<template>
  <div class="map-selector">
    <div class="address">
      <div class="label">地址：</div>
      <div class="input">
        <el-autocomplete
          v-model="searchText"
          style="width: 100%"
          :fetch-suggestions="queryLocal"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          @select="selectAddress"
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.name }}</div>
          </template>
        </el-autocomplete>
      </div>
    </div>

    <baidu-map
      class="map"
      :center="LngLat"
      :zoom="22"
      @ready="createMap"
    >
      <bm-navigation
        anchor="BMAP_ANCHOR_TOP_LEFT"
      />
    </baidu-map>

  </div>
</template>

<script>
export default {
  name: 'BmapSelector',
  model: {
    prop: 'address',
    event: 'input'
  },
  props: {
    address: [String, Number],
    LngLat: {
      type: Object,
      default: () => {
        return { lng: 118.649691, lat: 24.941118 }
      }
    },
    mapHeight: {
      type: String,
      default: '500px'
    }
  },
  data() {
    return {
      map: null,
      BMap: null,

      localSearch: null,
      bmap: this,

      geocoder: null
    }
  },
  computed: {
    searchText: {
      get() {
        return this.address
      },
      set(newValue) {
        console.log(newValue)
        this.$emit('input', newValue)
      }
    }
  },
  methods: {
    createMap(entity) {
      this.map = entity.map
      this.BMap = entity.BMap

      const _this = this

      this.map.addEventListener('click', e => {
        _this.setPosition(e.point)
        _this.emitAddress(e.point)
      })

      this.geocoder = new this.BMap.Geocoder()
      this.localSearch = new this.BMap.LocalSearch(_this.map)
    },

    emitAddress(point) {
      this.geocoder.getLocation(point, result => {
        this.$emit('getAddress', result)
      })
    },

    selectAddress(address) {
      this.searchText = address.name
      this.map.centerAndZoom(address.point, 22)
      this.setPosition(address.point)
      this.emitAddress(address.point)
    },

    queryLocal(queryString, cb) {
      this.localSearch.setSearchCompleteCallback(results => {
        const localList = []
        for (let i = 0; i < results.getCurrentNumPois(); i++) {
          const address = {
            name: results.getPoi(i).address,
            point: results.getPoi(i).point
          }
          localList.push(address)
        }

        // 回调显示下拉列表
        cb(localList)
      })

      this.localSearch.search(queryString)
    },

    setPosition(point) {
      this.map.clearOverlays()
      this.map.addOverlay(new this.BMap.Marker(point))
    }
  }
}
</script>
<style lang="scss" scoped>
.map-selector {
  .address {
    display: flex;
    margin-bottom: 15px;
    .label {
      flex: initial;
      font-size: 14px;
      font-weight: bold;

      // 实现文字水平垂直居中
      display:flex;
      align-items:center;
      justify-content:center;
    }
    .input {
      flex: auto;
    }
  }

}
.map {
  width: 100%;
  height: 470px;
}
</style>

