<template>
    <div class="user-details-fullscreen">
        <div class="header">
            <a href="javascript:;" @click="close" style="display: inline-block;line-height: 22px;"><Icon type="ios-arrow-left" size="22" style="vertical-align: top;"/> 返回</a>
        </div>
        <div class="content">
            <div class="user-desc clearfix">
                <div class="items items_info">
                    <div class="face"></div>
                    <div class="username">{{currentUser.staffName}}</div>
                    <div class="phone">电话：{{currentUser.telephone}}</div>
                </div>
                <div class="items">
                    <div style="float: left;">
                        <div class="phone">可用余额</div>
                        <div class="bigtext">{{balance}}元</div>
                    </div>
                    <div style="padding-top: 10px;float: left;margin-left: 26px;">
                        <Button type="primary" @click="handlerPayModel" size="large" style="width: 80px;">充值</Button>
                        <!-- <Button @click="handlerUserPay">扣款</Button> -->
                    </div>
                </div>
            </div>
            
            <h2 style="padding: 24px 0;font-weight: normal; color: #333; font-size: 16px; line-height: 24px;" >交易记录</h2>
            <Tabs :value="currentQueryType" :animated="false" @on-click="triggerTabs" class="tabs-custom-style_card" type="card">
                <TabPane :label="items.label" :name="items.value" v-for="items in queryType" :key="items.value"></TabPane>
            </Tabs>
            <Row style="margin-bottom: 22px;">
                <Col span="16">
                    <Select v-if="currentQueryType === '1'" size="large" v-model="search.statusCd" @on-change="getList" style="width: 150px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select size="large" v-model="search.currentMonth" @on-change="getList" style="width: 150px">
                        <Option v-for="item in selectMonthDict" :value="item.type" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="8">
                    <a v-if="!order.loading" href="javascript:;" @click="exportData" style="float: right;font-size: 14px;">导出</a>
                    <!-- <DatePicker size="large" type="daterange" placeholder="请选择查询时间" style="width: 220px; float: right;"
                        @on-change="handlerSelectDate"
                        ></DatePicker> -->
                </Col>
            </Row>

            <div v-if="order.loading" :class="'Placeholder ' + order.state">{{order.loadTips}}</div>
            <Table ref="userPayTable" v-if="!order.loading" border :columns="orderColumns" :data="order.data" class="custom-table"></Table>

            <Modal
                v-model="pay.isOpen"
                class-name="custom-modal custom-modal-onlyRead vertical-center-modal"
                width="478">
                <Icon type="ios-close-empty" slot="close" @click="closePayModal('payModel')"></Icon>
                <h2 class="title" slot="header">帐户充值</h2>
                <Form :model="pay.Form" ref="payModel" :rules="pay.rules" :label-width="92" class="custom-form">
                    <FormItem label="联系姓名：">
                        <div class="onlyRead">{{currentUser.loginName}}</div>
                    </FormItem>
                    <FormItem label="联系电话：">
                        <div class="onlyRead">{{currentUser.telephone}}</div>
                    </FormItem>
                    <FormItem label="充值金额：" prop="price">
                        <Input v-model="pay.Form.price"></Input>
                    </FormItem>
                </Form>
                <div slot="footer" >
                    <Button type="text" size="large" @click="closePayModal('payModel')">取消</Button>
                    <Button type="primary" size="large" :loading="pay.loading" @click.prevent="handlerPay('payModel')">确认</Button>
                </div>
            </Modal> <!-- 充值 -->
        </div>

        <user-pay v-if="userPayState" :currentUser="currentUser" :payDeatils="payDeatils" @closeUserPay="closeUserPay"></user-pay>
    </div>
</template>

