<template>
  <div class="store-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm" >
          <el-form-item label="类型">
            <el-select v-model="searchForm.type" placeholder="类型" size="small">
              <el-option
                v-for="item in appTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="searchForm.keyword" placeholder="关键字" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-for="app in list" :key="app.id" :span="6">
        <div class="grid-content bg-purple-light">
          <div class="store-app-logo">
            <img :src="app.logo" style="width: 96px;height: 96px;margin: 5px; border-radius: 10px;" />
          </div>
          <div class="store-app-desc">
            <p class="store-app-desc-p">{{ app.name }}<el-tag type="success" size="small" class="store-app-tag">{{ app.type }}</el-tag></p>
            <p class="store-app-desc-p" style="color: #5a5a5a;font-size: 0.8em;">{{ app.description | ellipsis }}</p>
            <p>
              <el-button type="primary" size="small" @click="showNewInstanceDialog($event, app.id)">运行</el-button>
              <el-button size="small" plain @click="showDialog($event, app.id)">移除</el-button>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>确定将{{ curApp.name }}从收藏夹中移除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-drawer title="新建实例" :before-close="handleClose" :visible.sync="newInstanceDialogVisible" direction="rtl" custom-class="demo-drawer" ref="drawer" size="50%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="form.ports"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <markdown-editor v-model="form.description" :options="{hideModeSwitch:true}" height="200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="newInstanceDialogVisible = false">确定</el-button>
          <el-button @click="newInstanceDialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { getList } from '@/api/app'
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  name: 'Fav',
  components: { MarkdownEditor },
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 12) {
        return value.slice(0, 12) + '...'
      }
      return value
    }
  },
  data() {
    return {
      newInstanceDialogVisible: false,
      dialogVisible: false,
      list: null,
      listLoading: true,
      curApp: {},
      form: {
        description: `Use markdown syntax to fill in the description`
      },
      searchForm: {
        type: '',
        keyword: ''
      },
      appTypes: [{
        label: 'all',
        value: ''
      }, {
        label: 'iot',
        value: 'iot'
      }]
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
    onSearch() {
      console.info('haha')
    },
    handleClose(done) {
      done()
    },
    showDialog(event, id) {
      this.dialogVisible = true
      this.curApp = this.findData(id)
    },
    showNewInstanceDialog(event, id) {
      this.newInstanceDialogVisible = true
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
      &-tag {
        margin-left: 5px;
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

