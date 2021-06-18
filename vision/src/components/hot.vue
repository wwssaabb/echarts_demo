<!--
 * @Author: wwssaabb
 * @Date: 2021-06-12 09:32:07
 * @LastEditTime: 2021-06-17 16:21:13
 * @FilePath: \demo\echarts_demo\vision\src\components\hot.vue
-->
<template>
  <div class="com-container po-re">
    <div class="com-chart" ref="hot"></div>
    <div class="com-control" v-if="allData">
      <div class="arrow-left po-ab" v-if="currentIndex>0" @click="currentIndex-=1"></div>
      <div class="arrow-right po-ab" v-if="currentIndex<allData.length-1" @click="currentIndex+=1"></div>
      <div class="com-chart-type po-ab" :style="typeStyle" v-if='allData[currentIndex]'>{{allData[currentIndex].name}}</div>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance:null,   //echarts实例对象
      allData:null,   //获取到的全部数据
      showData:null,   //展示需要的数据
      currentIndex:0,   //当前展示数据的索引
      chartWidth:0,   //当前展示数据的索引
    }
  },
  created() {
    //组件创建完成之后进行回调函数的注册
    this.$socket.registerCallBack('hotData',this.getData)
  },
  mounted(){
    this.initChart()
    //this.getData()
    this.$socket.send({
      action:'getData',
      socketType:'hotData',
      chartName:'hotproduct',
      data:''
    })
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    initChart(){
      this.chartInstance=this.$echarts.init(this.$refs.hot,'chalk')
      let option={
        title:{
          top:20, 
          left:20, 
          text:'▍热销商品销售金额占比统计'
        },
        legend:{
          show:true,
          top:'15%',
          icon:'circle',
        },
        series:[
          {
            type:'pie',
            center:['50%','55%'],
            label:{
              show:false
            },
            emphasis:{
              label:{
                show:true,
              },
              labelLine:{
                show:false
              }
            }
          }
        ],
        tooltip:{
          show:true,
          textStyle:{
            width:100,
            overflow:'break'
          }
        }
      }
      this.chartInstance.setOption(option)
    },
    async getData(res){
      //let {data:res}=await this.$http.get('/hotproduct')
      this.allData=res
      this.updateChart()
    },
    updateChart(){
      this.showData=this.allData[this.currentIndex].children.reduce((arr,item)=>{
        let total=item.children.reduce((s,i)=>s+=i.value,0)
        arr.push({name:item.name,value:total,children:item.children})
        return arr
      },[])
      let legendData=this.showData.map(i=>i.name)
      let option={
        legend:{
          data:legendData
        },
        series:[
          {
            data:this.showData,
          },
        ],
        tooltip:{
          formatter:res=>{
            let arr=res.data.children
            let result=arr.reduce((s,i,index,arr)=>index!==arr.length-1?s+=i.name+':'+(i.value/res.value*100).toFixed(2)+'%</br>':s+=i.name+':'+(i.value/res.value*100).toFixed(2)+'%','')
            return result
          }
        }
      }
      this.chartInstance.setOption(option)
    },
    screenAdapter(){
      this.chartWidth=this.$refs.hot.offsetWidth /100 * 3.125  //1920时为60
      let option={
        legend:{
          itemWidth:this.chartWidth<16?16:this.chartWidth>20?20:this.chartWidth,
          itemHeight:this.chartWidth<16?16:this.chartWidth>20?20:this.chartWidth,
          itemGap:this.chartWidth<16?16:this.chartWidth>20?20:this.chartWidth,
          textStyle:{
            fontSize:this.chartWidth<16?16:this.chartWidth>20?20:this.chartWidth
          }
        },
        title:{
          fontSize:this.chartWidth<20?20:this.chartWidth>40?40:this.chartWidth
        },
        series:[
          {
            radius:this.chartWidth*5.5,
            emphasis:{
            lebal:{
              fontSize:this.chartWidth/2<16?16:this.chartWidth>20?20:this.chartWidth
            }
            },
          }
        ]
      }
      this.chartInstance.setOption(option)
      this.chartInstance.resize()
    }
  },
  computed:{
    typeStyle(){
      return {fontSize:this.chartWidth*2/3<24?24:this.chartWidth*2/3+'px'} 
    }
  },
  watch:{
    currentIndex(){
      this.updateChart()
    }
  },
  destroyed() {
    window.removeEventListener('resize',this.screenAdarpter)
    this.$socket.unRegisterCallBack('hotData')
  },
}
</script>

<style lang='scss' scope>
  .com-chart{
    z-index: 10;
  }
  .com-control{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .arrow-left,.arrow-right{
    top: 50%;
    width: 3.5vw;
    height: 3.5vw;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-50%);
    z-index: 15;
  }
  .arrow-left{
    left: 5vw;
    z-index: 15;
    &::after{
      content:'';
      position: absolute;
      width: 2vw;
      height: 2vw;
      border-left:2px solid #fff;
      border-bottom:2px solid #fff;
      transform: rotate(45deg);
    }
  }
  .arrow-right{
    right: 5vw;
    z-index: 15;
    &::after{
      content:'';
      position: absolute;
      width: 1.5vw;
      height: 1.5vw;
      border-right:2px solid #fff;
      border-bottom:2px solid #fff;
      transform: rotate(-45deg);
    }
  }
  .com-chart-type{
    position: absolute;
    bottom: 3vh;
    left: 3vw;
    font-size: 40px;
    color: #fff;
    font-weight: bold;
    z-index: 15;
  }

</style>