import ContextMenu from './main';

export default {
  install(Vue) {
    const ContextMenuBox = Vue.extend(ContextMenu);

    Vue.prototype.$LContextMenu = (options) => {
      const instance = new ContextMenuBox().$mount();
      document.body.appendChild(instance.$el);
      return instance.open(options);
    };
  },
};
