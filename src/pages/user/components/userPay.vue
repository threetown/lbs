<template>
    <div class="user-details-fullscreen" :currentUser="currentUser" :payDeatils="payDeatils">
            <div class="header">
                <a href="javascript:;" @click="close" style="display: inline-block;line-height: 22px;"><Icon type="ios-arrow-left" size="22" style="vertical-align: top;"/> 返回</a>
            </div>
            <div class="content">
                <h2 style="padding: 24px 0;font-weight: normal; color: #333; font-size: 16px; line-height: 24px;" >扣款明细
                    <Button @click="exportData" size="large" type="primary" style="float: right;" v-if="!order.loading && payDeatils.status === 1">导出账单</Button>
                </h2>
                <div v-if="order.loading" :class="'Placeholder ' + order.state">{{order.loadTips}}</div>
                <div v-else>
                    <div v-if="payDeatils.status === 1">
                        <Table ref="userPayTable" border :columns="orderColumns" :data="order.data" class="custom-table"></Table>
                        <div style="margin-top: 22px;text-align: right;">
                            <Form :label-width="92" class="custom-form" style="float: right;">
                                <FormItem label="合计金额：" style="margin-bottom: 12px;">
                                    <div style="font-size: 14px;"><b style="font-size: 16px;">{{payDeatils.totalCall}}</b> 元</div>
                                </FormItem>
                                <FormItem label="应付金额：" prop="price">
                                    <div style="font-size: 14px;"><b style="font-size: 16px;">{{payDeatils.reallyMoney}}</b> 元</div>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                    <div v-else> <!--未结算-->
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
                                    <div style="font-size: 14px;"><b style="font-size: 16px;">{{order.money}}</b> 元</div>
                                </FormItem>
                                <FormItem label="应付金额：" prop="price">
                                    <Input :disabled="pay.loading ? true : false" v-model="orderMoney" size="large" placeholder="请输入应付金额" style="width: 120px"/>
                                </FormItem>
                                
                                <Button @click.prevent="handlerPay('payModel')" type="primary" size="large" :loading="pay.loading">账单结算</Button>
                            </Form>
                        </div>
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
            },
            payDeatils: {
                type: Object,
                default(){
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
                            { required: true, message: "请输入应付金额", trigger: 'blur' },
                            { pattern: /^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/, message:"请输入正确的金额", trigger: 'blur' }
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
                        let resource = res.data;
                        if(resource && resource.data && resource.data.length){
                            if(callback && typeof callback === "function"){
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
                    money: Number(self.orderMoney),
                    yyyyMM: self.countCurrentMonth,
                    mapIdsMoney: arrData
                }
                ajaxPostCutPayment(data).then(res => {
                    if(res.state === 0){
                        self.$Message.success(res.message);
                        // TODO: 更新可用金额 & 交易记录

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
                // 根据 payDeatils.status判断，1,详情；0，未结算
                if(this.payDeatils.status === 1){
                    this.getList(function(v){
                        self.order.data = v.data;
                        self.order.loading = false;
                    })
                }else{
                    this.getList(function(v){
                        let rs = v.data;
                        let a = rs.map(value => {
                            return value.id
                        })
                        if(a && a.length>0){
                            if(a[0] === 0){
                                self.triggerES(rs)
                            }else{
                                self.getDataList(v)
                            }
                        }
                    })
                }
            },
            getDataList(){
                const self = this;
                this.getList(function(v){
                    let rs = v.data;
                    self.order.data = rs;
                    self.order.money = v.money;
                    self.initCountMoney(rs)
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
                // let date = new Date(this.countMonth),
                let dateString = this.payDeatils.deductMonth
                let y = dateString.substr(0,4),
                    m = dateString.substr(4,2);
                let lastDay = new Date(y, m, 0).getDate();
                return [`${y}-${m}-01`,`${y}-${m}-${lastDay}`];
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
