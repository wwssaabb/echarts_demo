<template>
  <div class="com-container">
    <div class="com-chart" ref="seller"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      chartInstance:null, //echarts的实例对象
      all_data:null,
      currentPage:3,  //当前显示的页数
      totalPage:0,    //总共的页数
      show_data:[],   //图表显示的数据
      timerId:null,     //页数变化的定时器
    }
  },
  created() {
    //组件创建完成之后进行回调函数的注册
    this.$socket.registerCallBack('sellerData',this.getData)
  },
  mounted() {
    this.initChart()
    //this.getData()
    this.$socket.send({
      action:'getData',
      socketType:'sellerData',
      chartName:'seller',
      data:''
    })
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    initChart() {//初始化图表
      this.chartInstance=this.$echarts.init(this.$refs.seller,this.theme)
      //监听鼠标移入，取消图表变化定时器
      this.chartInstance.on('mouseover',()=>{
        clearInterval(this.timerId)
        this.timerId=null
      })
      this.chartInstance.on('mouseout',()=>{
        this.startIntervel()
      })
      let option={
        title:{
          text:'▍商家销售量统计',
          top:20,
          left:20,
        },
        grid:{
          top:'15%',
          left:'5%',
          right:'5%',
          bottom:'5%',
          containLabel:true
        },
        xAxis:{
          type:'value'
        },
        yAxis:{
          type:'category',
        },
        series:[
          {
            type:'bar',
            label:{
              show:true,
              position:'right',
              color:this.theme==='chalk'?'#fff':'#333',
              textStyle:{
                fontSize:20
              }
            },
            itemStyle:{
              color:new this.$echarts.graphic.LinearGradient(0,0,1,0,[
                {
                  offset:0,
                  color:'#5052ee'
                },
                {
                  offset:1,
                  color:'#ab6ee5'
                }
              ])
            }
          }
        ],
        tooltip:{
          show:true,
          trigger:'axis',
          axisPointer:{
            type:'line',
            z:0,
            lineStyle:{
              color:this.theme==='chalk'?'#2d3443':'#c8c8c8'
            }
          }
        }

      }
      this.chartInstance.setOption(option)
    },
    async getData(res){//获取服务器数据
      //const res=await this.$http.get('/seller')
      this.all_data=res
      //处理数据，从小到大排序
      this.all_data.sort((a,b)=>b.value-a.value)
      //处理数据，分页，5条数据一页
      this.totalPage=Math.ceil(this.all_data.length/5)
      for(let p=0;p<3;p++){
        let page=this.all_data.slice(p*5,(p+1)*5)
        this.show_data.push(page)
      }
      this.dataOption()
    },
    dataOption(){//数据更新时重新配置option
      let category_data=this.show_data[this.currentPage-1].map(i=>i.name)
      let value_data=this.show_data[this.currentPage-1].map(i=>i.value)
      let option={
        yAxis:{
          data:category_data
        },
        series:[
          {
            data:value_data
          }
        ]
      }
      this.chartInstance.setOption(option)
    },
    screenAdapter(){//窗口分辨率发生变化时重新配置option
      const titleFontSize=this.$refs.seller.offsetWidth /100 * 3.125
      const option={
        title:{
          textStyle:{
            top:titleFontSize/2,
            left:titleFontSize/2,
            fontSize:titleFontSize<20?20:titleFontSize>40?40:titleFontSize
          }
        },
        series:[
          {
            barWidth:titleFontSize*1.5,
            itemStyle:{
              barBorderRadius:[0,titleFontSize*.75,titleFontSize*.75,0]
            },
            label:{
              textStyle:{
                fontSize:titleFontSize<12?12:titleFontSize>20?20:titleFontSize
              }
            }
          }
        ],
        tooltip:{
          axisPointer:{
            lineStyle:{
              width:titleFontSize*1.5-10
            }
          }
        }
      }
      this.chartInstance.setOption(option)
      this.chartInstance.resize() //重置图表大小
    },
    startIntervel(){
      if(this.timerId){
        clearInterval(this.timerId)
        this.timerId=null
      }
      this.timerId=setInterval(()=>{
        this.currentPage<this.totalPage?this.currentPage+=1:this.currentPage=1
      },3000)
    }
  },
  watch:{
    currentPage(){
      this.dataOption()
    },
    theme(){
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.dataOption()
    }
  },
  computed:{
    ...mapState(['theme'])
  },
  destroyed() {
    clearInterval(this.timerId)
    this.timerId=null
    window.removeEventListener('resize',this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
  },
};
</script>

<style lang="scss" scope></style>
