<template>
  <div class="qrcode-dialog" :style="position">
    <div class="main-wrap">
      <div class="top">
        <img :src="LsAssets.cardTopBg" alt="" />
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
    </div>

    <div class="btn-list">
      <el-button class="btn left" :loading="isCopyLoading" @click="handleCopy">
        复制图片
      </el-button>
      <el-button class="btn right" :loading="isDownLoading" @click="handleDown">
        下载图片
      </el-button>
    </div>

    <canvas id="qrcode-canvas" style="display: none"></canvas>
  </div>
</template>

<script>
import LsAssets from './assets';
import { qrcode, domToImage, dataURLtoBlob } from '@lanshu/utils';

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
          qrcodeType: '',
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
      isCopyLoading: false,
      isDownLoading: false,
    };
  },
  mounted() {
    qrcode.toDataURL(
      `app://${this.qrcodeInfo.qrcodeType}/${this.qrcodeInfo.qrcodeId}`,
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
        this.qrcodeUrl = url;
      },
    );
  },
  methods: {
    async handleCopy() {
      this.isCopyLoading = true;
      const imageUrl = await this.getHtmlToImageUrl()
      const blob = dataURLtoBlob(imageUrl);

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      this.isCopyLoading = false;
      this.$message.success('图片复制成功');
    },
    async handleDown() {
      this.isDownLoading = true;
      const imageUrl = await this.getHtmlToImageUrl()
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = imageUrl;
      tempLink.setAttribute(
        'download',
        `${this.qrcodeInfo.nickname}的北象IM二维码`,
      );
      document.body.appendChild(tempLink);
      tempLink.click();
      this.isDownLoading = false;
      document.body.removeChild(tempLink);
    },

    async getHtmlToImageUrl() {
      return await domToImage.toPng(
        document.querySelector('.qrcode-dialog .main-wrap'),
        {
          quality: 0.95,
          bgcolor: '#fff',
        },
      );
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

  .main-wrap {
    padding-bottom: 50px;
  }

  .qrcode-wrap {
    width: 160px;
    height: 160px;
    margin: 34px auto 0;

    .qrcode {
      display: block;
      width: 160px;
      height: 160px;
    }
  }

  .tips {
    margin-top: 20px;
    font-size: 14px;
    color: $tips-text-color;
    text-align: center;
  }

  .btn-list {
    display: flex;
    align-items: center;
    justify-content: center;

    .btn {
      width: 110px;
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

    ::v-deep .el-button {
      border: none;
      display: inline;
      padding: 0;
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
