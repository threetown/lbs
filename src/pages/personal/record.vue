<template>
    <div class="full-block-mod">
        <div class="Header clearfix">
            <h2 class="title">配额申请记录<strong>您可以在这里查看您的配额申请记录</strong></h2>
        </div>
        <Row style="margin-bottom: 22px;">
            <Col span="16">
                <Select size="large" v-model="search.currentType" @on-change="changeType" style="width:200px">
                    <Option v-for="item in search.statusType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <!-- <Select size="large" v-model="search.currentDate" style="width:200px">
                    <Option v-for="item in search.dateType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select> -->
                <DatePicker size="large" type="datetimerange" placeholder="请选择查询时间" style="width: 350px;"
                    @on-ok="triggerSearchDate"
                    @on-change="selectDate"
                    ></DatePicker>
            </Col>
        </Row>
        <div v-if="record.loading" :class="'Placeholder ' + record.state">{{record.loadTips}}</div>
        <Table v-if="!record.loading" border :columns="recordColumns" :data="record.data" class="custom-table"></Table>
        <div class="page-placeholder" v-show="!record.loading">
            <Page :total="record.total"
                :current="record.page"
                :page-size="record.rows"
                @on-change="changeQueryPage"
            ></Page>
        </div>
    </div>
</template>

<script>
    import { ajaxPostQuotaRecord } from 'src/service/personal';
    import * as tools from 'src/util/tools'

    export default {
        name: 'personal-record',
        data () {
            return {
                search: {
                    currentType: '',
                    statusType: [
                        { label: '全部申请', value: '' },
                        { label: '未审批', value: '0' },
                        { label: '审批通过', value: '1' },
                        { label: '未通过', value: '2' }
                    ],
                    dataRange: []
                },
                recordColumns: [
                    { title: 'Key信息', key: 'keyName', align: 'center' },
                    { title: '接口信息', key: 'serviceName', align: 'center' },
                    { title: '提升类型', key: 'limittype', align: 'center', width: 95 },
                    { title: '当前配额', key: 'currentLimit', align: 'center' },
                    { title: '申请提升至', key: 'newLimit', align: 'center' },
                    { title: '申请时间', key: 'createdDt', align: 'center' },
                    { title: '状态', key: 'aprovalStatusCd', align: 'center', width: 96, render: (h, params) => {
                            let texts = '';
                            let classname = '';
                            if(params.row.aprovalStatusCd === '未通过'){
                                classname = 'status-error'
                            }else if(params.row.aprovalStatusCd === '未审批'){
                                classname = 'status-waiting'
                            }else{
                                classname = 'status-success'
                            }
                            texts = params.row.aprovalStatusCd;
                            return h('div',{},[
                                h('span', {
                                    class: classname,
                                }, texts)
                            ])
                        }
                    },
                    { title: '备注', key: 'remark', align: 'center' },
                    { title: '审核意见', key: 'aprovalRemark', align: 'center' }
                ],
                record:{
                    data: [],
                    state: 'loading',
                    loading: false,
                    loadTips: '努力加载中，请稍等...',
                    page: 1,
                    rows: 10,
                    total: 0
                }
            }
        },
        methods: {
            changeType(value){
                this.search.currentType = value;
                this.getList()
            },
            changeQueryPage(v){
                this.record.page = v;
                this.getList()
            },
            selectDate(v){
                this.search.dataRange = v;
            },
            triggerSearchDate(){
                const self = this;
                this.getList({
                    startTime: self.search.dataRange[0],
                    endTime: self.search.dataRange[1]
                })
            },
            getList(params){
                const self = this;
                let data = {
                    statusCd: this.search.currentType,
                    page: this.record.page,
                    rows: this.record.rows
                }
                data = Object.assign(data, params)
                this.record.loading = true;
                this.record.loadTips = '努力加载中，请稍等...'
                this.record.state = 'loading';
                ajaxPostQuotaRecord(data).then(res => {
                    if(res.state === 0){
                        let result = res.data;
                        if(result && result.data && result.data.length){
                            self.record.data = result.data;
                            self.record.total = result.total;
                            self.record.loading = false;
                        }else{
                            self.record.state = 'empty';
                            self.record.loadTips = '抱歉，暂无数据！';
                        }
                    }else{
                        self.record.state = 'error';
                        self.record.loadTips = '糟糕，加载失败！';
                    }
                })
            }
        },
        created(){
            this.getList()
        }
    }
</script>