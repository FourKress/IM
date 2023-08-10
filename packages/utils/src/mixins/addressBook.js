import { IMGetAllFriendList } from '@lanshu/im';
import { groupedPy, sortedPY } from '../pinyin';
import * as Apis from '../apis';
import ScrollToMixins from './scrollTo';

export default {
  mixins: [ScrollToMixins],
  data() {
    return {
      addressBookList: [],
      addressBookPYObj: [],
      navSelectKey: 'A',
      isSpecial: 'special',
      specialKey: '#',
      scrollView: '',
    };
  },
  computed: {
    pyList() {
      const wordArr = [];
      const keys = Object.keys(this.addressBookPYObj);
      // 拼音排序
      for (let i = 65; i <= 90; i++) {
        const code = String.fromCharCode(i);
        if (keys.includes(code)) {
          wordArr.push(code);
        }
      }
      if (wordArr?.length) {
        if (this.addressBookPYObj[this.isSpecial])
          return [...wordArr, this.specialKey];
        return [...wordArr];
      }
      return wordArr;
    },
  },
  created() {
    this.navSelectKey = 'A';
    this.isSpecial = 'special';
    this.specialKey = '#';
    this.scrollView = '.selected-scroll-view';
  },
  methods: {
    async getFriendListData() {
      if (this.isBot) {
        const res = await Apis.technicalSupportList();
        this.addressBookList = (res?.data || []).map((d) => {
          const { id, nickName, picture } = d;
          return {
            ...d,
            userId: id,
            nickname: nickName,
            avatar: picture,
            checked: false,
            isDefault: false,
          };
        });
      } else {
        const res = await IMGetAllFriendList();
        this.addressBookList = (res?.data || []).map((d) => {
          return {
            ...d,
            checked: false,
            isDefault: false,
          };
        });
      }
      this.initPinYin(this.addressBookList);
    },
    initPinYin(pyBookList) {
      // 数据转为拼音键值对 {A:[], B: []} 类型
      const addressBookPYObj = groupedPy(sortedPY(pyBookList));
      this.navSelectKey = Object.keys(addressBookPYObj)[0];
      this.addressBookPYObj = addressBookPYObj;
    },
    handleRegisterScroll(minTop, maxTop) {
      this.$nextTick(() => {
        if (!this.pyList?.length) return;
        const scrollView = document.querySelector(this.scrollView);
        const lastKey = this.pyList.at(-1).key;
        this.initScrollObserver(scrollView, lastKey, minTop, maxTop);
      });
    },

    filterAddress(key) {
      this.handleScrollTo(
        key,
        document.querySelector(
          `#${key === this.specialKey ? this.isSpecial : key}-group`,
        ),
        this.scrollView,
      );
    },
  },
};
