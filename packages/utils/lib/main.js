export * from '../src/constant';
export * from '../src/times-transform';
export * from '../src/emoji';
export * from '../src/token';
export * from '../src/base';
export * from '../src/pinyin';
import lodash from 'lodash';
import generateRoute, { routeInstance } from '../src/router';
import generateStore, { stareInstance } from '../src/store';
import regexUtils from '../src/regex';
import AddressBookMixins from '../src/mixins/addressBook';
import PhoneNumMixins from '../src/mixins/phoneNum';
import RecoverAccountMixins from '../src/mixins/recoverAccount';

export {
  lodash,
  generateRoute,
  generateStore,
  routeInstance,
  stareInstance,
  regexUtils,
  AddressBookMixins,
  PhoneNumMixins,
  RecoverAccountMixins,
};
