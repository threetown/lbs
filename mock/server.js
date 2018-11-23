const jsonServer = require('json-server')
const server = jsonServer.create()

// Support middleware
const middleware = jsonServer.defaults()
server.use(middleware)

// Add this before server.use(router)
server.use(jsonServer.rewriter({
  '/center/serviceInfo/list': '/serviceInfo' // 配置请求路由到指定的json-server值；也可以不配置，'/api/user/baseinfo'会找 /baseinfo.
 ,'/center/dict/list/appType' : '/appType'
 ,'/center/serviceInfo/getUrlList/236': '/getUrlList'
 ,'/center/getServiceLogCount/todayOfHours': '/getServiceLogCount'
 ,'/center/getAccessCount/todayOfHours': '/getAccessCount'
 ,'/center/getUserLogCount/todayOfHours': '/getUserLogCount'
 ,'/center/getCallLog': '/getCallLog'
 ,'/center/getUserCountByStatus': '/getUserCountByStatus'
 ,'/center/getUserLogCount/today': '/getUserLogCountToday'
 ,'/center/getServerCountInfo': '/getServerCountInfo'
 ,'/center/groupStaffCityInfo': '/groupStaffCityInfo'
 ,'/center/getUserLogCount/monthOfDays': '/getUserLogCountMonth'
 ,'/center/getAccessCount/weekOfDays': '/getAccessCountWeek'
 ,'/center/getServieRanking/0': '/getServieRanking'
 ,'/center/getServiceOverview': '/getServiceOverview'
 ,'/center/getAccessOverview': '/getAccessOverview'
}))

// 支持加载多个db文件
const _ = require('underscore')
const path = require('path')
const fs = require('fs')
const mockDir = path.join(__dirname, 'data')
const base = {}
const files = fs.readdirSync(mockDir)
files.forEach((file) => {
  _.extend(base, require(path.resolve(mockDir, file)))
})
const router = jsonServer.router(base)


// // 自定义请求路由 - post
server.post('/center/user/getAmpAuthByCondition', (req, res) => {
  let db = router.db
  let data = db.get('getAmpAuthByCondition').value()
  res.jsonp(data)
})

server.post('/center/appKeyInfo/list', (req, res) => {
  let db = router.db
  let data = db.get('appKeyInfo').value()
  res.jsonp({ data: data, state: 0, success: true, message:"操作成功" })
})

server.post('/center/getApiRequestCountInfo', (req, res) => {
  let db = router.db
  let data = db.get('getApiRequestCountInfo').value()
  res.jsonp({ data: data, state: 0, success: true, message:"操作成功" })
})

// server.post('/center/getServiceOverview', (req, res) => {
//     let db = router.db
//     let data = db.get('getServiceOverview').value()
//     res.jsonp({ data: data, state: 0, success: true, message:"操作成功" })
// })

server.use(router)

// 返回自定义格式数据
router.render = (req, res) => {
  let data = {}
  res.jsonp({
    data: res.locals.data,
    message: "操作成功",
    state: 0,
    success: true
  })
}

server.listen(9090, () => {
  console.log('JSON Server is running')
})