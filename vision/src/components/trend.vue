<!--
 * @Author: wwssaabb
 * @Date: 2021-06-11 08:14:17
 * @LastEditTime: 2021-06-16 17:30:21
 * @FilePath: \demo\echarts_demo\vision\src\components\Trend.vue
-->
<template>
  <div class="com-container po-re">
    <div class="com-chart" ref="trend"></div>
    <div class="com-chart-title po-ab" :class="is_select?'ov-no':'ov-hi'" :style="comStyle">
      <div>▍</div>
      <div class="select-area">
        <div class="select-item" v-for="(title,index) in titles" :key="index" @click="select_title(index)">
          {{title}}
        </div>
      </div>
      <div class="arrow" @click="is_select=!is_select" :class="is_select?'rotate-180':''" :style="arrowStyle"></div>
    </div>
    <div class="com-full po-ab"></div>
    <div class="com-back po-ab"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance:null, //echarts的实例对象
      allData:null, //获取到的全部数据
      showData:[], //展示的数据
      titles:[], //获取到的全部数据的类别
      selectTitle:'', //选择的类别
      is_select:false, //选择的类别
      titleFontSize:0, //title的字体大小
    }
  },
  created() {
    //组件创建完成之后进行回调函数的注册
    this.$socket.registerCallBack('trendData',this.getData)
  },
  mounted() {
    this.initChart()
    //this.getData()
    this.$socket.send({
      action:'getData',
      socketType:'trendData',
      chartName:'trend',
      data:''
    })
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    initChart(){//初始化图表
      //获取echarts实例对象
      this.chartInstance=this.$echarts.init(this.$refs.trend,'chalk')
      let option={
        xAxis:{
          type:'category',
          boundaryGap:false
        },
        yAxis:{
          type:'value'
        },
        legend:{
          top:'10%',
          icon:'circle',
          textStyle:{
            fontSize:30
          }
        },
        grid:{
          top:'18%',
          right:'5%',
          bottom:'5%',
          left:'5%',
          containLabel:true
        },
        tooltip:{
          show:true,
          trigger:'axis'
        }
      }
      this.chartInstance.setOption(option)
    },
    async getData(res){//获取数据
      //const {data:res}=await this.$http.get('trend')
      this.allData=res
      this.titles=res.type.map(i=>i.text)
      this.selectTitle=this.titles[0]
      this.showData.push(this.allData.map)
      this.showData.push(this.allData.seller)
      this.showData.push(this.allData.commodity)
      this.updataChart()
    },
    updataChart(){//数据更新时重新配置option
      //半透明的颜色值
      const colorArr1=[
        'rgba(185,86,15,0.5)',
        'rgba(188,35,36,0.5)',
        'rgba(25,182,167,0.5)',
        'rgba(41,89,194,0.5)',
        'rgba(18,130,46,0.5)',
      ]
      //全透明的颜色值
      const colorArr2=[
        'rgba(185,86,15,0)',
        'rgba(188,35,36,0)',
        'rgba(25,182,167,0)',
        'rgba(41,89,194,0)',
        'rgba(18,130,46,0)',
      ]
      //数据处理
      const timeArr=this.allData.common.month
      const valueArr=this.showData.find(i=>i.title===this.selectTitle).data
      const seriesArr=valueArr.map((i,index)=>{
        return {
          name:i.name,
          type:'line',
          data:i.data,
          stack:'map',
          areaStyle:{
            color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[
              {
                offset:0,
                color:colorArr1[index]
              },
              {
                offset:1,
                color:colorArr2[index]
              },
            ])
          }
        }
      })
      const legendArr=valueArr.map(i=>i.name)
      let option={
        xAxis:{
          data:timeArr
        },
        legend:{
          data:legendArr
        },
        series:[
          ...seriesArr
        ],
      }
      this.chartInstance.setOption(option)

    },
    screenAdapter(){//窗口分辨率发生变化时重新配置option
      this.titleFontSize=this.$refs.trend.offsetWidth /100 * 3.125 
      let option={
        legend:{
          itemWidth:this.titleFontSize<=12?12:this.titleFontSize>=20?20:this.titleFontSize,
          itemHeight:this.titleFontSize<=12?12:this.titleFontSize>=20?20:this.titleFontSize,
          itemGap:this.titleFontSize<=12?12:this.titleFontSize>=20?20:this.titleFontSize,
          textStyle:{
            fontSize:this.titleFontSize<=14?14:this.titleFontSize>=20?20:this.titleFontSize
          }
        }
      }
      this.chartInstance.setOption(option)
      this.chartInstance.resize()
    },
    select_title(index){
      let title=this.titles[index]
      this.titles.splice(index,1)
      this.titles.unshift(title)
      this.selectTitle=title
      this.is_select=false
    }
  },
  watch:{
    selectTitle(){
      this.updataChart()
    }
  },
  computed:{
    comStyle(){
      return {
        fontSize:(this.titleFontSize<=20?20:this.titleFontSize>=40?40:this.titleFontSize)+'px',
        top:this.titleFontSize/2+'px',
        left:this.titleFontSize/2+'px',
      }
    },
    arrowStyle(){
      return {
        width:(this.titleFontSize/2<=15?15:this.titleFontSize/2>=25?25:this.titleFontSize/2)+'px',
        height:(this.titleFontSize/2<=15?15:this.titleFontSize/2>=25?25:this.titleFontSize/2)+'px',
      }
    }
  },
  destroyed() {
    //移除窗口大小变化的时间监听
    window.removeEventListener('resize',this.screenAdapter)
    //组件销毁时进行回调函数的取消
    this.$socket.unRegisterCallBack('trendData')
  },
}
</script>

<style lang='scss' scope>

</style>