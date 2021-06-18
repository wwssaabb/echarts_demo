<!--
 * @Author: wwssaabb
 * @Date: 2021-06-15 14:42:26
 * @LastEditTime: 2021-06-17 17:53:12
 * @FilePath: \demo\echarts_demo\vision\src\views\screenPage.vue
-->
<template>
  <div class="com-page bg-color1 flex-css">
    <div class="com-header po-re">
      <div class="com-header-left"><p class="po-ab">logo</p></div>
      <div class="com-header-center po-ab">
        电商平台实时监控系统
        <div class="border-left po-ab"></div>
        <div class="border-bottom po-ab"></div>
        <div class="border-right po-ab"></div>
      </div>
      <div class="com-header-right"></div>
    </div>
    <div class="page-content-wrap">
      <div class="page-content-left">
        <div :class="['chart-trend','po-re',fullScreenStatus['trend']?'com-full-screen':'']"><trend ref="trend"></trend><div :class="fullScreenStatus['trend']?'com-zoom-out':'com-zoom-in'" @click="changeFullScreen('trend')"></div></div>
        <div class="chart-seller po-re" :class="fullScreenStatus['seller']?'com-full-screen':''"><seller ref="seller"></seller><div :class="fullScreenStatus['seller']?'com-zoom-out':'com-zoom-in'" @click="changeFullScreen('seller')"></div></div>
      </div>
      <div class="page-content-middle" po-ab>
        <div class="chart-map po-re" :class="fullScreenStatus['map']?'com-full-screen':''"><map_ ref="map"></map_><div :class="fullScreenStatus['map']?'com-zoom-out':'com-zoom-in'" @click="changeFullScreen('map')"></div></div>
        <div class="chart-rank po-re" :class="fullScreenStatus['rank']?'com-full-screen':''"><rank ref="rank"></rank><div :class="fullScreenStatus['rank']?'com-zoom-out':'com-zoom-in'" @click="changeFullScreen('rank')"></div></div>
      </div>
      <div class="page-content-right">
        <div class="chart-hot po-re" :class="fullScreenStatus['hot']?'com-full-screen':''"><hot ref="hot"></hot><div :class="fullScreenStatus['hot']?'com-zoom-out':'com-zoom-in'" @click="changeFullScreen('hot')"></div></div>
        <div class="chart-stock po-re" :class="fullScreenStatus['stock']?'com-full-screen':''"><stock ref="stock"></stock><div :class="fullScreenStatus['stock']?'com-zoom-out':'com-zoom-in'" @click="changeFullScreen('stock')"></div></div>
      </div>
    </div>
  </div>
</template>

<script>
import hot from "@/components/hot";
import map_ from "@/components/map";
import rank from "@/components/rank";
import seller from "@/components/seller";
import stock from "@/components/stock";
import trend from "@/components/trend";
export default {
  components: {
    hot,
    map_,
    rank,
    seller,
    stock,
    trend 
  },
  data() {
    return {
      fullScreenStatus:{
        hot:false,
        map:false,
        rank:false,
        seller:false,
        stock:false,
        trend:false,
      }
    };
  },
  created() {
    this.$socket.registerCallBack('fullScreen',this.recvData)
  },
  methods: {
    changeFullScreen(chartName){
      const targetValue=!this.fullScreenStatus[chartName]
      this.$socket.send({
        action:'fullScreen',
        socketType:'fullScreen',
        chartName:chartName,
        value:targetValue
      })
    },
    recvData(data){
      console.log(data)
      this.fullScreenStatus[data.chartName]=data.value
      console.log(this.fullScreenStatus)
      this.$nextTick(()=>{
        this.$refs[data.chartName].screenAdapter()
      })
    }
  },
  destroyed() {
    this.$socket.unRegisterCallBack('fullScreen')
  },
};
</script>

<style lang="scss" scope>
.bg-color1 {
  background-color: #171424;
}
.flex-css {
  display: flex;
  flex-direction: column;
}
.com-header {
  box-sizing: border-box;
  width: 100vw;
  padding: 10px 20px;
  height: 7vh;
  background-color: #171424;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.com-header-left,
.com-header-right {
  width: 40%;
  height: 2vh;
  border-bottom: 2px solid #474554;
}
.com-header p{
  left: 5vw;
  top: 50%;
  color:#fff;
  font-family: 'Ruslan Display', cursive;
  font-size: 1.5625vw;
  transform: translateY(-150%);
}
.com-header-center {
  width: 30%;
  height: 4vh;
  top: 20px;
  left: 50%;
  padding-bottom: 5px;
  font-size: 1.5625vw;
  //font-weight: bold;
  color: #fff;
  transform: translateX(-50%);
  clip-path: polygon(0 0, 20% 100%, 80% 100%, 100% 0, 20% 0);
  //border-bottom:2px solid #0080ad;
  background-color: #171424;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .border-bottom {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-image: linear-gradient(
      to right,
      #474554 10%,
      #1d2c4e 30%,
      #1a8cb6 45%,
      #00bbff 50%,
      #1a8cb6 55%,
      #1d2c4e 70%,
      #474554 90%
    );
  }
  .border-left {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    clip-path: polygon(0 0, 20% 100%, 21.5% 100%, 1.5% 0, 0 0);
    background-image: linear-gradient(to bottom, #171424 20%, #474554);
  }
  .border-right {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    clip-path: polygon(0 0, 98.5% 0, 78.5% 100%, 80% 100%, 100% 100%, 98.5% 0);
    background-image: linear-gradient(to bottom, #171424 20%, #474554);
  }
}

.page-content-wrap {
  flex: 1;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.page-content-left,
.page-content-right {
  box-sizing: border-box;
  width: 30vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  
}
.page-content-left {padding: 10px 10px 10px 20px;}
.page-content-right {padding: 10px 20px 10px 10px;}


.page-content-middle{
  box-sizing: border-box;
  width: 40vw;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.chart-trend{
  flex-shrink: 0;
  width: 100%;
  height: calc(60% - 10px);
  margin-bottom: 10px;
}
.chart-seller{
  width: 100%;
  height: 40%;
}
.chart-map{
  flex-shrink: 0;
  width: 100%;
  height: calc(65% - 10px);
  margin: 10px 0 10px 0;
}
.chart-rank{
  width: 100%;
  height: 35%;
}
.chart-hot{
  width: 100%;
  height: calc(50% - 10px);
  margin-bottom: 10px;
}
.chart-stock{
  width: 100%;
  height: 50%;
  
}

</style>
