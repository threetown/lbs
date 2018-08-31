<template>
    <div class="full-block-mod">
        <div class="Header clearfix">
            <h2 class="title">配置模板<strong>您可以在这里创建您的配置模板</strong></h2>
            <Button class="fr" type="primary" slot="extra" size="large" @click="triggerSolutionModal">服务维护</Button>
        </div>
        <Row style="min-height: 380px;">
            <Col span="4">
                <ul class="Menu">
                    <li class="Menu-item" v-if="solution.loading" v-for="i in 3" style="background-color: #f7f7f7"></li>
                    <li v-if="!solution.loading" class="Menu-item"
                        :class="items.code === solution.curType ? 'selected' : ''"
                        @click="handleSolution(items.code)"
                        v-for="items in solution.data">{{items.name}}</li>
                </ul>
            </Col>
            <Col span="19" offset="1">
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
            </Col>
        </Row>
        <Modal
            v-model="isOpenSolutionModal"
            class-name="custom-modal vertical-center-modal"
            width="782">
            <Icon type="ios-close-empty" slot="close" @click="closeSolutionModal('solutionAppForm')"></Icon>
            <h2 class="title" slot="header">服务维护</h2>
            <Form :model="solutionAppForm" ref="solutionAppForm" :rules="ruleSolutionApp" :label-width="120" class="custom-form">
                <FormItem :label="`${items.name}：`" v-for="items in serviceTypeResource" :key="items.code">
                    <CheckboxGroup v-model="solutionAppForm.serviceNames">
                        <Checkbox v-for="item in items.children" :label="item.serviceName" :key="item.serviceId"></Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
            <Spin size="large" fix v-if="solutionAppForm.spinShow"></Spin>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeSolutionModal('solutionAppForm')">取消</Button>
                <Button type="primary" size="large" :loading="solutionAppForm.loading" @click.prevent="handleSolutionModal('solutionAppForm')">提交</Button>
            </div>
        </Modal> <!-- 服务维护 -->
    </div>
</template>

