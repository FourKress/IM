<template>
  <div class="msg-card-item" :data-msg-id="msgId">
    <div
      class="card text"
      ref="MsgCard"
      :class="classObject"
      v-if="isText"
      v-html="msgText"
      v-contextMenu="[...textContextMenuList, ...baseContextMenuList]"
    ></div>

    <div
      class="card text"
      ref="MsgCard"
      :class="classObject"
      v-if="isAt"
      v-html="msgText"
      v-contextMenu="[...textContextMenuList, ...baseContextMenuList]"
    ></div>

    <div
      class="card text"
      ref="MsgCard"
      :class="classObject"
      v-if="isRevoke"
      v-html="msgText"
    ></div>

    <div
      class="wrap img shadow"
      v-if="isImage"
      :style="{
        width: `${size.width}px`,
        height: `${size.height}px`,
        ...wrapStyle,
      }"
      v-contextMenu="[...fileContextMenuList, ...baseContextMenuList]"
    >
      <el-image :src="assetsPath" @click="handlePreview">
        <div slot="placeholder" class="image-slot">
          加载中
          <span class="dot">...</span>
        </div>
      </el-image>
    </div>

    <div
      class="wrap video shadow"
      :class="videoLoading && 'loading'"
      v-if="msgType === CHECK_MSG_TYPE.IS_VIDEO"
      :style="{
        width: `${size.width}px`,
        height: `${size.height}px`,
        ...wrapStyle,
      }"
      v-contextMenu="[...fileContextMenuList, ...baseContextMenuList]"
    >
      <video
        class="video-js vjs-big-play-centered vjs-fluid"
        ref="Video"
      ></video>
    </div>

    <audio
      class="wrap"
      :style="{
        width: `${size.width}px`,
        ...wrapStyle,
      }"
      v-if="msgType === CHECK_MSG_TYPE.IS_AUDIO"
      controls
      controlsList="nodownload noplaybackrate"
      preload="auto"
      :src="assetsPath"
      v-contextMenu="[...fileContextMenuList, ...baseContextMenuList]"
    ></audio>

    <div
      class="wrap file card"
      :class="classObject"
      :style="{ ...wrapStyle, ...wrapFileStyle }"
      v-if="isFile"
      v-contextMenu="[...fileContextMenuList, ...baseContextMenuList]"
    >
      <div class="view">
        <LsIcon
          icon="ls-icon-icon_wenjian1"
          render-svg
          width="31"
          height="33"
        ></LsIcon>
      </div>
      <div class="info">
        <span class="name">{{ msgData.name }}</span>
        <span class="tips">
          <span>{{ getFileSize(msgData.size) }}</span>

          <span class="btn-list">
            <span class="opt-btn" v-if="cachePath">
              <el-tooltip
                class="item"
                effect="dark"
                content="查看文件夹"
                placement="top"
              >
                <LsIcon
                  icon="ls-icon-icon_wenjianjia"
                  render-svg
                  width="14"
                  height="14"
                  @click="handleOpenDir"
                ></LsIcon>
              </el-tooltip>
            </span>
            <span class="opt-btn" v-else>
              <el-tooltip
                class="item"
                effect="dark"
                content="下载"
                placement="top"
              >
                <LsIcon
                  icon="ls-icon-xiazai"
                  width="14"
                  height="14"
                  @click="handleDownload"
                ></LsIcon>
              </el-tooltip>
            </span>
          </span>
        </span>
      </div>
    </div>

    <div
      class="card trtc"
      :class="classObject"
      v-if="msgType === CHECK_MSG_TYPE.IS_TRTC"
      @click="handleStartTrtc"
    >
      <LsIcon
        v-if="!isSelf || bubbleModel === SESSION_BUBBLE_MODEL.IS_LEFT"
        class="trtc-icon target"
        :class="classObject"
        :icon="`${
          msgData.type === NETWORK_CALL_TYPE.IS_VIDEO
            ? 'ls-icon-icon_shipin_duifang'
            : 'ls-icon-icon_duihuakuang_yuyin'
        }`"
        width="18"
        height="18"
      ></LsIcon>
      {{ trtcMsgTips }}
      <LsIcon
        v-if="isSelf && bubbleModel === SESSION_BUBBLE_MODEL.IS_BETWEEN"
        class="trtc-icon self"
        :icon="`${
          msgData.type === NETWORK_CALL_TYPE.IS_VIDEO
            ? 'ls-icon-icon_shipin_wo'
            : 'ls-icon-icon_duihuakuang_yuyin'
        }`"
        width="18"
        height="18"
      ></LsIcon>
    </div>

    <div
      class="wrap position shadow"
      :class="classObject"
      :style="{
        ...cardStyle,
      }"
      v-if="isPosition"
      @click="handleOpenMap"
      v-contextMenu="[...positionContextMenuList]"
    >
      <div class="address">
        <span class="title">{{ this.msgData.placeName }}</span>
        <span class="sub-title">{{ this.msgData.detailAddress }}</span>
      </div>
      <div class="map-image">
        <img
          :src="`https://restapi.amap.com/v3/staticmap?location=${msgData.longitude},${msgData.latitude}&zoom=16&size=400*100&markers=mid,,A:${msgData.longitude},${msgData.latitude}&key=f0e44864bb6bf097f6c4c74d2828d583`"
          alt=""
        />
      </div>
    </div>

    <div
      class="wrap shadow panel"
      :style="{
        ...cardStyle,
      }"
      v-if="isCard"
    >
      <div class="panel-top" v-if="cardHeader">
        <img
          :src="
            LsAssets[
              `${bg_template[cardHeader.bg_template] || bg_template.blue}_${
                cardStyle.width
              }`
            ]
          "
          alt=""
        />
        <span
          v-if="cardHeader.title && cardHeader.title.text"
          :class="bg_template[cardHeader.bg_template] || bg_template.blue"
          :style="{ textAlign: cardHeader.title.align }"
        >
          {{ cardHeader.title.text }}
        </span>
      </div>
      <div class="panel-main" v-if="cardElements.length">
        <template v-for="(ele, key) in cardEleList">
          <div
            class="panel-row text-row"
            :key="key"
            v-if="ele.m_type === 'text'"
            v-html="ele.text"
          ></div>
          <div
            class="panel-row panel-btn-list"
            v-if="ele.m_type === 'buttons'"
            :key="key"
          >
            <div
              class="panel-btn"
              v-for="(btn, index) in ele.buttons"
              :key="index"
              :class="btn.b_type"
              @click="handleCardBtn(btn)"
            >
              {{ btn.text }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="card text" ref="MsgCard" :class="classObject" v-if="!msgType">
      未知类型消息
    </div>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import {
  NETWORK_CALL_TYPE,
  SESSION_BUBBLE_MODEL,
  secondToDate,
  MsgCardMixins,
  startTrtc,
  MICRO_KEY_CONFIG,
} from '@lanshu/utils';
import { LsIcon, LsAssets } from '@lanshu/components';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Msg-card',
  props: {
    rawMsg: {
      type: Object,
      required: true,
      default: () => {},
    },
    isSelf: {
      type: Boolean,
      required: true,
      default: true,
    },
    bubbleModel: {
      type: [Number, String],
      default: SESSION_BUBBLE_MODEL.IS_BETWEEN,
    },
    imViewSizeInfo: {
      required: true,
      type: Object,
      default: () => {},
    },
    session: {
      type: Object,
      default: () => {},
      require: true,
    },
  },
  components: {
    LsIcon,
  },
  mixins: [MsgCardMixins],
  data() {
    return {
      NETWORK_CALL_TYPE,
      SESSION_BUBBLE_MODEL,
      LsAssets,
      imageMaxWidth: 360,
      wrapStyle: {
        maxWidth: '360px',
        maxHeight: '360px',
      },
      wrapFileStyle: {
        width: '360px',
      },
      cardStyle: {
        width: '400px',
        maxWidth: '400px',
      },
      bg_template: {
        blue: 'blue',
        gray: 'gray',
        green: 'green',
        red: 'red',
        yellow: 'yellow',
      },
    };
  },
  computed: {
    ...mapGetters('IMStore', ['refreshRevoke', 'refreshReceipt']),
    ...mapGetters('globalStore', ['microAppList']),

    classObject() {
      return {
        self: this.isSelf,
        target: !this.isSelf,
        disabled: this.isRevoke || !this.msgType,
      };
    },
    trtcMsgTips() {
      const msgType = this.msg?.msgType;
      const tipsMap = {
        671: `通话结束 ${secondToDate(this.msgData?.time)}`,
        672: `${this.isSelf ? '' : '对方'}已拒绝`,
        673: `${this.isSelf ? '' : '对方'}已取消`,
        674: `${this.isSelf ? '对方无' : '未'}应答`,
      };
      return tipsMap[msgType];
    },
  },
  watch: {
    imViewSizeInfo(val) {
      this.initSize(val);
    },
    refreshRevoke: {
      deep: true,
      handler(val) {
        if (!val?.msgId) return;
        if (val?.msgId === this.msg?.msgId) {
          this.msg = val;
        }
      },
    },
    refreshReceipt: {
      deep: true,
      handler(val) {
        const targetList = val?.filter((d) => d.msgId === this.msgId);
        if (!targetList.length) return;
        const callbackReceiptUserList = targetList.map((d) => d.userId);
        const receiptUserList = this.msg.receiptUserList || [];
        this.msg = {
          ...this.msg,
          receiptUserList: [
            ...new Set([...receiptUserList, ...callbackReceiptUserList]),
          ],
        };
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initSize(this.imViewSizeInfo);
    });
  },
  methods: {
    ...mapActions('globalStore', ['setCurrentMicroApp', 'setMicroAppList']),
    ...mapActions('pluginStore', ['setActiveMicroApp']),

    initSize(imViewSizeInfo) {
      if (
        !this.isImage &&
        !this.isVideo &&
        !this.isAudio &&
        !this.isFile &&
        !this.isPosition &&
        !this.isCard
      )
        return;
      const { width, height } = imViewSizeInfo;
      if (width <= 693 || height <= 400) {
        this.setSmallSize();
      } else {
        this.setBaseSize();
      }
    },

    setSmallSize() {
      this.imageMaxWidth = 250;
      this.wrapStyle = { maxWidth: '250px', maxHeight: '250px' };
      this.wrapFileStyle = { width: '250px' };
      this.cardStyle = { width: '250px', maxWidth: '250px' };
    },

    setBaseSize() {
      this.imageMaxWidth = 360;
      this.wrapStyle = { maxWidth: '360px', maxHeight: '360px' };
      this.wrapFileStyle = { width: '360px' };
      this.cardStyle = { width: '400px', maxWidth: '400px' };
    },

    async handleStartTrtc() {
      const type = this.rawMsg.data?.type;
      if (!type) return;
      await startTrtc(this.session, type);
    },

    handleOpenMap() {
      renderProcess.openUrl(
        `https://ditu.amap.com/regeo?lng=${this.msgData.longitude}&lat=${this.msgData.latitude}&name=${this.msgData.placeName}&src=uriapi`,
      );
    },

    async handleCardBtn(btn) {
      const {
        multi_url: { url, pc_url },
      } = btn;
      const targetUrl = url || pc_url;
      // const targetUrl = 'app://SmartAdvocacyMicroApp/spokesmanother?121=333';
      if (!targetUrl) return;
      if (targetUrl.includes('http')) {
        renderProcess.openUrl(targetUrl);
        return;
      }

      const protocol = 'app://';
      if (targetUrl.includes(protocol)) {
        const [appKey, pagePath] = targetUrl.replace(protocol, '').split('/');

        const microKeys = Object.values(MICRO_KEY_CONFIG);
        if (!microKeys.includes(appKey)) {
          this.$message.error('未知应用，打开失败');
          return;
        }

        await this.setActiveMicroApp(appKey);
        await this.setMicroAppList(
          this.microAppList.map((d) => {
            if (d.key === appKey) {
              d.path = `/${pagePath}`;
            }
            return d;
          }),
        );

        await this.setCurrentMicroApp({
          appKey,
          visible: true,
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.msg-card-item {
  width: 100%;
  height: 100%;
  position: relative;

  .card {
    border-radius: 6px;
    padding: 10px 14px;

    &.self {
      background-color: $bubble-self-color;
    }

    &.target {
      background-color: $bubble-target-color;
    }

    &.text {
      user-select: text;
      word-break: break-all;
      white-space: pre-line;

      &.disabled {
        color: $minor-text-color;
      }
    }

    &.trtc {
      cursor: pointer;

      .trtc-icon {
        &.self {
          margin-left: 9px;
        }

        &.target {
          margin-right: 9px;
        }
      }
    }
  }

  .wrap {
    display: block;
    border-radius: 6px;
    overflow: hidden;

    &.shadow {
      box-shadow: 0 0 0 1px $split-line-color;
    }

    &.img {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border-radius: 6px;

      .el-image__error,
      .image-slot {
        font-size: 12px;
        color: $tips-text-color;
        background-color: transparent;
      }

      img {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
      }
    }

    &.video {
      position: relative;

      &.loading {
        &:before {
          content: '加载中...';
          z-index: 1;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          color: $tips-text-color;
          display: block;
        }
      }
    }

    &.file {
      width: 360px;
      height: 70px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .view {
        width: 31px;
        height: 40px;
        display: flex;
        align-items: center;
        margin-right: 12px;
        overflow: hidden;

        .tag {
          width: 100%;
          height: 100%;
          display: block;
          position: relative;
        }
      }

      .info {
        flex: 1;
        height: 40px;
        max-width: calc(100% - 41px);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;

        .name {
          flex: 1;
          max-width: 85%;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: $main-text-color;
          font-weight: bold;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tips {
          color: $minor-text-color;
          font-size: 12px;
          width: 100%;
          height: 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .btn-list {
            cursor: pointer;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .opt-btn {
              width: 26px;
              height: 26px;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;

              &:last-child {
                margin: 2px 0 0px 10px;
              }

              &:hover {
                background: $bg-hover-grey-color;
              }
            }
          }
        }
      }
    }

    &.position {
      cursor: pointer;
      height: 170px;
      max-height: 170px;

      .address {
        width: 100%;
        height: 70px;
        min-height: 70px;
        padding: 12px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title,
        .sub-title {
          flex: 1;
          height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .title {
          font-size: 16px;
          color: $main-text-color;
        }

        .sub-title {
          font-size: 12px;
          color: $minor-text-color;
        }
      }

      .map-image {
        width: 100%;
        height: 100px;
        position: relative;

        img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background-color: #2b333f;
        }
      }
    }

    &.panel {
      display: flex;
      flex-direction: column;

      .panel-top {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        padding: 0 16px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        img {
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          z-index: -1;
        }

        span {
          &.blue {
            color: $primary-color;
          }

          &.gray {
            color: $main-text-color;
          }

          &.green {
            color: $minor-color;
          }

          &.red {
            color: #f65951;
          }

          &.yellow {
            color: $minor-yellow-color;
          }
        }
      }

      .panel-main {
        width: 100%;
        flex: 1;
        padding: 16px 16px 0;
        box-sizing: border-box;
        font-size: 14px;
        color: $main-text-color;

        .panel-row {
          &.text-row {
            width: 100%;
            line-height: 22px;
            margin-top: 10px;
          }

          &.panel-btn-list {
            width: 100%;
            margin: 16px 0 6px;
            display: flex;
            flex-wrap: wrap;

            .panel-btn {
              min-width: 52px;
              max-width: 100%;
              height: 28px;
              min-height: 28px;
              line-height: 26px;
              padding: 0 12px;
              background-color: $bg-white-color;
              border-radius: 4px;
              border: 1px solid $bg-white-color;
              margin: 0 10px 10px 0;
              box-sizing: border-box;
              cursor: pointer;

              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              &.primary {
                color: $bg-white-color;
                border-color: $primary-color;
                background-color: $primary-color;
              }

              &.secondary {
                color: $primary-color;
                border-color: $primary-color;
              }

              &.danger {
                color: #f65951;
                border-color: #f65951;
              }

              &.default {
                color: $tips-text-color;
                border-color: #dadada;
              }

              &:last-child {
                margin-right: 0;
              }
            }
          }

          &:first-child {
            margin-top: 0;
          }

          &:last-child {
            &.text-row {
              margin-bottom: 16px;
            }
          }
        }
      }
    }
  }

  audio {
    background: #f1f3f4 !important;
    max-width: 300px !important;
  }

  ::v-deep .video-js {
    height: 100% !important;
    background-color: $bg-IM-color;

    .vjs-big-play-button {
      transform: scale(0.7);
    }
  }

  ::v-deep .link-jump {
    color: $primary-color;
    cursor: pointer;
  }

  ::v-deep .at-tag {
    color: $primary-color;
    cursor: pointer;

    &.at-me {
      background-color: $primary-color;
      color: $bg-white-color;
      padding: 0px 4px;
      border-radius: 4px;
    }

    .at-tag-sup {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: $bg-white-color;
      border: 1px solid $tips-text-color;
      display: inline-block;
      margin-left: 2px;
      box-sizing: border-box;
      transform: translateY(-2px);

      &.read {
        background-color: #00c476;
        border-color: #00c476;
      }
    }
  }
}
</style>
