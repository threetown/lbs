<template>
   <Tabs value="mapServer">
        <TabPane label="地图服务" name="mapServer">
            <Table border :columns="mapColumns" :data="mapServerData"></Table>
        </TabPane>
        <TabPane label="接口服务" name="APIServer">
        
        </TabPane>
    </Tabs>
</template>

<script>
    export default {
        data () {
            return {
                mapColumns: [
                    {
                        title: '服务内容',
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
                ]
            }
        }
    }
</script>
