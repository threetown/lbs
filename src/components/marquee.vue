<template>
    <div class="marqueeWrapper">
        <ul class="marqueeTitle">
            <span class="title">{{marqueeTitle}}</span>
            <span class="more" @click="moreClick">更多</span>
        </ul>
        <ul v-show="!empty" class="marqueeList js-scrollList-marquee" :style="{'height': marqueeListH}" >
            <li v-show="!empty" v-for="item in marqueeData" class="marqueeRow">
                <div class="marqueeColLeft" :title="item.title + item.info + item.createTime">
                    <span class="rowHigh">{{item.title}}</span>
                    <span v-if="item.title1">的{{item.title1}}中</span>
                    <span v-if="item.title2" class="rowHigh">{{item.title2}}</span>
                    <span>{{item.info}}</span>
                </div>
                <div class="marqueeColRight">{{item.createTime}}</div>
            </li>
        </ul>
        <ul v-show="empty" style="padding: 10px 24px;" :style="{'height': marqueeListH}">
            <p style="font-size:14px;margin-top:60px;text-align: center;">暂无数据</p>
        </ul>
    </div>  
</template>

<script>
import '@/lib/jquery-advanced-news-ticker/newsTicker';

export default {
    name: "marquee",
    props:['marqueeData','marqueeTitle','marqueeLength',"isEmpty"],
    data: function () {
        return {
            empty:this.isEmpty,
            marqueeListH:  '116px'
        }
    },
    mounted(){
        $('.js-scrollList-marquee').newsTicker({
            max_rows: this.marqueeLength
        });
        this.marqueeListH = (32*this.marqueeLength + 20)+'px';
    },
    methods:{
        moreClick(){
            this.$emit("moreClick");
        }
    }
}
</script>
<style scoped>
.marqueeWrapper{
    background: #fff;
}

.marqueeTitle{
    height: 55px;
    border-bottom: 1px solid rgb(233, 233, 233);
}

.title{
    float: left;
    padding-left: 24px;
    font-size: 16px;
    line-height: 55px;
    font-weight: bold;
    text-align: center;
}

.more{
    float: right;
    padding-right: 24px;
    font-size: 12px;
    line-height: 55px;
    text-align: center;
    color:#108EFF;
    cursor: pointer;
}

.marqueeList{
    padding: 10px 24px;
}

.marqueeRow{
    height: 32px;
    overflow: hidden;
    clear: both;
    color: #999;
    font-size: 14px;
    line-height: 32px;
}

.marqueeColLeft{
    width: calc(100% - 136px);
    float: left;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.marqueeColRight{
    width: 136px;
    float: left;
    text-align: right;
}

.rowHigh{
    color:#108EFF;
    margin-right: 6px;
}
</style>


