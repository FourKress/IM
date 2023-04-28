import { MICRO_KEY_MAP, MICRO_CONTAINER } from '@lanshu/utils';

const container = `#${MICRO_CONTAINER}`;

const microAppConfigs = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {
    name: MICRO_KEY_MAP.IS_SYSTEM,
    entry: '//localhost:5000/',
    container,
  },
  {
    name: MICRO_KEY_MAP.IS_KNOWLEDGE_BASE,
    entry: '//localhost:7777/',
    container,
  },
];

export default microAppConfigs;
