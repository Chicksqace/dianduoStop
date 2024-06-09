<template>
  <div class="list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchQuery" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column align="center" label="下单用户" prop="user"></el-table-column>
        <el-table-column align="center" label="商品图片">
          <template slot-scope="scope">
            <img v-if="scope.row.image" class="img" :src="scope.row.image" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="标题" prop="title"></el-table-column>

        <el-table-column align="center" label="介绍" prop="description"></el-table-column>

        <el-table-column align="center" label="购买数量">
          <template slot-scope="scope">
            <span>x{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品单价" prop="price"></el-table-column>
        <el-table-column align="center" label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="removeUserById(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog :visible.sync="editDialogVisible" title="编辑订单">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="下单用户">
          <el-input v-model="editForm.user"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-input v-model="editForm.image"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="购买数量">
          <el-input v-model="editForm.quantity" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品单价">
          <el-input v-model="editForm.price" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEditForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userlist: [],
      searchQuery: "", // 搜索
      editDialogVisible: false, // 控制编辑对话框的显示与隐藏
      editForm: {}, // 编辑表单的数据
    };
  },

  methods: {
    removeUserById(id) {
      console.log('title', id);
      const app = this;
      this.$http.post('http://127.0.0.1:8088/delete_orders', { id: id.id }).then(function (res) {
        if (res.data == '1') alert(id.title + '删除成功');
        else alert(id.title + '删除失败');
        app.$router.go(0);
      });
    },
    showEditDialog(row) {
      this.editForm = { ...row }; // 复制行数据到编辑表单
      this.editDialogVisible = true; // 显示编辑对话框
    },
    saveEditForm() {
      const app = this;
      this.$http.post('http://127.0.0.1:8088/update_orders', this.editForm).then(function (res) {
        if (res.data == '1') {
          alert('订单更新成功');
          app.editDialogVisible = false; // 关闭编辑对话框
          app.$router.go(0); // 刷新页面
        } else {
          alert('订单更新失败');
        }
      });
    }
  },
  mounted() {
    const app = this;
    this.$http.get('http://127.0.0.1:8088/orders').then(function (res) {
      app.userlist = res.data;
      console.log(res.data);
    });
  }
};
</script>

<style scoped>
.img {
  width: 80px;
  height: 120px;
}
</style>
