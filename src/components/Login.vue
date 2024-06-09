<template>
	<div id="fullpage">
	  <div id="ap">
		<div id="login">
			<h1>欢迎登录点多商店管理平台</h1>
			<p>账号：<input type="text" placeholder="请输入账号" v-model="user.admin_user"/></p>
			<p>密码：<input type="password" placeholder="请输入密码" v-model="user.admin_password"/></p>
			<p><button class="button" v-on:click="user_login">登录</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class="button" v-on:click="user.admin_user='',user.admin_password=''">取消</button></p>
		</div>
	  </div>
	</div>
</template>

<script>
	export default{
		name:'login',
		data:function()
		{
			return{
				user:{
					admin_user:'',
					admin_password:''
				}
			}
		},
		methods:{
			user_login(){
					const app=this;
					this.$http.post('http://127.0.0.1:8088/login',this.user).then(function(res){
						if(res.data=='0')//刚才查询失败，或者没查到
						{
							console.log('11111111111')
							alert('登录失败');
							app.$router.go(0);
						}
						else
						{
							alert('登陆成功');
							app.$router.push({path:'/home',query:{
								name:app.user.admin_user
							}});
							
						}
					})
			}
		}
	}
</script>

<style>
	#fullpage {
	  background-image: url(../assets/bg.png);
	  background-repeat: no-repeat;
	  background-size: cover;
	   position: absolute;
	    top: 0;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    width: 100%;
	    height: 100%;
	}
	
	#ap {
	  max-width: 400px;
	  margin: auto;
	  margin-top: 150px;
	  background-color: rgba(255, 255, 255, 0.9);
	  padding: 40px;
	  border-radius: 10px;
	  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
	}
	
	
	h2 {
	  text-align: center;
	  font-size: 32px;
	  margin-bottom: 30px;
	}
	
	input[type="text"],
	input[type="password"] {
	  padding: 10px;
	  font-size: 16px;
	  border-radius: 5px;
	  border: none;
	  margin-bottom: 20px;
	  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
	}
	
	button {
	  padding: 10px 20px;
	  font-size: 16px;
	  color: white;
	  background-color: #4CAF50;
	  border-radius: 5px;
	  border: none;
	  cursor: pointer;
	  transition: background-color 0.3s ease;
	}
	
	button:hover {
	  background-color: #3e8e41;
	}
	
	.button {
	  display: inline-block;
	  background-color: #4CAF50;
	  color: white;
	  padding: 10px 20px;
	  font-size: 16px;
	  text-align: center;
	  border-radius: 5px;
	  transition: background-color 0.3s ease;
	}
	
	.button:hover {
	  background-color: #3e8e41;
	}
	#login{
		margin: auto;
		text-align: center;
	}

</style>
