var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
var app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));


//连接数据库
const db = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"admin123",
	database:"mydb"
});
db.connect(function(err){
	if(err)
		console.log("数据库连接失败！");
	else
		console.log("数据库连接成功！");
});

// Multer配置
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads/') // 上传的文件存储在 uploads/ 目录中
	},
	filename: function (req, file, cb) {
	  cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // 在上传的文件名中添加时间戳
	}
  })
  const uploadImg = multer({ storage: storage });

// 处理图片上传请求
app.post('/uploadImg', uploadImg.single('image'), function (req, res, next) {
	// 如果文件上传成功，Multer会将文件信息添加到请求对象中(req.file)
	// 返回上传文件的路径
	res.json({ url: req.file.path });
  });
  
  

//用户登录
app.post('/login',function(req,res){
	
	var admin_user = req.body.admin_user;
	var admin_password = req.body.admin_password;
	var sql = "select * from administrator where admin_user ='" + admin_user +"' and admin_password='"+ admin_password +"'";
	db.query(sql,function(err,results){
		if(err)
		{
			res.send("0");
		}
		else
		{
			if(results.length>0)
				res.send("1");
			else
				res.send("0");	
		}
	});
});
//添加用户
app.post('/add_user', function(req, res) {
	var user_user = req.body.user_user;
	var user_phone = req.body.user_phone;
	// 在此处编写将管理员用户名和密码插入数据库的代码
	// 直接拼接 SQL 语句
	var sql = "INSERT INTO user_message (user_nickname, user_phone) VALUES ('" + user_user + "', '" + user_phone + "')";
	db.query(sql, function(err, result) {
	  if (err) {
		res.status(500).send('找不到用户');
		return;
	  }

	  console.log(`Added admin with ID: ${result.insertId}`);
	  res.send('1'); // 返回成功响应
	});
  });
//查找用户信息
app.get('/users',function(req,res){
	var sql = "select * from user_message";
	db.query(sql,function(err,results){
		if(err){
			res.send("0");
		}
		else {
			res.send(results);
		}
	});
});
//删除用户
app.post('/delete_p',function(req,res){
	var user_id = req.body.user_id;
	var sql="delete from user_message where user_id='"+user_id+"'";
	db.query(sql,function(err){
		if(err)
			res.send("0");
		else
			res.send("1");
	});
});
//修改用户
app.post('/update_p', function(req, res){
  var user_id = req.body.user_id;
  var user_phone = req.body.user_phone;
  var user_nickname=req.body.user_nickname
  var sql = "UPDATE user_message SET user_phone='" + user_phone + "' ,user_nickname='" + user_nickname + "'WHERE user_id='" + user_id + "'";
  db.query(sql, function(err){
    if (err)
      res.send("0");
    else
      res.send("1");
  });
});
//管理员信息
// 添加管理员
// 添加管理员
app.post('/add_admin', function(req, res) {
	var admin_user = req.body.admin_user;
	var admin_password = req.body.admin_password;
	// 在此处编写将管理员用户名和密码插入数据库的代码
	// 直接拼接 SQL 语句
	var sql = "INSERT INTO administrator (admin_user, admin_password) VALUES ('" + admin_user + "', '" + admin_password + "')";
	db.query(sql, function(err, result) {
	  if (err) {
		console.error('Failed to add admin:', err);
		res.status(500).send('找不到管理员');
		return;
	  }
	  res.send('1'); // 返回成功响应
	});
  });
  
  
//查找管理员信息
app.get('/admin',function(req,res){
	var sql = "select * from administrator";
	db.query(sql,function(err,results){
		if(err){
			res.send("0");
		}
		else {
			res.send(results);
		}
	});
});
//删除管理员
app.post('/delete_admin',function(req,res){
	var admin_id = req.body.admin_id;
	var sql="delete from administrator where admin_id='"+admin_id+"'";
	db.query(sql,function(err){
		if(err)
			res.send("0");
		else
			res.send("1");
	});
});
//修改管理员
app.post('/update_admin', function(req, res){
  var admin_id = req.body.admin_id;
  var admin_user = req.body.admin_user;
  var admin_password=req.body.admin_password
  var sql = "UPDATE administrator SET admin_user='" + admin_user + "' ,admin_password='" + admin_password + "'WHERE admin_id='" + admin_id + "'";
  db.query(sql, function(err){
    if (err)
      res.send("0");
    else
      res.send("1");
  });
});