<script>
    import { ajaxAppType, ajaxServiceType } from 'src/service/application'
    import { ajaxFindSolution, ajaxInsertSolution } from 'src/service/solution'

    export default {
        name: 'personal-record',
        data () {
            return {
                solution: {
                    data: [],
                    curType: '',
                    state: 'loading',
                    loading: false,
                    loadTips: '努力加载中，请稍等...',
                },
                isOpenSolutionModal: false,
                solutionAppForm: {
                    loading: false,
                    serviceNames: []
                },
                serviceTypeResource: [],
                ruleSolutionApp: {
                    code: [
                        { required: true, message: "请选择应用名称", trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: "请选择应用类型", trigger: 'change' }
                    ]
                },
                recordColumns: [
                    { title: '应用名称', key: 'serviceName', align: 'center' },
                    { title: '服务ID', key: 'serviceId', align: 'center' },
                    { title: '服务名称', key: 'serviceName', align: 'center'},
                    { title: '日调用量', key: 'dailyTotalCnt', align: 'center' },
                    { title: '并发量', key: 'concurrencyMax', align: 'center' },
                    { title: '状态', key: 'statusCd', align: 'center', width: 95 },
                ],
                record:{
                    data: [],
                    state: 'loading',
                    loading: false,
                    loadTips: '努力加载中，请稍等...',
                    page: 1,
                    rows: 10,
                    total: 0,
                    spinShow: false
                }
            }
        },
        methods: {
            changeQueryPage(v){
                this.record.page = v;
                this.getList()
            },
            triggerSolutionModal(){
                this.isOpenSolutionModal = true;
                // 选中
                this.getAllSolution()
            },
            getAllSolution(params){
                const self = this;
                let data = {
                    solutionCode: this.solution.curType,
                    rows: 1000
                }
                this.solutionAppForm.spinShow = true;
                data = Object.assign(data, params)
                ajaxFindSolution(data).then(res => {
                    let result = res.data.data;
                    if(result.length){
                        self.solutionAppForm.serviceNames = result.map(item => item.serviceName);
                    }
                    self.solutionAppForm.spinShow = false;
                })
            },
            closeSolutionModal(name){
                this.$refs[name].resetFields();
                this.isOpenSolutionModal = false;
            },
            handleSolutionModal(name){
                const self = this;
                let data = {
                    solutionCode: this.solution.curType,
                    serviceIds: this.serviceIds
                }
                this.solutionAppForm.loading = true;
                ajaxInsertSolution(data).then(res => {
                    if(res.state === 0){
                        self.$Message.success(res.message)
                        self.closeSolutionModal(name);
                        self.getList()
                    }else{
                        self.$Message.error(res.message)
                    }
                    self.solutionAppForm.loading = false;
                }).catch( reason => {
                    self.$Message.error('错误提示：' + reason.statusText + '（'+ reason.status +'）')
                })
            },
            handleSolution(v){
                this.solution.curType = v;
                this.getList()
            },
            getServerTypeList(){
                const self = this;
                ajaxServiceType().then(res => {
                    if(res.state === 0){
                        let result = res.data.serviceInfo;
                        if(result && result.length){
                            self.serviceTypeResource = result;
                        }
                    }
                })
            },
            getList(params){
                const self = this;
                let data = {
                    solutionCode: this.solution.curType,
                    page: this.record.page,
                    rows: this.record.rows
                }
                data = Object.assign(data, params)

                this.record.loading = true;
                this.record.loadTips = '努力加载中，请稍等...'
                this.record.state = 'loading';
                ajaxFindSolution(data).then(res => {
                    if(res.state === 0){
                        let result = res.data;
                        if(result && result.data && result.data.length){
                            self.record.data = result.data;
                            self.record.total = result.total;
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
                    self.record.loadTips = '错误提示：' + reason.statusText + '（'+ reason.status +'）';
                })
            },
            getAppTypeList(){
                const self = this;
                this.record.loading = true;
                this.solution.loading = true;
                this.solution.loadTips = "努力加载中，请稍等..."
                ajaxAppType('solution_code').then(res => {
                    if(res.state === 0){
                        self.solution.data = res.data.dict;
                        self.solution.curType = res.data.dict[0].code;
                        self.solution.loading = false;
                    }else{
                        this.solution.loadTips = "糟糕，加载失败！"
                    }
                    
                }).then(res => {
                    this.getList()
                })
            },
            init(){
                this.getAppTypeList()
                this.getServerTypeList()
            }
        },
        computed: {
            serviceTypeResourceChildren(){
                let arr = this.serviceTypeResource.map(item => item.children)
                return [].concat.apply([],arr)
            },
            serviceIds(){
                const self = this;
                return this.serviceTypeResourceChildren.filter(v => self.solutionAppForm.serviceNames.includes(v.serviceName)).map(item => item.serviceId)
            }
        },
        created(){
            this.init()
        }
    }
</script>

<style lang="less" scoped>
.Menu{
    color: #515a6e;
    font-size: 14px;
    position: relative;
    min-width: 180px;
    max-width: 200px;
    &:after {
        content: "";
        display: block;
        width: 1px;
        height: 100%;
        background: #dcdee2;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 1;
    }
    &-item {
        padding: 14px 24px;
        position: relative;
        display: block;
        outline: 0;
        list-style: none;
        font-size: 14px;
        z-index: 1;
        cursor: pointer;
        min-height: 50px;
        transition: all .2s ease-in-out;
        &:hover{
            color: #2d8cf0;
        }
        &.selected{
            color: #2d8cf0;
            background: #f0faff;
            z-index: 2;
            &:after {
                content: "";
                display: block;
                width: 2px;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                background: #2d8cf0;
            }
        }
    }
}
</style>
