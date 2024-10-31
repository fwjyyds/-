

//包的配置
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router()

const fs = require('fs');
const http = require('http')
const multiparty = require('multiparty')
const fse = require('fs-extra')


const jwt = require('jsonwebtoken')
const path = require('path');
const cors = require('cors');
const multer = require('multer');



var app = require('express')()
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//函数
// 使用app.get定义全局路由
app.get('/', (req, res) => {

});
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'lts3',
    port: '3307'
})
function getCurrentTimeFormatted() {
    let date = new Date();

    // 获取年份（2位）
    let year = String(date.getFullYear());

    // 获取月份（补0）
    let month = String(date.getMonth() + 1).padStart(2, '0');

    // 获取日期（补0）
    let day = String(date.getDate()).padStart(2, '0');

    // 获取小时（24小时制，补0）
    let hours = String(date.getHours()).padStart(2, '0');

    // 获取分钟（补0）
    let minutes = String(date.getMinutes()).padStart(2, '0');

    // 获取秒（补0）
    let seconds = String(date.getSeconds()).padStart(2, '0');

    // 拼接字符串
    let formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedTime;
}
/*中间件*/
//生成token
//密钥
const secret = 'qwer';
function generateToken(payload) {
    const token = jwt.sign(payload, secret, { expiresIn: '48h' }); // 有效期为1小时
    return token;
}
//验证token
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded
    } catch (error) {
        return false
    }
}
/* */
/*注册业务 */
app.post('/regis', (req, res) => {
    // 获取请求体中的JSON数据
    const data = req.body;
    db.query(`
        INSERT INTO user (name,password,createDate,nickname,exp1,des,face,quanxian) VALUES (?,?,?,?,?,?,?,?);`, [data.username, data.password, getCurrentTimeFormatted(), data.username, 0, '这里空空如也...', data.face, 0], (err, results) => {
        if (err) {
            console.error('数据库插入错误:', err);
            return res.send({
                code: '0',
                msg: '该用户名已存在',
                error: err.message
            });
        }
        else {
            db.query(`SELECT id,name,createDate,nickname,exp1,des,face,quanxian FROM user WHERE name = ? AND password =? ;`,
                [data.username, data.password], (err, results) => {
                    if (err) {
                        console.log(err)
                        return res.send({
                            code: '0',
                            msg: "查询失败",
                            error: err
                        })
                    }
                    else {
                        const myPayload = results[0];
                        const myToken = generateToken(myPayload);
                        return res.send({
                            code: '1',
                            msg: '登录成功',
                            user: results[0],
                            token: myToken
                        })
                    }
                })
        }
    })
})
/*登录业务 */
app.post('/login', (req, res) => {
    // 获取请求体中的JSON数据
    const data = req.body;

    let userinfo = verifyToken(req.headers['token'])
    console.log('userinfo', userinfo)
    if (!userinfo || userinfo === undefined || userinfo === null) {
        //无效userinfo
        db.query(`SELECT * FROM user WHERE username = ? AND password =? ;`,
            [data.username, data.password], (err, results) => {
                if (err) {
                    console.log(err)
                    return res.send({
                        code: '0',
                        msg: "查询失败",
                        error: err
                    })
                }
                else if (results.length == 0) {
                    db.query(`SELECT * FROM user WHERE username = ? ;`,
                        [data.username, data.password], (err, res1) => {
                            if (err) {
                                console.log(err)
                                return res.send({
                                    code: '0',
                                    msg: "查询失败",
                                    error: err
                                })
                            }
                            else if (res1.length == 0) {
                                return res.send({
                                    code: '0',
                                    msg: '用户不存在',

                                })
                            }
                            else {
                                return res.send({
                                    code: '0',
                                    msg: '密码错误',

                                })
                            }
                        })
                }
                else {
                    const myPayload = results[0];
                    console.log('res', results[0])
                    const myToken = generateToken(myPayload);
                    return res.send({
                        code: '1',
                        msg: '登录成功',
                        user: results[0],
                        token: myToken
                    })
                }
            })
    }
    else {
        db.query(`SELECT * FROM user WHERE id=? ;`,
            [userinfo.id], (err, results) => {
                if (err) {
                    console.log(err)
                    return res.send({
                        code: '0',
                        msg: "查询失败",
                        error: err
                    })
                }
                else if (results.length == 0) {
                    db.query(`SELECT * FROM user WHERE username = ? ;`,
                        [data.username, data.password], (err, res1) => {
                            if (err) {
                                console.log(err)
                                return res.send({
                                    code: '0',
                                    msg: "查询失败",
                                    error: err
                                })
                            }
                            else if (res1.length == 0) {
                                return res.send({
                                    code: '0',
                                    msg: '用户不存在',

                                })
                            }
                            else {
                                return res.send({
                                    code: '0',
                                    msg: '密码错误',

                                })
                            }
                        })
                }
                else {
                    const myPayload = results[0];
                    const myToken = generateToken(myPayload);
                    return res.send({
                        code: '1',
                        msg: '登录成功',
                        user: results[0],
                        token: myToken
                    })
                }
            })
    }
})

