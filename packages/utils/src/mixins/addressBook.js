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
    };
  },
  computed: {
    pyList() {
      const wordArr = [];
      const keys = Object.keys(this.addressBookPYObj);
      for (let i = 65; i <= 90; i++) {
        const code = String.fromCharCode(i);
        if (keys.includes(code)) {
          wordArr.push(code);
        }
      }
      return wordArr?.length ? [...wordArr, '#'] : wordArr;
    },
  },
  mounted() {
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
      const isDown = this.scrollTop <= scrollTop;
      this.scrollTop = scrollTop;

      let realKey;
      Object.keys(this.addressBookPYObj).forEach((key) => {
        const pinyinKey = key === 'special' ? '#' : key;
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
      document
        .querySelector(`#group-${key === '#' ? 'special' : key}`)
        .scrollIntoView();
    },
  },
  destroyed() {
    if (this.scrollView) {
      this.scrollView.removeEventListener('scroll', this.scrollHandle, true);
    }
  },
};
