<template>
    <div>
        <div class="full-block-mod">
            <div class="Header clearfix">
                <h2 class="title">回收站 <strong>被删除的应用可恢复</strong></h2>
                <div slot="extra" v-if="!Loading.state">
                    <Button class="fr" type="primary" icon="trash-a" size="large" @click="triggerDeleteModel('clearAll')">清空回收站</Button>
                </div>
            </div>
            
            <div v-if="Loading.state" :class="'Placeholder ' + Loading.class">{{Loading.info}}</div>
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
                                    <Icon type="trash-a" @click="triggerDeleteModel('app', item, index)"></Icon>
                                    <Button class="btn-blue" type="ghost" @click="triggerRecoverModal(item,'app')">恢复应用</Button>
                                </Col>
                                <Col span="2" class="tac arrow"><Icon type="ios-arrow-down" @click="toggleTab(index)"></Icon></Col>
                            </Row>
                        </div>
                        <div class="bd" v-if="index === curOpen ? true : false">
                            <Table border :columns="mapColumns" :data="item.keyInfos" class="custom-table"></Table>
                        </div>
                    </div>
                </div>
            </div>
                
        </div>

        <Modal
            v-model="isOpenDeleteModal"
            class-name="custom-modal custom-warning-modal vertical-center-modal"
            width="378">
            <h2 class="title" slot="header">
                <span v-if="deleteModelData.type === 'key'">删除Key</span>
                <span v-else-if="deleteModelData.type === 'app'">删除应用</span>
                <span v-else-if="deleteModelData.type === 'clearAll'">清空回收站</span>
            </h2>
            <div class="content">
                <h3>
                    您确定要<span v-if="deleteModelData.type === 'key'">删除Key</span>
                    <span v-else-if="deleteModelData.type === 'app'">删除应用</span>
                    <span v-else-if="deleteModelData.type === 'clearAll'">清空回收站</span>
                </h3>
                <p>
                    <span v-if="deleteModelData.type === 'key'">Key将被彻底删除且无法恢复，请您谨慎操作！</span>
                    <span v-else-if="deleteModelData.type === 'app'">彻底删除应用的同时该应用内的Key也将被彻底删除且无法恢复,请您谨慎操作！</span>
                    <span v-else-if="deleteModelData.type === 'clearAll'">清空回收站将删除回收站中所有的应用,请谨慎操作!</span>
                </p>
            </div>
            <div slot="footer" >
                <Button type="text" size="large" @click="isOpenDeleteModal = !isOpenDeleteModal">取消</Button>
                <Button type="primary" size="large" :loading="deleteModelData.loading" @click.prevent="deleteApp">确认</Button>
            </div>
        </Modal> <!-- 删除 -->

        <Modal
            v-model="Recover.modal"
            class-name="custom-modal vertical-center-modal"
            width="378">
            <h2 class="title" slot="header">恢复{{Recover.type === 'key' ? 'Key' : '应用'}}</h2>
            <div class="content">
                <p>{{Recover.type === 'key' ? 'Key将恢复到您地图选址应用下,并即时生效，您确定恢复Key么?' : '恢复应用的同时该应用内的Key也将恢复，您确定恢复么?'}}</p>
            </div>
            <div slot="footer" >
                <Button type="text" size="large" @click="Recover.modal = !Recover.modal">取消</Button>
                <Button type="primary" size="large" :loading="Recover.loading" @click.prevent="RecoverApp">确认</Button>
            </div>
        </Modal> <!-- 恢复 -->
    </div>
</template>