/*获取专区 */
app.post('/getnote', (req, res) => {
    // 获取请求体中的JSON数据
    const data = req.body;
    //1.用户2.视频3.评论4.消息
    if (data.fun == 1) {
        db.query(`select * from user`, (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '获取成功',
                    res: results
                })
            }
        })
    }

    else if (data.fun == 2) {
        sql = `SELECT * FROM lts where name like '%${data.keyword}%'`
        console.log('sql', sql)
        db.query(sql, [], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '获取成功',
                    res: results
                })
            }
        })
    }

    else if (data.fun == 3) {
        db.query(`select ltsid from ptp1 where userid in (select id from user where username=?);`, [data.userid], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                let ltslist = []

                const key1 = Object.keys(results)

                for (let key of key1) {
                    ltslist.push(parseInt(results[key].ltsid))
                }
                const p0 = `select * from lts where id in (${String(ltslist)})  ;`

                if (ltslist.length > 0) {
                    db.query(p0, [], (err, results2) => {
                        if (err) {
                            console.error('数据库获取错误:', err);
                            return res.status(500).send({
                                status: 1,
                                msg: '获取失败',
                                error: err.message
                            });
                        }
                        else {
                            return res.send({
                                code: '1',
                                msg: '获取成功',
                                res: results2
                            })



                        }



                    })

                }
                else {
                    return res.send({
                        code: '1',
                        msg: '获取成功',
                        res: []
                    })
                }


            }
        })
    }
    else if (data.fun == 4) {
        db.query(`select * from user where id in (select userid from ptp1 where ltsid=?)`, [data.ltsid], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '获取成功',
                    res: results
                })
            }
        })
    }
    else if (data.fun == 5) {
        db.query(`SELECT comment.*, user.nickname,user.exp1,user.des,user.face
FROM comment 
INNER JOIN user ON comment.userid = user.id where vvid=? ORDER BY ?
LIMIT ? OFFSET ? ;`, [data.vvid, data.order, data.num, data.index], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '获取成功',
                    res: results
                })
            }
        })
    }
    else if (data.fun == 6) {
        db.query(`SELECT vv.*, user.nickname,user.exp1,user.des,user.face
            FROM vv 
            INNER JOIN user ON vv.userid = user.id where vv.id=? and cond=? ORDER BY ?
            LIMIT ? OFFSET ? ;`, [data.vvid, data.cond, data.order, data.num, data.index], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '获取成功',
                    res: results
                })
            }
        })

    }
    else if (data.fun == 7) {
        console.log('userid', data.userid)


        sql = `SELECT n.from1,n.to1,n.content,n.createDate,u.nickname,
u.face,u.id 
FROM notice n
JOIN user u ON ( n.from1 = u.id or  n.to1 = u.id)
WHERE (u.id != ? and (n.from1=? or n.to1=?)) ORDER BY ? 
            LIMIT ? OFFSET ? ;`

        db.query(sql, [data.userid, data.userid, data.userid, data.order, data.num, data.index], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '获取成功',
                    res: results
                })
            }
        })

    }
    else if (data.fun == 8) {
        sql = `select count(*) as c from vv where cond=?`
        params = [data.cond]

        if (data.id) {
            sql = sql + ` and id =?`
            params.push(data.id)
        }
        if (data.link1) {
            sql = sql + ` and link1 like ?`
            params.push('%' + data.link1 + '%')
        }

        db.query(sql, params, (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '获取成功',
                    res: results[0].c
                })
            }
        })
    }
    else if (data.fun == 9) {
        db.query(`select count(*) as c from user where quanxian=?;`, [data.quanxian], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '获取成功',
                    res: results[0].c
                })
            }
        })
    }
    else if (data.fun == 10) {
        db.query(`select count(*) as c from notice where from1=? or to1=?;`, [data.from1, data.to1], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '获取成功',
                    res: results[0].c
                })
            }
        })
    }
});







