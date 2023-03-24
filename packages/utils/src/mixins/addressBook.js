import { groupedPy, sortedPY } from '../pinyin';

export default {
  data() {
    return {
      addressBookList: [
        { nickname: '张三' },
        { nickname: '李四' },
        { nickname: '王五' },
        { nickname: '2' },
        { nickname: '3' },
        { nickname: '4' },
        { nickname: 'a' },
        { nickname: 'b' },
        { nickname: 'c' },
        { nickname: '!' },
        { nickname: '@' },
        { nickname: '#' },
        { nickname: '赵六' },
        { nickname: '钱七' },
        { nickname: '钱1' },
        { nickname: '钱2' },
        { nickname: '钱3' },
        { nickname: '钱4' },
        { nickname: '钱5' },
        { nickname: '钱6' },
        { nickname: '东7' },
        { nickname: '东1' },
        { nickname: '东2' },
        { nickname: '东3' },
        { nickname: '东4' },
        { nickname: '东5' },
        { nickname: '东6' },
      ],
      addressBookPYObj: [],
      pinyinKey: 'A',
      scrollView: null,
      minScrollTop: null,
      maxScrollTop: null,
      scrollTop: 0,
      isSpecial: 'special',
      specialKey: '#',
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
      return wordArr?.length ? [...wordArr, this.specialKey] : wordArr;
    },
  },
  created() {
    this.isSpecial = 'special';
    this.specialKey = '#';
  },
  mounted() {
    // 数据转为拼音键值对 {A:[], B: []} 类型
    const addressBookPYObj = groupedPy(sortedPY(this.addressBookList));
    this.pinyinKey = Object.keys(addressBookPYObj)[0];
    this.addressBookPYObj = addressBookPYObj;
  },
  methods: {
    handleRegisterScroll() {
      this.$nextTick(() => {
        this.scrollView = document.querySelector('.selected-scroll-view');
        this.scrollView.addEventListener('scroll', this.scrollHandle, true);
      });
    },

    scrollHandle() {
      const scrollView = document.querySelector('.selected-scroll-view');
      const { scrollTop } = scrollView;
      // 判断滚动方向
      const isDown = this.scrollTop <= scrollTop;
      this.scrollTop = scrollTop;
      // 遍历节点，定位对应的锚点
      let realKey;
      Object.keys(this.addressBookPYObj).forEach((key) => {
        const pinyinKey = key === this.isSpecial ? this.specialKey : key;
        const offset = document
          .querySelector(`#group-${key}`)
          .getBoundingClientRect();

        const { top, height } = offset;

        if (isDown && top <= this.maxScrollTop) {
          realKey = pinyinKey;
          return;
        }

        if (
          !isDown &&
          ((top < 0 && top * -1 <= (height - this.maxScrollTop) / 3) ||
            (top >= this.minScrollTop && top <= this.maxScrollTop))
        ) {
          realKey = pinyinKey;
        }
      });

      if (realKey) {
        this.pinyinKey = realKey;
      }
    },
    filterAddress(key) {
      setTimeout(() => {
        this.pinyinKey = key;
      }, 100);
      // 滚动描点
      document
        .querySelector(
          `#group-${key === this.specialKey ? this.isSpecial : key}`,
        )
        .scrollIntoView();
    },
  },
  destroyed() {
    if (this.scrollView) {
      this.scrollView.removeEventListener('scroll', this.scrollHandle, true);
    }
  },
};
