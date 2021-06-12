<!--
 * @Author: wwssaabb
 * @Date: 2021-06-12 09:32:07
 * @LastEditTime: 2021-06-12 15:15:40
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
  mounted(){
    this.initChart()
    this.getData()
    window.addEventListener('resize',this.screenAdarpter)
    this.screenAdarpter()
  },
  methods: {
    initChart(){
      this.chartInstance=this.$echarts.init(this.$refs.hot,'chalk')
      let option={
        title:{
          text:'▍热销商品销售金额占比统计'
        },
        legend:{
          show:true,
          top:'10%',
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
                textStyle:{
                  fontSize:16
                }
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
    async getData(){
      let {data:res}=await this.$http.get('/hotproduct')
      console.log(res)
      this.allData=res
      this.updateChart()
    },
    updateChart(){
      this.showData=this.allData[this.currentIndex].children.reduce((arr,item)=>{
        let total=item.children.reduce((s,i)=>s+=i.value,0)
        arr.push({name:item.name,value:total,children:item.children})
        return arr
      },[])
      console.log(this.showData)
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
            //console.log(res)
            let arr=res.data.children
            let result=arr.reduce((s,i,index,arr)=>index!==arr.length-1?s+=i.name+':'+(i.value/res.value*100).toFixed(2)+'%</br>':s+=i.name+':'+(i.value/res.value*100).toFixed(2)+'%','')
            //console.log(result)
            return result
          }
        }
      }
      this.chartInstance.setOption(option)
    },
    screenAdarpter(){
      this.chartWidth=this.$refs.hot.offsetWidth /100 *3.125  //1920时为60
      let option={
        legend:{
          itemWidth:this.chartWidth/2<14?14:this.chartWidth>20?20:this.chartWidth,
          itemHeight:this.chartWidth/2<14?14:this.chartWidth>20?20:this.chartWidth,
          itemGap:this.chartWidth/2<14?14:this.chartWidth>20?20:this.chartWidth,
          textStyle:{
            fontSize:this.chartWidth/2<14?14:this.chartWidth>20?20:this.chartWidth
          }
        },
        title:{
          top:this.chartWidth/3,  
          left:this.chartWidth/3,
          textStyle:{
            fontSize:this.chartWidth<20?20:this.chartWidth>40?40:this.chartWidth
          }
        },
        series:[
          {
            radius:this.chartWidth*5,
            emphasis:{
            lebal:{
              fontSize:this.chartWidth/2<14?14:this.chartWidth>18?18:this.chartWidth
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
      width: 2vw;
      height: 2vw;
      border-right:2px solid #fff;
      border-bottom:2px solid #fff;
      transform: rotate(-45deg);
    }
  }
  .com-chart-type{
    position: absolute;
    bottom: 10vh;
    right: 15vw;
    font-size: 40px;
    color: #fff;
    font-weight: bold;
    z-index: 15;
  }

</style>