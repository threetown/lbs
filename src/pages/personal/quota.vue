<template>
    <div class="full-block-mod">
        <div class="Header clearfix">
            <h2 class="title">高额配管分析管理<strong>您可以在这里查看Web服务Key的每日调用量，还可以申请更高的调用次数。</strong></h2>
        </div>
        <div style="margin-bottom: 22px;">
            <div class="input-placeholder" v-if="Analysis.loading" style="width: 420px;">{{Analysis.loadTips}}</div>
            <Select size="large" v-if="!Analysis.loading" v-model="Analysis.currentType" @on-change="queryQueryList" style="width:420px">
                <Option v-for="item in Analysis.typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </div>
        
        <div v-if="record.loading" :class="'Placeholder ' + record.state">{{record.loadTips}}</div>
        <Table v-if="!record.loading" border :columns="recordColumns" :data="recordData" class="custom-table"></Table>
        <div class="page-placeholder" v-show="!record.loading">
            <Page :total="record.total"
                :current="record.page"
                :page-size="record.rows"
                @on-change="changeQueryPage"
                show-total
            ></Page>
        </div>


        <Modal
            v-model="isOpenQuotaModal"
            class-name="custom-modal vertical-center-modal"
            width="482">
            <Icon type="ios-close-empty" slot="close" @click="closeQuotaFormModal('createQuotaForm')"></Icon>
            <h2 class="title" slot="header">提升配额</h2>
            <Form :model="createQuotaForm" ref="createQuotaForm" :rules="ruleCreateQuota" :label-width="100" class="custom-form">
                <FormItem label="您的姓名" prop="username">
                    <Input v-model="createQuotaForm.username" placeholder="请输入您的姓名"></Input>
                </FormItem>
                <FormItem label="联系方式" prop="phone">
                    <Input v-model="createQuotaForm.phone" placeholder="请输入联系方式"></Input>
                </FormItem>
                <FormItem label="调用量上限" prop="newLimitDiao" class="hasUnit">
                    <Select v-model="createQuotaForm.newLimitDiao" placeholder="请输入调用量上限" style="width: 250px;">
                        <Option v-for="item in createQuotaForm.limitDiaoList" :value="item.name" :key="item.code">{{ item.name }}</Option>
                    </Select>
                    <span class="unit">次/日</span>
                </FormItem>
                <FormItem label="并发量上限" prop="newLimitBing" class="hasUnit">
                    <Select v-model="createQuotaForm.newLimitBing" placeholder="请输入并发量上限" style="width: 250px;">
                        <Option v-for="item in createQuotaForm.limitBingList" :value="item.name" :key="item.code">{{ item.name }}</Option>
                    </Select>
                    <span class="unit">次/秒</span>
                </FormItem>
                <FormItem label="备注" prop="desc">
                    <Input v-model="createQuotaForm.desc" type="textarea"></Input>
                    <span class="tips">提交后我们的工作人员会在2小时内与您联系。</span>
                </FormItem>
            </Form>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeQuotaFormModal('createQuotaForm')">取消</Button>
                <Button type="primary" size="large" :loading="createQuotaForm.loading" @click.prevent="createQuota('createQuotaForm')">提交</Button>
            </div>
        </Modal> <!-- 提升配额 -->
    </div>
</template>

