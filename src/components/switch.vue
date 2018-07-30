<template>
    <span :class="wrapClasses" @click="toggle">
        <span :class="innerClasses">
            <slot name="open" v-if="currentValue"></slot>
            <slot name="close" v-if="!currentValue"></slot>
        </span>
    </span>
</template>

<script>
    // import { oneOf } from 'iview/src/utils/assist';
    import Emitter from 'iview/src/mixins/emitter';

    const prefixCls = 'ivu-switch';

    export default {
        name: 'leon-switch',
        mixins: [ Emitter ],
        props: {
            value: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: 'default',
                // validator (value) {
                //     return oneOf(value, ['large', 'small']);
                // }
            },
            beforeChange: {
                type: Function
            }
        },
        data () {
            return {
                currentValue: this.value
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-checked`]: this.currentValue,
                        [`${prefixCls}-disabled`]: this.disabled,
                        [`${prefixCls}-${this.size}`]: !!this.size
                    }
                ];
            },
            innerClasses () {
                return `${prefixCls}-inner`;
            }
        },
        methods: {
            toggle () {
                if (this.disabled) {
                    return false;
                }
                if(this.beforeChange && (typeof this.beforeChange=='function')) {
                  var status = this.beforeChange.apply(this,[this.currentValue]);
                  if(status == false) return false;
                }
                const checked = !this.currentValue;
                this.currentValue = checked;
                this.$emit('input', checked);
                this.$emit('on-change', checked);
                this.dispatch('FormItem', 'on-form-change', checked);
            }
        },
        watch: {
            value (val) {
                this.currentValue = val;
            }
        }
    };
</script>