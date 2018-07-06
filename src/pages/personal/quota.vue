<template>
    <div class="full-block-mod">
        <div class="Header clearfix">
            <h2 class="title">高额配管分析管理<strong>您可以在这里查看Web服务Key的每日调用量，还可以申请更高的调用次数。</strong></h2>
        </div>
        <div style="margin-bottom: 22px;">
            <Select size="large" v-model="Analysis.currentType" @on-change="queryQueryList" style="width:420px">
                <Option v-for="item in Analysis.typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </div>
        <Table border :columns="recordColumns" :data="recordData" class="custom-table"></Table>


        <Modal
            v-model="isOpenQuotaModal"
            class-name="custom-modal vertical-center-modal"
            width="482">
            <Icon type="ios-close-empty" slot="close" @click="closeQuotaFormModal('createQuotaForm')"></Icon>
            <h2 class="title" slot="header">提升配额d</h2>
            <Form :model="createQuotaForm" ref="createQuotaForm" :rules="ruleCreateQuota" :label-width="80" class="custom-form">
                <FormItem label="您的姓名" prop="username">
                    <Input v-model="createQuotaForm.username" placeholder="请输入您的姓名"></Input>
                </FormItem>
                <FormItem label="联系方式" prop="phone">
                    <Input v-model="createQuotaForm.phone" placeholder="请输入联系方式"></Input>
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

    export default {
        name: 'personal-record',
        data () {
            return {
                Analysis: {
                    currentType: '',
                    typeList: [],
                    dateType: [
                        { label: '全部申请', value: '0' },
                        { label: '近三个月申请', value: '3' },
                        { label: '近六个月申请', value: '6' },
                        { label: '近一年申请', value: '12' },
                    ]
                },
                recordColumns: [
                    {
                        title: '服务',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '今日调用量',
                        key: 'info',
                        align: 'center',
                        className: 'percent-td',
                        minWidth: 320,
                        render: (h, params) => {
                            return h('div', {
                                class: 'percent-wrapper clearfix'
                            } ,[
                                '',
                                h('div', {
                                    class: 'percent-type'
                                }, '免费'),
                                h('Progress', {
                                    props: {
                                        'stroke-width': 5,
                                        'percent': params.row.percent
                                    },
                                    class: 'percent-line'
                                },''),
                                h('div', {
                                    class: 'percent-info'
                                }, [
                                    params.row.used + '已用',
                                    h('span', {
                                        class: 'highlight'
                                    }, params.row.percent + '%'),
                                ]
                                ),
                            ])
                        }
                    },
                    {
                        title: '调用量上限（次/日）',
                        key: 'price',
                        align: 'center'
                    },
                    {
                        title: '并发量上限（次/秒）',
                        key: 'upPrice',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
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
                    {
                        title: '反馈信息',
                        key: 'desc',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
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
                isOpenQuotaModal: false,
                createQuotaForm: {
                    username: '',
                    phone: '',
                    desc: '',
                    keyId: '',
                    serviceId: '',
                    loading: false
                },
                ruleCreateQuota: {
                    username: [
                        { required: true,  message: "请填写您的姓名", trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: "请填写联系方式", trigger: 'blur' },
                        { pattern: /^((1[3-8][0-9])+\d{8})$/, message: '请填写正确的手机号码' }
                    ]
                }
            }
        },
        methods: {
            triggerQuotaModal(params) {
                this.isOpenQuotaModal = true;
                this.createQuotaForm.keyId = params.row.keyId
                this.createQuotaForm.serviceId = params.row.serviceId
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
                            serviceId: self.createQuotaForm.serviceId
                        }
                        ajaxPostUpQuota(data).then(res => {
                            if(res.state === 0){
                                self.closeQuotaFormModal(name);
                                self.$Message.success(res.message)
                            }else{
                                self.$Message.error(res.message)
                            }
                            self.createQuotaForm.loading = false
                        })
                    }
                })
            },
            init(router){
                this.getQuotaType(router)
            },
            queryQueryList(value){
                this.Analysis.currentType = value;
                this.getQuotaList()
            },
            getQuotaList(){
                const self = this;
                let data = {
                    keyId: self.quotaKeyId
                }
                ajaxPostQuotaList(data).then(res => {
                    if(res.state === 0){
                        self.recordData = tools.getQuotaList(res.data.data.rows);
                    }
                })
            },
            getQuotaType(router){
                const self = this;
                ajaxPostQuotaType().then(res => {
                    if(res.state === 0){
                        self.Analysis.typeList = tools.getQuotaType(res.data.data)
                        self.Analysis.currentType = router ? router: self.Analysis.typeList[0].value;
                    }else{
                        console.error(res.message)
                    }
                }).then(rs => {
                    self.getQuotaList()
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