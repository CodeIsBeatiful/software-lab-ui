<template>
  <div class="store-container">

    <el-row :gutter="20">
      <el-col :span="24">
        <el-divider content-position="left">ALL</el-divider>
      </el-col>
      <el-col v-for="app in list" :key="app.name" :span="6">
        <div class="grid-content bg-purple-light">
          <div class="store-app-logo">
            <img :src="'/api/files/logo/'+app.name" style="width: 96px;height: 96px;margin: 5px; border-radius: 10px;">
          </div>
          <div class="store-app-desc">
            <p class="store-app-desc-p">{{ app.name }}</p>
            <p class="store-app-desc-p" style="color: #5a5a5a;font-size: 0.8em;">{{ app.description | ellipsis }}</p>
            <p>
              <el-button icon="el-icon-info" type="primary" size="small" :disabled="app.isCollect" @click="showDialog($event, app.name)">detail</el-button>
                <el-dropdown size="small" trigger="click" split-button @visible-change="handleDownloadDropdownChange($event,app.name)" @command="requestDownload(app.name,$event)">
                  Download
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item disabled>Choose Version</el-dropdown-item>
                  <template v-for="version in appVersions">
                    <el-dropdown-item :command="version.version" :disabled="version.downloadStatus === 2" :key="version.version" :icon=" version.downloadStatus | downloadIconFilter">
                      {{version.version}}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
<!--    <el-row :gutter="20">-->
<!--      <el-col :span="24">-->
<!--        <el-divider content-position="left">DataBase</el-divider>-->
<!--      </el-col>-->
<!--      <el-col v-for="app in list" :key="app.id" :span="6">-->
<!--        <div class="grid-content bg-purple-light">-->
<!--          <div class="store-app-logo">-->
<!--            <svg-icon icon-class="example" style="width: 96px;height: 96px;margin: 5px;" />-->
<!--          </div>-->
<!--          <div class="store-app-desc">-->
<!--            <p class="store-app-desc-p">{{ app.name }}</p>-->
<!--            <p class="store-app-desc-p" style="color: #5a5a5a;font-size: 0.8em;">{{ app.description | ellipsis }}</p>-->
<!--            <p>-->
<!--              <el-button type="primary" size="small" :disabled="app.isCollect" @click="showDialog($event, app.id)">收藏</el-button>-->
<!--              <el-button icon="el-icon-star-off" size="small" plain>{{ app.stars }}</el-button>-->
<!--            </p>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <el-dialog title="Tips" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <h4>{{ curApp.name }}</h4>
      <span>{{curApp.description }}</span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, getVersionsByAppName } from '@/api/app'
import { getToken } from '@/utils/auth'
import { getAddress } from '@/utils'

export default {
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 30) {
        return value.slice(0, 30) + '...'
      }
      return value
    },
    downloadIconFilter(downloadStatus) {
      if (downloadStatus === 2) {
        return 'el-icon-check'
      } else if (downloadStatus === 1) {
        return 'el-icon-loading'
      } else if (downloadStatus === 0) {
        return 'el-icon-download'
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      list: null,
      listLoading: true,
      curApp: {},
      appVersions: [],
      socket: null,
      token: getToken()
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.socket = new WebSocket('ws://' + getAddress() + `/api/ws/message?token=${this.token}`)
    var that = this
    this.socket.addEventListener('message', function(event) {
      that.$notify({
        title: 'Success',
        message: event.data,
        type: 'success',
        duration: 2000
      })
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList({
        'pageNum': 0,
        'pageSize': 10
      }).then(response => {
        this.list = response.data.records
        this.listLoading = false
      })
    },
    findData(name) {
      for (let i = 0; i < this.list.length; ++i) {
        if (this.list[i].name === name) {
          return this.list[i]
        }
      }
      return null
    },
    handleClose(done) {
      done()
    },
    showDialog(event, name) {
      this.dialogVisible = true
      this.curApp = this.findData(name)
    },
    handleDownloadDropdownChange(flag, name) {
      if (flag) {
        getVersionsByAppName(name).then(response => {
          this.appVersions = response.data
        })
      } else {
        this.appVersions = []
      }
    },
    requestDownload(app, version) {
      // todo
      this.socket.send(JSON.stringify({
        type: 'image',
        operate: 'download',
        content: app + ':' + version
      }))
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
    /*border-radius: 4px;*/
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
    margin-bottom: 15px;
  }
  .bg-purple-light {
    /*background: #e5e9f2;*/
    margin-bottom: 15px;
    border-bottom: #99a9bf   1px dashed;
  }
  .grid-content {
    /*border-radius: 4px;*/
    min-height: 110px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>

