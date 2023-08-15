const handleOpenContentMenu = (el, binding, vnode) => {
  const menuList = binding.value;
  const that = vnode.context;
  const arg = binding.arg;

  if (!menuList?.length) return;

  const handleOpenContentMenu = (event) => {
    const { clientX, clientY } = event;
    const { clientWidth, clientHeight } = document.body;

    let top = clientY;
    const maxTop = clientHeight - (18 + 40 * menuList.length) - 10;
    if (maxTop <= clientY) {
      top = maxTop;
    }
    that
      .$LContextMenu({
        menuList,
        menuItemParams: arg,
        position: {
          left: `${Math.min(clientX, clientWidth - 140)}px`,
          top: `${top}px`,
        },
      })
      .then((menuItem) => {
        if (!menuItem) return;
        menuItem.handler && menuItem.handler(arg);
      });
  };
  el.addEventListener('contextmenu', handleOpenContentMenu);
};

/**
 * 指令合集
 */
const directives = {
  contextMenu: {
    bind(el, binding, vnode) {
      handleOpenContentMenu(el, binding, vnode);
    },
    componentUpdated(el, binding, vnode) {
      handleOpenContentMenu(el, binding, vnode);
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
