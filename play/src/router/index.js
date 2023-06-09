const routes = [];

export const menuRoutes = routes?.map((route) => {
  const { name, path, meta } = route;
  return {
    name,
    path,
    meta,
  };
});
export default routes;
