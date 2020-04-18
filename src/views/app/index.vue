<template>
  <div class="store-container">

    <el-row :gutter="20">
      <el-col :span="24">
        <el-divider content-position="left">常用工具</el-divider>
      </el-col>
      <el-col v-for="app in list" :key="app.id" :span="6">
        <div class="grid-content bg-purple">
          <div class="store-app-logo">
            <img src="/app/kafka.png" style="width: 96px;height: 96px;margin: 5px; border-radius: 10px;" />
          </div>
          <div class="store-app-desc">
            <p class="store-app-desc-p">{{ app.name }}</p>
            <p class="store-app-desc-p" style="color: #5a5a5a">{{ app.description | ellipsis }}</p>
            <p>
              <el-button type="primary" size="small" :disabled="app.isCollect" @click="showDialog($event, app.id)">收藏</el-button>
              <el-button icon="el-icon-star-off" size="small" plain>{{ app.stars }}</el-button>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-divider content-position="left">数据库</el-divider>
      </el-col>
      <el-col v-for="app in list" :key="app.id" :span="6">
        <div class="grid-content bg-purple">
          <div class="store-app-logo">
            <svg-icon icon-class="example" style="width: 96px;height: 96px;margin: 5px;" />
          </div>
          <div class="store-app-desc">
            <p class="store-app-desc-p">{{ app.name }}</p>
            <p class="store-app-desc-p" style="color: #5a5a5a">{{ app.description | ellipsis }}</p>
            <p>
              <el-button type="primary" size="small" :disabled="app.isCollect" @click="showDialog($event, app.id)">收藏</el-button>
              <el-button icon="el-icon-star-off" size="small" plain>{{ app.stars }}</el-button>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>确定将{{ curApp.name }}加入到收藏夹吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/app'

export default {
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 8) {
        return value.slice(0, 8) + '...'
      }
      return value
    }
  },
  data() {
    return {
      dialogVisible: false,
      list: null,
      listLoading: true,
      curApp: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    findData(id) {
      for (let i = 0; i < this.list.length; ++i) {
        if (this.list[i].id === id) {
          return this.list[i]
        }
      }
      return null
    },

    handleClose(done) {
      done()
    },
    showDialog(event, id) {
      this.dialogVisible = true
      this.curApp = this.findData(id)
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
      width: auto;
      height: 110px;
      float: left;
      margin-top: 15px;

      &-logo {
        width: 110px;
        height: 110px;
        float: left;
      }

      &-desc {
        height: 110px;
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
    margin-bottom: 15px;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 110px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>