<script>
    import * as tools from 'src/util/tools'
    import { ajaxPostApp, ajaxUpdateApp, ajaxUpdateKey, ajaxDeleteApp, ajaxDeleteKey } from 'src/service/application'

    export default {
        data () {
            return {
                statusCd: 2,
                curOpen: 0,
                Loading: {
                    state: false,
                    class: 'loading',
                    info: '努力加载中，请稍等...'
                },
                mapColumns: [
                    { title: 'Key名称', key: 'keyName', align: 'center' },
                    { title: 'Key', key: 'keyCode', align: 'center' },
                    { title: '绑定服务', key: 'serviceTypeMajorName', align: 'center' },
                    { title: '删除时间', key: 'version', align: 'center' },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            return h('div',
                            {class: 'action-group'},
                            [
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.triggerRecoverModal(params, 'key')
                                        }
                                    }
                                }, '恢复'),
                                h('span', {
                                    class: 'items',
                                    on: {
                                        click: () => {
                                            this.triggerDeleteModel('key', params, params.index)
                                        }
                                    }
                                }, '彻底删除')
                            ]);
                        }
                    }
                    
                ],
                mapServerData: [],
                isOpenDeleteModal: false,
                deleteModelData: {
                    appId: '',
                    type: '',
                    keyId: '',
                    loading: false
                },
                appServerData: [],
                Recover: {
                    modal: false,
                    type: '',
                    appId: '',
                    keyId: '',
                    loading: false
                }
            }
        },
        methods: {
            toggleTab(index){
                this.curOpen = this.curOpen === index ? '' : index;
            },
            triggerDeleteModel(type, params, index){
                const self = this;
                if(type === 'app'){
                    this.deleteModelData.appId = params.appId;
                }else if(type === 'key'){
                    this.deleteModelData.appId = params.row.appId;
                    this.deleteModelData.keyId = params.row.keyId;
                }else if(type === 'clearAll'){
                    this.deleteModelData.appId = tools.getAppId(self.appServerData)
                }
                this.deleteModelData.type = type;
                this.isOpenDeleteModal = true;
            },
            deleteApp(){
                const self = this;
                let params = {
                    "statusCd": this.statusCd,
                    "appId": this.deleteModelData.appId
                }
                self.deleteModelData.loading = true;
                if(this.deleteModelData.type === 'key'){
                    let data = Object.assign(params, { "keyId": self.deleteModelData.keyId })
                    ajaxDeleteKey(data).then(res => {
                        if(res.state === 0){
                            self.getAppServerList();
                            self.isOpenDeleteModal = false;
                            self.$Message.success(res.message)
                        }else{
                            self.$Message.error(res.message)
                        }
                        self.deleteModelData.loading = false;
                    })
                }else if(this.deleteModelData.type === 'clearAll'){
                    ajaxDeleteApp({
                        "statusCd": self.statusCd,
                        "appIds": self.deleteModelData.appId
                    }).then(res => {
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
                    ajaxDeleteApp(params).then(res => {
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
            getAppServerList(){
                const self = this;
                let data = {
                    "statusCd": this.statusCd
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
                    self.Loading.info = '糟糕，服务器内部错误';//'错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
            },
            triggerRecoverModal(params, type){
                const self = this;
                if(type === 'app'){
                    this.Recover.appId = params.appId;
                }else if(type === 'key'){
                    this.Recover.appId = params.row.appId;
                    this.Recover.keyId = params.row.keyId;
                }
                this.Recover.type = type;
                this.Recover.modal = true;
            },
            RecoverApp(){
                const self = this;
                let data = {
                    statusCd: 1,
                    appId: this.Recover.appId
                }
                this.Recover.loading = true;
                if(this.Recover.type === 'key'){
                    data = Object.assign(data, {
                        keyId: this.Recover.keyId
                    })
                    ajaxUpdateKey(data).then(res => {
                        if(res.state === 0){
                            self.$Message.success(res.message)
                            self.getAppServerList()
                            self.Recover.modal = false
                        }else{
                            self.$Message.error(res.message)
                        }
                        self.Recover.loading = false;
                    })
                }else if(this.Recover.type === 'app'){
                    ajaxUpdateApp(data).then(res => {
                        if(res.state === 0){
                            self.$Message.success(res.message)
                            self.getAppServerList()
                            self.Recover.modal = false
                        }else{
                            self.$Message.error(res.message)
                        }
                        self.Recover.loading = false;
                    })
                }
            }
        },
        created(){
            this.getAppServerList()
        }
    }
</script>

<style lang="less">
  @import "~assets/styles/app.less";
</style>