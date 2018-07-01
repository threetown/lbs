<template>
    <div>
        <div class="full-block-mod">
            <div class="Header clearfix">
                <h2 class="title">我的应用 <strong>您可以在这里创建、设置并管理您的应用及Key</strong></h2>
                <Button class="fr" type="primary" icon="ios-plus-outline" slot="extra" size="large" @click="triggerAppModel">创建新应用</Button>
            </div>
            
            <div class="LoadingBox" style="height: 300px;" v-show="Loading.state">
                <Spin fix>
                    {{Loading.info}}
                </Spin>
            </div>
            <div v-if="!Loading.state">
                <div class="collapse">
                    <div :class="index === curOpen ? 'panel active' : 'panel'" v-for="(item, index) in appServerData">
                        <div class="hd">
                            <Row>
                                <Col span="5" class="title">
                                    <Icon type="ios-list"></Icon>{{item.appName}}
                                </Col>
                                <Col span="5">{{item.createdDt}} 创建</Col>
                                <Col span="12" class="action">
                                    <Icon type="compose" @click="triggerAppModel(item, index, 'edit')"></Icon>
                                    <Icon type="trash-a" @click="triggerDeleteModel(item, index, 'app')"></Icon>
                                    <Button class="btn-blue" type="ghost" @click="triggerCreateQuotaModal(item,'create')">添加新key</Button>
                                </Col>
                                <Col span="2" class="tac arrow"><Icon type="ios-arrow-down" @click="toggleTab(index)"></Icon></Col>
                            </Row>
                        </div>
                        <div class="bd" v-if="index === curOpen ? true : false">
                            <Table border :columns="mapColumns" :data="item.keyInfos" class="custom-table"></Table>
                        </div>
                    </div>
                </div>
                <!-- <div class="custom-Page">
                    <Page :total="Page.total" @on-change="PageChange" show-total></Page>
                </div> -->
            </div>
        </div>

        <Modal
            v-model="isOpenDeleteModal"
            class-name="custom-modal custom-warning-modal vertical-center-modal"
            width="378">
            <h2 class="title" slot="header">删除{{deleteModelData.type === 'key' ? 'Key' : '应用'}}</h2>
            <div class="content">
                <h3>您确定要删除{{deleteModelData.type === 'key' ? 'Key' : '应用'}}吗?</h3>
                <p>{{deleteModelData.type === 'key' ? '该Key删除后将被移至回收站,请您谨慎操作!' : '删除应用会将该应用及其下所有Key移至回收站，请您谨慎操作!'}}</p>
            </div>
            <div slot="footer" >
                <Button type="text" size="large">取消</Button>
                <Button type="primary" size="large" :loading="deleteModelData.loading" @click.prevent="deleteApp">确认</Button>
            </div>
        </Modal> <!-- 删除 -->

        <Modal
            v-model="isOpenCreateAppModal"
            class-name="custom-modal vertical-center-modal"
            width="482">
            <Icon type="ios-close-empty" slot="close" @click="closeCreateAppModal('createAppForm')"></Icon>
            <h2 class="title" slot="header">{{AppModalStatus === 'edit' ? '编辑应用' : '创建应用'}}</h2>
            <Form :model="createAppForm" ref="createAppForm" :rules="ruleCreateApp" :label-width="80" class="custom-form">
                <FormItem label="应用名称" prop="name">
                    <Input v-model="createAppForm.name" placeholder="支持汉字/数字/字母/下划线/中划线，不超过15个 "></Input>
                </FormItem>
                <FormItem label="应用类型" prop="type">
                    <Select v-model="createAppForm.type" placeholder="请选择应用类型">
                        <Option v-for="item in panelAppType" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeCreateAppModal('createAppForm')">取消</Button>
                <Button type="primary" size="large" :loading="createAppForm.loading" @click.prevent="submitApp('createAppForm')">提交</Button>
            </div>
        </Modal> <!-- 创建应用 -->

        <Modal
            v-model="isOpenQuotaModal"
            class-name="custom-modal vertical-center-modal"
            width="482">
            <Icon type="ios-close-empty" slot="close" @click="closeQuotaFormModal('createQuotaForm')"></Icon>
            <h2 class="title" slot="header">查看配额</h2>
            <Form :model="createQuotaForm" ref="createQuotaForm" :rules="ruleCreateQuota" :label-width="80" class="custom-form">
                <FormItem label="key信息" prop="key">
                    <Input v-model="createQuotaForm.key" disabled></Input>
                </FormItem>
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
                <Button type="primary" size="large" @click.prevent="createQuota('createQuotaForm')">提交</Button>
            </div>
        </Modal> <!-- 提升配额 -->

        <Modal
            v-model="isCreateKeyModal"
            class-name="custom-modal vertical-center-modal"
            width="772">
            <Icon type="ios-close-empty" slot="close" @click="closeKeyFormModal('createKeyForm')"></Icon>
            <h2 class="title" slot="header">{{ editKeyModalStatus === 'edit' ? '编辑' : '创建新' }}Key</h2>
            <Form :model="createKeyForm" ref="createKeyForm" :rules="ruleCreateKey" :label-width="95" class="custom-form">
                <FormItem label="key名称" prop="name" class="hasTooltip">
                    <Input v-model="createKeyForm.name"></Input>
                    <Tooltip placement="bottom-end" class="whiteTooltip">
                        <Icon type="ios-help-outline"></Icon>
                        <div slot="content">
                            <p>规范命名会让数据统计和数据分析更准确</p>
                            <p>建议命名方式: <span class="t-blue">[应用名 + 应用场景]</span></p>
                        </div>
                    </Tooltip>
                </FormItem>
                <FormItem label="服务平台" prop="type">
                    <RadioGroup v-model="createKeyForm.type">
                        <Radio :label="item.code" v-for="item in panelServiceType" :disabled="(editKeyModalStatus === 'edit') ? true : false" >{{item.name}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="可使用服务">
                    <ul class="panelServiceList">
                        <li v-for="item in panelServiceItems"><a :href="item.url" target="_blank">{{item.serviceName}}</a></li>
                    </ul>
                </FormItem>
                <FormItem label="ID白名单" prop="desc" class="hasTooltip">
                    <Input v-model="createKeyForm.desc" type="textarea" placeholder="非必填，留空表示无IP限制
添加IP白名单后，只有白名单中的IP可访问服务
IP应该设定为服务器出口IP，支持设定IP段，如:202.202.2.*，多个IP请每行填写一条"></Input>
                    <Tooltip content="为什么要设置IP白名单，应该设置哪个IP？" placement="bottom-end" class="whiteTooltip">
                        <Icon type="ios-help-outline"></Icon>
                    </Tooltip>
                </FormItem>
                <FormItem prop="isRead">
                    <Checkbox v-model="createKeyForm.isRead" style="font-size: 14px;">
                        阅读并同意 <a href="" target="_blank">国信达服务条款及隐私权政策</a>、<a href="" target="_blank">Web服务API使用条款</a> 和 <a href="" target="_blank">国信达地图API服务条款</a>
                    </Checkbox>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="closeKeyFormModal('createKeyForm')">取消</Button>
                <Button type="primary" size="large" :loading="createKeyForm.loading" :disabled="!createKeyForm.isRead ? true : false" @click.prevent="createKey('createKeyForm')">提交</Button>
            </div>
        </Modal> <!-- 创建新Key -->
    </div>
</template>

<script>
    import * as basicConfig from 'src/config/basicConfig'
    import * as tools from 'src/util/tools'

    import { ajaxPostApp, ajaxCreateApp, ajaxAppType, ajaxUpdateApp, ajaxServiceType, ajaxCreateKey, ajaxUpdateKey, getPostApp } from 'src/service/application'

    export default {
        data () {
            return {
                isOpenCreateAppModal: false,
                isOpenDeleteModal: false,
                isOpenQuotaModal: false,
                isCreateKeyModal: false,
                AppModalStatus: '',
                editKeyModalStatus: '',
                curOpen: 0,
                Loading: {
                    state: true,
                    info: '完命加载中，请稍等...'
                },
                mapColumns: [
                    {
                        title: 'Key名称', key: 'keyName', align: 'center'
                    },
                    {
                        title: 'Key', key: 'keyCode', align: 'center'
                    },
                    {
                        title: '绑定服务', key: 'serviceTypeMajorName', align: 'center'
                    },
                    {
                        title: '操作', key: 'action', align: 'center', width: 200,
                        render: (h, params) => {
                            return h('div',
                            {class: 'action-group'},
                            [
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.triggerCreateQuotaModal(params, 'edit')
                                        }
                                    }
                                }, '编辑'),
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.triggerDeleteModel(params, params.index, 'key')
                                        }
                                    }
                                }, '删除'),
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.createItem(params)
                                        }
                                    }
                                }, '提升配额')
                            ]);
                        }
                    }
                ],
                appServerData: [],
                createAppForm: {
                    name: '',
                    type: '',
                    loading: false
                },
                ruleCreateApp: {
                    name: [
                        { required: true, type: 'string', max: 15, message: "支持汉字/数字/字母/下划线/中划线，不超过15个", trigger: 'blur' },
                    ],
                    type: [
                        { required: true, message: "请选择应用类型", trigger: 'blur' }
                    ]
                },
                createQuotaForm: {
                    key: '',
                    username: '',
                    phone: '',
                    desc: ''
                },
                ruleCreateQuota: {
                    username: [
                        { required: true,  message: "请填写您的姓名", trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: "请填写联系方式", trigger: 'blur' }
                    ]
                },
                createKeyForm: {
                    name: '',
                    type: '',
                    desc: '',
                    keyId: '',
                    isRead: false,
                    loading: false
                },
                ruleCreateKey: {
                    name: [
                        { required: true, message: "请输入key名称", trigger: 'blur' },
                        { max: 15, message:"最多填入15个字符", trigger: 'blur' },
                        { pattern:/^[\u4e00-\u9fa5a-zA-Z0-9-_\s]+$/, message:"Key名称只能使用字母、汉字、数字、下划线、中划线", trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: "请选择服务平台", trigger: 'change' }
                    ]
                },
                deleteModelData: {
                    appId: '',
                    type: '',
                    keyId: '',
                    loading: false
                },
                serviceTypeResource: [],
                panelAppType: [],
                Page: {
                    total: 0,
                    current: 1,
                    size: 10
                }
            }
        },
        methods: {
            deleteApp(){
                const self = this;
                let params = {
                    "statusCd": 2,
                    "appId": this.deleteModelData.appId
                }
                self.deleteModelData.loading = true;
                if(this.deleteModelData.type === 'key'){
                    let data = Object.assign(params, { "keyId": self.deleteModelData.keyId })
                    ajaxUpdateKey(data).then(res => {
                        if(res.state === 0){
                            self.getAppServerList();
                            self.isOpenDeleteModal = false;
                            self.$Message.success(res.message)
                        }else{
                            self.$Message.error(res.message)
                        }
                        self.deleteModelData.loading = false;
                    })
                }else{
                    ajaxUpdateApp(params).then(res => {
                        if(res.state === 0){
                            self.getAppServerList();
                            self.isOpenDeleteModal = false;
                            self.$Message.success(res.message)
                        }else{
                            self.$Message.error(res.message)
                        }
                        self.deleteModelData.loading = false;
                    })
                }
            },
            submitApp(name){ // 提交-编辑/创建应用
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        let params = {
                            "appType": self.createAppForm.type,
                            "appName": self.createAppForm.name,
                        }
                        self.createAppForm.loading = true;
                        if(self.AppModalStatus === 'edit'){
                            // 编辑应用
                            Object.assign(params,{"appId": self.createAppForm.id})
                            ajaxUpdateApp(params).then(res => {
                                if(res.state === 0){
                                    self.getAppServerList();
                                    self.closeCreateAppModal(name);
                                    self.$Message.success(res.message);
                                }else{
                                    self.$Message.error(res.message)
                                }
                            })
                        }else{
                            // 创建新应用
                            ajaxCreateApp(params).then(res => {
                                if(res.state === 0){
                                    self.getAppServerList();
                                    self.closeCreateAppModal(name);
                                    self.$Message.success(res.message);
                                }else{
                                    self.$Message.error(res.message);
                                }
                                self.createAppForm.loading = false;
                            })
                        }
                    }
                })
            },
            triggerAppModel(params, index, type){ // 新建/编辑应用
                if(type === 'edit'){
                    this.createAppForm.name = params.appName;
                    this.createAppForm.type = params.appType;
                    this.createAppForm.id = params.appId;
                }else{
                    this.createAppForm.id = '';
                }
                this.AppModalStatus = type;
                this.isOpenCreateAppModal = true;
            },
            closeCreateAppModal(name){
                this.$refs[name].resetFields();
                this.isOpenCreateAppModal = false;
            },
            triggerDeleteModel(params, index, type){
                if(type === 'app'){
                    this.deleteModelData.appId = params.appId;
                }else if(type === 'key'){
                    this.deleteModelData.appId = params.row.appId;
                    this.deleteModelData.keyId = params.row.keyId;
                }
                this.deleteModelData.type = type;
                this.isOpenDeleteModal = true;
            },
            createItem(params){ // 提升配额
                this.createQuotaForm.key = params.row.name;
                this.isOpenQuotaModal = true;
            },
            closeQuotaFormModal(name){
                this.$refs[name].resetFields();
                this.isOpenQuotaModal = false;
            },
            triggerCreateQuotaModal(params, type){
                console.log(params, 339)
                const self = this;
                if(type === 'edit'){
                    this.createKeyForm.appId = params.row.appId;
                    this.createKeyForm.name = params.row.keyName;
                    this.createKeyForm.desc = params.row.whitelist;
                    this.createKeyForm.keyId = params.row.keyId;

                    this.createKeyForm.type = params.row.serviceTypeMajor; // 只用来高亮显示 服务平台
                }else if(type === 'create'){
                    this.createKeyForm.appId = params.appId;
                    this.createKeyForm.type = self.serviceTypeResource[0].code; // 初始化高亮显示 默认取第一个
                }
                
                this.editKeyModalStatus = type;
                this.isCreateKeyModal = true;
            },
            createQuota(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        // TODO，提升配额
                        self.$Message.success('操作成功！');
                        self.closeQuotaFormModal(name);
                    }
                })
            },
            closeKeyFormModal(name){
                this.$refs[name].resetFields();
                this.isCreateKeyModal = false;
            },
            createKey(name){ // 新建/编辑 key
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        self.createKeyForm.loading = true;
                        let params = {
                            "appId": self.createKeyForm.appId,
                            "keyName": self.createKeyForm.name,
                            "whitelist": self.createKeyForm.desc
                        }
                        if(self.editKeyModalStatus === 'edit'){
                            let data = Object.assign(params, { "keyId": self.createKeyForm.keyId })
                            ajaxUpdateKey(data).then(res => {
                                if(res.state === 0){
                                    self.getAppServerList();
                                    self.closeKeyFormModal(name);
                                    self.$Message.success(res.message);
                                }else{
                                    self.$Message.error(res.message)
                                }
                                self.createKeyForm.loading = false;
                            })
                        }else if(self.editKeyModalStatus === 'create'){
                            let data =  Object.assign(params, {
                                "code": self.createKeyForm.type
                            })
                            ajaxCreateKey(data).then(res => {
                                if(res.state === 0){
                                    self.getAppServerList();
                                    self.closeKeyFormModal(name);
                                    self.$Message.success(res.message);
                                }else{
                                     self.$Message.error(res.message);
                                }
                                self.createKeyForm.loading = false;
                            })
                        }
                    }
                })
            },
            toggleTab(index){
                this.curOpen = this.curOpen === index ? '' : index;
            },
            getAppServerList(){
                const self = this;
                let data = {
                    "page": this.Page.current, // 当前页码
                    "rows": this.Page.size, // 每页记录数
                    "statusCd": 1
                }
                ajaxPostApp(data).then(res => {
                    if(res.state === 0){
                        let resource = res.data;
                        self.appServerData = resource.appKeyInfo;
                        self.Page.total = res.page;
                        self.Loading.state = false;
                    }else{
                        self.Loading.info = res.message;
                    }
                })
            },
            PageChange(page){
                this.Page.current = page;
            }
        },
        computed: {
            panelServiceType(){
                const self = this;
                return tools.getRootData(self.serviceTypeResource)
            },
            panelServiceItems() {
                const self = this;
                return tools.getChildrenData(self.serviceTypeResource, self.createKeyForm.type)
            }
        },
        created(){
            const self = this;
            const params = {
                type: 'appType',
                app: {
                    "statusCd": 1
                }
            }
            // 调用 应用列表接口、应用类型 和服务平台接口
            Promise.all([self.getAppServerList(), ajaxAppType(params.type), ajaxServiceType()]).then(res => {

                if(res[1].state === 0){
                    self.panelAppType = res[1].data.dict;
                }

                if(res[2].state === 0){
                    let result = res[2].data.serviceInfo;
                    self.serviceTypeResource = result;
                    // 初始化 createKeyForm.type
                    self.createKeyForm.type = result[0].code;
                }
            })
        }
    }
