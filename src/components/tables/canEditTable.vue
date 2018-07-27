<template>
    <div>
        <Table 
            class="can-edit-table"
            :ref="refs"
            :columns="columnsList"
            :data="thisTableData"
            @on-selection-change="selectChange"
            border disabled-hover></Table>
    </div>
</template>

<script>

const incellEditBtn = (vm, h, param) => {
    if (vm.hoverShow) {
        return h('div', {
            'class': {
                'show-edit-btn': vm.hoverShow
            }
        }, [
            h('Button', {
                props: { type: 'text', icon: 'edit' },
                on: {
                    click: (event) => {
                        vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                        // 从选中数组
                        vm.edittingStore.forEach(element => {
                            vm.selectStore.forEach(el => {
                                if(element.mapCode === el.mapCode){ // TODO: mapCode
                                    element = Object.assign(element, { '_checked': true })
                                }
                            })
                        });
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    }
                }
            })
        ]);
    } else {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'edit'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    // 从选中数组
                    vm.edittingStore.forEach(element => {
                        vm.selectStore.forEach(el => {
                            if(element.mapCode === el.mapCode){ // TODO: mapCode
                                element = Object.assign(element, { '_checked': true })
                            }
                        })
                    });
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                }
            }
        });
    }
};
const saveIncellEditBtn = (vm, h, param) => {
    return h('Button', {
        props: {
            type: 'text',
            icon: 'checkmark'
        },
        on: {
            click: (event) => {
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData), param.index, param.column.key);
            }
        }
    });
};
const cellInput = (vm, h, param, item) => {
    return h('InputNumber', {
        props: {
            type: 'text',
            value: vm.edittingStore[param.index][item.key]
        },
        on: {
            'on-change' (event) {
                let key = item.key;
                vm.edittingStore[param.index][key] = event;
            }
        }
    });
};
export default {
    name: 'canEditTable',
    props: {
        refs: String,
        columnsList: Array,
        value: Array,
        url: String,
        editIncell: {
            type: Boolean,
            default: false
        },
        hoverShow: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            columns: [],
            thisTableData: [],
            edittingStore: [],
            selectStore: []
        };
    },
    created () {
        this.init();
    },
    methods: {
        init () {
            let vm = this;
            let editableCell = this.columnsList.filter(item => {
                if (item.editable) {
                    if (item.editable === true) {
                        return item;
                    }
                }
            });
            let cloneData = JSON.parse(JSON.stringify(this.value));
            let res = [];
            res = cloneData.map((item, index) => {
                let isEditting = false;
                if (this.thisTableData[index]) {
                    if (this.thisTableData[index].editting) {
                        isEditting = true;
                    } else {
                        for (const cell in this.thisTableData[index].edittingCell) {
                            if (this.thisTableData[index].edittingCell[cell] === true) {
                                isEditting = true;
                            }
                        }
                    }
                }
                if (isEditting) {
                    return this.thisTableData[index];
                } else {
                    this.$set(item, 'editting', false);
                    let edittingCell = {};
                    editableCell.forEach(item => {
                        edittingCell[item.key] = false;
                    });
                    this.$set(item, 'edittingCell', edittingCell);
                    return item;
                }
            });
            this.thisTableData = res;
            this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
            this.columnsList.forEach(item => {
                if (item.editable) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        if (!currentRow.editting) {
                            if (this.editIncell) {
                                return h('Row', {
                                    props: {
                                        type: 'flex',
                                        align: 'middle',
                                        justify: 'center'
                                    }
                                }, [
                                    h('Col', {
                                        props: {
                                            span: '20'
                                        }
                                    }, [
                                        !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellInput(this, h, param, item)
                                    ]),
                                    h('Col', {
                                        props: {
                                            span: '4'
                                        }
                                    }, [
                                        currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                    ])
                                ]);
                            } else {
                                return h('span', currentRow[item.key]);
                            }
                        } else {
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: currentRow[item.key]
                                },
                                on: {
                                    'on-change' (event) {
                                        let key = param.column.key;
                                        vm.edittingStore[param.index][key] = event.target.value;
                                    }
                                }
                            });
                        }
                    };
                }
            });
        },
        handleBackdata (data) {
            let clonedData = JSON.parse(JSON.stringify(data));
            clonedData.forEach(item => {
                delete item.editting;
                delete item.edittingCell;
                delete item.saving;
            });
            return clonedData;
        },
        selectChange: function (data) {
            const self = this;
            this.selectStore = data;
            if(data && data.length){
                // 从选中数组
                self.edittingStore.forEach(element => {
                    element = Object.assign(element, { '_checked': false })
                    data.forEach(el => {
                        if(element.mapCode === el.mapCode){ // TODO: mapCode
                            element = Object.assign(element, { '_checked': true })
                        }
                    })
                });
            }
            this.$emit('on-select-change', self.edittingStore);
        }
    },
    watch: {
        value (data) {
            this.init();
        }
    }
};
</script>
<style lang="less">
.show-edit-btn{
    padding: 3px 10px;
    display: none;
    margin-left: -10px;
}
.ivu-table-cell:hover .show-edit-btn{
    display: inline-block;
}
.ivu-icon-checkmark{
    color: #19be6b;
}
.can-edit-table{
    .ivu-table td, .ivu-table th{
        height: 40px;
    }
}
</style>
