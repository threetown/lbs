<template>
    <div class="marqueeWrapper">
        <ul class="marqueeTitle">
            <span class="title">{{marqueeTitle}}</span>
        </ul>
        <ul v-show="!empty" class="marqueeList js-scrollList-marqueeCircle" :style="{'height': marqueeListH}" >
            <li v-show="!empty" v-for="item in marqueeData" class="marqueeRow">
                <div class="marqueeLine"></div>
                <div class="marqueeColLeft" :title="item.title + item.info + item.createTime">
                    <span class="rowWeight">{{item.title}}</span>
                    <span class="rowHigh">{{item.info}}</span>
                </div>
                <div class="marqueeColRight">{{item.createTime}}</div>
            </li>
        </ul>
        <ul v-show="empty" style="padding: 11px 24px;" :style="{'height': marqueeListH}"> 
            <p style="font-size:14px;margin-top:180px;text-align: center;">暂无数据</p>
        </ul>
    </div>    
</template>

<script>
import '@/lib/jquery-advanced-news-ticker/newsTicker';

export default {
    name: "marqueeCircle",
    props:['marqueeData','marqueeTitle','marqueeLength',"isEmpty"],
    data: function () {
        return {
            empty:this.isEmpty,
            marqueeListH:  '116px'
        }
    },
    mounted(){
        $('.js-scrollList-marqueeCircle').newsTicker({
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
    padding: 11px 24px;
}

.marqueeRow{
    height: 32px;
    overflow: hidden;
    clear: both;
    color: #999;
    font-size: 14px;
    line-height: 32px;

}
.marqueeLine{
    position: relative;
    width: 20px;
    height: 32px;
    float: left;
}

.marqueeRow:not(:last-child) > .marqueeLine::before{
    content: '';
    top:0;
    position: absolute;
    left:9px;
    height: 32px;
    border-left: 2px solid #f0f0f0;
}

.marqueeRow:first-child>.marqueeLine::before{
    content: '';
    top:12px !important;
    position: absolute;
    left:9px;
    height: 32px;
    border-left: 2px solid #f0f0f0;
}
.marqueeRow:last-child>.marqueeLine::before{
    content: '';
    top:0px !important;
    position: absolute;
    left:9px;
    height: 16px;
    border-left: 2px solid #f0f0f0;
}

.marqueeLine::after{
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    top:10px;
    left:4px;
    border:2px solid #108EFF;
    border-radius: 50%;
    background-color:#fff;
}

.marqueeColLeft{
    width: calc(100% - 166px);
    float: left;
    margin-left: 10px;
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

.rowWeight{
    color:#333;
    font-weight: bolder;
    margin-right: 6px;
}

.rowHigh{
    color:#108EFF;
}
</style>


