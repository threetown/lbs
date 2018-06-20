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
            result.push({ "name": dataArr[i].name, "type": dataArr[i].type})
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
            if(dataArr[i].type === value){
                result = dataArr[i].children;
            }
        }
    }
    return result;
}