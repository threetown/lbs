<template>
   <div>
       <div class="full-block-mod">
            <div class="Header clearfix">
                <h2 class="title">业务管理（28/90）<strong>用户申请提升配额的记录</strong></h2>
            </div>
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
                    <Input size="large" v-model="searchKey" icon="ios-search-strong" placeholder="请输入关键字" style="width: 220px;float: right;"></Input>
                </Col>
            </Row>
            <Table border :columns="mapColumns" :data="mapServerData"></Table>
       </div>
   </div>
</template>

<script>
    export default {
        data () {
            return {
                severModel: '',
                statusModel: '',
                searchKey: '',
                mapColumns: [
                    {
                        title: '业务内容',
                        key: 'name'
                    },
                    {
                        title: '对象ID',
                        key: 'objectID'
                    },
                    {
                        title: 'URL',
                        key: 'url'
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
                        objectID: '20180611',
                        url: 'New York No. 1 Lake Park',
                        status: '正常'
                    },
                    {
                        name: 'www',
                        objectID: '20180611',
                        url: 'New York No. 1 Lake Park',
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