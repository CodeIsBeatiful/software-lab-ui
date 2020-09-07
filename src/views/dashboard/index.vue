<template>
  <div class="dashboard-container">

    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-os">
            <svg-icon icon-class="os" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              OS
            </div>
            <p class="card-panel-num">macos 15.06</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-os">
            <svg-icon icon-class="os" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              App Total
            </div>
            <count-to :start-val="0" :end-val="2367" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-software">
            <svg-icon icon-class="software" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
               Instance Total
            </div>
            <count-to :start-val="0" :end-val="15" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-software">
            <svg-icon icon-class="software" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Running Instance
            </div>
            <count-to :start-val="0" :end-val="5" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from '@/views/dashboard/components/LineChart'
import CountTo from 'vue-count-to'

const lineChartData = {
  newVisitis: {
    expectedData: [['2012-03-01 05:06:00', 100], ['2012-03-01 05:06:05', 120], ['2012-03-01 05:06:10', 161], ['2012-03-01 05:06:15', 134]],
    actualData: [['2012-03-01 05:06:00', 140], ['2012-03-01 05:06:05', 130], ['2012-03-01 05:06:10', 111], ['2012-03-01 05:06:15', 198]]
  }
}

export default {
  name: 'Dashboard',
  components: { LineChart, CountTo },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
/*.dashboard {*/
/*  &-container {*/
/*    margin: 30px;*/
/*  }*/
/*  &-text {*/
/*    font-size: 30px;*/
/*    line-height: 46px;*/
/*  }*/
/*}*/
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-os {
        background: #40c9c6;
      }

      .icon-software {
        background: #36a3f7;
      }
    }

    .icon-os {
      color: #40c9c6;
    }

    .icon-software {
      color: #36a3f7;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