<script>
    import * as tools from 'src/util/tools'
    import { ajaxPostQuotaType, ajaxPostQuotaList, ajaxPostUpQuota } from 'src/service/personal'
    import { ajaxAppType } from 'src/service/application'

    export default {
        name: 'personal-record',
        data () {
            return {
                Analysis: {
                    currentType: '',
                    typeList: [],
                    loading: false,
                    loadTips: '努力加载中...'
                },
                recordColumns: [
                    { title: '服务', key: 'type', align: 'center'},
                    { title: '今日调用量', key: 'info', align: 'center', className: 'percent-td', minWidth: 320,
                        render: (h, params) => {
                            return h('div', {
                                class: 'percent-wrapper clearfix'
                            } ,[
                                '',
                                h('div', { class: 'percent-type' }, '免费'),
                                h('Progress', {
                                    props: { 'stroke-width': 5, 'percent': params.row.percent },
                                    class: 'percent-line'
                                },''),
                                h('div', { class: 'percent-info' }, [
                                    params.row.used + '已用', h('span', { class: 'highlight' }, params.row.percent + '%'),
                                ]
                                ),
                            ])
                        }
                    },
                    { title: '调用量上限（次/日）', key: 'price', align: 'center' },
                    { title: '并发量上限（次/秒）', key: 'upPrice', align: 'center' },
                    { title: '状态', key: 'status', align: 'center', width: 120, render: (h, params) => {
                            let texts = '';
                            let classname = '';
                            if(params.row.status === '正常'){
                                classname = 'status-success'
                            }else{
                                classname = 'status-error'
                            }
                            texts = params.row.status;
                            return h('div',{},[
                                h('span', {
                                    class: classname,
                                }, texts)
                            ])
                        }
                    },
                    { title: '反馈信息', key: 'desc', align: 'center', width: 120, render: (h, params) => {
                            return h('div',
                            {class: 'action-group'},
                            [
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.triggerQuotaModal(params)
                                        }
                                    }
                                }, '提升配额')
                            ]);
                        }
                    },
                ],
                recordData: [],
                record: {
                    page: 1,
                    rows: 10,
                    total: 0,
                    loading: false,
                    state: 'loading',
                    loadTips: '努力加载中，请稍等...'
                },
                isOpenQuotaModal: false,
                createQuotaForm: {
                    username: '',
                    phone: '',
                    desc: '',
                    keyId: '',
                    serviceId: '',
                    newLimitDiao: '',
                    newLimitBing: '',
                    concurrencyMax: '',
                    dailyTotalCnt: '',
                    loading: false,
                    limitBingList: [],
                    limitDiaoList: []
                },
                ruleCreateQuota: {
                    username: [
                        { required: true,  message: "请填写您的姓名", trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: "请填写联系方式", trigger: 'blur' },
                        { pattern: /^((1[3-8][0-9])+\d{8})$/, message: '请填写正确的手机号码' }
                    ],
                    newLimitDiao: [
                        { required: true, message: "请填写调用量上限", trigger: 'blur' }
                    ],
                    newLimitBing: [
                        { required: true, message: "请填写并发量上限", trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            triggerQuotaModal(params) {
                this.isOpenQuotaModal = true;
                this.createQuotaForm.keyId = params.row.keyId
                this.createQuotaForm.serviceId = params.row.serviceId
                this.createQuotaForm.concurrencyMax = params.row.price
                this.createQuotaForm.dailyTotalCnt = params.row.upPrice
            },
            closeQuotaFormModal(name){
                this.$refs[name].resetFields();
                this.isOpenQuotaModal = false;
            },
            createQuota(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        self.createQuotaForm.loading = true;
                        let data = {
                            contact: self.createQuotaForm.username,
                            contactTel: self.createQuotaForm.phone,
                            remark: self.createQuotaForm.desc,
                            keyId: self.createQuotaForm.keyId,
                            serviceId: self.createQuotaForm.serviceId,
                            currentLimitBing: self.createQuotaForm.dailyTotalCnt,
                            currentLimitDiao: self.createQuotaForm.concurrencyMax,
                            newLimitBing: self.createQuotaForm.newLimitBing,
                            newLimitDiao: self.createQuotaForm.newLimitDiao
                        }
                        ajaxPostUpQuota(data).then(res => {
                            if(res.state === 0){
                                self.closeQuotaFormModal(name);
                                self.$Message.success(res.message)
                            }else{
                                self.$Message.error(res.message ? res.message : '糟糕，操作失败！')
                            }
                            self.createQuotaForm.loading = false
                        })
                    }
                })
            },
            init(router){
                this.getQuotaType(router)
                const self = this;
                // 日调用量上限 - 列表
                ajaxAppType('daily_total_cnt').then(res => {
                    self.createQuotaForm.limitDiaoList = res.data.dict
                })
                // 并发量上限 - 列表
                ajaxAppType('concurrency_max').then(res => {
                    self.createQuotaForm.limitBingList = res.data.dict
                })
            },
            queryQueryList(value){
                this.Analysis.currentType = value;
                this.getQuotaList()
            },
            changeQueryPage(value){
                this.getQuotaList({ page: value })
            },
            getQuotaList(params){
                const self = this;
                let data = {
                    keyId: this.quotaKeyId,
                    page: this.record.page,
                    rows: this.record.rows,
                }
                data = Object.assign(data, params)
                this.record.loading = true;
                this.record.loadTips = '努力加载中，请稍等...'
                this.record.state = 'loading'
                ajaxPostQuotaList(data).then(res => {
                    if(res.state === 0){
                        let result = res.data;
                        if(result && result.data && result.data.rows.length){
                            self.recordData = tools.getQuotaList(result.data.rows);
                            self.record.total = result.data.total;
                            self.record.loading = false;
                        }else{
                            self.record.state = 'empty';
                            self.record.loadTips = '抱歉，暂无数据！';
                        }
                    }else{
                        self.record.state = 'error';
                        self.record.loadTips = '糟糕，加载失败！';
                    }
                }).catch( reason => {
                    self.record.state = 'error';
                    self.record.loadTips = '糟糕，服务器内部错误';//'错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
            },
            getQuotaType(router){
                const self = this;
                this.Analysis.loading = true;
                this.record.loading = true;
                let data = {
                    code: 'all'
                }
                ajaxPostQuotaType(data).then(res => {
                    if(res.state === 0){
                        let data = res.data.data;
                        if(data && data.length){
                            self.Analysis.typeList = tools.getQuotaType(res.data.data)
                            self.Analysis.currentType = router ? router: self.Analysis.typeList[0].value;
                            self.Analysis.loading = false;
                            self.getQuotaList()
                        }else{
                            self.Analysis.loadTips = '暂无数据'
                            self.record.loadTips = '抱歉，暂无数据！'
                            self.record.state = 'empty'
                        }
                    }else{
                        self.Analysis.loadTips = res.message ? res.message : "糟糕，加载失败..."
                        self.record.loadTips = '糟糕，加载失败！'
                        self.record.state = 'error'
                    }
                }).catch( reason => {
                    self.record.state = 'error';
                    self.Analysis.loadTips = reason.statusText;
                    self.record.loadTips = '糟糕，服务器内部错误！'
                    // self.record.loadTips = '错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
            }
        },
        computed: {
            quotaKeyId(){
                const self = this;
                return tools.getQuotaKeyId(self.Analysis.typeList, self.Analysis.currentType)
            }
        },
        created(){
            const self = this;
            this.init(self.$route.query.keyCode)
        },
        watch: {
            '$route' (to, from) {
                if(to.query){
                    this.init(to.query.keyCode)
                }
            }
        }
    }
</script>