<!--
 * @Author: wwssaabb
 * @Date: 2021-06-11 12:02:48
 * @LastEditTime: 2021-11-12 14:42:50
 * @FilePath: \echarts_demo\vision\src\components\map.vue
-->
<template>
  <div class="com-container" @dblclick="reset_map">
    <div class="com-chart" ref="map"></div>
  </div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "../utils/map_utils";
import { mapState } from "vuex";
export default {
  data() {
    return {
      href: "",
      chartInstance: null, //echarts实例对象
      allData: null, //获取到的全部数据
      china_map: null, //中国地图矢量数据
      china_cityMap: {} //中国城市地图矢量数据
    };
  },
  created() {
    //组件创建完成之后进行回调函数的注册
    this.$socket.registerCallBack("mapData", this.getData);
    //获取baseUrl
    this.href = location.href.replace("#/", "");
  },
  mounted() {
    this.initChart();
    //this.getData()
    this.$socket.send({
      action: "getData",
      socketType: "mapData",
      chartName: "map",
      data: ""
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map, this.theme);
      //获取中国地图的矢量数据
      this.china_map = await axios.get(this.href + "/static/map/china.json");
      this.$echarts.registerMap("china", this.china_map.data);
      let option = {
        title: {
          text: "▍商家分布",
          top: 20,
          left: 20
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#a8a8a8",
            borderColor: "#666"
          }
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical"
        }
      };
      this.chartInstance.setOption(option);
      this.chartInstance.on("click", this.changeCity);
    },
    async getData(res) {
      //let {data:res}=await this.$http.get('/map')
      this.allData = res;
      this.updateChart();
    },
    updateChart() {
      let legendArr = this.allData.map(i => i.name);
      let scatterArr = this.allData.map(i => {
        let data = i.children;
        return {
          type: "effectScatter",
          name: i.name,
          data,
          coordinateSystem: "geo",
          rippleEffect: {
            scale: 5,
            brushType: "stroke"
          }
        };
      });
      let option = {
        legend: {
          data: legendArr
        },
        series: [...scatterArr]
      };
      this.chartInstance.setOption(option);
    },
    screenAdapter() {
      let width = (this.$refs.map.offsetWidth / 100) * 3.125;
      let option = {
        title: {
          textStyle: {
            fontSize: width < 20 ? 20 : width > 40 ? 40 : width
          }
        },
        legend: {
          itemWidth: width < 14 ? 14 : width > 20 ? 20 : width,
          itemHeight: width < 14 ? 14 : width > 20 ? 20 : width,
          itemGap: width < 14 ? 14 : width > 20 ? 20 : width,
          textStyle: {
            fontSize: width < 14 ? 14 : width > 20 ? 20 : width
          }
        }
      };
      this.chartInstance.setOption(option);
      this.chartInstance.resize();
    },
    async changeCity(e) {
      let city = getProvinceMapInfo(e.name);
      if (!city.key) return; //没有找到城市返回
      if (!this.china_cityMap[e.name]) {
        this.chartInstance.showLoading();
        let { data: res } = await axios.get(this.href + city.path);
        this.china_cityMap[e.name] = res;
        this.chartInstance.hideLoading();
      }
      let city_map = this.china_cityMap[e.name];
      this.$echarts.registerMap("city_map", city_map);
      let option = {
        geo: {
          map: "city_map"
        }
      };
      this.chartInstance.setOption(option);
    },
    reset_map() {
      let option = {
        geo: {
          map: "china"
        }
      };
      this.chartInstance.setOption(option);
    }
  },
  computed: {
    ...mapState(["theme"])
  },
  watch: {
    theme() {
      this.chartInstance.dispose(); //销毁当前图表实例
      this.initChart();
      this.screenAdapter();
      this.updateChart();
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.chartInstance.off("click", this.changeCity);
    this.$socket.unRegisterCallBack("mapData");
  }
};
</script>

<style></style>
