import Confirm from './main';

export default {
  install(Vue) {
    const ConfirmBox = Vue.extend(Confirm);

    Vue.prototype.$LConfirm = (options) => {
      const instance = new ConfirmBox().$mount();
      document.body.appendChild(instance.$el);
      return instance.open(options);
    };
  },
};
