/**
 * 需要挂载到Vue原型链上的方法
 * 统一由$开头以示区别
 */

import https from './https';
import VueScrollTo from 'vue-scrollto';
import Video from 'video.js';
import 'video.js/dist/video-js.css';

const ScrollTo = VueScrollTo.scrollTo;

const prototypes = {
  https,
  Video,
  ScrollTo,
};

export default {
  install(Vue) {
    Object.keys(prototypes).forEach((key) => {
      Vue.prototype[`$${key}`] = prototypes[key];
    });
  },
};
