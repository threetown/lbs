/**
 * create by leon
 * create time: 2018.06.20
 * url: http://github.com/threetowns
 * email: threetowns@163.com
 */

/**
 * @method getRootData,获取顶级元素
 * @param {array} dataArr 
 */
export const getRootData = (dataArr) => {
    let result = [];
    if (dataArr && dataArr instanceof Array) {
        for (let i = 0; i < dataArr.length; i++) {
            result.push({ "name": dataArr[i].name, "code": dataArr[i].code})
        }
    }
    return result;
}

/**
 * @method getChildrenData,获取子元素
 * @param {array} dataArr 
 * @param {string} value 
 */
export const getChildrenData = (dataArr, value) => {
    let result = [];
    if (dataArr && dataArr instanceof Array) {
        for (let i = 0; i < dataArr.length; i++) {
            if(dataArr[i].code === value){
                result = dataArr[i].children;
            }
        }
    }
    return result;
}

/**
 * 
 * @param {array} dataArr 
 * @param {string} value 
 * @param {string} type 
 */
export const getDictData = (dataArr, value, type) => {
    let result = null;
    let Type = type ? type : 'label';
    if(dataArr && dataArr instanceof Array) {
        switch(Type){
            case 'value':
                for(let i = 0; i< dataArr.length; i++){
                    if(dataArr[i].label === value){
                        result = dataArr[i].value;
                    }
                }
                break;
            default:
                for(let i = 0; i< dataArr.length; i++){
                    if(dataArr[i].value === value){
                        result = dataArr[i].label;
                    }
                }
        }
    }
    return result;
}


export const getQuotaType = (resourceArr) => {
    // {
    //     "keyCode": "377716c941154ca6b89e0d54f08569e4",
    //     "appName": "招行抵押",
    //     "keyId": 52
    // }
    // { label: '智慧楼盘-3839dc8c17483f15990d9cc6e8cf7de6', value: '3839dc8c17483f15990d9cc6e8cf7de6' }
    let result = [];
    if(resourceArr && resourceArr instanceof Array){
        for (let i = 0; i < resourceArr.length; i++) {
            const item = resourceArr[i];
            result.push({ 'label': item.appName + '-' + item.keyCode, 'value': item.keyCode, 'id': item.keyId })
        }
    }
    return result;
}

export const getQuotaList = (resourceArr) => {
    let result = [];
    if(resourceArr && resourceArr instanceof Array){
        for (let i = 0; i < resourceArr.length; i++) {
            const item = resourceArr[i];
            result.push({
                "id": item.serviceId,
                "type": item.serviceName,
                "price": item.dailyTotalCnt,
                "upPrice": item.concurrencyMax,
                "status": item.statusCd,
                "used": item.alreadyUse ? item.alreadyUse : 0,
                "percent": item.ratio ? item.ratio : 0,
                "keyId": item.keyId,
                "serviceId": item.serviceId
            })
        }
    }
    return result;
}

export const getQuotaKeyId = (resourceArr, keyCode) => {
    let result = null;
    if(resourceArr && resourceArr instanceof Array){
        for (let i = 0; i < resourceArr.length; i++) {
            if(resourceArr[i].value === keyCode){
                result = resourceArr[i].id;
            }
        }
    }
    return result;
}

export const getQuotaRecord = (resourceArr) => {
    let result = [];
    if(resourceArr && resourceArr instanceof Array){
        for (let i = 0; i < resourceArr.length; i++) {
            const item = resourceArr[i];
            result.push({
                "id": item.logId,
                "name": item.keyName,
                "info": "这是接口信息",
                "type": item.limittype,
                "price": item.currentLimit ? item.currentLimit: 0,
                "upPrice": item.newLimit? item.newLimit : 0,
                "status": item.aprovalStatusCd,
                "desc": item.remark ? item.remark : '-'
            })
        }
    }
    return result;
}

export const getAppId = (resourceArr) => {
    let result = [];
    if(resourceArr && resourceArr instanceof Array){
        for (let i = 0; i < resourceArr.length; i++) {
            result.push(resourceArr[i].appId)
        }
    }
    return result;
}

