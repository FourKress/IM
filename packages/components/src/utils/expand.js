// JSX Render渲染器

export default {
  name: 'ConfirmRender',
  functional: true,
  props: {
    info: Object,
    render: Function,
  },
  render: (h, ctx) => {
    return ctx.props.render(h, ctx.props.info);
  },
};
