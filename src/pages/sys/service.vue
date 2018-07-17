<template>
    <div class="normal-block-mod tabs-custom-style">
        <Tabs :value="serviceTypeValue " :animated="false" @on-click="triggerTabs">
            <TabPane :label="items.name" :name="items.value" v-for="items in serviceTypeResource" :key="items.value">
                <div class="mormal-tabs-bd">
                    <Row style="margin-bottom: 22px;">
                        <Col span="16">
                            <Select size="large" v-if="serviceTypeValue === '2'" v-model="search.server" style="width:200px">
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
                    <Table class="custom-table" border :columns="mapColumns" :data="mapServerData"></Table>
                </div>
            </TabPane>
            <Button type="primary" icon="ios-plus-outline" slot="extra" size="large" @click="triggerAddServer">新增服务</Button>
        </Tabs>

        <Modal
            v-model="mapServer.isOpen"
            class-name="custom-modal vertical-center-modal"
            width="682">
            <Icon type="ios-close-empty" slot="close" @click="closeMapServerModal('MapServerForm')"></Icon>
            <h2 class="title" slot="header">新增服务</h2>
            <div v-if="mapServer.loading" :class="'Placeholder ' + mapServer.state">{{mapServer.loadTips}}</div>
            <Table v-if="!mapServer.loading" class="custom-table-popup" border 
                :columns="mapServer.columns"
                :data="mapServer.data"
                stripe></Table>
            <div class="page-placeholder" v-show="!mapServer.loading">
                <Page :total="mapServer.total" :current="mapServer.current" @on-change="mapServerChangePage"></Page>
            </div>

            <div slot="footer" v-show="!mapServer.loading">
                <Button type="text" size="large" @click="closeMapServerModal('MapServerForm')">取消</Button>
                <Button type="primary" size="large" @click.prevent="submitMapServer('MapServerForm')">提交</Button>
            </div>
        </Modal> <!-- 新增服务 - 地图服务 -->
    </div>
</template>

<script>
    import * as tools from 'src/util/tools'

    import { ajaxServiceType, ajaxAppType } from 'src/service/application'
    import { ajaxMapServerItems } from 'src/service/sys'

    export default {
        data () {
            return {
                mapColumns: [
                    {
                        title: '服务名称',
                        key: 'name'
                    },
                    {
                        title: 'URL',
                        key: 'url'
                    },
                    {
                        title: '服务类型',
                        key: 'type'
                    },
                    {
                        title: '状态',
                        key: 'status'
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
                mapServerData: [
                    {
                        name: 'www',
                        url: 'New York No. 1 Lake Park',
                        type: '楼盘地图',
                        status: '正常'
                    },
                    {
                        name: 'www',
                        url: 'New York No. 1 Lake Park',
                        type: '专题地图',
                        status: '正常'
                    }
                ],
                severList: [
                    {
                        value: '1',
                        label: '基础地图'
                    }
                ],
                serviceTypeResource: [],
                serviceTypeValue: '',
                search: { // 搜索条件
                    server: '',
                    serverList: '',
                    state: '',
                    stateList: [{
                        value: '',
                        label: '全部状态'
                    },{
                        value: '1',
                        label: '正常'
                    },{
                        value: '0',
                        label: '异常'
                    }],
                    keyword: ''
                },
                mapServer: { // 新增地图服务
                    isOpen: false,
                    columns: [
                        { type: 'selection', width: 60, align: 'center' },
                        { title: '资源类型', key: 'mapType' },
                        { title: '资源名称', key: 'mapName' },
                        { title: '日调用量', key: 'dailyTotalCnt' },
                        { title: '并发量', key: 'concurrencyMax' }
                    ],
                    data: [
                        { "concurrencyMax": 0, "mapType": "addr_map", "mapName": "池州市地图资源", "mapCode": "1_ADDR_MAP_332f0f81194c66cbf6df88bfbd11962e", "dailyTotalCnt": 0 }
                    ],
                    page: 1,
                    total: 0,
                    loading: false,
                    state: 'loading',
                    loadTips: '努力加载中，请稍等...'
                }
            }
        },
        methods: {
            triggerTabs(v){
                const self = this;
                this.serviceTypeValue = v; // 更新服务类型

                
                switch (v) {
                    case '1':    // Web服务
                        console.log(key)
                        break;
                    case '2':    // 地图服务
                        self.InitMapService()
                        break;
                    case '3':    // 楼盘服务
                        console.log(key)
                        break;
                    default:
                        console.log('a')
                        break;
                }
            },
            triggerSearch(){
                console.log('search')
            },
            triggerAddServer(){ // 新增服务
                const self = this;
                let key = this.serviceTypeValue;
                switch (key) {
                    case '1':    // Web服务
                        console.log(key)
                        break;
                    case '2':    // 地图服务
                        self.mapServer.isOpen = true;
                        self.getMapServerItems()
                        break;
                    case '3':    // 楼盘服务
                        console.log(key)
                        break;
                    default:
                        console.log('a')
                        break;
                }
            },
            closeMapServerModal(){

            },
            submitMapServer(){

            },
            mapServerChangePage(v){
                this.mapServer.page = v;
                this.getMapServerItems()
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
                        self.mapServerData.loadTips = "糟糕，加载失败！"
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
                ajaxServiceType().then(res => {
                    if(res.state === 0){
                        let result = res.data.serviceInfo;
                        self.serviceTypeResource = result.map(item => ({ name: item.name, value: item.code}))
                        self.serviceTypeValue = self.serviceTypeResource[0].value;
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