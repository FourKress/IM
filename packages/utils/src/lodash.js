import lodash, { throttle } from 'lodash';

export const _throttle = (fun, wait = 20) =>
  throttle(fun, wait, {
    leading: true,
    trailing: false,
  });

export default lodash;
