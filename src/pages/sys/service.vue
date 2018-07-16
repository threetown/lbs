<template>
    <div class="normal-block-mod tabs-custom-style">
        <Tabs value="mapServer" :animated="false">
            <TabPane label="地图服务" name="mapServer">
                <div class="mormal-tabs-bd">
                    <Row style="margin-bottom: 22px;">
                        <Col span="16">
                            <Select size="large" v-model="severModel" style="width:200px">
                                <Option v-for="item in severList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select size="large" v-model="statusModel" style="width:200px">
                                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="8">
                            <Input size="large" v-model="value4" icon="ios-search-strong" placeholder="请输入用户名称" style="width: 220px;float: right;"></Input>
                        </Col>
                    </Row>
                    <Table border :columns="mapColumns" :data="mapServerData"></Table>
                </div>
            </TabPane>
            <TabPane label="接口服务" name="APIServer">
                <div class="mormal-tabs-bd">
                    接口服务
                </div>
            </TabPane>
            <Button type="primary" icon="ios-plus-outline" slot="extra" size="large">新增服务</Button>
        </Tabs>
    </div>
</template>

<script>
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
                statusList: [
                    {
                        value: '',
                        label: '全部状态'
                    },{
                        value: '1',
                        label: '正常'
                    },{
                        value: '0',
                        label: '异常'
                    }
                ]
            }
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
}
</style>