<template>
  <div id="app">
    <div id="preview" ref="preview"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import { postMsgToParent } from '@/utils/utils'
import html2canvas from 'html2canvas';
// 域名设置，本地localhost域名设置将会报错，所以需要try catch
try {
  document.domain = "91fkys.com"
} catch (e) {
  // ignore
}

export default {
  name: 'App',
  data() {
    return {
      id: null,
      html: '',
      js: '',
      css: '',
      component: null,
    };
  },
  mounted() {
    // this.renderCode('init')
    window.addEventListener('message', (e) => {
      // 不接受消息源来自于当前窗口的消息
      if (e.source === window || e.data === 'loaded') {
        return;
      }
      this[e.data.type](e.data.data);
    });
  },
  methods: {
    init(code) {
      const { css, vueHtml, vueData } = code
      this.html = vueHtml
      this.css = css
      this.js = 
      `
      return {
        data() {
          return ${JSON.stringify(vueData, null, 2)}
        },
        methods: {}
      }      
      `
      if (this.html !== '' && this.js !== '') {
        const parseStrToFunc = new Function(this.js)();
        parseStrToFunc.template =  this.html;
        const Component = Vue.extend( parseStrToFunc );
        this.component = new Component().$mount();
        const el = this.$refs.preview
        // 先删除子节点 再新增
        el.innerHTML = ''

        el.appendChild(this.component.$el);

        // 设置css
        this.setCss()

        this.$nextTick(() => {
          postMsgToParent({
            type: 'reDraw'
          })
        })
      }
    },
    setCss() {
      if (this.id) {
        // 如果存在id  先删除 stylesheet
        const style = document.getElementById(this.id)
        if (style) document.head.removeChild(style)
      }
      this.id = Date.now()

      if (this.css !== '') {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = this.id;
        style.innerHTML = this.css;
        document.head.appendChild(style);
      }
    },
    combineNodesToImage(node) {
      const el = document.getElementsByClassName(node.className)[0]
      html2canvas(el, { allowTaint: true, useCORS: true, backgroundColor: null }).then(canvas => {
        postMsgToParent({
          type: 'combineNodesToImage',
          data: {
            node,
            imageUrl: canvas.toDataURL()
          }
        })
      })
    }
  }
};
</script>
<style lang="scss">
#app {
  position: relative;
}
</style>
