<template>
    <div class="normal-block-mod tabs-custom-style">
        <div class="tabs-placeholder" v-if="serviceType.loading">
            <div class="ivu-tabs-bar ivu-tabs-bar header">
                <ul class="ivu-tabs-nav">
                    <li class="ivu-tabs-tab" v-for="items in 3"></li>
                </ul>
            </div>
            <div :class="'Placeholder ' + serviceType.state">{{serviceType.loadTips}}</div>
        </div>
        <Tabs v-if="!serviceType.loading" :value="serviceType.value " :animated="false" @on-click="triggerTabs">
            <TabPane :label="items.name" :name="items.value" v-for="items in serviceType.data" :key="items.value">
                <div class="mormal-tabs-bd">
                    <Row style="margin-bottom: 22px;">
                        <Col span="16">
                            <Select size="large" v-if="serviceType.value === '2'" v-model="search.server" style="width:200px" @on-change="changeQueryService">
                                <Option v-for="item in search.serverList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            <Select size="large" v-model="search.state" style="width:200px" @on-change="changeQueryState">
                                <Option v-for="item in search.stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="8">
                            <Input size="large"
                                v-model.trim="search.keyword"
                                @on-enter="getServerList"
                                @on-click="getServerList"
                                icon="ios-search-strong"
                                placeholder="请输入关键字"
                                style="width: 220px;float: right;"></Input>
                        </Col>
                    </Row>

                    <div v-if="serviceResource.loading" :class="'Placeholder ' + serviceResource.state">{{serviceResource.loadTips}}</div>
                    <Table v-if="!serviceResource.loading" class="custom-table" border :columns="mapColumns" :data="serviceResource.data"></Table>
                    <div class="page-placeholder" v-show="!serviceResource.loading">
                        <Page :total="serviceResource.total"
                            :current="serviceResource.page"
                            :page-size="serviceResource.rows"
                            @on-change="changeQueryPage"
                            show-total
                        ></Page>
                    </div>
                </div>
            </TabPane>
            <div slot="extra">
                <Button type="primary" icon="ios-plus-outline" size="large" @click.prevent="triggerAddServer">新增服务</Button>
            </div>
        </Tabs>

        <Modal
            v-model="mapServer.isOpen"
            class-name="custom-modal vertical-center-modal"
            width="782">
            <Icon type="ios-close-empty" slot="close" @click="closeMapServerModal('MapServerForm')"></Icon>
            <h2 class="title" slot="header">新增服务</h2>
            <div style="height: 36px;margin-bottom: 10px;margin-top: -18px;">
                <Input size="large"
                v-model="mapServer.keyword"
                @on-enter="mapServerQueryKeyword"
                @on-click="mapServerQueryKeyword"
                icon="ios-search-strong"
                placeholder="请输入资源名称"
                style="width: 220px;float: right;"></Input>
            </div>

            <div v-if="mapServer.loading" :class="'Placeholder ' + mapServer.state">{{mapServer.loadTips}}</div>
            <can-edit-table
                v-if="!mapServer.loading"
                refs="mapServerPopupTable" 
                v-model="mapServer.data"
                :editIncell="true"
                :columns-list="mapServer.columns"
                @on-select-change="mapServerAddData"
            ></can-edit-table>

            <div class="page-placeholder" style="padding: 10px 0 0" v-show="!mapServer.loading">
                <Page :total="mapServer.total" :current="mapServer.page" :page-size="mapServer.rows" @on-change="mapServerChangePage"></Page>
            </div>

            <div slot="footer" style="margin-top: -8px;margin-bottom: -16px;" v-show="!mapServer.loading">
                <Button type="text" size="large" @click="closeMapServerModal('MapServerForm')">取消</Button>
                <Button type="primary" size="large" :loading="mapServer.submitLoading" :disabled="!mapServer.selectData.length ? true : false" @click.prevent="submitMapServer('MapServerForm')">提交</Button>
            </div>
        </Modal> <!-- 新增服务 - 地图服务 -->

        <Modal
            v-model="Modal.service.isOpen"
            class-name="custom-modal vertical-center-modal"
            width="510">
            <Icon type="ios-close-empty" slot="close" @click="closeServiceModal('serviceForm')"></Icon>
            <h2 class="title" slot="header">{{ Modal.service.type === 'edit' ? '编辑' : '创建新' }}服务</h2>
            <Form :model="Modal.service.Form" ref="serviceForm" :rules="Modal.service.rule" :label-width="92" class="custom-form">
                <FormItem label="服务名称" prop="serviceName">
                    <Input v-model="Modal.service.Form.serviceName" :disabled="(Modal.service.type === 'edit' && serviceType.value === '2') ? true : false"></Input>
                </FormItem>
                <FormItem label="URL" prop="serviceUrl">
                    <Input v-model="Modal.service.Form.serviceUrl" :disabled="(Modal.service.type === 'edit' && serviceType.value === '2') ? true : false"></Input>
                </FormItem>
                <FormItem label="调用量上限" prop="dailyTotalCnt" class="hasUnit">
                    <InputNumber v-model="Modal.service.Form.dailyTotalCnt" :min="0" size="large" style="width: 130px"></InputNumber>
                    <span class="unit">次/日</span>
                </FormItem>
                <FormItem label="并发量上限" prop="concurrencyMax" class="hasUnit">
                    <InputNumber v-model.number="Modal.service.Form.concurrencyMax" :min="0" size="large" style="width: 130px"></InputNumber>
                    <span class="unit">次/秒</span>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="closeServiceModal('serviceForm')">取消</Button>
                <Button type="primary" size="large" :loading="Modal.service.loading" @click.prevent="handlerService('serviceForm')">提交</Button>
            </div>
        </Modal> <!-- 编辑/新增服务 -->

        <Modal
            v-model="Modal.delete.isOpen"
            class-name="custom-modal custom-warning-modal vertical-center-modal"
            width="378">
            <h2 class="title" slot="header">{{Modal.delete.type}}服务</h2>
            <div class="content">
                <h3>您确定要{{Modal.delete.type}}服务吗?</h3>
                <p>您将{{Modal.delete.type}}服务，请您谨慎操作!</p>
            </div>
            <div slot="footer" >
                <Button type="text" size="large" @click="Modal.delete.isOpen = !Modal.delete.isOpen">取消</Button>
                <Button type="primary" size="large" :loading="Modal.delete.loading" @click.prevent="handlerDelete">确认</Button>
            </div>
        </Modal> <!-- 删除 -->

        <Modal
            v-model="Count.isOpen"
            class-name="custom-modal vertical-center-modal"
            width="912">
            <Icon type="ios-close-empty" slot="close" @click="closeCountModal('CountForm')"></Icon>
            <h2 class="title" slot="header">{{Count.title}} ● 数据统计</h2>
            
            <Select v-model="Count.type" @on-change="selectCount" size="large" style="width:160px;">
                <Option v-for="item in selectTimeDict" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <div v-if="Count.loading" :class="'Placeholder ' + Count.state">{{Count.loadTips}}</div>
            <leon-line-echart v-if="!Count.loading" :id="Count.echarts.id" :option="Count.echarts.option" :style="Count.echarts.style"></leon-line-echart>

            <div slot="footer"></div>
        </Modal> <!-- 新增服务 - 地图服务 -->
    </div>
