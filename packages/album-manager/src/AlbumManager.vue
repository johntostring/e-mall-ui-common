<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span style="line-height: 36px;">相册</span>
      <el-button style="float: right;" type="primary">操作按钮</el-button>
    </div>
    <el-row>
      <el-col :span="24">
        当前位置：{{currentLocation}}
        <p>
          <el-button style="float: right;" type="primary" @click="backTo(currentDir.location)">返回</el-button>
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-tree class="directory-list-box"
          :data="directoryList"
          node-key="id"
          ref="dirTree"
          highlight-current
          @node-click="clickDirectory"
          :props="{ children: 'children', label: 'name' }">
        </el-tree>
      </el-col>
      <el-col :span="18">
        <el-table class="file-list-box"
                  :data="displayList"
                  highlight-current-row
                  @current-change="handleCurrentRowChange"
                  @row-dblclick="dblClickDirectory"
                  style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="size"
            label="大小">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="日期"
            width="180">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import _ from 'lodash'

const SEPARATOR = '/'

export default {
  name: 'AlbumManager',
  data () {
    return {
      currentDir: {location: SEPARATOR},
      displayList: []
    }
  },
  created () {
    this.getDirectoryList({location: SEPARATOR}).then(res => {
      this.displayList = res.body
    })
  },
  computed: {
    ...mapGetters([
      'directoryList'
    ]),
    currentLocation () {
      let endsWithSeparator = this.currentDir.location && this.currentDir.location.endsWith(SEPARATOR)
      return this.currentDir.location + (endsWithSeparator ? '' : SEPARATOR) + (this.currentDir.name || '')
    }
  },
  methods: {
    ...mapActions([
      'getDirectoryList',
      'findDirectoryByLocation'
    ]),
    clickDirectory (dir, node, tree) {
      this.currentDir = dir
      if (dir.children !== null) {
        this.displayList = dir.children
      } else {
        this.displayList = []
      }
    },
    dblClickDirectory (row, event) {
      this.currentDir = row
      if (row.children !== null) {
        this.displayList = row.children
      } else {
        this.displayList = []
      }
      this.treeByLocation(this.currentLocation, true)
    },
    treeByLocation (location, expanded) {
      let array = location.split(SEPARATOR)
      let node = this.$refs.dirTree.root
      array.forEach(name => {
        if (name !== '') {
          node = _.find(node.childNodes, {label: name})
          node.expanded = true
          node.store.currentNode = node
        }
      })
      if (!expanded && node) {
        node.expanded = false
      }
    },
    backTo (location) {
      if (location === SEPARATOR) {
        this.currentDir = {location: SEPARATOR}
        this.displayList = []
        return
      }
      this.treeByLocation(location, false)
      this.findDirectoryByLocation(location).then(res => {
        this.currentDir = res
        this.displayList = res.children
      })
    },
    handleCurrentRowChange (row) {
      console.log('active:', row)
      this.currentRow = row
    }
  }
}
</script>

<style scoped>
.file-list-box {
  border-radius: 0;
  box-shadow: none;
  height: 200px;
}
.directory-list-box {
  height: 200px;
  overflow: scroll;
}
</style>
<style>
  .file-list-box tr.el-table__row {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
