<template>
    <div class="full-block-mod">
        <div class="Header clearfix">
            <h2 class="title">配额申请审核<strong>您可以在这里查看您的配额申请记录</strong></h2>
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
            <Col span="8">
                <Input size="large"
                    v-model.trim="search.keyword"
                    @on-enter="getList"
                    @on-click="getList"
                    icon="ios-search-strong"
                    placeholder="请输入Key信息或用户名"
                    style="width: 260px;float: right;"></Input>
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

        <Modal
            v-model="checkoutForm.isOpen"
            class-name="custom-modal custom-modal-onlyRead vertical-center-modal"
            width="510">
            <Icon type="ios-close-empty" slot="close" @click="closeCheckoutFormModal('checkoutForm')"></Icon>
            <h2 class="title" slot="header">配额申请审核</h2>
            <Form :model="checkoutForm" ref="checkoutForm" :rules="checkoutFormRules" :label-width="120" class="custom-form">
                <FormItem label="Key信息：">
                    <div class="onlyRead">{{checkoutForm.keyName}}</div>
                </FormItem>
                <FormItem label="联系姓名：">
                    <div class="onlyRead">{{checkoutForm.contactName}}</div>
                </FormItem>
                <FormItem label="联系方式：">
                    <div class="onlyRead">{{checkoutForm.contactTel}}</div>
                </FormItem>
                <FormItem label="提升类型：">
                    <div class="onlyRead">{{checkoutForm.limittype}}</div>
                </FormItem>
                <FormItem label="当前配额：">
                    <div class="onlyRead">{{checkoutForm.currentLimit}} {{checkoutForm.limittype === '并发量' ? '次/秒' : '次/日'}}</div>
                </FormItem>
                <FormItem label="申请提升至：">
                    <div class="onlyRead">{{checkoutForm.newLimit}} {{checkoutForm.limittype === '并发量' ? '次/秒' : '次/日'}}</div>
                </FormItem>
                <FormItem label="申请时间：">
                    <div class="onlyRead">{{checkoutForm.createdDt}}</div>
                </FormItem>
                <FormItem label="用户备注：" v-if="checkoutForm.remark">
                    <div class="onlyRead">{{checkoutForm.remark}}</div>
                </FormItem>
                <FormItem label="审核状态：" prop="aprovalstatus" style="margin-bottom: 24px;" v-if="checkoutForm.aprovalStatusCd === '未审批'">
                    <RadioGroup v-model="checkoutForm.type">
                        <Radio :label="item.label" v-for="item in checkoutForm.typeList" :key="item.label" >{{item.label}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="审核状态: " v-if="checkoutForm.aprovalStatusCd !== '未审批'">
                    <RadioGroup v-model="checkoutForm.aprovalStatusCd">
                        <Radio :label="item.label" v-for="item in checkoutForm.typeList" :key="item.label" disabled>{{item.label}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="审核意见：">
                    <Input v-model="checkoutForm.aprovalRemark" type="textarea" placeholder="您可以在此填写审核意见，告知用户原因！" v-if="checkoutForm.aprovalStatusCd === '未审批'"></Input>
                    <div class="onlyRead" v-if="checkoutForm.aprovalStatusCd !== '未审批'">{{checkoutForm.aprovalRemark ? checkoutForm.aprovalRemark: '-'}}</div>
                </FormItem>
            </Form>

            <div slot="footer" v-if="checkoutForm.aprovalStatusCd === '未审批'">
                <Button type="text" size="large" @click="closeCheckoutFormModal('checkoutForm')">取消</Button>
                <Button type="primary" size="large" :loading="checkoutForm.loading" @click.prevent="submitCheckoutForm('checkoutForm')">提交</Button>
            </div>
            <div slot="footer" v-else></div>
        </Modal> <!-- 提升配额 -->
    </div>
</template>

<script>
    import { ajaxPostQuotaRecord, ajaxPostDealApply } from 'src/service/personal';
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
                    keyword: '',
                    dataRange: []
                },
                recordColumns: [
                    { title: '审请人', key: 'staffName', align: 'center' },
                    { title: 'Key信息', key: 'keyName', align: 'center' },
                    { title: '接口信息', key: 'serviceName', align: 'center' },
                    { title: '提升类型', key: 'limittype', align: 'center', width: 95 },
                    { title: '当前配额', key: 'currentLimit', align: 'center' },
                    { title: '申请提升至', key: 'newLimit', align: 'center' },
                    // { title: '联系人', key: 'contactName', align: 'center' },
                    // { title: '联系电话', key: 'contactTel', align: 'center', width: 124 },
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
                    // { title: '用户备注', key: 'remark', align: 'center' },
                    // { title: '审核意见', key: 'aprovalRemark', align: 'center' },
                    {
                        title: '操作', key: 'action', align: 'center', width: 88,
                        render: (h, params) => {
                            return h('div',
                            {class: 'action-group'},
                            [
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.triggerCheckoutModal(params)
                                        }
                                    }
                                }, '审核')
                            ]);
                        }
                    }
                ],
                record:{
                    data: [],
                    state: 'loading',
                    loading: false,
                    loadTips: '努力加载中，请稍等...',
                    page: 1,
                    rows: 10,
                    total: 0
                },
                checkoutForm: {
                    contactName: '',
                    contactTel: '',
                    limittype: '',
                    currentLimit: '',
                    newLimit: '',
                    createdDt: '',
                    keyName: '',
                    remark: '',
                    logId: '',
                    aprovalStatusCd: '',
                    aprovalRemark: '',
                    type: '',
                    typeList: [
                        { label: '审批通过', value: 1 },
                        { label: '未通过', value: 2 }
                    ],
                    loading: false,
                    isOpen: false
                },
                checkoutFormRules: {
                    aprovalstatus: [
                        { required: true, message: '请选择审批状态', trigger: 'change' }
                    ]
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
            closeCheckoutFormModal(name){
                this.$refs[name].resetFields();
                this.checkoutForm.isOpen = false;
            },
            submitCheckoutForm(name){
                const self = this;
                // this.$refs[name].validate((valid) => {
                    // if(valid) {
                        let data = {
                            logId: this.checkoutForm.logId,
                            aprovalStatusCd: this.aprovalStatus
                        }
                        let aprovalRemark = this.checkoutForm.aprovalRemark
                        if(aprovalRemark){
                            data = Object.assign(data, { aprovalRemark })
                        }
                        this.checkoutForm.loading = true;
                        ajaxPostDealApply(data).then(res => {
                            if(res.state === 0){
                                self.closeCheckoutFormModal(name)
                                self.getList()
                                self.$Message.success(res.message)
                            }else{
                                self.$Message.error(res.message)
                            }
                            this.checkoutForm.loading = false;
                        })
                    // }
                // })
            },
            triggerCheckoutModal(params){
                let data = params.row;
                this.checkoutForm.contactName = data.contactName;
                this.checkoutForm.contactTel = data.contactTel;
                this.checkoutForm.limittype = data.limittype;
                this.checkoutForm.currentLimit = data.currentLimit;
                this.checkoutForm.newLimit = data.newLimit;
                this.checkoutForm.createdDt = data.createdDt;
                this.checkoutForm.keyName = data.keyName;
                this.checkoutForm.remark = data.remark;
                this.checkoutForm.logId = data.logId;
                this.checkoutForm.aprovalStatusCd =  data.aprovalStatusCd
                this.checkoutForm.aprovalRemark = data.aprovalRemark
                this.checkoutForm.isOpen = true;
            },
            getList(params){
                const self = this;
                let data = {
                    statusCd: this.search.currentType,
                    page: this.record.page,
                    rows: this.record.rows,
                    type: 1
                }
                data = Object.assign(data, params)
                if(this.search.keyword){
                    data = Object.assign(data, {searchName: self.search.keyword})
                }
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
        computed: {
            aprovalStatus(){
                let type = this.checkoutForm.type;
                return this.checkoutForm.typeList.find((v, i) => { return v.label === type }).value
            }
        },
        created(){
            this.getList()
        }
    }
</script>