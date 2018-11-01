<template>
    <div class="full-block-mod">
        <div class="Header clearfix">
            <h2 class="title">创建应用<strong>您可以在这里创建您的解决方案应用</strong></h2>
        </div>
        <Row style="margin-bottom: 22px;">
            <Col span="16">&nbsp;</Col>
            <Col span="8">
                <Input size="large"
                    v-model.trim="search.keyword"
                    @on-enter="getList"
                    @on-click="getList"
                    icon="ios-search-strong"
                    placeholder="请输入用户名称或用户帐号"
                    style="width: 280px;float: right;"></Input>
            </Col>
        </Row>
        <div v-if="record.loading" :class="'Placeholder ' + record.state">{{record.loadTips}}</div>
        <Table v-if="!record.loading" border :columns="recordColumns" :data="record.data" class="custom-table"></Table>
        <div class="page-placeholder" v-show="!record.loading">
            <Page :total="record.total"
                :current="record.page"
                :page-size="record.rows"
                @on-change="changeQueryPage"
                show-total
            ></Page>
        </div>

        <Modal
            v-model="isOpenCreateModal"
            class-name="custom-modal vertical-center-modal"
            width="482">
            <Icon type="ios-close-empty" slot="close" @click="closeCreateModal('createAppForm')"></Icon>
            <h2 class="title" slot="header">创建应用</h2>
            <Form :model="createAppForm" ref="createAppForm" :rules="ruleCreateApp" :label-width="80" class="custom-form">
                <FormItem label="应用名称" prop="code">
                    <Select v-model="createAppForm.code" placeholder="请选择应用类型">
                        <Option v-for="item in solutionCode" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="应用类型" prop="type">
                    <Select v-model="createAppForm.type" placeholder="请选择应用类型">
                        <Option v-for="item in panelAppType" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeCreateModal('createAppForm')">取消</Button>
                <Button type="primary" size="large" :loading="createAppForm.loading" @click.prevent="submitApp('createAppForm')">提交</Button>
            </div>
        </Modal> <!-- 创建应用 -->
    </div>
</template>

<script>
    import { ajaxUserList, ajaxInserApp } from 'src/service/solution';
    import { ajaxAppType } from 'src/service/application'
    import * as tools from 'src/util/tools'

    export default {
        name: 'personal-record',
        data () {
            return {
                isOpenCreateModal: false,
                createAppForm: {
                    staffId: '',
                    type: '',
                    name: '',
                    loading: false
                },
                ruleCreateApp: {
                    code: [
                        { required: true, message: "请选择应用名称", trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: "请选择应用类型", trigger: 'change' }
                    ]
                },
                panelAppType: [],
                solutionCode: [],
                search: {
                    keyword: ''
                },
                recordColumns: [
                    { title: '用户名称', key: 'staffName', align: 'center' },
                    { title: '用户账号', key: 'loginName', align: 'center' },
                    { title: '电话', key: 'telephone', align: 'center'},
                    { title: '创建时间', key: 'createdDt', align: 'center'},
                    {
                        title: '操作', key: 'action', align: 'center', render: (h, params) => {
                            return h('div', {class: 'action-group'},
                            [
                                h('span', {
                                    class: 'items', on: {
                                        click: () => {
                                            this.triggerCreateModal(params)
                                        }
                                    }
                                }, '创建应用')
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
                }
            }
        },
        methods: {
            triggerCreateModal(params){
                this.createAppForm.staffId = params.row.staffId;
                this.isOpenCreateModal = true;
            },
            closeCreateModal(name){
                this.$refs[name].resetFields();
                this.isOpenCreateModal = false;
            },
            submitApp(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        let data = {
                            appName: self.currentAppName,
                            solutionCode: self.createAppForm.code,
                            staffId: self.createAppForm.staffId,
                            appType: self.createAppForm.type
                        }
                        self.createAppForm.loading = true;
                        ajaxInserApp(data).then(res => {
                            if(res.state === 0){
                                self.closeCreateModal(name);
                                self.$Message.success(res.message)
                            }else{
                                self.$Message.error(res.message)
                            }
                            self.createAppForm.loading = false;
                        })
                    }
                })
            },
            changeQueryPage(v){
                this.getList({ page: v})
            },
            getList(params){
                const self = this;
                let data = {
                    page: this.record.page,
                    rows: this.record.rows,
                }
                data = Object.assign(data, params)
                if(this.search.keyword){
                    data = Object.assign(data, {loginName: self.search.keyword})
                }
                this.record.loading = true;
                this.record.loadTips = '努力加载中，请稍等...'
                this.record.state = 'loading';
                ajaxUserList(data).then(res => {
                    if(res.status === 0){
                        if(res.data && res.data.length){
                            self.record.data = res.data;
                            self.record.total = res.total;
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
            getAppTypeList(){
                const self = this;
                ajaxAppType('appType').then(res => {
                    self.panelAppType = res.data.dict;
                })
                ajaxAppType('solution_code').then(res => {
                    self.solutionCode = res.data.dict;
                })
            },
            init(){
                this.getList()
                this.getAppTypeList()
            }
        },
        computed: {
            currentAppName(){
                const self = this;
                let result = '';
                if(this.createAppForm.code){
                    result = this.solutionCode.find((v, i) => { return v.code === self.createAppForm.code }).name
                }
                return result;
            }
        },
        created(){
            this.init()
        }
    }
</script>