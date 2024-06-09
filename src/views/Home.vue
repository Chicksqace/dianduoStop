<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/gagalogo-2-x.png" alt="" />
        <span>点多商店管理系统</span>
      </div>
      <div class="btn">
        <el-button style="margin-right:12px;" type="success" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="green" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->

          <el-submenu index="1">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <img src="../assets/用户.png" class="tubiao"/>
              <!-- 文本 -->
              <span>用户管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/users"  @click="saveNavState('/users')">
              <template slot="title">
                <!-- 图标 -->
                <img src="../assets/设备管理.png" class="tubiao"/>
                <!-- 文本 -->
                <span>账号管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/admin"  @click="saveNavState('/admin')">
              <template slot="title">
                <!-- 图标 -->
                <img src="../assets/设备管理.png" class="tubiao"/>
                <!-- 文本 -->
                <span>管理员管理</span>
              </template>
            </el-menu-item>
          </el-submenu>

         <el-submenu index="2">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <img src="../assets/商品管理-线性 (1).png" class="tubiao1"/>
              <!-- 文本 -->
              <span>商品管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/list"  @click="saveNavState('/list')">
              <template slot="title">
                <!-- 图标 -->
                <img src="../assets/设备管理.png" class="tubiao"/>
                <!-- 文本 -->
                <span>商品列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <img src="../assets/订单.png" class="tubiao"/>
              <!-- 文本 -->
              <span>订单管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/order"  @click="saveNavState('/order')">
              <template slot="title">
                <!-- 图标 -->
                <img src="../assets/设备管理.png" class="tubiao"/>
                <!-- 文本 -->
                <span>订单列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <img src="../assets/评论.png" class="tubiao"/>
              <!-- 文本 -->
              <span>评论管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/pinglun"  @click="saveNavState('/pinglun')">
              <template slot="title">
                <!-- 图标 -->
                <img src="../assets/设备管理.png" class="tubiao"/>
                <!-- 文本 -->
                <span>评论列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

           <el-submenu index="5">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <img src="../assets/数据看板.png" class="tubiao"/>
              <!-- 文本 -->
              <span>数据分析</span>
            </template>
            <!-- 二级菜单 -->
            <!-- <el-menu-item index="/fenxi"  @click="saveNavState('/fenxi')"> -->
            <el-menu-item index="/fenxi"  @click="saveNavState('/fenxi')">
              <template slot="title">
                <!-- 图标 -->
                <img src="../assets/设备管理.png" class="tubiao"/>
                <!-- 文本 -->
                <span>分析列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
    }
  },
  methods: {
    logout() {
      // window.sessionStorage.clear()
      this.$router.push('/login')
    },

    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>

<style lang="less" scoped>
.tubiao{
  height: 17px;
  width: 17px;
  margin-right: 16px;
  margin-left: 10px;
}
.tubiao1{
  height: 23px;
  width: 23px;
  margin-right: 16px;
  margin-left: 5px;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: green;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  // padding: 15px 0;
  height: 80px !important;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    margin: 15px 0px 15px 15px;
  }
}

.el-aside {
  background-color:green;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color:green;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
