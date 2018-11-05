<template>
    <div class="full-block-mod">
        <div class="Header clearfix">
            <h2 class="title">账户列表<strong>关于账户的所有记录</strong></h2>
        </div>
        <Row style="margin-bottom: 22px;">
            <Col span="16">
                <!-- <Select size="large" v-model="search.statusCd" @on-change="getList" style="width: 150px">
                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select> -->
                <Input size="large"
                    v-model.trim="search.keyword"
                    @on-enter="getList"
                    @on-click="getList"
                    icon="ios-search-strong"
                    placeholder="请输入用户名"
                    style="width: 260px;"></Input>
            </Col>
            <Col span="8">
            &nbsp;
                <!-- <Input size="large"
                    v-model.trim="search.keyword"
                    @on-enter="getList"
                    @on-click="getList"
                    icon="ios-search-strong"
                    placeholder="请输入用户名"
                    style="width: 260px;float: right;"></Input> -->
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
            v-model="isOpenDeleteUserModal"
            class-name="custom-modal custom-warning-modal vertical-center-modal"
            width="378">
            <h2 class="title" slot="header">删除用户</h2>
            <div class="content">
                <h3>您确定要删除该用户吗?</h3>
                <p>您将删除用户 {{deleteUser.username}} ，该操作不可逆,请您谨慎操作!</p>
            </div>
            <div slot="footer" >
                <Button type="text" size="large" @click="isOpenDeleteUserModal = !isOpenDeleteUserModal">取消</Button>
                <Button type="primary" size="large" :loading="deleteUser.loading" @click.prevent="handlerDeleteUser">确认</Button>
            </div>
        </Modal> <!-- 删除 -->

        <user-details v-if="userModal" :currentUser="currentUser" @closeUserDetails="closeUserDetails"></user-details>
    </div>
</template>

<script>
    import { ajaxPostUserList, ajaxPostDeleteUser } from 'src/service/user';

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
                    // { value: 2, label: '删除(预警)' },
                    // { value: 3, label: '离职' },
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
                    { title: '联系方式', key: 'telephone', align: 'center' },
                    { title: '帐户余额', key: 'ableAmount', align: 'center' },
                    // { title: '注册时间', key: 'createdDt', width: 136, align: 'center' },
                    { title: '状态', key: 'statusCd', align: 'center', width: 110, render: (h, params) => {
                            let texts = '';
                            let classname = '';
                            if(params.row.statusCd === 1){
                                classname = 'status-success'
                            }else if(params.row.statusCd === 4){
                                classname = 'status-waiting'
                            }
                            texts = this.statusList.find((v) => { return v.value === params.row.statusCd}).label;
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
                            // }, '配额管理')
                        ]);
                        }
                    }
                ],
                userModal: false,
                currentUser: {},
                isOpenDeleteUserModal: false,
                deleteUser: {
                    loading: false,
                    username: '',
                    staffId: ''
                }
            }
        },
        methods: {
            closeUserDetails(){
                this.userModal = false;
            },
            triggerDeleteUser(params){
                this.deleteUser.username = params.row.staffName;
                this.deleteUser.staffId = params.row.staffId
                this.isOpenDeleteUserModal = true;
            },
            handlerDeleteUser(){
                const self = this;
                this.deleteUser.loading = true;
                ajaxPostDeleteUser(self.deleteUser.staffId).then(res => {
                    if(res.state === 0){
                        self.isOpenDeleteUserModal = false;
                        self.getList()
                        self.$Message.success(res.message)
                    }else{
                        self.$Message.error(res.message)
                    }
                    this.deleteUser.loading = false;
                })
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
                        if(result && result.data && result.data.rows && result.data.rows.length){
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
                    self.record.loadTips = '糟糕，服务器内部错误!';//'错误提示：' + reason.statusText + '（'+ reason.status +'）';
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