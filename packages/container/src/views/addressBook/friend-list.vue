<template>
  <div class="friend-list">
    <div class="py-nav">
      <span
        v-for="item in pyList"
        :key="item"
        :class="pinyinKey === item && 'active'"
        @click="filterAddress(item)"
      >
        {{ item }}
      </span>
    </div>
    <div class="list selected-scroll-view">
      <div class="scroll-view" v-if="addressBookList.length">
        <div
          class="group-panel"
          :id="`group-${key}`"
          :key="key"
          v-for="(group, key) in addressBookPYObj"
        >
          <span class="group-name">
            {{ key === 'special' ? '#' : key }}
          </span>

          <div
            class="item"
            v-for="item in group"
            v-if="item.nickname"
            :key="item.nickname"
            @click="(event) => openFriendDialog(item, event)"
          >
            <div class="info">
              <div class="img">
                <img :src="item.avatar" alt="" />
              </div>
              <div class="name">
                <span>{{ item.nickname }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <LsCardDialog :visible.sync="showFriendDialog">
      <FriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="{ isPass: true }"
        @confirm="handleConfirm"
      />
    </LsCardDialog>

  </div>
</template>

<script>
import { groupedPy, sortedPY } from '@lanshu/utils';
import {LsCardDialog} from '@lanshu/components'
import FriendPanel from './friend-panel.vue';
import mixins from './mixins';

export default {
  name: 'Friend-List',
  props: {
    isBot: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [mixins],
  components: {
    LsCardDialog,
    FriendPanel,
  },
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
    this.$nextTick(() => {
      this.scrollView = document.querySelector('.selected-scroll-view');
      this.scrollView.addEventListener('scroll', this.scrollHandle, true);
    });
  },
  methods: {
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

        if (isDown && top <= 120) {
          realKey = pinyinKey;
          return;
        }

        if (
          !isDown &&
          ((top < 0 && top * -1 <= (height - 120) / 3) ||
            (top >= 80 && top <= 120))
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

    handleConfirm() {
      console.log(213)
    }
  },
  destroyed() {
    this.scrollView.removeEventListener('scroll', this.scrollHandle, true);
  },
};
</script>

<style scoped lang="scss">
.friend-list {
  overflow: hidden;
  height: 100%;

  .py-nav {
    width: 10px;
    right: 27px;
    top: 50%;
    z-index: 8;
    transform: translateY(-50%);
    font-size: 12px;
    position: absolute;
    color: $minor-text-color;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      cursor: pointer;
      line-height: 28px;
      position: relative;

      &.active {
        color: $bg-white-color;
        font-weight: bold;

        &:before {
          content: '';
          display: block;
          width: 30px;
          height: 30px;
          background: $primary-color;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          z-index: -1;
        }
      }
    }
  }

  .list {
    overflow-y: auto;
    overflow-x: hidden;
    transform: translate3d(0, 0, 0);
    scroll-behavior: smooth;
    height: 100%;

    .scroll-view {
      .group-panel {
        display: flex;
        flex-direction: column;

        .group-name {
          font-size: 12px;
          color: $main-text-color;
          height: 28px;
          line-height: 28px;
          background: $bg-IM-color;
          padding-left: 15px;
          margin-bottom: 20px;
        }
      }

      .item {
        height: 46px;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        cursor: pointer;
        padding-left: 24px;
        margin-bottom: 18px;

        &:last-child {
          margin-bottom: 20px;
        }

        &:hover {
          background-color: $bg-hover-grey-color;
        }

        .info {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;

          .img {
            width: 46px;
            height: 46px;
            margin-right: 8px;
            border-radius: 6px;
            overflow: hidden;
            background-color: #333333;

            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }

          .name {
            flex: 1;
            font-size: 14px;
            color: $main-text-color;
          }
        }
      }
    }
  }
}
</style>