<script>
    import { ajaxPostBalance, ajaxPostDeductList, ajaxPostDealRecord, ajaxPostAccountTopUp } from 'src/service/user';
    import { selectMonthDict } from "src/config/basicConfig"

    import * as tools from 'src/util/tools'

    import userPay from "./userPay"

    export default {
        name: 'userDetails',
        components: {
            userPay
        },
        props: {
            // currentUser: {
            //     type: Object,
            //     default() {
            //         return {}
            //     }
            // }
        },
        data () {
            return {
                currentUser:{},
                payDeatils: {},
                selectMonthDict,
                balance: 0,
                search: {
                    dateRange: [],
                    statusCd: "0",
                    currentMonth: 6
                },
                statusList: [
                    { value: "0", label: '未结算' },
                    { value: "1", label: '已结算' }
                ],
                currentQueryType: "1",
                queryType: [
                    { value: "1", label: '扣款记录' },
                    { value: "2", label: '充值记录' }
                ],
                order: {
                    loading: false,
                    loadTips: '努力加载中，请稍等。。。',
                    state: 'loading',
                    data: []
                },
                pay: {
                    isOpen: false,
                    loading: false,
                    rules: {
                        price: [
                            { required: true, message: "请输入充值金额", trigger: 'blur' },
                            { pattern: /^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/, message:"请输入正确的充值金额", trigger: 'blur' }
                        ]
                    },
                    Form: {
                        price: ''
                    }
                },
                userPayState: false
            }
        },
        methods: {
            triggerTabs(v){
                this.currentQueryType = v
                this.search.currentMonth = 6
                this.getList()
            },
            exportData(){
                this.$refs.userPayTable.exportCsv({
                    filename: '交易记录',
                    original: false
                });
            },
            close(){
                this.$router.push({
                    name: 'list' 
                });
                // this.$emit("closeUserDetails");
            },
            closeUserPay(){
                this.userPayState = false;
            },
            handlerUserPay(){
                this.userPayState = true;
            },
            handlerSelectDate(v){
                this.search.dateRange = v;
                this.getList()
            },
            getBalance(){
                let staffId = this.currentUser.staffId;
                ajaxPostBalance(staffId).then(res => {
                    if(res.state === 0){
                        this.balance = res.data.data;
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            getList(){
                const self = this;
                this.order.loading = true;
                this.order.loadTips = '努力加载中，请稍等。。。'
                this.order.state = 'loading'

                let data = {
                    staffId: this.currentUser.staffId,
                    startTime: this.currentDateRange[0],
                    endTime: this.currentDateRange[1]
                }

                // 扣款记录
                if(this.currentQueryType === '1'){
                    data = Object.assign(data, { status: this.search.statusCd })
                    ajaxPostDeductList(data).then(res => {
                        if(res.state === 0){
                            let resource = res.data.data;
                            if(resource && resource.length){
                                self.order.data = resource;
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
                        self.order.loadTips = '糟糕，服务器内部错误';
                    })
                }else{
                    // 充值记录
                    data = Object.assign(data, { type: 1 })
                    ajaxPostDealRecord(data).then(res => {
                        if(res.state === 0){
                            let resource = res.data.data;
                            if(resource && resource.length){
                                self.order.data = resource;
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
                        self.order.loadTips = '糟糕，服务器内部错误';//'错误提示：' + reason.statusText + '（'+ reason.status +'）';
                    })
                }
            },
            handlerPayModel(){
                this.pay.isOpen = true;
            },
            closePayModal(name){
                this.$refs[name].resetFields();
                this.pay.isOpen = false;
                this.pay.loading = false;
            },
            handlerPay(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        let data = {
                            staffId: self.currentUser.staffId,
                            money: self.pay.Form.price
                        }
                        self.pay.loading = true;
                        ajaxPostAccountTopUp(data).then(res => {
                            if(res.state === 0){
                                self.closePayModal(name);
                                self.$Message.success(res.message);
                            }else{
                                self.$Message.error(res.message)
                                self.pay.loading = false;
                            }
                        }).then(res => {
                            self.getBalance()
                        })
                    }
                })
            },
            openDetails(params){
                // 打开详情，已计算；未计算
                console.log(params, 257)
            },
            openCount(params){
                let argu = { keyCode: params.row.keyCode };
                let routeData = this.$router.resolve({
                    name: 'count',
                    query: argu
                });
                window.open(routeData.href, '_blank')
            },
            openPay(params){
                this.userPayState = true;
                this.payDeatils = params.row
            },
            init(){
                this.getBalance()
                this.getList()
            }
        },
        mounted() {
            this.init()
        },
         created(){
            const self = this;
            this.currentUser = self.$route.query;
        },
        computed: {
            currentDateRange(){
                let key = this.search.currentMonth;

                let cdate = new Date();
                let cyear = cdate.getFullYear();
                let cmonth = cdate.getMonth()+1>10?cdate.getMonth()+1:'0'+cdate.getMonth()+1;
                let lastD = new Date(cyear, cmonth, 0).getDate();
                let cday = lastD>10 ? lastD: '0'+lastD;
                let nowdatestr = cyear+"-"+cmonth+"-"+cday;

                let data = tools.getPreMonth(key);
                return [`${data}-01`, `${nowdatestr}`];
            },
            orderColumns(){
                const self = this;
                let columns = [];
                if(this.currentQueryType === '1'){
                    if(this.search.statusCd === "1"){
                        columns.push({ title: '扣款时间', key: 'deductTime' })
                    }
                    
                    columns.push(
                        { title: '扣款月份', key: 'deductMonth', align: 'center' },
                        { title: '总调用量', key: 'totalCall', align: 'center' },
                        { title: '有效调用量', key: 'workCall', align: 'center' },
                        { title: '实际调用量', key: 'reallyCall', align: 'center' },
                        { title: '实际费用（元）', key: 'reallyMoney', align: 'center' },
                        { title: '状态', key: 'status', align: 'center', render: (h, params) => {
                            let texts = '';
                            let classname = '';
                            if(params.row.status === 0){
                                classname = 'status-error'
                                texts = '未结算'
                            }else if(params.row.status === 1){
                                classname = 'status-success'
                                texts = '已结算'
                            }
                                return h('div',{},[
                                    h('span', {
                                        class: classname,
                                    }, texts)
                                ])
                            }
                        },
                        {
                            title: '操作', key: 'action', align: 'center', width: 100, render: (h, params) => {
                                let texts = '';
                                let classname = '';
                                if(params.row.status === 0){
                                    texts = '结算'
                                }else{
                                    texts = '详情'
                                }
                                return h('div', {class: 'action-group'},
                                [
                                    h('span', {
                                        class: 'items', on: {
                                            click: () => {
                                                this.openPay(params)
                                            }
                                        }
                                    }, texts)
                                ]);
                            }
                        }
                    )
                }else{
                    columns.push(
                        { title: '创建时间', key: 'createdDt' },
                        { title: '充值月份', key: 'month' },
                        { title: '变动金额', key: 'dealAmount' }
                    )
                }
                return columns;
            }
        },
        watch: {
            // currentUser: {
            //     handler() {
            //         this.init();
            //     },
            //     deep: true
            // }
        }
    }
</script>

<style lang="less">
@border-color: #e9eaec;
.user-desc{
    padding: 20px 5px;
    border-bottom: 1px solid @border-color;
    .items{
        position: relative;
        float: left;
        border-right: 1px solid @border-color;
        padding: 0 62px;
        &:last-child{
            border-right: 0;
        }
        .username{
            color: #333;
            font-size: 18px;
            line-height: 24px;
            padding-top: 6px;
        }
        .phone{
            font-size: 14px;
            color: #999;
            white-space: nowrap;
        }
        .bigtext{
            font-size: 20px;
        }
    }
    .items_info{
        padding-left: 82px;
        .face{
            border: 1px solid #eaeaea;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #f2f2f2 url(./userface.png) center no-repeat;
            float: left;
            margin-left: -80px;
        }
    }
}
.user-details-fullscreen {
    // position: fixed;
    // overflow: auto;
    // top: 0;
    // right: 0;
    // bottom: 0;
    // left: 0;
    // z-index: 1000;
    // -webkit-overflow-scrolling: touch;
    // outline: 0;
    background-color: #fff;
    .header{
        border-bottom: 1px solid #e9eaec;
        padding: 14px 16px;
        line-height: 1;
    }
    .content{
        // width: 100%;
        // overflow: auto;
        // position: absolute;
        // top: 51px;
        // bottom: 0;
        // padding: 16px;
        // font-size: 12px;
        // line-height: 1.5;
        padding: 20px;
    }
}
</style>