// 扣款明细 - 应付金额计算
export const countPrice = (num,limitNumber) => {
    limitNumber = limitNumber ? limitNumber : 500000;
    let result = 0;
    if(num <= limitNumber){
        result = num * 0.7
    }else{
        result = limitNumber * 0.7 + (num - limitNumber) * 0.5
    }
    return parseFloat(result).toFixed(2);
}

// 前几个月
export const getPreMonthDay = (monthNum, date) => {
    // 当前日期：
    if(!date){
        let cdate = new Date();
        let cyear = cdate.getFullYear();
        let cmonth = cdate.getMonth()+1>10?cdate.getMonth()+1:'0'+cdate.getMonth()+1;
        let cday = cdate.getDate()>10?cdate.getDate():'0'+cdate.getDate();
        let nowdatestr = cyear+"-"+cmonth+"-"+cday;
        date = nowdatestr;
    }

    let dateArr = date.split('-');
    let year = dateArr[0]-1; //获取当前日期的年份
    let month = dateArr[1]; //获取当前日期的月份
    let day = dateArr[2]; //获取当前日期的日
    let days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    let year2 = year;
    let month2 = parseInt(month) - monthNum;
    if (month2 <=0) {
        year2 = parseInt(year2) - parseInt(month2 / 12 == 0 ? 1 : Math.abs(month2) / 12);
        month2 = 12 - (Math.abs(month2) % 12);
    }
    let day2 = day;
    let days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    let t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}


export const getPreMonth = (monthNum, date) => {
    // 当前日期：
    if(!date){
        let cdate = new Date();
        let cyear = cdate.getFullYear();
        let cmonth = cdate.getMonth()+1>10?cdate.getMonth()+1:'0'+cdate.getMonth()+1;
        let cday = cdate.getDate()>10?cdate.getDate():'0'+cdate.getDate();
        let nowdatestr = cyear+"-"+cmonth+"-"+cday;
        date = nowdatestr;
    }

    let dateArr = date.split('-');
    let year = dateArr[0]; //获取当前日期的年份
    let month = dateArr[1]; //获取当前日期的月份
    let day = dateArr[2]; //获取当前日期的日
    let days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数

    // 1. 
    let mod = monthNum%12;
    let int = parseInt(monthNum/12);
    let m = parseInt(month)
    let y = year - int;

    let m2 = 12;
    if(mod < m){
        m2 = m - mod
    }else if(mod > m){
        m2 = 12 - (mod - m)
        y = y -1
    }else{
        y = y -1
    }
    m2 = Number(m2) < 10 ? `0${m2}` : m2;

    let t2 = y + '-' + m2;
    return t2;
}

//含时间
export const getFormatterData = (date) =>{
    var datetime = date.getFullYear()
    + "-"// "年"
    + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
            + (date.getMonth() + 1))
    + "-"// "月"
    + (date.getDate() < 10 ? "0" + date.getDate() : date
            .getDate())
    + " "
    + (date.getHours() < 10 ? "0" + date.getHours() : date
            .getHours())
    + ":"
    + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
            .getMinutes())
    + ":"
    + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
            .getSeconds());
    return datetime;
}

//可以传 date year month
export const getCurDateByKey = (key) =>{
    let cdate = new Date();
    let cyear = cdate.getFullYear();
    let cmonth = cdate.getMonth() + 1 < 10 ? '0'+ (cdate.getMonth() + 1) : cdate.getMonth()+1;
    let cday =  cdate.getDate() < 10 ? '0'+ cdate.getDate() : cdate.getDate();
    let nowdatestr='';
    if(key == 'year'){
        nowdatestr = cyear+"";
    }else if(key =='month'){
        nowdatestr = cyear+"-"+cmonth;
    }else if(key =='date'){
        nowdatestr = cyear+"-"+cmonth+"-"+cday;
    }
    return nowdatestr;
}

export const transDateByKey = (cdate,key) =>{
    let strDate='';
    let cyear = cdate.getFullYear();
    let cmonth = cdate.getMonth() + 1 < 10 ? '0'+ (cdate.getMonth() + 1) : cdate.getMonth()+1;
    let cday =  cdate.getDate() < 10 ? '0'+ cdate.getDate() : cdate.getDate();
    if(key == 'year'){
        strDate = cyear+"";
    }else if(key =='month'){
        strDate = cyear+'-'+cmonth;
    }else if(key =='date'){
        strDate = cyear+"-"+cmonth+"-"+cday;
    }
    return strDate;
}