//微信小程序
// 微信小程序插入
app.post('/wxPay', function(req, res) {
  var user = req.body.user;
  var pay = req.body.pay;
  var sql = "INSERT INTO wxpay (user, pay) VALUES ('" + user + "', '" + pay + "')";
  // 将数据插入到数据库中
  db.query(sql, function(err) {
    if (err) {
      res.send({ code: 1, msg: '插入失败' });
    } else {
      res.send({ code: 0, msg: '插入成功' });
    }
  });
});

//查询评论
app.get('/pinglun',function(req,res){
	var sql = "select * from pinglun";
	db.query(sql,function(err,results){
		if(err){
			res.send("0");
		}
		else {
			res.send(results);
		}
	});
});
//删除用户评论
app.post('/delete_user',function(req,res){
	var phone = req.body.phone;
	// console.log(req.body)
	var sql="delete from pinglun where phone='"+phone+"'";
	console.log(sql)
	db.query(sql,function(err){
		if(err)
			res.send("0");
		else
			res.send("1");
	});
});
//修改用户评分
app.post('/updateScore', function(req, res){
  var id = req.body.id;
  var score = req.body.score;
  var sql = "UPDATE pinglun SET score='" + score + "' WHERE id='" + id + "'";
  db.query(sql, function(err){
    if (err)
      res.send("0");
    else
      res.send("1");
  });
});
//查询商品
app.get('/list',function(req,res){
	var sql = "select * from list";
	db.query(sql,function(err,results){
		if(err){
			res.send("0");
		}
		else {
			res.send(results);
		}
	});
});
// 给微信的数据
app.get('/wxHome',function(req,res){
	var sql = "select * from wx_home";
	db.query(sql,function(err,results){
		if(err){
			res.send("0");
		}
		else {
			res.send(results);
		}
	});
});
//删除商品
app.post('/delete_list',function(req,res){
	var id = req.body.id;
	// console.log(req.body)
	var sql="delete from list where id='"+id+"'";
	console.log(sql)
	db.query(sql,function(err){
		if(err)
			res.send("0");
		else
			res.send("1");
	});
});
//修改商品数据
app.post('/update_relist', function(req, res){
  const { id, title, description, price, image } = req.body;
   const updateSql = `UPDATE list SET title ='${title}',description ='${description}' , price ='${price}', image ='${image}'WHERE id ='${id}'`
	db.query(updateSql, [title, description, price, image, id], function(err, result) {
      if (err) {
        res.status(500).send('未能更新商品');
        return;
      }
      res.send('1'); // 返回成功响应
    });
});
//orders
app.get('/orders',function(req,res){
	var sql = "select * from orders";
	db.query(sql,function(err,results){
		if(err){
			res.send("0");
		}
		else {
			res.send(results);
		}
	});
});
//order删除
app.post('/delete_orders',function(req,res){
	var id = req.body.id;
	// console.log(req.body)
	var sql="delete from orders where id='"+id+"'";
	db.query(sql,function(err){
		if(err)
			res.send("0");
		else
			res.send("1");
	});
});

//order修改
app.post('/update_orders', (req, res) => {
	const { id, user,image, title, description, quantity, price } = req.body;
	const query = `
	  UPDATE Orders
	  SET user = '${user}',  image = '${image}', title = '${title}', description = '${description}', quantity = '${quantity}', price = '${price}'
	  WHERE id = '${id}'
	`;
  
	db.query(query, (err, results) => {
	  if (err) {
		console.error(err);
		res.status(500).send('更新订单时出错');
	  } else {
		res.send('1');
	  }
	});
  });
  
//添加商品
app.post('/add_list',function(req,res){
	let list=req.body
	// list.image=""
		const updateSql = `INSERT INTO list (image, title, description, price,created_at) VALUES ('${list.image}', '${list.title}', '${list.description}', '${list.price}','${list.created_at}');`
		console.log(updateSql);
	db.query(updateSql,function(err){
		if(err){
			res.send("0")
			console.log('插入失败');
		}else{
			res.send("1")
			console.log('插入成功');
		}
			
	})
});
//数据表
app.get('/transaction-trend', (req, res) => {
	const query = 'SELECT day, sales FROM TransactionTrend';
	db.query(query, (err, results) => {
	  if (err) {
		res.status(500).send('获取交易趋势数据时出错');
		return;
	  }
	  res.json(results);
	});
  });
  
  app.get('/order-source', (req, res) => {
	const query = 'SELECT source, count FROM OrderSource';
	db.query(query, (err, results) => {
	  if (err) {
		res.status(500).send('获取订单源数据时出错');
		return;
	  }
	  res.json(results);
	});
  });
  //小程序需要用到的数据
