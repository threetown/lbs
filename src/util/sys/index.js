/**
 * 数据总览 - 异常统计数据格式处理
 * @param {array} resourceArr 
 */
export const convertServiceOverview = (resourceArr) => {
    let configs = [
        {
            type: 'wait',
            icon: 'icon-pending',
            name: '待处理业务',
            value: 0
        }, {
            type: 'error-server',
            icon: 'icon-warning',
            name: '异常服务',
            value: 0
        }, {
            type: 'warning',
            icon: 'icon-alert',
            name: '预警业务',
            value: 0
        }, {
            type: 'error-user',
            icon: 'icon-abnormal-user',
            name: '异常用户',
            value: 0
        }
    ]
    if(resourceArr && resourceArr instanceof Array){
        for (let i = 0; i < configs.length; i++) {
            const el = configs[i];
            for (let j = 0; j < resourceArr.length; j++) {
                const ele = resourceArr[j];
                if(el.type === ele.type){
                    el.value = ele.value;
                }
            }            
        }
    }
    return configs;
}

/**
 * 数据总览 - 访问统计数据格式处理
 * @param {array} resourceArr 
 */
export const convertAccessOverview = (resourceArr) => {
    let configs = [
        {
            type: 'pv',
            name: '今日访问次数-PV',
            value: 0,
            percent: 0
        }, {
            type: 'uv',
            name: '今日访问用户-UV',
            value: 0,
            percent: 0
        }, {
            type: 'av',
            name: '昨日新增用户',
            value: 0,
            percent: 0
        }
    ]
    if(resourceArr && resourceArr instanceof Array){
        for (let i = 0; i < configs.length; i++) {
            const el = configs[i];
            for (let j = 0; j < resourceArr.length; j++) {
                const ele = resourceArr[j];
                if(el.type === ele.type){
                    el.value = ele.value;
                    el.percent = ele.percent;
                }
            }            
        }
    }
    return configs;
}

/**
 * 业务分析转换
 * @param {array} resourceArr 
 * @param {array} nameArr 
 */
export const convertLineAreaEchartData = (resourceArr, nameArr) => {
    let option = {}
    let xAxisData = [];
    let seriesData = [];
    if(resourceArr && resourceArr instanceof Array){
        for (let i = 0; i < resourceArr.length; i++) {
            const element = resourceArr[i];
            xAxisData.push(element.key_as_string);
            seriesData.push(element.doc_count)
        }
    }
    option = {
        xAxisData,
        seriesData: [
            { name: nameArr, data: seriesData }
        ]
    }
    return option;
}

/**
 * 流量分析转换
 * @param {array} resourceArr 
 * @param {array} nameArr 
 */
export const convertFlowLineAreaEchartData = (resourceArr, fieldArr, nameArr) => {
    let option = {}
    let xAxisData = [];
    let seriesData = [];
    nameArr = nameArr ? nameArr : ['访问次数','访问人数']
    fieldArr = fieldArr ? fieldArr : ['access_count', 'user_count']
    if(resourceArr && resourceArr instanceof Array){
        // 处理数据
        for (let i = 0; i < fieldArr.length; i++) {
            let data = [];
            let field = fieldArr[i]
            for (let j = 0; j < resourceArr.length; j++) {
                data.push(resourceArr[j][field].value)
            }
            seriesData.push({ name: nameArr[i], data: data })
        }
        // 处理x轴
        for (let i = 0; i < resourceArr.length; i++) {
            xAxisData.push(resourceArr[i].key_as_string)
        }
    }
    option = {
        xAxisData,
        seriesData
    }
    return option;
}

/**
 * 用户分析转换
 * @param {array} resourceArr 
 * @param {array} nameArr 
 */
export const convertUserLineAreaEchartData = (resourceArr, fieldArr, nameArr) => {
    let option = {}
    let xAxisData = [];
    let seriesData = [];
    nameArr = nameArr ? nameArr : ['用户总数','新增用户']
    fieldArr = fieldArr ? fieldArr : ['total_count', 'doc_count']
    if(resourceArr && resourceArr instanceof Array){
        // 处理数据
        for (let i = 0; i < fieldArr.length; i++) {
            let data = [];
            let field = fieldArr[i]
            for (let j = 0; j < resourceArr.length; j++) {
                data.push(resourceArr[j][field])
            }
            seriesData.push({ name: nameArr[i], data: data })
        }
        // 处理x轴
        for (let i = 0; i < resourceArr.length; i++) {
            xAxisData.push(resourceArr[i].key_as_string)
        }
    }
    option = {
        xAxisData,
        seriesData
    }
    return option;
}