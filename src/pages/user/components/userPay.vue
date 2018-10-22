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
                    <Table border :columns="orderColumns" :data="order.data" class="custom-table" ref="userPayTable"></Table>
                    <div style="margin-top: 22px;text-align: right;">
                        <Form :model="pay.Form" ref="payModel" :rules="pay.rules" :label-width="92" class="custom-form" style="float: right;">
                            <FormItem label="合计金额：" style="margin-bottom: 12px;">
                                <div style="font-size: 14px;"><b style="font-size: 16px;">{{order.money}}</b> 元</div>
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
    import { ajaxPostDeductMoney, ajaxPostCutPayment } from 'src/service/user'

    export default {
        name: 'userPay',
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
                            { required: true, message: "请输入充值金额", trigger: 'blur' }
                        ]
                    }
                },
                orderColumns: [
                    { title: '应用名称', align: 'center', key: 'appName' },
                    { title: 'Key名称', align: 'center', key: 'keyName' },
                    { title: '接口名称', align: 'center', key: 'serviceName' },
                    { title: '总访问量', align: 'center', key: 'zongdiaoyongshu' },
                    { title: '有效访问量', align: 'center', key: 'zongjifeishu' },
                    { title: '实际访问量', align: 'center', key: 'shijifangwen' },
                    { title: '费用(元)', align: 'center', key: 'money' },
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
                this.getList()
            },
            openCount(params){
                let argu = { keyCode: params.row.keyCode };
                let routeData = this.$router.resolve({
                    name: 'count',
                    query: argu
                });
                window.open(routeData.href, '_blank')
            },
            getList(){
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
                            self.order.data = resource;
                            self.order.money = res.data.money;
                            self.order.loading = false;
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
                    self.order.loadTips = '错误提示：' + reason.statusText + '（'+ reason.status +'）';
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
                        let arrData = self.order.data.slice().map(v => {
                            return { "id": v.id, "feesCallCnt": v.shijifangwen, "money": v.money }
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
                    }
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
                this.getList()
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
