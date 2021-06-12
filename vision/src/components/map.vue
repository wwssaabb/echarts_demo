<!--
 * @Author: wwssaabb
 * @Date: 2021-06-11 12:02:48
 * @LastEditTime: 2021-06-12 09:01:33
 * @FilePath: \demo\echarts_demo\vision\src\components\map.vue
-->
<template>
  <div class="com-container" @dblclick="reset_map">
    <div class="com-chart" ref="map"></div>
  </div>
</template>

<script>
import axios from 'axios'
import {getProvinceMapInfo} from '../utils/map_utils'
export default {
  data() {
    return {
      chartInstance:null,  //echarts实例对象
      allData:null,  //获取到的全部数据
      china_map:null,  //中国地图矢量数据
      china_cityMap:{},  //中国城市地图矢量数据
    }
  },
   mounted() {
      this.initChart()
      this.getData()
      window.addEventListener('resize',this.screenAdapter)
      this.screenAdapter()
  },
  methods: {
    async initChart(){
      this.chartInstance=this.$echarts.init(this.$refs.map,'chalk')
      //获取中国地图的矢量数据
      this.china_map=await axios.get('http://localhost:8080/static/map/china.json')
      console.log(this.china_map)
      this.$echarts.registerMap('china',this.china_map.data)
      let option={
        title:{
          text:'▍商家分布',
          top:20,
          left:20,
          textStyle:{
            fontSize:30
          }
        },
        geo:{
          type:'map',
          map:'china',
          top:'5%',
          bottom:'5%',
          itemStyle:{
            areaColor:'#a8a8a8',
            borderColor:'#666'
          }
        },
        legend:{
          left:'5%',
          bottom:'5%',
          orient:'vertical',
        },
        
      }
      this.chartInstance.setOption(option)
      this.chartInstance.on('click',this.changeCity)
    },
    async getData(){
      let {data:res}=await this.$http.get('/map')
      this.allData=res
      console.log(this.allData)
      this.updateChart()
    },
    updateChart(){
      console.log('updateChart')
      let legendArr=this.allData.map(i=>i.name)
      let scatterArr=this.allData.map(i=>{
        let data=i.children
        return {
          type:'effectScatter',
          name:i.name,
          data,
          coordinateSystem:'geo',
          rippleEffect:{
            scale:5,
            brushType:'stroke'
          }
        }
      })
      let option={ 
        legend:{
          data:legendArr,
        },
        series:[
          ...scatterArr
        ]
      }
      this.chartInstance.setOption(option)
    },
    screenAdapter(){
      let width=this.$refs.map.offsetWidth /100 *3.12
      let option={
        title:{
          textStyle:{
            fontSize:width
          }
        },
        legend:{
          itemWidth:width/2.5,
          itemHeight:width/2.5,
          itemGap:width/3,
          textStyle:{
            fontSize:width/2.5
          }
        }
      }
      this.chartInstance.setOption(option)
      this.chartInstance.resize()
    },
    async changeCity(e){
      let city=getProvinceMapInfo(e.name)
      if(!city.key) return  //没有找到城市返回
      if(!this.china_cityMap[e.name]){
        this.chartInstance.showLoading()
        let {data:res}=await axios.get('http://localhost:8080/'+city.path)
        this.china_cityMap[e.name]=res
        console.log(this.china_cityMap)
        this.chartInstance.hideLoading()
      }
      let city_map=this.china_cityMap[e.name]
      this.$echarts.registerMap('city_map',city_map)
      let option={
        geo:{
          map:'city_map'
        }
      }
      this.chartInstance.setOption(option)
    },
    reset_map(){
      let option={
        geo:{
          map:'china'
        }
      }
      this.chartInstance.setOption(option)
    }
  },
  destroyed() {
    window.removeEventListener('resize',this.screenAdapter)
    this.chartInstance.off('click',this.changeCity)
  },
}
</script>

<style>

</style>