<!--
 * @Author: wwssaabb
 * @Date: 2021-06-12 15:02:48
 * @LastEditTime: 2021-06-12 17:15:43
 * @FilePath: \demo\echarts_demo\vision\src\components\stock.vue
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="stock"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance:null,   //echarts实例对象
      allData:null,   //获取的全部数据
      showData:[],   //展示的数据集合，分成两组，每组5各数据
      currentIndex:0,   //当前展示集合索引
      timerID:null,   //数据变更的定时器ID
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    initChart(){
      this.chartInstance=this.$echarts.init(this.$refs.stock,'chalk')
      let option={
        title:{
          text:'▍库存销售量',
          top:20,
          left:20 
        },
        label:{
          show:false,
        },
        tooltip:{
          show:false
        }
      }
      this.chartInstance.setOption(option)
      this.chartInstance.on('mousemove',()=>{
        clearInterval(this.timerID)
        this.timerID=null
      })
      this.chartInstance.on('mouseout',this.startInterval)
    },
    async getData(){
      let {data:res}=await this.$http.get('/stock')
      this.allData=res
      this.showData.push(this.allData.slice(0,5))
      this.showData.push(this.allData.slice(5))
      this.updateChart()
      this.startInterval()
    },
    updateChart(){
      const cneterArr=[
        ['18%','40%'],
        ['50%','40%'],
        ['82%','40%'],
        ['34%','75%'],
        ['66%','75%'],
      ]
      const colorArr=[
        ['#4ff778','#0ba82c'],
        ['#e5dd45','#e8b11c'],
        ['#e8821c','#e55445'],
        ['#5052ee','#ab6ee5'],
        ['#23e5e5','#2e72bf'],
      ]
      let seriesData=this.showData[this.currentIndex].map((i,index)=>{
        return {
          name:i.name,
          data:[{value:i.sales,name:i.name+'\n销量:'+i.sales+'\n库存:'+i.stock,itemStyle:{
            color:new this.$echarts.graphic.LinearGradient(0,1,0,0,[
              {
                offset:0,
                color:colorArr[index][0]
              },
              {
                offset:1,
                color:colorArr[index][1]
              }
            ])
          }},{value:i.stock,itemStyle:{color:'#333843'}}],
          type:'pie',
          labelLine:{
            show:false
          },
          label:{
            position:'center',
            textStyle:{
              color:colorArr[index][0],
            }
          },
          radius:['28%','25%'],
          center:cneterArr[index],
          hoverAnimation:false  //关闭鼠标移入饼图时的默认动画效果
        }
      })
      console.log(seriesData)
      let option={
        series:[
          ...seriesData
        ]
      }
      this.chartInstance.setOption(option)
    },
    screenAdapter(){
      const width=this.$refs.stock.offsetWidth /100 * 3.125 //1920时为60
      let textSize=width<14?14:width>24?24:width
      console.log(textSize)
      let option={
        title:{
          textStyle:{
            top:width/2,
            left:width/2,
            fontSize:width<20?20:width>40?40:width
          }
        },
        series:[
          {type:'pie',label:{textStyle:{fontSize:textSize,lineHeight:textSize*1.3}}},
          {type:'pie',label:{textStyle:{fontSize:textSize,lineHeight:textSize*1.3}}},
          {type:'pie',label:{textStyle:{fontSize:textSize,lineHeight:textSize*1.3}}},
          {type:'pie',label:{textStyle:{fontSize:textSize,lineHeight:textSize*1.3}}},
          {type:'pie',label:{textStyle:{fontSize:textSize,lineHeight:textSize*1.3}}},
        ]
      }
      this.chartInstance.setOption(option)
      this.chartInstance.resize()
    },
    startInterval(){
      if(this.timerID){
        clearInterval(this.timerID)
        this.timerID=null
      }
      this.timerID=setInterval(()=>{
        this.currentIndex=this.currentIndex===0?1:0
      },3000)
    }

  },
  watch:{
    currentIndex(){
      this.updateChart()
    }
  },
  destroyed() {
    clearInterval(this.timerID)
    this.timerID=null
    this.chartInstance.off('mousemove')
    this.chartInstance.off('mouseout',this.startInterval)
  },
}
</script>

<style>

</style>