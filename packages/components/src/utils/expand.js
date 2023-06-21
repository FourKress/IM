// JSX Render渲染器

export default {
  props: {
    render: Function,
  },
  name: 'confirmRender',
  functional: true,
  render: (h, ctx) => {
    return ctx.props.render(h);
  },
};
