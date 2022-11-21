import { throttle } from 'lodash';

export const _throttle = (fun, wait = 1000) =>
  throttle(fun, wait, {
    leading: true,
    trailing: false,
  });
