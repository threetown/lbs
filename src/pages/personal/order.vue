<template>
    <div class="full-block-mod">
        <div style="font-size: 14px; color: #999;padding-bottom: 16px; margin-bottom: 22px; white-space: nowrap;border-bottom: 1px solid #e9eaec;">可用余额<strong style="font-size: 20px; color: #333; display: block;">{{balance}}元</strong></div>
            
        <div class="Header clearfix"><h2 class="title">交易记录</h2></div>
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
    </div>
</template>

<script>
    import { ajaxPostBalance, ajaxPostDealRecord } from 'src/service/user';

    export default {
        name: 'userDetails',
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
                }
            }
        },
        methods: {
            handlerSelectDate(v){
                this.search.dateRange = v;
                this.getList()
            },
            getBalance(){
                // let staffId = this.currentUser.staffId;
                let staffId = -1; // TODO
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
                    // staffId: this.currentUser.staffId,
                    staffId: -1,
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
        created() {
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
        }
    }
</script>
