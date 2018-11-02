<template>
    <div class="user-details-fullscreen" :currentUser="currentUser">
            <div class="header">
                <a href="javascript:;" @click="close" style="display: inline-block;line-height: 22px;"><Icon type="ios-arrow-left" size="22" style="vertical-align: top;"/> 返回</a>
            </div>
            <div class="content">
                <h2 style="padding: 24px 0;font-weight: normal; color: #333; font-size: 16px; line-height: 24px;" >扣款明细</h2>
                <div style="margin-bottom: 22px;">
                    <DatePicker size="large" type="month" @on-change="handlerSelectDate" v-model="countMonth" placeholder="月份" style="width: 120px;"></DatePicker>
                </div>
                
                <div v-if="order.loading" :class="'Placeholder ' + order.state">{{order.loadTips}}</div>
                <div v-else>
                    <can-edit-table
                        class="custom-table"
                        v-model="order.data"
                        :editIncell="true"
                        :columns-list="orderColumns"
                        @on-cell-change="handleCellChange" 
                        @on-change="handleChange"
                        ></can-edit-table>
                    <div style="margin-top: 22px;text-align: right;">
                        <Form :model="pay.Form" ref="payModel" :rules="pay.rules" :label-width="92" class="custom-form" style="float: right;">
                            <FormItem label="合计金额：" style="margin-bottom: 12px;">
                                <div style="font-size: 14px;"><b style="font-size: 16px;">{{orderMoney}}</b> 元</div>
                            </FormItem>
                            <FormItem label="应付金额：" prop="price">
                                <Input :disabled="pay.loading ? true : false" v-model="pay.Form.price" size="large" placeholder="请输入应付金额" style="width: 120px"/>
                            </FormItem>
                            <Button @click="exportData" size="large">导出账单</Button>
                            <Button @click.prevent="handlerPay('payModel')" type="primary" size="large" :loading="pay.loading">账单结算</Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
    import { ajaxPostDeductMoney, ajaxPostCutPayment, ajaxPostEsData } from 'src/service/user'
    import canEditTable from 'components/tables/canOnlyEditTable.vue'

    import * as tools from 'src/util/tools'

    export default {
        name: 'userPay',
        components: {
            canEditTable
        },
        props: {
            currentUser: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data () {
            return {
                countMonth: '',
                order: {
                    loading: false,
                    state: 'loading',
                    loadTips: '努力加载中，请稍等。。。',
                    data: [],
                    money: 0,
                },
                pay: {
                    loading: false,
                    Form: {
                        price: ''
                    },
                    rules: {
                        price: [
                            { required: true, message: "请输入应付金额", trigger: 'blur' }
                        ]
                    }
                },
                orderMoney: 0,
                orderColumns: [
                    { title: '应用名称', align: 'center', key: 'appName' },
                    { title: 'Key名称', align: 'center', key: 'keyName' },
                    { title: '接口名称', align: 'center', key: 'serviceName' },
                    { title: '总访问量', align: 'center', key: 'zongdiaoyongshu' },
                    { title: '有效访问量', align: 'center', key: 'zongjifeishu' },
                    { title: '实际访问量', align: 'center', key: 'shijifangwen', editable: true },
                    { title: '费用(元)', align: 'center', key: 'money', render: (h, params) => {
                            let texts = tools.countPrice(params.row.shijifangwen);
                            return h('div',{},[
                                h('span', {}, texts)
                            ])
                        }
                    },
                    { title: '操作', align: 'center', key: 'action', render: (h, params) => {
                            return h('div', {class: 'action-group'},
                            [
                                h('span', {
                                    class: 'items', on: {
                                        click: () => {
                                            this.openCount(params)
                                        }
                                    }
                                }, '详情')
                            ]);
                        }
                    },
                ]
            }
        },
        methods: {
            close(){
                this.$emit("closeUserPay");
            },
            handlerSelectDate(v){
                this.dateRange = v;
                this.initList()
            },
            openCount(params){
                let argu = { keyCode: params.row.keyCode, dateMonth: this.countCurrentMonth };
                let routeData = this.$router.resolve({
                    name: 'count',
                    query: argu
                });
                window.open(routeData.href, '_blank')
            },
            getList(callback){
                const self = this;
                this.order.loading = true;
                this.order.loadTips = '努力加载中，请稍等。。。'
                this.order.state = 'loading'

                let data = {
                    staffId: this.currentUser.staffId,
                    startTime: this.countTimeRate[0],
                    endTime: this.countTimeRate[1]
                }
                ajaxPostDeductMoney(data).then(res => {
                    if(res.state === 0){
                        let resource = res.data.data;
                        if(resource && resource.length){
                            if(callback && typeof callback === "function"){
                                console.log('go callback')
                                callback(resource); // 回调
                            }
                        }else{
                            self.order.state = 'empty'
                            self.order.loadTips = '抱歉，暂无数据！'
                        }
                    }else{
                        self.order.state = 'error';
                        self.order.loadTips = res.message ? res.message : '糟糕，加载失败！';
                    }
                }).catch( reason => {
                    self.order.state = 'error';
                    self.order.loadTips = '糟糕，服务器内部错误';//'错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
            },
            exportData(){
                this.$refs.userPayTable.exportCsv({
                    filename: '扣款明细',
                    original: false
                });
            },
            handlerPay(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        self.pay.loading = true
                        self.triggerPayment()
                    }
                })
            },
            triggerES(resource){
                const self = this;
                if(resource && resource.length>0){
                    let arrData = resource.map(v => {
                        return v.keyCode
                    })
                    let data = {
                        staffId: this.currentUser.staffId,
                        gte: this.countTimeRate[0],
                        lte: this.countTimeRate[1],
                        key: arrData
                    }
                    ajaxPostEsData(data).then(res => {
                        console.log(res, 185)
                        if(res.state === 0){
                            self.getDataList()
                        }else{
                            self.order.state = 'error';
                            self.order.loadTips = res.message ? res.message : '糟糕，加载失败！';
                        }
                    })
                }
            },
            triggerPayment(){
                const self = this;
                let qData = {
                    staffId: this.currentUser.staffId,
                    startTime: this.countTimeRate[0],
                    endTime: this.countTimeRate[1]
                }
                let arrData = this.order.data.slice().map(v => {
                    return { "id": v.id, "feesCallCnt": v.shijifangwen, "money": Number(tools.countPrice(v.shijifangwen)) }
                })
                let data = {
                    staffId: self.currentUser.staffId,
                    money: Number(self.pay.Form.price),
                    yyyyMM: self.countCurrentMonth,
                    mapIdsMoney: arrData
                }
                ajaxPostCutPayment(data).then(res => {
                    if(res.state === 0){
                        self.$Message.success(res.message);
                    }else{
                        self.$Message.error(res.message);
                    }
                    self.pay.loading = false;
                })
            },
            handleCellChange(v){
                this.initCountMoney(v)
            },
            handleChange(v){
                console.log(v, 197)
            },
            initCountMoney(arr){
                let sum = 0;
                let countArr = arr.map(v => {
                    return Number(tools.countPrice(v.shijifangwen))
                })
                countArr.map(v => { sum += v })
                this.orderMoney = parseFloat(sum).toFixed(2)
            },
            initList(){
                const self = this;
                let selectTimestamp = new Date(this.countMonth).valueOf();
                let currentTimestamp = new Date(this.curentMonth).valueOf()
                if(selectTimestamp < currentTimestamp){
                    // 当前月大于查看月，先拉一遍列表，再执行toES,再拉一遍列表展示
                    this.getList(function(v){
                        let a = v.map(value => {
                            return v.id
                        })
                        if(a && a.length>0){
                            if(a[0] === 0){
                                self.order.data = v;
                                self.initCountMoney(v)
                                self.order.loading = false;
                            }else{
                                self.triggerES(v)
                            }
                        }
                    })
                }else{
                    this.getDataList()
                }
            },
            getDataList(){
                const self = this;
                this.getList(function(v){
                    self.order.data = v;
                    self.initCountMoney(v)
                    self.order.loading = false;
                })
            },
            initDate(){
                let date = new Date();
                let y = date.getFullYear(),
                    m = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
                this.countMonth = `${y}-${m}`;
            },
            init(){
                this.initDate()
                this.initList()
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
            },
            countCurrentMonth(){
                let date = new Date(this.countMonth),
                    y = date.getFullYear(),
                    m = date.getMonth();
                let formatMonth = m+1 < 10 ? `0${m+1}` : `${m+1}`;
                return `${y}${formatMonth}`;
            },
            curentMonth(){
                let date = new Date();
                let y = date.getFullYear(),
                    m = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
                return `${y}-${m}`;
            }
        },
        mounted() {
            this.init()
        },
        watch: {
            currentUser: {
                handler() {
                    this.init();
                },
                deep: true
            }
        }
    }
</script>

<style lang="less">
    .custom-tables{
        width: 100%;
        border: 1px solid #ccc;
        td{
            border: 1px solid #ccc;
        }
    }
</style>
