<template>
  <div class="list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="searchQuery"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button  type="danger" plain @click="goAdd" class="add">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column align="center" label="商品图片">
          <template slot-scope="scope">
            <img v-if="scope.row.image" class="img" :src="scope.row.image" alt=""/>
            <!-- <span v-else>{{ scope.row.key }}</span> -->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="标题"
          prop="title"
        ></el-table-column>
        <el-table-column
          align="center"
          label="介绍"
          prop="description"
        ></el-table-column>
         <el-table-column
          align="center"
          label="价格"
          prop="price"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary" plain
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger" plain
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
	  <el-dialog title="修改商品信息" :visible.sync="editDialogVisible">
	    <el-form :model="editForm" label-position="top">
			<el-form-item label="图片地址">
			  <el-input v-model="editForm.image"></el-input>
			</el-form-item>
	      <el-form-item label="标题">
	        <el-input v-model="editForm.title"></el-input>
	      </el-form-item>
	      <el-form-item label="介绍">
	        <el-input v-model="editForm.description"></el-input>
	      </el-form-item>
	      <el-form-item label="价格">
	        <el-input v-model="editForm.price"></el-input>
	      </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="editDialogVisible = false">取 消</el-button>
	      <el-button type="primary" @click="updateUserById(editForm)">确 定</el-button>
	    </div>
	  </el-dialog>

    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userlist: [],
      searchQuery: "", // 搜索
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      editForm: [],
    };
  },
  created() {
    // this.getUserList();
  },
  methods: {
	  goAdd(){
	     this.$router.push({path: '/add'})
	  },
	removeUserById(id){
			const app = this
			this.$http.post('http://127.0.0.1:8088/delete_list', { id:id }).then(function (res) {
        console.log(res);
			  if (res.data == '1') alert( '商品删除成功')
			  else alert( '商品删除失败')
			  app.$router.go(0)
			})
		}, 
    updateUserById(row) {
  // 提取图片路径并进行处理
  let { image } = row;
  // 创建 URL 对象以解析图片路径
  const url = new URL(image);
  // 获取域名和路径部分
  const domain = url.origin;
  const imagePath = url.pathname;
  console.log(domain, 'domain');
  console.log(imagePath, 'imagePath');

  // 创建要发送给后端的数据对象
  const data = {
    ...row,
    image: domain + imagePath // 合并域名和路径部分
  };

  const app = this;
  this.$http.post('http://127.0.0.1:8088/update_relist', data)
    .then(function(res) {
      if (res.data == '1') {
        alert('商品信息更新成功');
        app.editDialogVisible = false; // 关闭修改商品信息对话框
        app.$router.go(0); // 刷新页面
      } else {
        alert('商品信息更新失败');
      }
    })
    .catch(function(error) {
      console.error('Error updating product:', error);
      alert('商品信息更新失败');
    });
},

 
  showEditDialog(row) {
    this.editDialogVisible = true;
    this.editForm = Object.assign({}, row);
  }
  },
  mounted(){
    const app = this
    this.$http.get('http://127.0.0.1:8088/list').then(function (res) {
      app.userlist = res.data
  	  console.log(res.data)
    })
  }
};
</script>
<style lang="less" scoped>
.img {
  width: 80px;
  height: 120px;
}
.add{
  position: absolute;
  right: 50px;
}
</style>