</script>

<style lang="less" scoped>
    .panelServiceList{
        overflow: hidden;
        li{
            width: 33.33%;
            height: 32px;
            line-height: 32px;
            float: left;
            padding-right: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            a{
                font-size: 14px;
                color: #008AFF;
            }
        }
    }
    .collapse{
        border-bottom: 1px solid #E5E5E5;
        .panel{
            .hd{
                height: 58px;
                padding: 12px 0;
                border-top: 1px solid #E5E5E5;
                font-size: 14px;
                line-height: 32px;
                color: #666;
                &:hover{
                    .action{
                        i{
                            display: inline-block;
                        }
                    }
                }
                .title{
                    font-size: 16px;
                    color: #008AFF;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    i{
                        font-size: 22px;
                        vertical-align: middle;
                        margin-right: 5px;
                    }
                }
                .action{
                    text-align: right;
                    i{
                        font-size: 22px;
                        color: #666;
                        vertical-align: middle;
                        margin: 0 4px;
                        display: none;
                        cursor: pointer;
                    }
                    .btn-blue{
                        color: #008AFF;
                        font-size: 14px;
                        height: 32px;
                        border: 1px solid #008AFF;
                        background-color: #fff;
                        margin-left: 20px;
                    }
                }
                .arrow{
                    i{
                        cursor: pointer;
                        width: 20px;
                        -webkit-transform: rotate(0deg);
                        -ms-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }
                }
            }
            .bd{
                // display: none;
            }
            &.active{
                .arrow{
                    -webkit-transform: rotate(180deg);
                    -ms-transform: rotate(180deg);
                    transform: rotate(180deg);
                }
                .bd{
                    display: block;
                }
            }
        }
    }
</style>