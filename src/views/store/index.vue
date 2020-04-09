<template>
  <div class="store-container">

    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="store-app-logo">
            <svg-icon icon-class="example" style="width: 96px;height: 96px;margin: 15px;"/>
          </div>
          <div class="store-app-desc">
            <p class="store-app-desc-p">Postgresql 9.6</p>
            <p class="store-app-desc-p" style="color: #5a5a5a">最流行的关系型数据库</p>
            <p>
              <el-button round @click="dialogVisible = true">获取</el-button>
              <el-button type="warning" icon="el-icon-star-off" circle></el-button>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleClose(done) {
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
  .store {
    &-container {
      margin: 30px;
    }
    &-app {
      width: 350px;
      height: 120px;
      float: left;
      margin-top: 15px;

      &-logo {
        width: 120px;
        height: 120px;
        float: left;
      }

      &-desc {
        height: 120px;
        margin-left: 20px;
        float: left;
        &-p {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          /*margin: 10px;*/
        }
      }
    }
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 120px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>

