<template>
    <div class="user-details-fullscreen" :currentUser="currentUser">
        <div class="header">
            <a href="javascript:;" @click="close" style="display: inline-block;line-height: 22px;"><Icon type="ios-arrow-left" size="22" style="vertical-align: top;"/> 返回</a>
        </div>
        <div class="content">
            <div class="user-desc clearfix">
                <div class="items items_info">
                    <div class="face"></div>
                    <div class="username">{{currentUser.loginName}}</div>
                    <div class="phone">电话：{{currentUser.telephone}}</div>
                </div>
                <div class="items">
                    <div style="float: left;">
                        <div class="phone">可用余额</div>
                        <div class="bigtext">{{balance}}元</div>
                    </div>
                    <div style="padding-top: 10px;float: left;margin-left: 26px;">
                        <Button type="primary" @click="handlerPayModel">充值</Button>
                        <Button @click="handlerUserPay">扣款</Button>
                    </div>
                </div>
            </div>
            
            <h2 style="padding: 24px 0;font-weight: normal; color: #333; font-size: 16px; line-height: 24px;" >交易记录</h2>
            <Row style="margin-bottom: 22px;">
                <Col span="16">
                    <Select size="large" v-model="search.statusCd" @on-change="getList" style="width: 150px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="8">
                    <DatePicker size="large" type="daterange" placeholder="请选择查询时间" style="width: 220px; float: right;"
                        @on-change="handlerSelectDate"
                        ></DatePicker>
                </Col>
            </Row>

            <div v-if="order.loading" :class="'Placeholder ' + order.state">{{order.loadTips}}</div>
            <Table v-if="!order.loading" border :columns="orderColumns" :data="order.data" class="custom-table"></Table>

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

        <user-pay v-if="userPayState" :currentUser="currentUser" @closeUserPay="closeUserPay"></user-pay>
    </div>
</template>

<script>
    import { ajaxPostBalance, ajaxPostDealRecord, ajaxPostAccountTopUp } from 'src/service/user';

    import userPay from "./userPay"

    export default {
        name: 'userDetails',
        components: {
            userPay
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
                balance: 0,
                search: {
                    dateRange: [],
                    statusCd: 2
                },
                statusList: [
                    { value: 1, label: '充值' },
                    { value: 2, label: '扣款' }
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
                            { required: true, message: "请输入充值金额", trigger: 'blur' }
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
            close(){
                this.$emit("closeUserDetails");
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
                    type: this.search.statusCd
                }
                if(self.search.dateRange && self.search.dateRange[0]){
                    data = Object.assign(data, {startTime: self.search.dateRange[0]})
                }
                if(self.search.dateRange && self.search.dateRange[1]){
                    data = Object.assign(data, {endTime: self.search.dateRange[1]})
                }
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
                    self.order.loadTips = '错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
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
            openCount(params){
                let argu = { keyCode: params.row.keyCode };
                let routeData = this.$router.resolve({
                    name: 'count',
                    query: argu
                });
                window.open(routeData.href, '_blank')
            },
            init(){
                this.getBalance()
                this.getList()
            }
        },
        mounted() {
            this.init()
        },
        computed: {
            orderColumns(){
                const self = this;
                let columns = [
                    { title: '创建时间', key: 'createdDt' },
                ];
                if(this.search.statusCd === 2){
                    columns.push({
                        title: '服务名称', key: 'serviceName' },
                        { title: '总调用量', key: 'totalCallCnt' },
                        { title: '有效调用量', key: 'goodCallCnt' },
                        { title: '备注', key: 'remark' },
                        { title: '合计费用', key: 'totalCost' }
                    )
                }
                columns.push({ title: '变动金额', key: 'dealAmount' })

                if(this.search.statusCd === 2){
                    columns.push({
                        title: '操作', key: 'action', align: 'center', width: 100, render: (h, params) => {
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
                    })
                }
                return columns;
            }
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
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    background-color: #fff;
    .header{
        border-bottom: 1px solid #e9eaec;
        padding: 14px 16px;
        line-height: 1;
    }
    .content{
        width: 100%;
        overflow: auto;
        position: absolute;
        top: 51px;
        bottom: 0;
        padding: 16px;
        font-size: 12px;
        line-height: 1.5;
    }
}
</style>