var server = require('http').Server(app)
var io = require('socket.io')(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        // origin: "http://localhost", // 允许跨域的前端域名
        methods: ["GET", "POST"], // 允许的跨域请求方法
        transports: ['websocket', 'polling'], // 允许的跨域通信传输方式
        credentials: true // 允许cookies等认证信息一起跨域传递
    }
}

)

let users = []



server.listen(3010, () => {
    console.log('服务i')
})
//总连线
io.on('connection', function (socket) {
    console.log('新的连接方法')


    socket.on('login', data => {
        console.log('新用户', data, users)
        const obj1Keys = Object.keys(data.user);

        const user = users.find(item => {

            for (let key of obj1Keys) {
                console.log('ddddddd', data.user[key], item.user[key])
                if (data.user[key] !== item.user[key]) {
                    return false;
                }
                else {
                    return true
                }
            }
        }

        )


        console.log('FF', user)
        if (user) {
            socket.emit('loginerror', { msg: '登陆失败' })
        }
        else {
            users.push(data)
            socket.user = data
            socket.emit('loginsuccess', { msg: '登陆成功' })

        }
        console.log(`还有${users.length}个连接`)
    })
    socket.on('sendmsg', (data) => {

        console.log(`在${getCurrentTimeFormatted()},${data.user}发送消息,${data.msg}`)
        io.emit('receivemsg', data)
    })
    socket.on('sendimg', (data) => {

        console.log(`在${getCurrentTimeFormatted()},${data.user}发送消息,${data.imgurl}`)
        io.emit('receiveimg', data)
    })
    socket.on('disconnect', () => {
        if(socket.user===undefined||typeof socket.user ===undefined||!socket.user){
return 
        }
        let idx = users.findIndex(item => item.username === socket.user)
        console.log(socket.user, '离开了we',users)
        users.splice(idx, 1)
        //告诉所有人离开了
        console.log(`还有${users.length}个连接`)
        io.emit('deluser', socket.user)
        //告诉所有人.ulist更新
        io.emit('userlist', { users: users })
    })
})