</template>

<script>
    import * as tools from 'src/util/tools'

    import { ajaxServiceType, ajaxAppType } from 'src/service/application'
    import { ajaxServerList, ajaxMapServerItems, ajaxMapServerRegist, ajaxDeleteServer, ajaxEditServer, ajaxRequestCount } from 'src/service/sys'
    
    import canEditTable from 'components/tables/canEditTable.vue'
    import leonLineEchart from "components/echarts/leon-line-chart"
    import leonSwitch from "components/switch"

    import { selectTimeDict } from "src/config/basicConfig"
    import * as method from 'src/util/sys/'

    export default {
        components: {
            canEditTable,
            leonLineEchart,
            leonSwitch
        },
        data () {
            return {
                serviceType: { // 服务类型
                    data: [],
                    value: '',
                    loading: false,
                    loadTips: '努力加载中，请稍等...',
                    state: 'loading'
                },
                serviceResource: {
                    data: [],
                    page: 1,
                    rows: 10,
                    total: 0,
                    loading: false,
                    loadTips: '努力加载中，请稍等...',
                    state: 'loading'
                },
                search: { // 搜索条件
                    server: 'all',
                    serverList: [],
                    state: '1',
                    stateList: [{
                        value: 'all',
                        label: '全部'
                    },{
                        value: '1',
                        label: '有效'
                    },{
                        value: '2',
                        label: '无效'
                    }],
                    keyword: ''
                },
                mapServer: { // 新增地图服务
                    isOpen: false,
                    columns: [
                        { type: 'selection', width: 50, align: 'center' },
                        { title: '资源类型', key: 'typeName' },
                        { title: '资源名称', key: 'mapName' },
                        { title: '日调用量', key: 'dailyTotalCnt', editable: true },
                        { title: '并发量', key: 'concurrencyMax', editable: true }
                    ],
                    data: [],
                    page: 1,
                    rows: 10,
                    total: 0,
                    loading: false,
                    state: 'loading',
                    loadTips: '努力加载中，请稍等...',
                    keyword: '',
                    selectData: [],
                    submitLoading: false
                },
                Modal: {
                    delete: {
                        serviceId: '',
                        type: '',
                        isOpen: false,
                        loading: false
                    },
                    service: {
                        Form: {
                            serviceName: '',   // 服务名称
                            serviceUrl: '',    // URL
                            dailyTotalCnt: 0,  // 调用量上限(次/日)
                            concurrencyMax: 0, // 并发量上限(次/秒)
                            serviceId: '',
                            serviceTypeMinor: '',
                            serviceTypeMajor: ''
                        },
                        rule: {},
                        type: '',
                        isOpen: false,
                        loading: false
                    }
                },
                Count: {
                    type: 'todayOfHours',
                    title: '',
                    serviceId: '',
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
                selectTimeDict
            }
        },
        methods: {
            triggerTabs(v){
                const self = this;
                this.serviceType.value = v; // 更新服务类型
                // 初始化搜索条件
                this.search.keyword = ''
                this.serviceResource.page = 1;
                this.search.state = '1';
                switch (v) {
                    case '2':    // 地图服务
                        if(!(self.search.serverList && self.search.serverList.length)){
                            self.InitMapService()
                        }
                        break;
                    default:
                        // console.log('a')
                        break;
                }
                this.getServerList();
            },
            triggerAddServer(){ // 新增服务
                const self = this;
                let key = this.serviceType.value;
                switch (key) {
                    case '2':    // 地图服务
                        self.mapServer.isOpen = true;
                        self.getMapServerItems()
                        break;
                    default:
                        self.triggerServiceModal()
                        break;
                }
            },
            triggerServiceModal(params, type){
                if(type === 'edit'){
                    let data = params.row;
                    this.Modal.service.Form.serviceName = data.serviceName
                    this.Modal.service.Form.serviceUrl = data.serviceUrl
                    this.Modal.service.Form.dailyTotalCnt = data.dailyTotalCnt
                    this.Modal.service.Form.concurrencyMax = data.concurrencyMax
                    this.Modal.service.Form.serviceId = data.serviceId
                    this.Modal.service.Form.serviceTypeMinor = data.serviceTypeMinor
                    if(this.serviceType.value === '2'){
                        this.Modal.service.rule = {}
                    }else{
                        this.Modal.service.rule = {
                            serviceName: [
                                { required: true, message: "请输入服务名称", trigger: 'blur' },
                                { max: 15, message:"服务名称不能超过15个字符", trigger: 'blur' },
                                { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9-_\s]+$/, message:"请使用字母、汉字、数字、下划线、中划线", trigger: 'blur' }  
                            ],
                            serviceUrl: [
                                { required: true, message: "请输入URL", trigger: 'blur' },
                                // { pattern: /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/, message:"请输入正确的URL", trigger: 'blur' }
                            ]
                        }
                    }
                    
                }else{
                    this.Modal.service.rule = {
                        serviceName: [
                            { required: true, message: "请输入服务名称", trigger: 'blur' },
                            { max: 15, message:"服务名称不能超过15个字符", trigger: 'blur' },
                            { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9-_\s]+$/, message:"请使用字母、汉字、数字、下划线、中划线", trigger: 'blur' }  
                        ],
                        serviceUrl: [
                            { required: true, message: "请输入URL", trigger: 'blur' },
                            // { pattern: /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/, message:"请输入正确的URL", trigger: 'blur' }
                        ]
                    }
                }
                this.Modal.service.type = type;
                this.Modal.service.isOpen = true;
            },
            closeServiceModal(name){
                this.$refs[name].resetFields();
                this.Modal.service.isOpen = false;
            },
            handlerService(name){
                const self = this;
                let data ={
                    serviceTypeMajor: this.serviceType.value,
                    serviceName: this.Modal.service.Form.serviceName,
                    dailyTotalCnt: this.Modal.service.Form.dailyTotalCnt,
                    concurrencyMax: this.Modal.service.Form.concurrencyMax,
                }
                
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        this.Modal.service.loading = true;
                        if(this.Modal.service.type === 'edit'){
                            data = Object.assign(data, {
                                serviceUrl: self.Modal.service.Form.serviceUrl,
                                serviceId: self.Modal.service.Form.serviceId,
                                serviceTypeMinor: self.Modal.service.Form.serviceTypeMinor
                            })
                            ajaxEditServer(data).then(res => {
                                if(res.state === 0){
                                    self.closeServiceModal(name);
                                    self.getServerList();
                                    self.$Message.success(res.message)
                                }else{
                                    self.$Message.error(res.message)
                                }
                                self.Modal.service.loading = false;
                            })
                        }else{
                            data = Object.assign(data, {
                                mapCode: self.Modal.service.Form.serviceUrl,
                            })
                            data = `[${JSON.stringify(data)}]`  // 后台要求传入必须为数组，所以这么转换
                            ajaxMapServerRegist(data).then(res => {
                                if(res.state === 0){
                                    self.closeServiceModal(name);
                                    self.getServerList();
                                    self.$Message.success(res.message)
                                }else{
                                    self.$Message.error(res.message)
                                }
                                self.Modal.service.loading = false;
                            })
                        }                        
                    }
                })
            },
            triggerDeleteModal(params){ // 删除
                let data = params.row;
                if(data.statusCd === 1){
                    this.Modal.delete.type = '停用'
                }else{
                    this.Modal.delete.type = '启用'
                }
                this.Modal.delete.serviceId = data.serviceId;
                this.Modal.delete.isOpen = true;
            },
            handlerDelete(){
                const self = this;
                this.Modal.delete.loading = true;
                let serviceId = this.Modal.delete.serviceId;
                ajaxDeleteServer(serviceId).then(res => {
                    if(res.state === 0){
                        self.getServerList()
                        self.$Message.success(res.message);
                        self.Modal.delete.isOpen = false;
                    }else{
                        self.$Message.error(res.message);
                    }
                    self.Modal.delete.loading = false;
                })
            },
            closeMapServerModal(){
                this.mapServer.isOpen = false;
            },
            submitMapServer(){
                const self = this;
                this.mapServer.submitLoading = true;
                let result = this.mapServer.selectData;
                let data = result.map(item => ({
                    concurrencyMax: item.concurrencyMax ,
                    dailyTotalCnt: item.dailyTotalCnt ,
                    mapCode: item.mapCode ,
                    serviceName: item.mapName ,
                    serviceTypeMajor: self.serviceType.value ,
                    serviceTypeMinor: item.mapType
                }))
                ajaxMapServerRegist(data).then(res => {
                    if(res.state === 0){
                        self.getServerList()
                        self.$Message.success(res.message);
                        self.mapServer.isOpen = false;
                    }else{
                        self.$Message.error(res.message);
                    }
                    self.mapServer.submitLoading = false;
                })
            },
            mapServerAddData(v){
                this.mapServer.selectData = v.filter(item => item._checked === true);
            },
            mapServerChangePage(v){
                this.mapServer.page = v;
                this.getMapServerItems()
            },
            changeQueryPage(v){
                this.serviceResource.page = v;
                this.getServerList()
            },
            changeQueryState(v){
                if(this.search.state === 'all'){
                    this.getServerList()
                }else{
                    this.getServerList({ statusCd: v })
                }
            },
            changeQueryService(){
                const self = this;
                // if(this.search.server === 'all'){
                //     this.getServerList()
                // }else{
                    this.getServerList({
                        serviceTypeMinor: self.search.server
                    })
                // }
            },
            getServerList(params){ // 获取服务
                const self = this;
                
                this.serviceResource.loading = true;
                this.serviceResource.state = 'loading';
                this.serviceResource.loadTips = '努力加载中，请稍等...';

                let data = {
                    serviceTypeMajor: this.serviceType.value,
                    page: this.serviceResource.page,
                    rows: this.serviceResource.rows
                }
                if(this.search.state !== 'all'){
                    data = Object.assign(data, {statusCd: self.search.state})
                }
                if(this.search.server !== 'all' && this.serviceType.value === '2'){
                    data = Object.assign(data, {serviceTypeMinor: self.search.server})
                }
                if(this.search.keyword){
                    data = Object.assign(data, {searchName: self.search.keyword})
                }

                ajaxServerList(data).then(res => {
                    if(res.state === 0){
                        let datas = res.data.data;
                        if(datas && datas.rows && datas.rows.length){
                            self.serviceResource.data = datas.rows;
                            self.serviceResource.total = datas.total;
                            self.serviceResource.loading = false;
                        }else{
                            self.serviceResource.state = 'empty';
                            self.serviceResource.loadTips = '抱歉，暂无数据！';
                        }
                    }else{
                        self.serviceResource.state = 'error';
                        self.serviceResource.loadTips = "糟糕，加载失败！"
                    }
                })
            },
            mapServerQueryKeyword(v){
                const self = this;
                this.getMapServerItems({
                    mapName: self.mapServer.keyword
                })
            },
            getMapServerItems(params){
                const self = this;
                this.mapServer.loading = true;
                this.mapServer.state = 'loading';
                let data = {
                    page: this.mapServer.page,
                    rows: this.mapServer.rows
                }
                data = Object.assign(data, params)
                ajaxMapServerItems(data).then(res => {
                    if (res.state === 0) {
                        let data = res.data.data;
                        if(data && data.total){
                            self.mapServer.data = data.rows;
                            self.mapServer.total = data.total;
                            self.mapServer.loading = false;
                        }else{
                            self.mapServer.state = 'empty';
                            self.mapServer.loadTips = "抱歉，暂无数据";
                        }
                    }else{
                        self.mapServer.state = 'error';
                        self.mapServer.loadTips = "糟糕，加载失败！"
                    }
                })
            },
            getMapServerType(){
                const self = this;
                let allArr = []
                ajaxAppType('map_type').then(res => {
                    if(res.state === 0){
                        let data = res.data.dict;
                        if(data && data.length){
                            allArr = data.map(item => ({ name: item.name, value: item.code }))
                            allArr.unshift({ name: '全部', value: 'all' })
                            self.search.serverList = allArr
                        }
                    }
                })
            },
            getServiceTabs(){
                const self = this;
                this.serviceType.loading = true;
                this.serviceType.state = 'loading';
                this.serviceType.loadTips = '努力加载中，请稍等...';
                ajaxServiceType().then(res => {
                    if(res.state === 0){
                        let result = res.data.serviceInfo;
                        if(result && result.length){
                            self.serviceType.data = result.map(item => ({ name: item.name, value: item.code}))
                            // 判断是否为 2 地图服务，如果是则调用一次 map_type请求
                            self.triggerTabs(self.serviceType.data[0].value);
                            self.serviceType.loading = false;
                        }else{
                            self.serviceType.state = 'empty'
                            self.serviceType.loadTips = '抱歉，暂无数据！'
                        }
                    }else{
                        self.serviceType.state = 'error';
                        self.serviceType.loadTips = "糟糕，加载失败！"
                    }
                }).catch( reason => {
                    self.serviceType.state = 'error';
                    self.serviceType.loadTips = '错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
            },
            closeCountModal(name){
                this.Count.isOpen = false;
            },
            triggerCountModal(params){
                this.Count.isOpen = true;
                this.Count.serviceId = params.row.serviceId;
                this.Count.title = params.row.serviceName
                this.showCount()
            },
            selectCount(v){
                this.showCount({ countType: v })
            },
            showCount(params){
                const self = this;
                let data = {
                    countType: this.Count.type,
                    serviceID: this.Count.serviceId
                }
                if(params){
                    data = Object.assign(data, params)
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
            InitMapService(){ // 初始化地图服务
                this.getMapServerType()
            },
            init(){
                this.getServiceTabs()
            }
        },
        computed: {
            mapColumns(){
                const self = this;
                let columns = [
                    { title: '服务名称', key: 'serviceName' },
                    { title: 'URL', key: 'serviceUrl' },
                    { title: '调用量上限(次/日)', width: 156, key: 'dailyTotalCnt' },
                    { title: '并发量上限(次/秒)', width: 156, key: 'concurrencyMax' }
                ]
                if(this.serviceType.value === '2'){
                    columns.push({ title: '服务类型', width: 100, key: 'serviceTypeMinor', render: (h, params) => {
                            let classname = '';
                            let texts = self.search.serverList && params.row.serviceTypeMinor ? (self.search.serverList.find(item => item.value === params.row.serviceTypeMinor) ? self.search.serverList.find(item => item.value === params.row.serviceTypeMinor).name : '') : ''
                            return h('div',{},[
                                h('span', { class: classname }, texts)
                            ])
                        }
                    })
                }
                columns.push({ title: '状态', key: 'statusCd', align: 'center', width: 80, render: (h, params) => {
                            let texts = '';
                            let classname = '';
                            if(params.row.statusCd === 1){
                                classname = 'status-success'
                                texts = '有效';
                            }else if(params.row.statusCd === 2){
                                classname = 'status-error'
                                texts = '无效';
                            }else{
                                texts = '其它';
                            }
                            return h('div',{},[
                                h('span', { class: classname }, texts)
                            ])
                        }
                    },
                    { title: '是否启用', key: 'statusCd', align: 'center', width: 94, render: (h, params) => {
                        return h(leonSwitch, {
                            props: {
                                type: 'primary',
                                value: params.row.statusCd === 1,
                                size: 'default',
                                loading: true,
                                beforeChange: () => {
                                    this.triggerDeleteModal(params)
                                    return false;
                                }
                            },
                            on: {
                                'on-change': (e) => {
                                    // console.log(e)
                                }
                            }
                        },'')
                        }
                    },
                    {
                        title: '操作', key: 'action', align: 'center', width: 150, render: (h, params) => {
                            return h('div', {class: 'action-group'},
                            [
                                h('span', {
                                    class: 'items', on: {
                                        click: () => {
                                            this.triggerServiceModal(params, 'edit')
                                        }
                                    }
                                }, '编辑'),
                                h('span', {
                                    class: 'items', on: {
                                        click: () => {
                                            this.triggerCountModal(params)
                                        }
                                    }
                                }, '数据统计')
                            ]);
                        }
                    })

                return columns;
            }
        },
        created(){
            this.init()
        }
    }
</script>

<style lang="less">
.tabs-custom-style{
    .tabs-placeholder{
        height: 300px;
        .header{
            height: 67px;
            li{
                height: 50px;
                width: 100px;
                background-color: #f8f8f9;
            }
        }
        .search{

        }
        .data{

        }
    }
    .ivu-tabs-bar{
        padding: 16px 20px 0;
    }
    .ivu-tabs-nav{
        .ivu-tabs-tab{
            font-size: 16px;
            padding-bottom: 18px;
            color: #666;
            &-active{
                color: #008aff;
            }
        }
    }
    .ivu-input-icon{
        cursor: pointer;
    }
}
</style>