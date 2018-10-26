<template>
    <div class="full-block-mod">
        <div class="Header clearfix">
            <h2 class="title">接口调用统计<strong>接口调用量及本月费用统计</strong></h2>
        </div>
        <div style="margin-bottom: 22px;">
            <div class="input-placeholder" v-if="Analysis.loading" style="width: 420px;">{{Analysis.loadTips}}</div>
            <Select size="large" v-if="!Analysis.loading" v-model="Analysis.currentType" @on-change="queryByKey" style="width: 350px">
                <Option v-for="item in Analysis.typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select size="large" v-if="!Analysis.loading" v-model="AnalysisSub.currentType" @on-change="queryByType" style="width: 120px;margin-left: 12px;">
                <Option v-for="item in AnalysisSub.typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </div>

        <Row style="margin-bottom: 22px;">
            <Col span="12">
                <div class="commonTitle">本月接口调用及费用统计</div>
            </Col>
            <Col span="12">
                <DatePicker size="large" type="month" @on-change="queryByDate" v-model="countMonth" placeholder="月份" style="width: 120px;float: right;"></DatePicker>
            </Col>
        </Row>

        <div v-if="record.loading" :class="'Placeholder ' + record.state">{{record.loadTips}}</div>
        <div v-else>
            <Table  border :columns="recordColumns" :data="record.data" class="custom-table"></Table>
            <Row style="font-size: 14px;line-height: 22px;color: #999;padding: 12px;text-align: right;">
                <Col span="4">&nbsp;</Col>
                <Col span="6">总访问量：<span style="color: #666;">{{record.zongdiaoyongshu}}</span></Col>
                <Col span="6">有效访问量：<span style="color: #666;">{{record.zongjifeishu}}</span></Col>
                <Col span="8">本月合计费用：<span style="font-size: 18px;color: #FF3535;">{{record.money}}</span> 元</Col>
            </Row>
        </div>

        <div style="padding-top: 32px;border-top: 1px solid #E5E5E5;">
            <div class="commonTitle" >近一年接口调用统计</div>
        </div>
        <div v-if="lastYear.loading" :class="'Placeholder ' + lastYear.state">{{lastYear.loadTips}}</div>
        <leon-line-bar-light-chart v-if="!lastYear.loading" :id="lastYear.id" :option="lastYear.option"></leon-line-bar-light-chart>
    </div>
</template>

