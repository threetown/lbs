<template>
    <div>
        <div class="full-block-mod">
            <div class="Header clearfix">
                <h2 class="title">我的应用 <strong>您可以在这里创建、设置并管理您的应用及Key</strong></h2>
                <Button class="fr" type="primary" icon="ios-plus-outline" slot="extra" size="large">新增服务</Button>
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
                                <Icon type="trash-a"></Icon>
                                <Button type="blue">添加新key</Button>
                            </Col>
                            <Col span="2" class="tac"><Icon type="ios-arrow-down"></Icon></Col>
                        </Row>
                    </div>
                    <div class="bd">
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
                                <Button type="blue">添加新key</Button>
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
                                <Button type="blue">添加新key</Button>
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
    </div>
</template>

<script>
    export default {
        data () {
            return {
                curOpen: 1,
                mapColumns: [
                    {
                        title: 'Key名称',
                        key: 'name'
                    },
                    {
                        title: 'Key名称',
                        key: 'key'
                    },
                    {
                        title: '绑定服务',
                        key: 'type'
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
                        key: '20180611',
                        type: 'New York No. 1 Lake Park'
                    },
                    {
                        name: 'www',
                        key: '20180611',
                        type: 'New York No. 1 Lake Park'
                    }
                ]
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
                    .ivu-btn-blue{
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
</style>