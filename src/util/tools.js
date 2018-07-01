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
                "status": 1,
                "used": 0,
                "percent": 0
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
                "name": 'WWW',
                "info": "这是接口信息",
                "type": "IP定位",
                "price": 2000,
                "upPrice": 20000,
                "status": 0,
                "desc": item.remark
            })
        }
    }
    return result;
}