<script>
    import * as tools from 'src/util/tools'
    import { ajaxPostQuotaType, ajaxPostMatchingResult, ajaxPostEsYearsData } from 'src/service/personal'

    import leonLineBarLightChart from "components/echarts/leon-line-bar-light-chart";

    export default {
        name: 'personal-record',
        components: {
            leonLineBarLightChart
        },
        data () {
            return {
                countMonth: '',
                Analysis: {
                    currentType: '',
                    typeList: [],
                    loading: false,
                    loadTips: '努力加载中...'
                },
                AnalysisSub: {
                    currentType: 'House',
                    typeList: [
                        { value: 'Street', label: '街道办接口' },
                        { value: 'Community', label: '小区接口' },
                        { value: 'Building', label: '楼栋接口' },
                        { value: 'Unit', label: '单元接口' },
                        { value: 'House', label: '户接口' }
                    ]
                },
                recordColumns: [
                    { title: '匹配级别', key: 'level', align: 'center'},
                    { title: '有效访问量', key: 'visit', align: 'center' },
                    { title: '匹配率', key: 'rate', align: 'center' },
                ],
                record: {
                    data: [],
                    zongjifeishu: 0,   // 有效访问量
                    zongdiaoyongshu: 0,// 总访问量
                    money: 0,          // 金额费用
                    loading: false,
                    state: 'loading',
                    loadTips: '努力加载中，请稍等...'
                },
                lastYear: {
                    loading: false,
                    state: 'loading',
                    loadTips: '图表正在生成中...',
                    id: 'lastYear',
                    option: [],
                }
            }
        },
        methods: {
            init(router){
                this.getQuotaType(router)
            },
            queryByKey(v){
                this.getQuotaList({ key: v})
                this.drawChart({ key: v })
            },
            queryByType(v){
                this.getQuotaList({ type: v})
                this.drawChart({ type: v })
            },
            queryByDate(v){
                this.getQuotaList()
            },
            getQuotaList(params){
                const self = this;
                this.record.loading = true;
                this.record.loadTips = '努力加载中，请稍等...'
                this.record.state = 'loading'
                let data = {
                    key: this.Analysis.currentType,
                    type: this.AnalysisSub.currentType,
                    gte: this.countTimeRate[0],
                    lte: this.countTimeRate[1]
                }
                data = Object.assign(data, params)

                ajaxPostMatchingResult(data).then(res => {
                    if(res.state === 0){
                        let result = res.data;
                        if(result && result.data && result.data.length){
                            self.record = Object.assign(self.record, result);
                            self.record.loading = false;
                        }else{
                            self.record.state = 'empty';
                            self.record.loadTips = '抱歉，暂无数据！';
                        }
                    }else{
                        self.record.state = 'error';
                        self.record.loadTips = '糟糕，加载失败！';
                    }
                }).catch( reason => {
                    self.record.state = 'error';
                    self.record.loadTips = '错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
            },
            getQuotaTypeCallback(){
                this.getQuotaList()
                this.drawChart()
            },
            getQuotaType(router){
                const self = this;
                this.Analysis.loading = true;
                this.record.loading = true;
                this.lastYear.loading = true;
                ajaxPostQuotaType().then(res => {
                    if(res.state === 0){
                        let data = res.data.data;
                        if(data && data.length){
                            self.Analysis.typeList = tools.getQuotaType(res.data.data)
                            self.Analysis.currentType = router ? router: self.Analysis.typeList[0].value;
                            self.Analysis.loading = false;
                            self.getQuotaTypeCallback()
                        }else{
                            self.Analysis.loadTips = '暂无数据'
                            self.record.loadTips = '抱歉，暂无数据！'
                            self.record.state = 'empty'
                        }
                    }else{
                        self.Analysis.loadTips = res.message ? res.message : "糟糕，加载失败..."
                        self.record.loadTips = '糟糕，加载失败！'
                        self.record.state = 'error'
                    }
                }).catch( reason => {
                    self.record.state = 'error';
                    self.Analysis.loadTips = reason.statusText;
                    self.record.loadTips = '错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
            },
            drawChart(params){
                const self = this;
                this.lastYear.loading = true;
                this.lastYear.loadTips = '图表正在生成中...'
                this.lastYear.state = 'loading'

                let data = {
                    key: this.Analysis.currentType,
                    type: this.AnalysisSub.currentType,
                }
                data = Object.assign(data, params)

                ajaxPostEsYearsData(data).then(res => {
                    if(res.state === 0){
                        let result = res.data;
                        if(result && result.data && result.data.length){
                            self.lastYear.option = result.data;
                            self.lastYear.loading = false;
                        }else{
                            self.lastYear.state = 'empty';
                            self.lastYear.loadTips = '抱歉，暂无数据！';
                        }
                    }else{
                        self.lastYear.state = 'error';
                        self.lastYear.loadTips = '糟糕，加载失败！';
                    }
                })
            },
            initDate(){
                let date = new Date();
                let y = date.getFullYear(),
                    m = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
                if(this.$route.query && this.$route.query.dateMonth){
                    let queryDate = this.$route.query.dateMonth;
                    y = queryDate.substring(0,4)
                    m = queryDate.substring(4,6)
                }
                this.countMonth = `${y}-${m}`;
            }
        },
        computed: {
            countTimeRate(){
                let date = new Date(this.countMonth),
                    y = date.getFullYear(),
                    m = date.getMonth();
                let firstDay = new Date(y, m, 1).getDate(),
                     lastDay = new Date(y, m+1, 0).getDate();
                let formatMonth = m+1 < 10 ? `0${m+1}` : `${m+1}`;
                return [`${y}-${formatMonth}-01`,`${y}-${formatMonth}-${lastDay}`];
            }
        },
        created(){
            const self = this;
            this.init(self.$route.query.keyCode)
            this.initDate()
        },
        watch: {
            '$route' (to, from) {
                if(to.query){
                    this.init(to.query.keyCode)
                }
            }
        }
    }
</script>
<style lang="less" scoped>

</style>
