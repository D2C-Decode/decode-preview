import Vue from 'vue';
import { Badge, Button, Card, Field, NavBar, Tabbar, Tab, Tabs } from '@zyf2e/capui-mobile';
import App from './App.vue';

Vue.config.productionTip = false;
// Vue.use(Field);
Vue.use(Badge)
  .use(Button)
  .use(Card)
  .use(Field)
  .use(NavBar)
  .use(Tabbar)
  .use(Tab)
  .use(Tabs);

function main() {
  new Vue({
    render: h => h(App)
  }).$mount('#app');
}

main();
