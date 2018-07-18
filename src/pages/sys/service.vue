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
                    <Row style="margin-bottom: 22px;" v-if="!serviceResource.loading">
                        <Col span="16">
                            <Select size="large" v-if="serviceType.value === '2'" v-model="search.server" style="width:200px">
                                <Option v-for="item in search.serverList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            <Select size="large" v-model="search.state" style="width:200px">
                                <Option v-for="item in search.stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="8">
                            <Input size="large"
                                v-model="search.keyword"
                                @on-enter="triggerSearch"
                                @on-click="triggerSearch"
                                icon="ios-search-strong"
                                placeholder="请输入关键字"
                                style="width: 220px;float: right;"></Input>
                        </Col>
                    </Row>

                    <div v-if="serviceResource.loading" :class="'Placeholder ' + serviceResource.state">{{serviceResource.loadTips}}</div>
                    <Table v-if="!serviceResource.loading" class="custom-table" border :columns="mapColumns" :data="serviceResource.data"></Table>
                </div>
            </TabPane>
            <div slot="extra">
                <Button v-if="!serviceResource.loading" type="primary" icon="ios-plus-outline" size="large" @click="triggerAddServer">新增服务</Button>
            </div>
        </Tabs>

        <Modal
            v-model="mapServer.isOpen"
            class-name="custom-modal vertical-center-modal"
            width="682">
            <Icon type="ios-close-empty" slot="close" @click="closeMapServerModal('MapServerForm')"></Icon>
            <h2 class="title" slot="header">新增服务</h2>
            <div v-if="mapServer.loading" :class="'Placeholder ' + mapServer.state">{{mapServer.loadTips}}</div>

            <can-edit-table
                v-if="!mapServer.loading"
                refs="mapServerPopupTable" 
                v-model="mapServer.data"
                :editIncell="true"
                :columns-list="mapServer.columns"
                @on-select-change="mapServerAddData"
            ></can-edit-table>

            <div class="page-placeholder" v-show="!mapServer.loading">
                <Page :total="mapServer.total" :current="mapServer.current" @on-change="mapServerChangePage"></Page>
            </div>

            <div slot="footer" v-show="!mapServer.loading">
                <Button type="text" size="large" @click="closeMapServerModal('MapServerForm')">取消</Button>
                <Button type="primary" size="large" :loading="mapServer.submitLoading" :disabled="!mapServer.selectData.length ? true : false" @click.prevent="submitMapServer('MapServerForm')">提交</Button>
            </div>
        </Modal> <!-- 新增服务 - 地图服务 -->
    </div>
</template>

<script>
    import * as tools from 'src/util/tools'

    import { ajaxServiceType, ajaxAppType } from 'src/service/application'
    import { ajaxServerList, ajaxMapServerItems, ajaxMapServerRegist } from 'src/service/sys'
    
    import canEditTable from 'components/tables/canEditTable.vue'

    export default {
        components: {
            canEditTable
        },
        data () {
            return {
                mapColumns: [
                    {
                        title: '服务名称',
                        key: 'serviceName'
                    },
                    {
                        title: 'URL',
                        key: 'serviceUrl'
                    },
                    {
                        title: '调用量上限(次/日)',
                        key: 'dailyTotalCnt'
                    },
                    {
                        title: '并发量上限(次/秒)',
                        key: 'concurrencyMax'
                    },
                    {
                        title: '服务类型',
                        key: 'serviceTypeMinor'
                    },
                    {
                        title: '状态',
                        key: 'statusCd'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, '数据统计')
                            ]);
                        }
                    }
                    
                ],
                serviceType: {
                    data: [],
                    value: '',
                    loading: false,
                    loadTips: '努力加载中，请稍等...',
                    state: 'loading'
                },
                serviceResource: {
                    data: [],
                    loading: false,
                    loadTips: '努力加载中，请稍等...',
                    state: 'loading'
                },
                search: { // 搜索条件
                    server: '',
                    serverList: '',
                    state: '',
                    stateList: [{
                        value: '',
                        label: '全部状态'
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
                        { type: 'selection', width: 60, align: 'center' },
                        { title: '资源类型', key: 'mapType' },
                        { title: '资源名称', key: 'mapName' },
                        { title: '日调用量', key: 'dailyTotalCnt', editable: true },
                        { title: '并发量', key: 'concurrencyMax', editable: true }
                    ],
                    data: [
                        { "concurrencyMax": 0, "mapType": "addr_map", "mapName": "池州市地图资源", "mapCode": "1_ADDR_MAP_332f0f81194c66cbf6df88bfbd11962e", "dailyTotalCnt": 0 },
                        { "concurrencyMax": 0, "mapType": "addr_map", "mapName": "池州市地图资源2", "mapCode": "1_ADDR_MAP_332f0f81194c66cbf6df88bfbd11962e", "dailyTotalCnt": 0, _checked: true }
                    ],
                    page: 1,
                    total: 0,
                    loading: false,
                    state: 'loading',
                    loadTips: '努力加载中，请稍等...',
                    selectData: [],
                    submitLoading: false
                }
            }
        },
        methods: {
            triggerTabs(v){
                const self = this;
                this.serviceType.value = v; // 更新服务类型

                switch (v) {
                    case '2':    // 地图服务
                        if(!(self.search.serverList && self.search.serverList.length)){
                            self.InitMapService()
                        }
                        break;
                    default:
                        console.log('a')
                        break;
                }
                this.getServerList();
            },
            triggerSearch(){
                console.log('search')
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
                        console.log('a')
                        break;
                }
            },
            closeMapServerModal(){
                self.mapServer.isOpen = false;
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
                    serviceTypeMinor: item.mapCode
                }))
                ajaxMapServerRegist(data).then(res => {
                    if(res.state === 0){
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
            getServerList(params){ // 获取服务
                const self = this;
                
                this.serviceResource.loading = true;
                this.serviceResource.state = 'loading';
                this.serviceResource.loadTips = '努力加载中，请稍等...';

                let data = {
                    serviceTypeMajor: self.serviceType.value
                }
                data = Object.assign(data, params);

                ajaxServerList(data).then(res => {
                    if(res.state === 0){
                        let datas = res.data.data.rows;
                        if(datas && datas.length){
                            self.serviceResource.data = datas;
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
            getMapServerItems(){
                const self = this;
                this.mapServer.loading = true;
                this.mapServer.state = 'loading';
                let data = {
                    rows: this.mapServer.page -1
                }
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
                ajaxAppType('map_type').then(res => {
                    if(res.state === 0){
                        let data = res.data.dict;
                        self.search.serverList = data && data.length ? data.map(item => ({ name: item.name, value: item.code })) : []
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
                            self.serviceType.value = self.serviceType.data[0].value;
                            self.serviceType.loading = false;
                            self.getServerList();
                        }else{
                            self.serviceType.state = 'empty'
                            self.serviceType.loadTips = '抱歉，暂无数据！'
                        }
                    }else{
                        self.serviceType.state = 'error';
                        self.serviceType.loadTips = "糟糕，加载失败！"
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