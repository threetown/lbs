<template>
    <div>
        <div class="full-block-mod">
            <div class="Header clearfix">
                <h2 class="title">我的应用 <strong>您可以在这里创建、设置并管理您的应用及Key</strong></h2>
                <Button class="fr" type="primary" icon="ios-plus-outline" slot="extra" size="large" @click="triggerAppModel">创建新应用</Button>
            </div>--{{RenewalForm.endDate}}

            <div v-if="Loading.state" :class="'Placeholder ' + Loading.class">{{Loading.info}}</div>
            <div v-if="!Loading.state">
                <div class="collapse">
                    <div :class="index === curOpen ? 'panel active' : 'panel'" v-for="(item, index) in appServerData">
                        <div class="hd">
                            <Row>
                                <Col span="5" class="title">
                                    <i class="iconfont icon-app"></i>{{item.appName}}
                                </Col>
                                <Col span="5">{{item.createdDt}} 创建</Col>
                                <Col span="12" class="action">
                                    <Icon type="compose" @click="triggerAppModel(item, 'edit')"></Icon>
                                    <Icon type="trash-a" @click="triggerDeleteModel(item, index, 'app')"></Icon>
                                    <Button class="btn-blue" type="ghost" @click="triggerCreateQuotaModal(item,'create')">添加新key</Button>
                                </Col>
                                <Col span="2" class="tac arrow"><Icon type="ios-arrow-down" @click="toggleTab(index)"></Icon></Col>
                            </Row>
                        </div>
                        <div class="bd" v-if="index === curOpen ? true : false">
                            <Table border :columns="mapColumns" :data="item.keyInfos ? item.keyInfos : []" class="custom-table"></Table>
                        </div>
                    </div>
                </div>
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
                <Button type="text" size="large" @click="isOpenDeleteModal = !isOpenDeleteModal">取消</Button>
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
            v-model="url.isOpen"
            class-name="custom-modal vertical-center-modal"
            width="782">
            <Icon type="ios-close-empty" slot="close"></Icon>
            <h2 class="title" slot="header">服务地址</h2>

            <div v-if="url.loading" :class="'Placeholder ' + url.state">{{url.loadTips}}</div>
            <Table v-if="!url.loading" border :columns="url.columns" :data="url.data"></Table>

            <div slot="footer"></div>
        </Modal> <!-- 新增服务 - 地图服务 -->

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
                        <Radio :label="item.code" v-for="item in panelServiceType" :key="item.code" :disabled="(editKeyModalStatus === 'edit') ? true : false" >{{item.name}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="可使用服务" prop="serviceNames">
                    <CheckboxGroup v-model="createKeyForm.serviceNames">
                        <Checkbox v-for="item in panelServiceItems" :label="item.serviceName" :key="item.serviceId"></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="IP白名单" prop="desc" class="hasTooltip">
                    <Input v-model="createKeyForm.desc" type="textarea" placeholder="非必填，留空表示无IP限制
添加IP白名单后，只有白名单中的IP可访问服务
IP格式，如: 202.198.16.3,202.202.2.0 。填写多个IP地址，请用英文半角逗号分隔"></Input>
                    <Tooltip content="为什么要设置IP白名单，应该设置哪个IP？" placement="bottom-end" class="whiteTooltip">
                        <Icon type="ios-help-outline"></Icon>
                    </Tooltip>
                </FormItem>
                <FormItem prop="isRead">
                    <Checkbox v-model="createKeyForm.isRead" style="font-size: 14px;">
                        阅读并同意 <a href="javascript:;" target="_blank">国信达服务条款及隐私权政策</a>、<a href="javascript:;" target="_blank">Web服务API使用条款</a> 和 <a href="javascript:;" target="_blank">国信达地图API服务条款</a>
                    </Checkbox>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="closeKeyFormModal('createKeyForm')">取消</Button>
                <Button type="primary" size="large" :loading="createKeyForm.loading" :disabled="!createKeyForm.isRead ? true : false" @click.prevent="createKey('createKeyForm')">提交</Button>
            </div>
        </Modal> <!-- 创建新Key -->

        <Modal
            v-model="Count.isOpen"
            class-name="custom-modal vertical-center-modal"
            width="912">
            <Icon type="ios-close-empty" slot="close" @click="closeCountModal('CountForm')"></Icon>
            <h2 class="title" slot="header">{{Count.title}} ● 调用量统计</h2>

            <Row>
                <Col span="12">
                    <Select v-model="Count.type" @on-change="selectCount" size="large" style="width:160px;">
                        <Option v-for="item in selectTimeDict" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="12">
                    <Select v-model="Count.serviceId" @on-change="selectCountServiceId" size="large" style="width:160px;float: right;">
                        <Option v-for="item in Count.ServiceInfos" :value="item.serviceId" :key="item.serviceId">{{ item.serviceName }}</Option>
                    </Select>
                </Col>
            </Row>

            <div v-if="Count.loading" :class="'Placeholder ' + Count.state">{{Count.loadTips}}</div>
            <leon-line-echart v-if="!Count.loading" :id="Count.echarts.id" :option="Count.echarts.option" :style="Count.echarts.style"></leon-line-echart>

            <div slot="footer"></div>
        </Modal> <!-- 调用量统计 -->

        <Modal
            v-model="isOpenRenewal"
            class-name="custom-modal vertical-center-modal"
            width="482">
            <Icon type="ios-close-empty" slot="close" @click="closeRenewalModal('RenewalForm')"></Icon>
            <h2 class="title" slot="header">续期</h2>

            <Form :model="RenewalForm" ref="RenewalForm" :rules="RenewalForm.rules" :label-width="100" class="custom-form">
                <FormItem label="您的姓名" prop="username">
                    <Input v-model="RenewalForm.username" placeholder="请输入您的姓名"></Input>
                </FormItem>
                <FormItem label="联系方式" prop="phone">
                    <Input v-model="RenewalForm.phone" placeholder="请输入联系方式"></Input>
                </FormItem>
                <FormItem label="到期时间" prop="mouth" class="hasUnit">
                    <DatePicker v-model="RenewalForm.mouth" type="datetime" :options="RenewalRange" @on-change="RenewalRangeChange" placeholder="到期时间"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeRenewalModal('RenewalForm')">取消</Button>
                <Button type="primary" size="large" :loading="RenewalForm.loading" @click.prevent="handlerRenewal('RenewalForm')">提交</Button>
            </div>
        </Modal> <!-- 续期 -->
    </div>
</template>

<script>
    import * as tools from 'src/util/tools'

    import { ajaxPostApp, ajaxCreateApp, ajaxAppType, ajaxUpdateApp, ajaxServiceType, ajaxCreateKey, ajaxUpdateKey, ajaxUrl, ajaxRenewal } from 'src/service/application'
    import { ajaxRequestCount } from 'src/service/sys'

    import * as method from 'src/util/sys/'
    
    import { selectTimeDict } from "src/config/basicConfig"
    import leonLineEchart from "components/echarts/leon-line-chart"

    export default {
        components: {
            leonLineEchart
        },
        data () {
            const validateIps = (rule, value, callback) => {
                if (value !== '') {
                    const ipsRe =  /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(\,)?)+$/
                    if(!ipsRe.test(value)){
                        callback(new Error('IP地址格式不正确！'));
                    }
                }
                callback();
            }
            return {
                isOpenCreateAppModal: false,
                isOpenDeleteModal: false,
                isCreateKeyModal: false,
                AppModalStatus: '',
                editKeyModalStatus: '',
                curOpen: 0,
                url: {
                    isOpen: false,
                    loading: false,
                    loadTips: '',
                    state: 'loading',
                    columns: [
                        { title: '服务名称', key: 'serviceName', width: 160 },
                        { title: '服务地址', key: 'serviceUrl' }
                    ],
                    data: []
                },
                Loading: {
                    state: false,
                    class: 'loading',
                    info: '努力加载中，请稍等...'
                },
                mapColumns: [
                    {
                        title: 'Key名称', key: 'keyName', align: 'center'
                    },
                    {
                        title: 'Key', key: 'keyCode', align: 'center', width: 290
                    },
                    {
                        title: '绑定服务', key: 'serviceTypeMajorName', align: 'center', width: 180
                    },
                    {
                        title: '到期时间', key: 'endDt', align: 'center', width: 116
                    },
                    {
                        title: '操作', key: 'action', align: 'center', width: 290,
                        render: (h, params) => {
                            let texts = params.row.serviceTypeMajor == 1 ? '接口统计' : '调用量统计';
                            return h('div',
                            {class: 'action-group'},
                            [
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.triggerViewUrlModal(params)
                                        }
                                    }
                                }, 'URL'),
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.triggerCreateQuotaModal(params, 'edit')
                                        }
                                    }
                                }, '编辑'),
                                // h('span', {
                                //     class: 'items',
                                //     on: {
                                //         click: () => {
                                //             this.triggerRenewalModel(params.row)
                                //         }
                                //     }
                                // }, '续期'),
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
                                            let argu = { keyCode: params.row.keyCode };
                                            this.$router.push({
                                                name: 'quota',
                                                query: argu
                                            });
                                        }
                                    }
                                }, '配额'),
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.handlerCount(params)
                                        }
                                    }
                                }, texts)
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
                createKeyForm: {
                    name: '',
                    type: '',
                    desc: '',
                    keyId: '',
                    serviceNames: [],
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
                    ],
                    serviceNames: [
                        { required: true, type: 'array', min: 1, message: '请至少选择一项服务', trigger: 'change' }
                    ],
                    desc: [
                        { validator: validateIps, trigger: 'blur' }
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
                Count: {
                    type: 'todayOfHours',
                    title: '',
                    keyCode: '',
                    serviceId: '',
                    ServiceInfos: [],
                    isOpen: false,
                    loading: false,
                    loadTips: '努力加载中，请稍等...',
                    state: 'loading',
                    echarts: {
                        id: 'count-echarts',
                        style: {
                            width: '852px',
                            height: '381px'
                        },
                        option: {}
                    }
                },
                selectTimeDict,
                isOpenRenewal: false,
                RenewalForm: {
                    rules: {
                        username: [
                            { required: true,  message: "请填写您的姓名", trigger: 'blur' },
                        ],
                        phone: [
                            { required: true, message: "请填写联系方式", trigger: 'blur' },
                            { pattern: /^((1[3-8][0-9])+\d{8})$/, message: '请填写正确的手机号码' }
                        ],
                        mouth: [
                            { required: true, message: "请填写到期时间", trigger: 'change' }
                        ]
                    },
                    keyId: '',
                    username: '',
                    phone: '',
                    mouth: '',
                    endDate: '',
                    loading: false
                },
                RenewalRange: {}
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
                                self.createAppForm.loading = false;
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
            triggerAppModel(params, type){ // 新建/编辑应用
                if(type === 'edit'){
                    this.createAppForm.name = params.appName;
                    this.createAppForm.type = params.appType.toString(); // number转string
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
            triggerCreateQuotaModal(params, type){
                const self = this;
                if(type === 'edit'){
                    let data = params.row;
                    this.createKeyForm.appId = data.appId;
                    this.createKeyForm.name = data.keyName;
                    this.createKeyForm.desc = data.whitelist;
                    this.createKeyForm.keyId = data.keyId;

                    this.createKeyForm.type = data.serviceTypeMajor; // 只用来高亮显示 服务平台
                    // 处理serviceName
                    let stateArr = data.serviceInfos.filter(item => item.state === '1')
                    this.createKeyForm.serviceNames = stateArr.map(item => item.serviceName)
                }else if(type === 'create'){
                    this.createKeyForm.appId = params.appId;
                    this.createKeyForm.type = self.serviceTypeResource[0] ? self.serviceTypeResource[0].code : ''; // 初始化高亮显示 默认取第一个
                }
                
                this.editKeyModalStatus = type;
                this.isCreateKeyModal = true;
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
                            "whitelist": self.createKeyForm.desc,
                            "serviceIds": self.serviceIds
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
            handlerCount(params){
                if(params.row.serviceTypeMajor == 1){
                    this.handlerApiCount(params)
                }else{
                    this.handlerVisitCount(params)
                }
            },
            closeCountModal(name){
                this.Count.isOpen = false;
            },
            handlerVisitCount(params){
                this.Count.isOpen = true;
                this.Count.ServiceInfos = params.row.serviceInfos;
                this.Count.serviceId = this.Count.ServiceInfos[0].serviceId;
                this.Count.title = params.row.keyName;
                this.Count.keyCode = params.row.keyCode;
                this.showCount()
            },
            selectCount(v){
                this.Count.type = v;
                this.showCount()
            },
            selectCountServiceId(v){
                this.Count.serviceId = v;
                this.showCount();
            },
            showCount(params){
                const self = this;
                let data = {
                    keyCode:   this.Count.keyCode,
                    countType: this.Count.type,
                    serviceID: this.Count.serviceId
                }

                this.Count.loading = true;
                this.Count.state = 'loading';
                this.Count.loadTips = '努力加载中，请稍等...';
                ajaxRequestCount(data).then(res => {
                    if(res.state === 0){
                        let result = res.data.data;
                        if(result && result.length){
                            self.Count.echarts.option = method.convertUserLineAreaEchartData(result, ['doc_count'], ['调用量']);
                            self.Count.loading = false;
                        }else{
                            self.Count.state = 'empty';
                            self.Count.loadTips = '抱歉，暂无数据！';
                        }
                    }else{
                        self.Count.state = 'error';
                        self.Count.loadTips = '糟糕，加载失败！';
                    }
                })
            },
            handlerApiCount(params){
                let argu = { keyCode: params.row.keyCode };
                this.$router.push({
                    name: 'count',
                    query: argu
                });
            },
            getAppServerList(){
                const self = this;
                let data = {
                    "statusCd": 1
                }
                this.Loading.state = true;
                this.Loading.class = 'loading';
                this.Loading.info = '努力加载中，请稍等...';
                ajaxPostApp(data).then(res => {
                    if(res.state === 0){
                        let resource = res.data.appKeyInfo;
                        if(resource && resource.length){
                            self.appServerData = resource;
                            self.Loading.state = false;
                        }else{
                             self.Loading.class = 'empty'
                            self.Loading.info = '抱歉，暂无数据！'
                        }
                    }else{
                        self.Loading.class = 'error';
                        self.Loading.info = '糟糕，加载失败！';
                    }
                }).catch( reason => {
                    self.Loading.class = 'error';
                    self.Loading.info = '错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
            },
            getServerTypeList(){
                const self = this;
                ajaxServiceType().then(res => {
                    if(res.state === 0){
                        let result = res.data.serviceInfo;
                        if(result && result.length){
                            self.serviceTypeResource = result;
                            self.createKeyForm.type = result[0].code;
                        }
                    }
                })
            },
            triggerViewUrlModal(params){
                const self = this;
                this.url.isOpen = true;
                this.url.loading = true;
                this.url.loadTips = '努力加载中，请稍等...'
                this.url.state = 'loading'
                ajaxUrl(params.row.keyId).then(res => {
                    if(res.state === 0){
                        let result = res.data.data;
                        if(result && result.length){
                            self.url.data = result;
                            self.url.loading = false;
                        }else{
                            self.url.loadTips = '暂无数据'
                            self.url.state = 'empty'
                        }
                    }else{
                        self.url.loadTips = '糟糕，加载失败！';
                        self.url.state = 'error'
                    }
                }).catch( reason => {
                    self.record.state = 'error';
                    self.record.loadTips = '错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
            },
            getAppTypeList(){
                const self = this;
                ajaxAppType('appType').then(res => {
                    self.panelAppType = res.data.dict;
                })
            },
            triggerRenewalModel(params){
                this.isOpenRenewal = true;
                this.RenewalForm.keyId = params.keyId;
                this.RenewalForm.endDate = params.endDt;
            },
            closeRenewalModal(name){
                this.$refs[name].resetFields();
                this.isOpenRenewal = false;
            },
            handlerRenewal(name){
                const self = this;
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        console.log(name)
                    }
                })
            },
            RenewalRangeChange(e){
                const self = this;
                console.log(e, 713)
                var endTime = e;
                var ft = this.RenewalForm.endDate;
                console.log(endTime, ft, 716)
                // endTime = e ? new Date()
                this.RenewalRange = {
                    disabledDate(date){
                        let startTime = new Date(ft).valueOf(); //this.RenewalForm.endDate ? new Date(this.RenewalForm.endDate).valueOf() : '';
                        return date && date.valueOf() < startTime
                    }
                }
            },
            init(){
                this.getAppServerList()
                this.getServerTypeList()
                this.getAppTypeList()
            }
        },
        computed: {
            panelServiceType(){
                const self = this;
                return tools.getRootData(self.serviceTypeResource)
            },
            panelServiceItems() {
                const self = this;
                let data = tools.getChildrenData(self.serviceTypeResource, self.createKeyForm.type)
                if(this.editKeyModalStatus === 'create'){
                    this.createKeyForm.serviceNames = data.map(item => item.serviceName);
                }
                return data
            },
            serviceIds(){
                const self = this;
                return this.panelServiceItems.filter(v => self.createKeyForm.serviceNames.includes(v.serviceName)).map(item => item.serviceId)
            }
        },
        created(){
            this.init()
        }
    }
</script>

<style lang="less">
  @import "~assets/styles/app.less";
</style>