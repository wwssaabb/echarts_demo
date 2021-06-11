
<template>
  <div class="com-container">
    <div class="com-chart" ref="rank"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance:null, //echarts实例对象
      allData:null, //获取的全部数据
      showData:null, //展示的数据
      remainData:null, //剩余的数据
      timeID:null, //定时器ID
    }
  },
  mounted() {
    this.initChart()
    this.getData()
  },
  methods: {
    initChart(){
      this.chartInstance=this.$echarts.init(this.$refs.rank,'chalk')
      let option={
        xAxis:{
          type:'category',
        },
        yAxis:{
          type:'value'
        },
        series:[
          {
            type:'bar',
            barWidth:60,
            itemStyle:{
              barBorderRadius:[30,30,0,0],
              color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                {
                  offset:0,
                  color:'#0cb830'
                },
                {
                  offset:1,
                  color:'#666'
                },
              ])
            }
          }
        ],
        tooltip:{
          show:true
        },
        label:{
          show:true,
        }
      }
      this.chartInstance.setOption(option)
    },
    async getData(){
      let {data:res}=await this.$http.get('/rank')
      console.log(res)
      this.allData=res.sort((a,b)=>a.value-b.value)
      this.showData=this.allData.slice(0,11)
      this.remainData=this.allData.slice(11)
      //console.log(this.allData)
      console.log(this.showData.map(i=>i.name))
      console.log(this.remainData.map(i=>i.name))
      this.updateChart()
      this.starInterval()
    },
    updateChart(){
      let category_arr=this.showData.map(i=>i.name)
      let value_arr=this.showData.map(i=>i.value)
      let option={
        xAxis:{
          data:category_arr,
        },
        series:[
            {
              data:value_arr
            }
          ]
      }
      this.chartInstance.setOption(option)
    },
    screenAdapter(){
      let option={}
      this.chartInstance.setOption(option)
      this.chartInstance.resize()
    },
    starInterval(){
      this.timeID=setInterval(()=>{
        this.remainData.push(this.showData.shift())
        this.showData.push(this.remainData.shift())
        this.updateChart()
      },3000)
    }
  },
}
</script>

<style>

</style>