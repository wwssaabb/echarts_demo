<!--
 * @Author: wwssaabb
 * @Date: 2021-06-15 14:42:26
 * @LastEditTime: 2021-06-15 18:07:49
 * @FilePath: \demo\echarts_demo\vision\src\views\screenPage.vue
-->
<template>
  <div class="com-page bg-color1 flex-css">
    <div class="com-header po-re">
      <div class="com-header-left"></div>
      <div class="com-header-center po-ab">
        电商平台实时监控系统
        <div class="border-left po-ab"></div>
        <div class="border-bottom po-ab"></div>
        <div class="border-right po-ab"></div>
      </div>
      <div class="com-header-right"></div>
    </div>
    <div class="page-content-wrap">
      <div class="page-content-left"></div>
      <div class="page-content-middle"></div>
      <div class="page-content-right"></div>
    </div>
  </div>
</template>

<script>
import hot from "@/components/hot";
import map from "@/components/map";
import rank from "@/components/rank";
import seller from "@/components/seller";
import stock from "@/components/stock";
import trend from "@/components/trend";
export default {
  components: {
    /*  hot,
    map,
    rank,
    seller,
    stock,
    trend */
  },
  data() {
    return {};
  },
  methods: {}
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
.com-header-center {
  width: 30%;
  height: 4vh;
  top: 20px;
  left: 50%;
  padding-bottom: 5px;
  font-size: 20px;
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

.content-wrap {
  flex: 1;
}
.page-content-left,
.page-content-middle,
.page-content-right {
  width: 30vw;
  height: 100%;
  color: #fff;
}
</style>
