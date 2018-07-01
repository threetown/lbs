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
                <Select size="large" v-model="search.currentDate" style="width:200px">
                    <Option v-for="item in search.dateType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
        </Row>
        <Table border :columns="recordColumns" :data="recordData" class="custom-table"></Table>
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
                    currentType: '0',
                    statusType: [
                        { label: '全部申请', value: '0' },
                        { label: '已通过', value: '1' },
                        { label: '未通过', value: '2' }
                    ],
                    currentDate: '0',
                    dateType: [
                        { label: '全部申请', value: '0' },
                        { label: '近三个月申请', value: '3' },
                        { label: '近六个月申请', value: '6' },
                        { label: '近一年申请', value: '12' },
                    ]
                },
                recordColumns: [
                    { title: 'Key信息', key: 'name', align: 'center' },
                    { title: '接口信息', key: 'info', align: 'center' },
                    { title: '提升类型', key: 'type', align: 'center' },
                    { title: '当前配额', key: 'price', align: 'center' },
                    { title: '申请提升至', key: 'upPrice', align: 'center' },
                    { title: '状态', key: 'status', align: 'center', render: (h, params) => {
                            let texts = '';
                            let classname = '';
                            if(params.row.status === 1){
                                texts = '成功'
                                classname = 'status-success'
                            }else if(params.row.status === 0){
                                texts = '失败'
                                classname = 'status-error'
                            }
                            return h('div',{},[
                                h('span', {
                                    class: classname,
                                }, texts)
                            ])
                        }
                    },
                    { title: '反馈信息', key: 'desc', align: 'center' }
                ],
                recordData: [
                    { "id": 1, "name": 'WWW', "info": "这是接口信息", "type": "IP定位", "price": 2000, "upPrice": 20000, "status": 1, "desc": "提升成功" },
                    { "id": 3, "name": 'WWW', "info": "这是接口信息", "type": "IP定位", "price": 2000, "upPrice": 20000, "status": 0, "desc": "操作异常" }
                ]
            }
        },
        methods: {
            changeType(value){
                this.search.currentType = value;
                this.getList()
            },
            getList(){
                const self = this;
                let data = {
                    statusCd: this.search.currentType,
                    staffId: 421
                }
                ajaxPostQuotaRecord(data).then(res => {
                    if(res.state === 0){
                        self.recordData = tools.getQuotaRecord(res.data.data);
                    }else{
                        self.$Message.error(res.message)
                    }
                    
                })
            }
        },
        created(){
            this.getList()
        }
    }
</script>