/*上传专区 */
app.post('/uploadnote', (req, res) => {

    // 获取请求体中的JSON数据
    const data = req.body;

    if (data.fun == 1) {
        db.query(`
            
            INSERT IGNORE INTO ptp1 (userid,ltsid)
select * from (select ? AS userid, ? AS ltsid) as tmp 
where not exists ( select * from ptp1 where userid= ? and ltsid=?  );`, [data.userid, data.ltsid, data.userid, data.ltsid], (err, results) => {
            if (err) {
                console.error('数据库插入错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '上传失败',
                    error: err.message
                });
            }
            else{
                console.log(results.affectedRows,data.ltsid,'kkkkkkkkk')
                if(results.affectedRows===1){
                    db.query(`UPDATE lts SET num=num+1 where id=?;`, [ data.ltsid], (err1,res1) => {
                        console.log('2.',err1,res1)
                     })
                }
    
                return res.send({
                    code: '1',
                    msg: '添加成功',
                    res: results
                })


            }
         
        })
    }
    //评论
    else if (data.fun == 2) {
        db.query(`INSERT INTO vv (link1,userid,looknum,likenum,dislikenum,cond,createDate) VALUES (?,?,?,?,?,?,?);`, [data.link1, data.userid, 0, 0, 0, 0, getCurrentTimeFormatted()], (err, results) => {
            if (err) {
                console.error('数据库插入错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '上传失败',
                    error: err.message
                });
            }
            return res.send({
                code: '1',
                msg: '添加成功',
                res: results
            })
        })
    }
    else if (data.fun == 3) {
        db.query(`INSERT INTO comment (content,createDate,userid,cond,vvid,likenum,dislikenum ) VALUES (?,?,?,?,?,?,?);`, [data.content, getCurrentTimeFormatted(), data.userid, data.cond, data.vvid, 0, 0], (err, results) => {
            if (err) {
                console.error('数据库插入错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '上传失败',
                    error: err.message
                });
            }
            return res.send({
                code: '1',
                msg: '添加成功',
                res: ''
            })
        })
    }
    else if (data.fun == 4) {
        db.query(`INSERT INTO notice (from1,to1,content,createDate)VALUES (?,?,?,?);`, [data.from1, data.to1, data.content, getCurrentTimeFormatted()], (err, results) => {
            if (err) {
                console.error('数据库插入错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '上传失败',
                    error: err.message
                });
            }
            return res.send({
                code: '1',
                msg: '添加成功',
                res: results
            })
        })
    }
});
// import ws from 'nodejs-websocket'
// const server=ws.createServer(conn=>{
//     console.log('新连接')
//     conn.on('text',data=>{
//         console.log('发生')
//     })
//     conn.on('close',data=>{
//         console.log('断开')
//     })
//     conn.on('error',data=>{
//         console.log('错误')
//     })
// })

// server.listen(3010,()=>{
//     console.log('元神 启动')
// })

/*修改专区 */
app.post('/changenote', (req, res) => {
    // 获取请求体中的JSON数据
    const data = req.body;

    if (data.fun == 1) {
        db.query(`UPDATE lts SET name=?,num=?,face=?,content=?,order1=? where id=?;`, [data.name, data.num, data.face, data.content, data.order, data.id], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '更新成功',
                    res: results
                })
            }
        })

    }
    else if (data.fun == 3) {
        db.query(`UPDATE comment SET likenum = ?,dislikenum=? WHERE  id=?;`, [data.likenum, data.dislikenum, data.id], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '状态更新成功',
                    res: results
                })
            }
        })

    }
    else if (data.fun == 2) {
        db.query(`UPDATE vv SET looknum = ?,likenum=?,dislikenum=?,cond=? WHERE id = ?;`, [data.looknum, data.likenum, data.dislikenum, data.cond, data.id], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '状态更新成功',
                    res: results
                })
            }
        })

    }


})
/*删除专区 */
app.post('/deletenote', (req, res) => {
    // 获取请求体中的JSON数据
    const data = req.body;
    //1.删除用户
    if (data.fun == 1) {
        db.query(`
delete from ptp1 where userid=? and ltsid=?;`, [data.userid, data.ltsid], (err, results) => {
            if (err) {
                console.error('数据库插入错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '上传失败',
                    error: err.message
                });
            }
            else{
              
                if(results.affectedRows===1){
                    db.query(`UPDATE lts SET num=num-1 where id=?;`, [ data.ltsid], (err1,res1) => {
                        console.log('2.',err1,res1)
                     })
                }
    
                return res.send({
                    code: '1',
                    msg: '你已退出群聊',
                    res: results
                })


            }
         
        })
    }
    else if (data.fun == 2) {
        db.query(`delete from vv WHERE id = ?;`, [data.id], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '删除成功',
                    res: results
                })
            }
        })

    }
    else if (data.fun == 3) {
        db.query(`delete from comment WHERE cond = ? or id=?;`, [data.id, data.id], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '删除成功',
                    res: results
                })
            }
        })

    }
    else if (data.fun == 4) {
        db.query(`delete from notice WHERE id = ?;`, [data.id], (err, results) => {
            if (err) {
                console.error('数据库获取错误:', err);
                return res.status(500).send({
                    status: 1,
                    msg: '获取失败',
                    error: err.message
                });
            }
            else {
                return res.send({
                    code: '1',
                    msg: '删除成功',
                    res: results
                })
            }
        })

    }
})