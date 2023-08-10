import lodash from 'lodash';

export default {
  data() {
    return {
      scrollView: '',
      navSelectKey: '',
      notObserver: false,
    };
  },
  mounted() {},
  methods: {
    initScrollObserver(scrollView, lastKey, minTop, maxTop) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (this.notObserver) return;
          let realKey = '';
          entries.forEach((entry) => {
            const { isIntersecting, target } = entry;
            // 进入可视区
            if (isIntersecting) {
              const { intersectionRatio, boundingClientRect } = entry;
              const { top } = boundingClientRect;
              const key = target.id.split('-')[0];

              if (intersectionRatio <= 0.25 && top <= minTop) {
                realKey = key;
                return;
              }
              if (
                intersectionRatio <= 1 &&
                intersectionRatio >= 0.5 &&
                top <= maxTop
              ) {
                realKey = key;
                return;
              }
            }
          });
          if (realKey) {
            this.navSelectKey = realKey;
          }
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 0.85, 0.95, 1],
          root: scrollView,
        },
      );
      const childNodes = scrollView.childNodes;
      childNodes.forEach((element) => {
        observer.observe(element);
      });
    },

    handleScrollTo(key, element, container, duration = 200) {
      this.$ScrollTo(element, duration, {
        container,
        easing: 'linear',
        lazy: false,
        offset: 0,
        force: true,
        cancelable: true,
        x: false,
        y: true,
        onStart: () => {
          this.notObserver = true;
        },
        onDone: () => {
          this.navSelectKey = key;
          this.notObserver = false;
        },
      });
    },
  },
};
