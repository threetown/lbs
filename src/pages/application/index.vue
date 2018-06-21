<template>
    <div>
        <div class="full-block-mod">
            <div class="Header clearfix">
                <h2 class="title">我的应用 <strong>您可以在这里创建、设置并管理您的应用及Key</strong></h2>
                <Button class="fr" type="primary" icon="ios-plus-outline" slot="extra" size="large" @click="triggerAppModel">创建新应用</Button>
            </div>
            
            <div class="collapse">
                <div :class="index === curOpen ? 'panel active' : 'panel'" v-for="(item, index) in appServerData">
                    <div class="hd">
                        <Row>
                            <Col span="4" class="title">
                                <Icon type="ios-list"></Icon>{{item.name}}
                            </Col>
                            <Col span="4">{{item.createTime}}创建</Col>
                            <Col span="14" class="action">
                                <Icon type="compose" @click="triggerAppModel(item, index, 'edit')"></Icon>
                                <Icon type="trash-a" @click="deleteItem"></Icon>
                                <Button class="btn-blue" type="ghost" @click="createQuotaModal">添加新key</Button>
                            </Col>
                            <Col span="2" class="tac arrow"><Icon type="ios-arrow-down" @click="toggleTab(index)"></Icon></Col>
                        </Row>
                    </div>
                    <div class="bd">
                        <Table border :columns="mapColumns" :data="item.children" class="appTable"></Table>
                    </div>
                </div>
            </div>
        </div>

        <Modal
            v-model="isOpenDeleteModal"
            class-name="custom-modal custom-warning-modal vertical-center-modal"
            ok-text="确认"
            @on-ok="deleteApp"
            width="378">
            <h2 class="title" slot="header">删除应用</h2>
            <div class="content">
                <h3>您确定要删除应用吗?</h3>
                <p>删除应用会将该应用及其下所有Key移至回收站，请您谨慎操作!</p>
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
                    <Input v-model="createAppForm.name" :placeholder="createAppForm.placeholder.name"></Input>
                </FormItem>
                <FormItem label="应用类型" prop="type">
                    <Select v-model="createAppForm.type" :placeholder="createAppForm.placeholder.type">
                        <Option v-for="item in panelServiceType" :value="item.type">{{ item.name }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeCreateAppModal('createAppForm')">取消</Button>
                <Button type="primary" size="large" @click.prevent="createApp('createAppForm')">提交</Button>
            </div>
        </Modal> <!-- 创建应用 -->

        <Modal
            v-model="isOpenQuotaModal"
            class-name="custom-modal vertical-center-modal"
            width="482">
            <Icon type="ios-close-empty" slot="close" @click="closeQuotaFormModal('createQuotaForm')"></Icon>
            <h2 class="title" slot="header">提升配额</h2>
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
            <h2 class="title" slot="header">创建新Key</h2>
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
                        <Radio :label="item.type" v-for="item in panelServiceType">{{item.name}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="可使用服务">
                    <ul class="panelServiceList">
                        <li v-for="item in panelServiceItems"><a :href="item.url" target="_blank">{{item.name}}</a></li>
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
                <Button type="primary" size="large" @click.prevent="createKey('createKeyForm')">提交</Button>
            </div>
        </Modal> <!-- 创建新Key -->
    </div>
</template>

<script>
    import * as basicConfig from 'src/config/basicConfig'
    import * as tools from 'src/util/tools'

    export default {
        data () {
            return {
                isOpenCreateAppModal: false,
                isOpenDeleteModal: false,
                isOpenQuotaModal: false,
                isCreateKeyModal: false,
                AppModalStatus: '',
                curOpen: 0,
                mapColumns: [
                    {
                        title: 'Key名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: 'Key',
                        key: 'key',
                        align: 'center'
                    },
                    {
                        title: '绑定服务',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            return h('div',
                            {class: 'action-group'},
                            [
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.editItem(params)
                                        }
                                    }
                                }, '编辑'),
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.deleteItem(params)
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
                appServerData: [
                    {
                        "id": "501672",
                        "name": "智慧选址",
                        "createTime": "2018-06-21",
                        "industryId": 24,
                        "children": [
                            {
                                "key": "3839dc8c17483f15990d9cc6e8cf7de6",
                                "name": "一个神奇的Key",
                                "bind": "Web\u670d\u52a1",
                                "type": "1"
                            },
                            {
                                "key": "7d8e65345cba571902266131db2f8b03",
                                "name": "两个神奇的Key",
                                "bind": "Android\u5e73\u53f0",
                                "type": "31"
                            }
                        ]
                    },
                    {
                        "id": "501670",
                        "name": "智慧楼盘",
                        "createTime": "2018-06-21",
                        "industryId": 25,
                        "children": []
                    }
                ],
                createAppForm: {
                    name: '',
                    type: '',
                    placeholder: {
                        name: "支持汉字/数字/字母/下划线/中划线，不超过15个",
                        type: "请选择应用类型"
                    }
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
                    type: 'web',
                    desc: '',
                    isRead: true
                },
                ruleCreateKey: {
                    name: [
                        { required: true, message: "请输入key名称", trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: "请选择服务平台", trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            deleteApp(){
                // TODO
                this.$Message.success('操作成功');
                this.isOpenDeleteModal = false;
            },
            createApp(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        // TODO，创建新应用
                        self.$Message.success('操作成功！');
                        self.closeCreateAppModal(name);
                    }
                })
            },
            triggerAppModel(params, type){ // 新建/编辑应用
                if(type === 'edit'){
                    this.AppModalStatus = type;
                }
                this.isOpenCreateAppModal = true;
            },
            closeCreateAppModal(name){
                this.$refs[name].resetFields();
                this.isOpenCreateAppModal = false;
            },
            editItem(params){
                console.log(params)
            },
            deleteItem(row){
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
            createQuotaModal(){
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
            createKey(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        // TODO，创建新Key
                        self.$Message.success('操作成功！');
                        self.closeKeyFormModal(name);
                    }
                })
            },
            toggleTab(index){
                this.curOpen = this.curOpen === index ? '' : index;
            }
        },
        computed: {
            panelServiceType(){
                return tools.getRootData(basicConfig.PanelService)
            },
            panelServiceItems() {
                const self = this;
                return tools.getChildrenData(basicConfig.PanelService, self.createKeyForm.type)
            }
        }
    }
</script>

<style lang="less">
    .fr{float: right;}
    .tar{text-align: right;}
    .tac{
        text-align: center;
    }
    .full-block-mod{
        padding: 30px;
        background-color: #fff;
    }
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
    .Header{
        margin-bottom: 25px;
        .title{
            font-weight: normal;
            color: #333;
            font-size: 18px;
            line-height: 24px;
            float: left;
            strong{
                font-weight: normal;
                font-size: 14px;
                color: #999;
                display: block;
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
                        -webkit-transform: rotate(0deg);
                        -ms-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }
                }
            }
            .bd{
                display: none;
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
    .appTable{
        .ivu-table{
            font-size: 14px;
        }        
        .action-group{
            font-size: 14px;
            .items{
                color: #008AFF;
                margin: 0 6px;
                cursor: pointer;
            }
        }
    }
</style>