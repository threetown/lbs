<template>
    <div class="full-block-mod">
        <div class="Header clearfix">
            <h2 class="title">用户列表<strong>关于用户的所有记录</strong></h2>
        </div>
        <Row style="margin-bottom: 22px;">
            <Col span="16">
                <Select size="large" v-model="search.statusCd" @on-change="getList" style="width: 150px">
                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col span="8">
                <Input size="large"
                    v-model.trim="search.keyword"
                    @on-enter="getList"
                    @on-click="getList"
                    icon="ios-search-strong"
                    placeholder="请输入用户名或昵称"
                    style="width: 260px;float: right;"></Input>
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

        <user-details v-if="userModal" :currentUser="currentUser" @closeUserDetails="closeUserDetails"></user-details>
    </div>
</template>

<script>
    import { ajaxPostUserList } from 'src/service/user';

    import userDetails from "./components/userDetails"
    
    export default {
        name: 'personal-record',
        components: {
            userDetails
        },
        data () {
            return {
                statusList: [
                    { value: 1, label: '在用' },
                    { value: 2, label: '删除(预警)' },
                    { value: 3, label: '离职' },
                    { value: 4, label: '冻结(异常)' }
                ],
                search: {
                    statusCd: 1,
                    keyword: ''
                },
                record: {
                    loadTips: '努力加载中，请稍等。。。',
                    loading: false,
                    data: [],
                    total: 0,
                    rows: 10,
                    page: 1
                },
                recordColumns: [
                    { title: '用户名', key: 'staffName', align: 'center' },
                    { title: '用户昵称', key: 'loginName', align: 'center' },
                    { title: '联系方式', key: 'telephone', width: 126, align: 'center' },
                    { title: '注册时间', key: 'createdDt', width: 136, align: 'center' },
                    { title: '状态', key: 'statusCd', align: 'center', width: 110, render: (h, params) => {
                            let texts = '';
                            let classname = '';
                            if(params.row.statusCd === 1){
                                classname = 'status-success'
                            }else if(params.row.statusCd === 2){
                                classname = 'status-error'
                            }else if(params.row.statusCd === 3){
                                classname = 'status-waiting'
                            }else if(params.row.statusCd === 4){
                                classname = 'status-waiting'
                            }
                            texts = this.statusList.find((v) => { return v.value === params.row.statusCd}).label;;
                            return h('div',{},[
                                h('span', {
                                    class: classname,
                                }, texts)
                            ])
                        }
                    },
                    { title: '操作', key: 'level', align: 'center', render: (h, params) => {
                        return h('div', {class: 'action-group'}, [
                            h('span', {
                                class: 'items',
                                on: {
                                    click: () => {
                                        this.triggerUserModal(params.row)
                                    }
                                }
                            }, '帐户详情'),
                            // h('span', {
                            //     class: 'items',
                            //     on: {
                            //         click: () => {
                            //             // this.triggerCreateQuotaModal(params, 'edit')
                            //         }
                            //     }
                            // }, '配额管理'),
                            // h('span', {
                            //     class: 'items',
                            //     on: {
                            //         click: () => {
                            //             // this.triggerCreateQuotaModal(params, 'edit')
                            //         }
                            //     }
                            // }, '个人资料'),
                            h('span', {
                                class: 'items',
                                on: {
                                    click: () => {
                                        // this.triggerDeleteModel(params, params.index, 'key')
                                    }
                                }
                            }, '删除')
                        ]);
                        }
                    }
                ],
                userModal: false,
                currentUser: {}
            }
        },
        methods: {
            closeUserDetails(){
                this.userModal = false;
            },
            getList(params){
                const self = this;
                let data = {
                    page: this.record.page,
                    rows: this.record.rows
                }
                data = Object.assign(data, params)
                if(this.search.statusCd){
                    data = Object.assign(data, {statusCd: self.search.statusCd})
                }
                if(this.search.keyword){
                    data = Object.assign(data, {searchName: self.search.keyword})
                }

                this.record.loading = true;
                this.record.loadTips = '努力加载中，请稍等...'
                this.record.state = 'loading'

                ajaxPostUserList(data).then(res=>{
                    if(res.state === 0){
                        let result = res.data;
                        if(result && result.data && result.data.rows.length){
                            self.record.data = result.data.rows;
                            self.record.total = result.data.total;
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
            changeQueryPage(v){
                this.getList({ page: v })
            },
            triggerUserModal(params){
                this.userModal = true;
                this.currentUser = params;
            },
            init(){
                this.getList()
            }
        },
        created(){
            this.init()
        }
    }
</script>

<style lang="less">
    .custom-tables{
        width: 100%;
        border: 1px solid #ccc;
        td{
            border: 1px solid #ccc;
        }
    }
</style>