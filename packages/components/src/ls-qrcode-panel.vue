<template>
  <div class="qrcode-dialog" :style="position">
    <div class="top">
      <img :src="LsAssets.topBg" alt="" />
    </div>
    <div class="info">
      <div class="avatar">
        <img :src="qrcodeInfo.avatar" class="img" />
      </div>
      <div class="sub-info">
        <div class="nickname">{{ qrcodeInfo.nickname }}</div>
      </div>
    </div>

    <div class="qrcode-wrap">
      <img class="qrcode" v-if="qrcodeUrl" :src="qrcodeUrl" alt="" />
    </div>

    <div class="tips">扫码二维码，{{ tips }}</div>
    <div class="btn-list">
      <span class="btn left" @click="handleCopy">复制图片</span>
      <span class="btn right" @click="handleDown">下载图片</span>
    </div>
  </div>
</template>

<script>
import LsAssets from './assets';
import { qrcode } from '@lanshu/utils';
export default {
  name: 'Ls-qrcode-panel',
  props: {
    tips: {
      type: String,
    },
    qrcodeInfo: {
      type: Object,
      required: true,
      default: () => {
        return {
          qrcodeId: '',
          nickname: '',
          avatar: '',
        };
      },
    },
    position: {
      type: Object,
      required: true,
      default: () => {
        return {
          left: '',
          top: '',
        };
      },
    },
  },
  data() {
    return {
      LsAssets,
      qrcodeUrl: '',
    };
  },
  mounted() {
    qrcode.toDataURL(
      `app://share/${this.qrcodeInfo.qrcodeId}`,
      {
        errorCorrectionLevel: 'H',
        width: 160,
        height: 160,
        margin: 0,
      },
      (error, url) => {
        if (error) {
          this.$message.error('二维码生成失败!');
        }
        console.log(url);
        this.qrcodeUrl = url;
      },
    );
  },
  methods: {
    dataURLtoBlob(dataUrl) {
      let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bStr = atob(arr[1]),
        n = bStr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bStr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },

    async handleCopy() {
      const blob = this.dataURLtoBlob(this.qrcodeUrl);

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      this.$message.success('二维码复制成功');
    },
    handleDown() {
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = this.qrcodeUrl;
      tempLink.setAttribute(
        'download',
        `${this.qrcodeInfo.nickname}的蓝数IM二维码`,
      );
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    },
  },
};
</script>

<style scoped lang="scss">
.qrcode-dialog {
  width: 372px;
  height: 516px;
  background: $bg-white-color;
  box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
  border-radius: 12px;
  border: 1px solid $split-line-color;
  overflow: hidden;
  position: fixed;
  z-index: 9;

  .qrcode-wrap {
    width: 160px;
    height: 160px;
    margin: 34px auto 0;

    background: #333;

    .qrcode {
      display: block;
      width: 160px;
      height: 160px;
    }
  }

  .tips {
    margin: 20px 0 50px 0;
    font-size: 14px;
    color: $tips-text-color;
    text-align: center;
  }

  .btn-list {
    display: flex;
    align-items: center;
    justify-content: center;

    .btn {
      width: 88px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;

      &.right {
        background: $primary-color;
        color: #fff;
        margin-left: 10px;
      }

      &.left {
        background: $bg-grey-color;
        color: $primary-color;
      }
    }
  }

  .top {
    width: 100%;
    height: 110px;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .info {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 0 30px 0 24px;
    margin: -29px 0 17px 0;

    .avatar {
      border-radius: 16px;
      border: 6px solid #ffffff;
      margin-right: 14px;

      .img {
        width: 66px;
        height: 66px;
        border-radius: 8px;
        display: block;
      }
    }

    .sub-info {
      flex: 1;
      display: flex;
      align-items: center;
      max-width: 211px;
      margin-bottom: 6px;

      .nickname {
        max-width: 140px;
        font-size: 18px;
        font-weight: bold;
        color: $main-text-color;
        margin-right: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .auth-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 53px;
        height: 18px;
        border-radius: 4px;
        border: 1px solid $minor-color;
        text-align: center;
        font-size: 11px;
        color: $minor-color;
        line-height: 18px;

        .tag-icon {
          margin-right: 2px;
        }
      }
    }

    .more {
      margin-bottom: 6px;
      cursor: pointer;
    }
  }
}
</style>