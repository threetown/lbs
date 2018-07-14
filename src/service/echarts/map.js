import fetch from 'src/util/fetch';

/**
 * 百度ECharts图表获取 中国城市 地理信息
 */
export const ajaxGetEChartsCityMap = () => fetch({ url: '/static/mock/data/china-cities.json', method: 'get' })
