<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.imageType" placeholder="IMAGE TYPE" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-autocomplete v-model="listQuery.image" class="filter-item" style="width: 200px" :fetch-suggestions="imageQuerySearch" placeholder="IMAGE NAME" @select="handleImageSelect" />
      <el-input v-model="listQuery.title" placeholder="KEYWORD" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        QUERY
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        ADD
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        EXPORT
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        ADVANCED
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="NAME" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleSelect(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IMAGE NAME" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.image }}</span>
          <el-tag>{{ row.imageType | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-button :type="row.status | statusTypeFilter" :icon="row.status | statusFilter" size="mini" circle />
        </template>
      </el-table-column>
      <el-table-column label="Create Time" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation Time" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.operationTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleSelect(row)">
            Detail
          </el-button>
          <el-button v-if="row.status=='stop'" size="mini" type="success" @click="handleModifyStatus(row,'start')">
            Start
          </el-button>
          <el-button v-if="row.status=='start'" size="mini" type="warning" @click="handleModifyStatus(row,'stop')">
            Stop
          </el-button>
          <el-button v-if="row.status=='stop'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Remove
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="CLI" width="110px" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.status=='start'" size="mini" circle>
            <svg-icon icon-class="command" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Image Type" prop="image type">
          <el-select v-model="temp.imageType" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Image" prop="image">
          <el-autocomplete v-model="temp.image" class="filter-item" placeholder="Please select" :fetch-suggestions="imageQuerySearch" @select="handleImageSelect" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Additional Info" prop="additionalInfo">
          <el-input v-model="temp.additionalInfo" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='select'" label="Create Time" prop="timestamp">
          <el-date-picker v-model="temp.createTime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='select'" label="Operation Time" prop="timestamp">
          <el-date-picker v-model="temp.operationTime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus==='create'" @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createInstance } from '@/api/instance'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'All', display_name: '' },
  { key: 'Util', display_name: 'Util' },
  { key: 'DataBase', display_name: 'DataBase' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        start: 'el-icon-check',
        stop: 'el-icon-close'
      }
      return statusMap[status]
    },
    statusTypeFilter(status) {
      const statusMap = {
        start: 'success',
        stop: 'warning'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      images: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        image: undefined,
        imageType: undefined,
        title: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['start', 'stop'],
      showReviewer: false,
      temp: {
        id: undefined,
        imageType: undefined,
        image: undefined,
        title: '',
        createTime: new Date(),
        operationTIme: new Date(),
        additionalInfo: '',
        status: 'stop'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        select: 'Detail',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getImageList()
  },
  mounted() {
    // do nothing
  },
  methods: {
    imageQuerySearch(queryString, cb) {
      const images = this.images
      const results = queryString ? images.filter(this.createImageFilter(queryString)) : images
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createImageFilter(queryString) {
      return (image) => {
        return (image.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    getImageList() {
      this.images = [{ 'value': 'PG:9.6' },
        { 'value': 'Kafka:2.11_2.2.0' }]
    },
    handleImageSelect(item) {
      // todo something
      console.log(item)
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        createTime: new Date(),
        operationTime: new Date(),
        title: '',
        status: 'stop',
        imageType: '',
        imageName: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createInstance(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleSelect(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'select'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
