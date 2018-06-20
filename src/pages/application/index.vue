<template>
    <div>
        <div class="full-block-mod">
            <div class="Header clearfix">
                <h2 class="title">我的应用 <strong>您可以在这里创建、设置并管理您的应用及Key</strong></h2>
                <Button class="fr" type="primary" icon="ios-plus-outline" slot="extra" size="large" @click="isOpenCreateAppModal = !isOpenCreateAppModal">创建新应用</Button>
            </div>
            
            <div class="collapse">
                <div class="panel">
                    <div class="hd">
                        <Row>
                            <Col span="4" class="title">
                                <Icon type="ios-list"></Icon>智慧楼盘
                            </Col>
                            <Col span="4">2018-05-08创建</Col>
                            <Col span="14" class="action">
                                <Icon type="compose"></Icon>
                                <Icon type="trash-a" @click="deleteItem"></Icon>
                                <Button class="btn-blue" type="ghost">添加新key</Button>
                            </Col>
                            <Col span="2" class="tac"><Icon type="ios-arrow-down"></Icon></Col>
                        </Row>
                    </div>
                    <div class="bd">
                        <Table border :columns="mapColumns" :data="mapServerData" class="appTable"></Table>
                    </div>
                </div>
                <div class="panel">
                    <div class="hd">
                        <Row>
                            <Col span="4" class="title">
                                <Icon type="ios-list"></Icon>智慧楼盘
                            </Col>
                            <Col span="4">2018-05-08创建</Col>
                            <Col span="14" class="action">
                                <Icon type="compose"></Icon>
                                <Icon type="trash-a" @click="deleteItem"></Icon>
                                <Button class="btn-blue" type="ghost">添加新key</Button>
                            </Col>
                            <Col span="2" class="tac"><Icon type="ios-arrow-down"></Icon></Col>
                        </Row>
                    </div>
                    <div class="bd" style="display: none;">
                        <Table border :columns="mapColumns" :data="mapServerData"></Table>
                    </div>
                </div>
                <div class="panel">
                    <div class="hd">
                        <Row>
                            <Col span="4" class="title">
                                <Icon type="ios-list"></Icon>智慧楼盘
                            </Col>
                            <Col span="4">2018-05-08创建</Col>
                            <Col span="14" class="action">
                                <Icon type="compose"></Icon>
                                <Icon type="trash-a"></Icon>
                                <Button class="btn-blue" type="ghost">添加新key</Button>
                            </Col>
                            <Col span="2" class="tac"><Icon type="ios-arrow-down"></Icon></Col>
                        </Row>
                    </div>
                    <div class="bd" style="display: none;">
                        <Table border :columns="mapColumns" :data="mapServerData"></Table>
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
            <h2 class="title" slot="header">创建应用</h2>
            <Form :model="createAppForm" ref="createAppForm" :rules="ruleCreateApp" :label-width="80" class="custom-form">
                <FormItem label="应用名称" prop="name">
                    <Input v-model="createAppForm.name" :placeholder="createAppForm.placeholder.name"></Input>
                </FormItem>
                <FormItem label="应用类型" prop="type">
                    <Select v-model="createAppForm.type" :placeholder="createAppForm.placeholder.type">
                        <Option value="beijing">New York</Option>
                        <Option value="shanghai">London</Option>
                        <Option value="shenzhen">Sydney</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer" >
                <Button type="text" size="large" @click="closeCreateAppModal('createAppForm')">取消</Button>
                <Button type="primary" size="large" @click.prevent="createApp('createAppForm')">提交</Button>
            </div>
        </Modal> <!-- 创建应用 -->
    </div>
</template>

<script>
    export default {
        data () {
            return {
                isOpenCreateAppModal: false,
                isOpenDeleteModal: false,
                curOpen: 1,
                mapColumns: [
                    {
                        title: 'Key名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: 'Key名称',
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
                                            this.createItem(params.id)
                                        }
                                    }
                                }, '提升配额')
                            ]);
                        }
                    }
                    
                ],
                mapServerData: [
                    {
                        id: '1',
                        name: 'www',
                        key: '20180611',
                        type: 'New York No. 1 Lake Park'
                    },
                    {
                        id: '3',
                        name: 'www',
                        key: '20180611',
                        type: 'New York No. 1 Lake Park'
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
                        self.isOpenCreateAppModal = false;
                    }
                })
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
            }
        }
    }
</script>

<style lang="less">
    .clearfix:after{content:'\0020';display:block;height:0;clear:both;visibility:hidden;}
    .clearfix{*zoom:1;}
    .fr{float: right;}
    .tar{text-align: right;}
    .tac{
        text-align: center;
    }
    .full-block-mod{
        padding: 30px;
        background-color: #fff;
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
            }
            .bd{

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