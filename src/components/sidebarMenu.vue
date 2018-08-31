<template>
    <Menu :active-name="activeName" :theme="theme" :open-names="openNames"  @on-select="changeMenu" width="auto">
        <template v-for="item in MenuList">
            <!-- <MenuItem v-if="item.children.length<1" :name="item.children[0].name" :key="item.path">
                <i class="iconfont" :class="item.meta.icon"></i> {{item.title}}
            </MenuItem> -->
            <Submenu v-if="item.children.length >= 1" :name="item.name" :key="item.path">
                <template slot="title">
                    <i class="iconfont" :class="item.meta.icon"></i><span>{{item.title}}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.name" :key="child.name"><span>{{ child.title }}</span></MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
    export default {
        name: 'sideBar',
        props: {
            MenuList:{
                type: Array
            },
            theme: {
                type: String,
                default: 'dark'
            },
            activeName: {
                type: String
            },
            openNames: {
                type: Array
            }
        },
        methods: {
            changeMenu(active) {
                this.$emit('on-change', active)
            }
        }
    }
</script>
