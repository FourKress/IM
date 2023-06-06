/**
 * 指令合集
 */
const directives = {
  contextMenu: {
    bind(el, binding, vnode) {
      const menuList = binding.value;
      const that = vnode.context;
      const arg = binding.arg;
      const handleOpenContentMenu = (event) => {
        const { clientX, clientY } = event;
        that
          .$LContextMenu({
            menuList,
            position: {
              left: `${clientX}px`,
              top: `${clientY}px`,
            },
          })
          .then((menuItem) => {
            console.log('then', menuItem);
            if (!menuItem) return;
            menuItem.handler && menuItem.handler(arg);
          });
      };
      el.addEventListener('contextmenu', handleOpenContentMenu);
    },
  },
};

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
