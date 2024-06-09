<template>
  <div>
    <el-form ref="data" :model="obj" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="obj.title"></el-input>
      </el-form-item>
      <el-form-item label="商品介绍">
        <el-input v-model="obj.description"></el-input>
      </el-form-item>
      <el-form-item label="商品金额">
        <el-input v-model="obj.price"></el-input>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload action="http://127.0.0.1:8088/add_list" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="uploadSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="obj.imageVisible">
          <img width="100%" :src="obj.image" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 将发布时间写死为今日 -->
      <el-form-item label="发布时间" required>
        <el-input v-model="obj.created_at" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="btn(obj)">确认添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        title: '',
        description: '',
        image: '', 
        imageVisible: false,
        price: '',
        created_at: new Date().toISOString().slice(0, 10) // 将发布时间写死为今日
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
    handlePictureCardPreview(file) {
      this.obj.image = file.url;
      this.obj.imageVisible = true;
    },
    uploadSuccess(response, file) {
      let that=this
      let image
      // 处理图片上传成功后的逻辑
      image=file.url+file.name
      that.obj.image = image; // 更新图片路径为上传成功后的路径
    },
    btn(obj) {
      // 点击确认添加按钮的逻辑，提交表单数据到服务器
      // 注意：这里只是示例，实际情况需要根据后端接口进行调整
      this.$http
        .post('http://127.0.0.1:8088/add_list', obj)
        .then((res) => {
          if (res.data == '1') {
            alert('商品信息添加成功')
            this.$router.go(-1) // 刷新页面
          } else {
            alert('商品信息添加失败')
          }
        })
        .catch((err) => {
          console.error(err)
          alert('出现错误，商品信息添加失败')
        })
    }
  }
}
</script>

<style>
.avatar-uploader {
  width: 200px;
  height: 178px;
  border: 1px dashed gray;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 178px;
  display: block;
}
</style>
