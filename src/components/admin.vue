<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入用户名" v-model="searchQuery" clearable @clear="clearSearch()">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" plain @click="goAdd" class="add">添加管理员</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="filteredUserlist" border stripe>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column align="center" label="管理员id" prop="admin_id"></el-table-column>
        <el-table-column align="center" label="管理员昵称" prop="admin_user"></el-table-column>
        <el-table-column align="center" label="管理员密码" prop="admin_password"></el-table-column>
        <el-table-column align="center" label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="delete_p(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加管理员对话框 -->
      <el-dialog title="添加管理员" :visible.sync="addDialogVisible">
        <el-form :model="addForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="addForm.user"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="addForm.paw" show-password></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addAdmin">确定</el-button>
        </div>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%">
        <el-form :model="editUser" label-width="80px">
          <el-form-item label="管理员id">
            <el-input v-model="editUser.admin_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="管理员昵称" label-width="100px">
            <el-input v-model="editUser.admin_user"></el-input>
          </el-form-item>
          <el-form-item label="用户密码">
            <el-input v-model="editUser.admin_password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      searchQuery: ' ', // 搜索关键词
      userlist: [], // 原始用户列表数据
      filteredUserlist: [], // 过滤后的用户列表数据
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        user: '',
        paw: ''
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      editUser: {},
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false
    }
  },
  methods: {
    filterUserlist() {
      // 根据搜索关键词过滤用户列表数据
      if (this.searchQuery.trim() == '') {
        // 如果搜索关键词为空，则显示所有数据
        this.filteredUserlist = this.userlist
      } else {
        // 如果搜索关键词不为空，则根据关键词过滤数据
        this.filteredUserlist = this.userlist.filter((user) => {
          return user.admin_user.includes(this.searchQuery)
        })
      }
    },
    clearSearch() {
      // 清空搜索关键词时，重置过滤后的用户列表为原始列表数据
      this.filteredUserlist = this.userlist
    },
    goAdd() {
      this.addDialogVisible = true // 显示添加管理员对话框
    },
    async addAdmin() {
      const { data: res } = await this.$http.post('http://127.0.0.1:8088/add_admin', {
        admin_user: this.addForm.user,
        admin_password: this.addForm.paw
      })
      if (res == '1') {
        alert('添加管理员成功')
        this.getUserList() // 重新获取用户列表
        this.$router.go(0)
      } else {
        alert('添加管理员失败')
      }
      this.addDialogVisible = false // 关闭添加管理员对话框
      // 清空表单数据
      this.addForm.user = ''
      this.addForm.paw = ''
    },
    delete_p(id) {
      const app = this
      this.$http.post('http://127.0.0.1:8088/delete_admin', { admin_id: id.admin_id }).then(function (res) {
        if (res.data == '1') alert(id.admin_user + '删除成功')
        else alert(id.admin_user + '删除失败')
        app.$router.go(0)
      })
    },
    async getUserList() {
      try {
        const response = await this.$http.get('http://127.0.0.1:8088/admin')
        this.userlist = response.data
        this.filteredUserlist = response.data
      } catch (error) {
        console.error('Failed to fetch user list:', error)
      }
    },
    showEditDialog(row) {
      // 修改代码开始
      this.editDialogVisible = true
      this.editUser = Object.assign({}, row) // 使用Object.assign()创建一个独立的对象，以避免直接修改原始数据
      // 修改代码结束
    },
    confirmEdit() {
      const app = this
      this.$http
        .post('http://127.0.0.1:8088/update_admin', {
          admin_id: this.editUser.admin_id,
          admin_user: this.editUser.admin_user,
          admin_password: this.editUser.admin_password
        })
        .then(function (res) {
          if (res.data == '1') alert('修改成功')
          else alert('修改失败')
          app.editDialogVisible = false // 关闭修改对话框
          app.getUserList() // 重新获取用户列表
          app.$router.go(0)
        })
    }
  },
  mounted() {
    this.getUserList()
    const app = this
    this.$http.get('http://127.0.0.1:8088/admin').then(function (res) {
      app.userlist = res.data
      console.log(res.data)
    })
  },
  watch: {
    searchQuery: {
      handler(newVal) {
        // 监听搜索关键词变化，动态更新过滤后的用户列表数据
        this.filterUserlist()
      },
      immediate: true // 立即执行一次搜索过滤
    }
  }
}
</script>
  
  <style lang="less" scoped>
.addUser {
  position: absolute;
  right: 50px;
}
.add {
  position: absolute;
  right: 50px;
}
</style>
  