//   签到
  app.post('/api/signin', (req, res) => {
	const { userId, signInDate, points } = req.body;
	const query = `
	  INSERT INTO SignIns (userId, signInDate, points)
	  VALUES (${userId}, '${signInDate}', ${points})
	  ON DUPLICATE KEY UPDATE signInDate = '${signInDate}', points = points + ${points};
	`;
	db.query(query, (err, results) => {
	  if (err) {
		console.error(err);
		res.status(500).send('登录时出错');
	  } else {
		res.send('登录成功');
	  }
	});
  });
//   签到历史
app.get('/api/signin/history', (req, res) => {
	const userId = req.query.userId;
	const query = `SELECT signInDate FROM SignIns WHERE userId = ${userId} ORDER BY signInDate DESC`;
	db.query(query, (err, results) => {
	  if (err) {
		console.error(err);
		res.status(500).send('获取登录历史记录时出错');
	  } else {
		res.json(results);
	  }
	});
  });
 //附近
 app.get('/api/shopInfo', (req, res) => {
	const shopId = req.query.shopId || 1;  // 默认获取 shopId 为 1 的店铺信息
	const query = `SELECT * FROM shop_info WHERE id = ${shopId}`;
  
	db.query(query, (err, results) => {
	  if (err) {
		console.error(err);
		res.status(500).send('获取商店信息时出错');
	  } else {
		console.log(results); // 打印结果以便调试
		res.json(results[0] || {});  // 假设只有一个结果
	  }
	});
  });
  //福利界面
  // 模拟福利列表数据
const welfareData = [
    {
        id: 1,
        imageUrl: "https://userblink.csdnimg.cn/direct/6a4c479020be4d87a7df31715a663f8a.jpeg",
        title: "新用户专享",
        description: "首单立减",
        price: "优惠价：¥9.9"
    },
    {
        id: 2,
        imageUrl: "https://userblink.csdnimg.cn/direct/43000bced9c34086a33f7361e2482c09.jpeg",
        title: "限时抢购",
        description: "全场8折",
        price: "原价：¥99.9"
    },
	{
        id: 1,
        imageUrl: "https://userblink.csdnimg.cn/direct/82ab1fd635b247b69c9e60c40c9e4528.jpeg",
        title: "新用户专享",
        description: "首单立减",
        price: "优惠价：¥9.9"
    },
    {
        id: 2,
        imageUrl: "https://userblink.csdnimg.cn/direct/c745d665deb14f6e93a45c00a120d554.jpeg",
        title: "限时抢购",
        description: "全场8.8折",
        price: "原价：¥99.9"
    }
    // 其他福利内容
];
// 获取福利列表接口
app.get('/api/welfare', (req, res) => {
    // 假设这里从数据库或其他地方获取福利列表数据
    res.json(welfareData);
});
//联系我们
/// 接收用户提交的联系信息
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    const query = 'INSERT INTO Contacts (name, email, message) VALUES (?, ?, ?)';
    db.query(query, [name, email, message], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: '保存联系信息时出错' });
        } else {
            res.status(201).json({ success: true, message: '已成功保存联系信息' });
        }
    });
});

// 获取所有用户提交的联系信息
app.get('/api/contacts', (req, res) => {
    const query = 'SELECT * FROM Contacts ORDER BY createdAt DESC';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: '获取联系信息时出错' });
        } else {
            res.json({ success: true, data: results });
        }
    });
});

//优惠卷
app.post('/api/redeem-coupon', (req, res) => {
    const { userId, couponCode } = req.body;

    if (!userId || !couponCode) {
        return res.status(400).json({ message: '用户ID和优惠券代码是必填项' });
    }

    const queryCoupon = 'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE';
    db.query(queryCoupon, [couponCode], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.status(404).json({ message: '优惠券无效或已过期' });
        }

        const coupon = results[0];
        const insertUserCoupon = 'INSERT INTO user_coupons (user_id, coupon_id) VALUES (?, ?)';
        db.query(insertUserCoupon, [userId, coupon.id], (err, result) => {
            if (err) throw err;

            return res.status(200).json({ message: '优惠券兑换成功', coupon });
        });
    });
});
app.get('/api/user-coupons/:userId', (req, res) => {
    const { userId } = req.params;

    const queryUserCoupons = `
        SELECT uc.id, c.code, c.discount, c.description, c.min_spend, uc.is_used, uc.used_at 
        FROM user_coupons uc
        JOIN coupons c ON uc.coupon_id = c.id
        WHERE uc.user_id = ?
    `;
    db.query(queryUserCoupons, [userId], (err, results) => {
        if (err) throw err;

        return res.status(200).json({ coupons: results });
    });
});

app.listen(8088,function(){
	console.log("服务器启动成功")
});