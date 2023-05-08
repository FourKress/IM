export * from '../src/constant';
export * from '../src/times-transform';
export * from '../src/emoji';
export * from '../src/token';
export * from '../src/base';
export * from '../src/pinyin';
import lodash from 'lodash';
import qrcode from 'qrcode';
import generateRoute, { routeInstance } from '../src/router';
import generateStore, { storeInstance } from '../src/store';
import regexUtils from '../src/regex';
import AddressBookMixins from '../src/mixins/addressBook';
import PhoneNumMixins from '../src/mixins/phoneNum';
import RecoverAccountMixins from '../src/mixins/recoverAccount';
import FriendMixins from '../src/mixins/friend';
import https from '../src/https';
import VuePrototype from '../src/VuePrototype';
import * as Apis from '../src/apis';

export {
  lodash,
  qrcode,
  generateRoute,
  generateStore,
  routeInstance,
  storeInstance,
  regexUtils,
  AddressBookMixins,
  PhoneNumMixins,
  RecoverAccountMixins,
  FriendMixins,
  https,
  VuePrototype,
  Apis,
};
