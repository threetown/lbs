<template>
    <div class="user-details-fullscreen" :currentUser="currentUser">
            <div class="header">
                <a href="javascript:;" @click="close" style="display: inline-block;line-height: 22px;"><Icon type="ios-arrow-left" size="22" style="vertical-align: top;"/> 返回</a>
            </div>
            <div class="content">
                <h2 style="padding: 24px 0;font-weight: normal; color: #333; font-size: 16px; line-height: 24px;" >扣款明细</h2>
                <div style="margin-bottom: 22px;">
                    <!-- <DatePicker size="large" type="daterange" placeholder="请选择查询时间" style="width: 220px;"
                        @on-change="handlerSelectDate"
                        ></DatePicker> -->
                    <DatePicker size="large" type="month" @on-change="handlerSelectDate" v-model="countMonth" placeholder="月份" style="width: 120px;float: right;"></DatePicker>
                </div>
                
                <div v-if="order.loading" :class="'Placeholder ' + order.state">{{order.loadTips}}</div>
                <div v-else>
                    <Table border :columns="orderColumns" :data="order.data" class="custom-table" ref="userPayTable"></Table>
                    <div style="margin-top: 22px;text-align: right;">
                        <div style="font-size: 14px;margin-bottom: 12px;">
                            <div style="margin-bottom: 12px;">合计金额： {{order.money}} 元 </div>
                            应付金额：<Input v-model="order.payMoney" size="large" placeholder="请输入应付金额" style="width: 120px"/>
                        </div>
                        <div>
                            <Button @click="exportData" size="large">导出账单</Button>
                            <Button @click="handlerPay" type="primary" size="large">账单结算</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
    import { ajaxPostDeductMoney } from 'src/service/user'

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
                    payMoney: ''
                },
                orderColumns: [
                    { title: '应用名称', align: 'center', key: 'appName' },
                    { title: 'Key名称', align: 'center', key: 'keyName' },
                    { title: '接口名称', align: 'center', key: 'serviceName' },
                    { title: '总访问量', align: 'center', key: 'zongdiaoyongshu' },
                    { title: '有效访问量', align: 'center', key: 'zongjifeishu' },
                    { title: '实际访问量', align: 'center', key: 'zongjifeishu' },
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
            handlerPay(){
                this.$Message.success('正在支付');
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
