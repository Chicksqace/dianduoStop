<template>
  <div class="list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="userlist" border stripe>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column
          align="center"
          label="用户昵称"
          prop="nickname"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机号"
          prop="phone"
        ></el-table-column>
        <el-table-column
          align="center"
          label="评语"
          prop="comment"
        ></el-table-column>
        <el-table-column align="center" label="评分">
          <template slot-scope="scope">
            <el-rate
                v-model="scope.row.score"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
            </el-rate>
          </template>
        </el-table-column>
         <el-table-column
          align="center"
          label="评论时间"
          prop="created_at"
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
              @click="removeUserNickName(scope.row.phone)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
	  <el-dialog :visible.sync="editDialogVisible">
	    <el-form :model="editForm" label-width="80px">
	      <el-form-item label="评分">
	        <el-rate v-model="editForm.score" show-score text-color="#ff9900" score-template="{value}" />
	      </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="editDialogVisible = false">取消</el-button>
	      <el-button type="primary" @click="updateScore(editForm)">保存</el-button>
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
	  removeUserNickName(phone){
		const app = this
		this.$http.post('http://127.0.0.1:8088/delete_user', { phone: phone }).then(function (res) {
		  if (res.data == '1') alert(phone + '删除成功')
		  else alert(phone + '删除失败')
		  app.$router.go(0)
		})
	},
	  async updateScore(row) {
		  const app = this
		  console.log(row)
	    const { data: res } = await this.$http.post('http://127.0.0.1:8088/updateScore', { id: row.id, score: row.score })
	    if (res.success) {
	      alert('更新失败')
	      this.editDialogVisible = false
	    } else {
			alert('更新成功')
			app.$router.go(0)
	      
	    }
	  },
	  showEditDialog(row) {
	    this.editForm = Object.assign({}, row)
	    this.editDialogVisible = true
	  }
  },
  async getUserList() {
      const { data: res } = await this.$http.get('getUser');
    this.userlist = res.list
    console.log('ssss'+res.list)
  },
  mounted(){
    const app = this
    this.$http.get('http://127.0.0.1:8088/pinglun').then(function (res) {
      app.userlist = res.data
  	  console.log(res.data)
    })
  }
}

</script>
<style lang="less" scoped>
.img {
  width: 120px;
  height: 80px;
}
.name_img{
    width: 30rpx;
    height: 30rpx;
    border-radius: 10000px;
}
</style>