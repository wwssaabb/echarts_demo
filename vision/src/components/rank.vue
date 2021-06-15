
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
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    initChart(){
      this.chartInstance=this.$echarts.init(this.$refs.rank,'chalk')
      let option={
        title:{
          top:20,
          left:20,
          text:'▍地区销售排行榜',
        },
        grid:{
          top:'15%',
          left:'5%',
          right:'5%',
          bottom:'5%',
          containLabel:true
        },
        xAxis:{
          type:'category',
        },
        yAxis:{
          type:'value'
        },
        series:[
          {
            type:'bar',
            itemStyle:{
              color:(res)=>{
                let colorArr=null
                if(res.value>300){
                  colorArr=['#0ba82c','#4ff778']
                }else if(res.value>200){
                  colorArr=['#2e72bf','#23e5e5']
                }else{
                  colorArr=['#5052ee','#ab6ee5']
                }
                return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                        {
                          offset:0,
                          color:colorArr[0]
                        },
                        {
                          offset:1,
                          color:colorArr[1]
                        },
                      ])
                }
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
      this.chartInstance.on('mousemove',()=>{ //鼠标移入图表
        clearInterval(this.timeID)
        this.timeID=null
      })
      this.chartInstance.on('mouseout',this.starInterval) //鼠标移出图表
      
    },
    async getData(){
      let {data:res}=await this.$http.get('/rank')
      this.allData=res.sort((a,b)=>a.value-b.value)
      this.showData=this.allData.slice(0,11)
      this.remainData=this.allData.slice(11)
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
      let width=this.$refs.rank.offsetWidth /100 * 3.125  //1920的情况下为60
      let option={
        title:{
          textStyle:{
            top:width/2,
            left:width/2,
            fontSize:width<20?20:width>40?40:width
          }
        },
        xAxis:{
          
        },
        yAxis:{
          
        },
        series:[
          {
            barWidth:width*1.5,
            itemStyle:{
              barBorderRadius:[width*.75,width*.75,0,0]
            }
          }
        ],
        tooltip:{
          textStyle:{
            fontSize:width<14?14:width>18?18:width
          },
        }
      }
      this.chartInstance.setOption(option)
      this.chartInstance.resize()
    },
    starInterval(){
      if(this.timeID){
        clearInterval(this.timeID)
        this.timeID=null
      }
      this.timeID=setInterval(()=>{
        this.remainData.push(this.showData.shift())
        this.showData.push(this.remainData.shift())
        this.updateChart()
      },3000)
    }
  },
  destroyed() {
    window.removeEventListener('resize',this.screenAdapter)
    this.chartInstance.off('mouseout',this.screenAdapter)
    clearInterval(this.timeID)
    this.timeID=null
  },
}
</script>

<style>

</style>