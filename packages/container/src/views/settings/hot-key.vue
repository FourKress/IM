<template>
  <Card id="HotKey-Card" title="快捷键">
    <InfoBlock :info="{ title: '消息' }">
      <div class="row">
        <el-select
          type="text"
          placeholder="选择快捷键"
          @change="handleSendMsgChange"
          v-model="msgHotKey"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </InfoBlock>

    <InfoBlock :info="{ title: '截图' }">
      <div class="row">
        <el-input
          type="text"
          id="screenshot"
          ref="screenshot"
          maxlength="0"
          :placeholder="hotKeyInfo.screenshot.placeholder"
          @blur="inputBlur('screenshot')"
          v-model="hotKeyInfo.screenshot.currentKey"
        />
        <span class="btn" @click="handleActiveHotKey('screenshot')">更改</span>
      </div>
    </InfoBlock>

    <InfoBlock :info="{ title: '搜索' }">
      <div class="row">
        <el-input
          type="text"
          id="search"
          ref="search"
          maxlength="0"
          :placeholder="hotKeyInfo.search.placeholder"
          @blur="inputBlur('search')"
          v-model="hotKeyInfo.search.currentKey"
        />
        <span class="btn" @click="handleActiveHotKey('search')">更改</span>
      </div>
    </InfoBlock>

    <InfoBlock :info="{ title: '显示/隐藏窗口' }">
      <div class="row">
        <el-input
          type="text"
          id="window"
          ref="window"
          maxlength="0"
          :placeholder="hotKeyInfo.window.placeholder"
          @blur="inputBlur('window')"
          v-model="hotKeyInfo.window.currentKey"
        />
        <span class="btn" @click="handleActiveHotKey('window')">更改</span>
      </div>
    </InfoBlock>

    <div class="reset">
      <span @click="handleReset">全部还原为默认设置</span>
    </div>
  </Card>
</template>

<script>
import Card from './card';
import InfoBlock from './info-block';
import { renderProcess } from '@lanshu/render-process';
import { keyCode, isMacPlatform } from '@lanshu/utils';

export default {
  name: 'HotKey-Card',
  components: {
    Card,
    InfoBlock,
  },
  data() {
    return {
      msgHotKey: '',
      keyCode,
      options: [
        {
          value: keyCode.isEnter,
          label: keyCode.isEnter,
        },
        {
          value: keyCode.isCtrlEnter,
          label: `${keyCode.viewCharacter} + ${keyCode.isEnter}`,
        },
      ],
      hotKeyInfo: {
        sendMsg: {
          currentKey: '',
          placeholder: '',
          activeHotKey: false,
          oldKey: '',
        },
        screenshot: {
          currentKey: '',
          placeholder: '',
          activeHotKey: false,
          oldKey: '',
        },
        search: {
          currentKey: '',
          placeholder: '',
          activeHotKey: false,
          oldKey: '',
        },
        window: {
          currentKey: '',
          placeholder: '',
          activeHotKey: false,
          oldKey: '',
        },
      },
    };
  },
  created() {
    this.init();
    this.$nextTick(() => {
      const [_first, ...hotKeyInputList] = [
        ...document.querySelectorAll('#HotKey-Card input'),
      ];

      hotKeyInputList.forEach((el) => {
        el.addEventListener('keydown', (e) => this.handleKeydown(e, el.id));

        el.addEventListener('keyup', () => this.handleKeyup(el.id));
      });
    });
  },
  methods: {
    async init() {
      const hotKeyDB = await renderProcess.getStore('hotKeys');
      this.msgHotKey = hotKeyDB.sendMsg.currentKey;
      Object.keys(this.hotKeyInfo).map(async (k) => {
        const { currentKey, defaultKey } = hotKeyDB[k];
        if (currentKey) {
          this.hotKeyInfo[k].currentKey = currentKey.replace(
            this.keyCode.realCharacter,
            this.keyCode.viewCharacter,
          );
          this.hotKeyInfo[k].oldKey = currentKey;
        } else {
          this.hotKeyInfo[k].currentKey = defaultKey.replace(
            this.keyCode.realCharacter,
            this.keyCode.viewCharacter,
          );
        }

        this.hotKeyInfo[k].placeholder = '点击设置快捷键';
        this.hotKeyInfo[k].activeHotKey = false;
      });
    },
    async inputBlur(key) {
      this.hotKeyInfo[key].placeholder = '点击设置快捷键';
      const formatKey = this.hotKeyInfo[key].currentKey.replace(
        this.keyCode.viewCharacter,
        this.keyCode.realCharacter,
      );
      const keyArr = formatKey.split('+');
      const oldKey = this.hotKeyInfo[key].oldKey;

      if (formatKey === oldKey) return;

      let currentKey = '';
      if (formatKey && keyArr.slice(-1)[0].trim()) {
        currentKey = formatKey;
      } else {
        this.hotKeyInfo[key].currentKey = '';
        this.hotKeyInfo[key].activeHotKey = false;
        currentKey = '';
      }

      renderProcess.setHotKey({
        newKey: currentKey,
        oldKey,
        type: key,
      });
      const hotKeyDB = (await renderProcess.getStore('hotKeys')) || {};
      await renderProcess.setStore('hotKeys', {
        ...hotKeyDB,
        [key]: {
          ...hotKeyDB[key],
          currentKey,
        },
      });
    },

    async handleSendMsgChange(val) {
      const msgHotKey = val.replace(
        this.keyCode.viewCharacter,
        this.keyCode.realCharacter,
      );
      const hotKeyDB = (await renderProcess.getStore('hotKeys')) || {};
      await renderProcess.setStore('hotKeys', {
        ...hotKeyDB,
        sendMsg: {
          defaultKey: msgHotKey,
          currentKey: msgHotKey,
        },
      });
    },

    handleKeydown(e, key) {
      if (!this.hotKeyInfo[key].activeHotKey) return;
      e.preventDefault();
      const list = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (list.includes(e.key)) return;
      // 获取用户有没有按下特殊按键【'Control', 'Alt', 'Shift', 'Meta'】
      const auxiliaryKey = [
        e.metaKey ? '⌘' : '',
        e.ctrlKey ? 'Ctrl' : '',
        e.altKey ? 'Alt' : '',
        e.shiftKey ? 'Shift' : '',
      ].filter((t) => t);
      const someKeys = ['Control', 'Alt', 'Shift', 'Meta'];
      // mac下禁止使用快捷键option
      let publicKey =
        someKeys.indexOf(e.key) < 0 ? e.key.toLocaleUpperCase() : '';
      if (isMacPlatform && e.altKey) {
        publicKey = '';
      }
      if (auxiliaryKey.length) {
        this.hotKeyInfo[key].currentKey =
          auxiliaryKey.join('+') + '+' + publicKey;
      }
    },
    handleKeyup(key) {
      const keys = this.hotKeyInfo[key].currentKey;
      const keyArr = keys.split('+');
      if (keys && !keyArr.slice(-1)[0].trim()) {
        this.hotKeyInfo[key].placeholder = '点击设置快捷键';
        this.hotKeyInfo[key].currentKey = '';
      }
    },

    handleActiveHotKey(key) {
      this.hotKeyInfo[key].placeholder = '键盘按下要设置的快捷键组合';
      this.hotKeyInfo[key].currentKey = '';
      this.hotKeyInfo[key].activeHotKey = true;
      this.$refs[key].focus();
    },

    async handleReset() {
      this.msgHotKey = this.keyCode.isEnter;

      const hotKeyDB = await renderProcess.getStore('hotKeys');
      Object.keys(this.hotKeyInfo).map(async (k) => {
        const { defaultKey } = hotKeyDB[k];
        hotKeyDB[k].currentKey = defaultKey;

        renderProcess.setHotKey({
          newKey: defaultKey,
          oldKey: this.hotKeyInfo[k].currentKey.replace(
            this.keyCode.viewCharacter,
            this.keyCode.realCharacter,
          ),
          type: k,
        });

        this.hotKeyInfo[k].currentKey = defaultKey.replace(
          this.keyCode.realCharacter,
          this.keyCode.viewCharacter,
        );
        this.hotKeyInfo[k].oldKey = defaultKey;
        this.hotKeyInfo[k].placeholder = '点击设置快捷键';
        this.hotKeyInfo[k].activeHotKey = false;
      });
      await renderProcess.setStore('hotKeys', {
        ...hotKeyDB,
        sendMsg: {
          defaultKey: this.keyCode.isEnter,
          currentKey: this.keyCode.isEnter,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.row {
  width: 486px;
  margin-top: 4px;
  position: relative;

  ::v-deep .el-select {
    width: 100%;
  }

  ::v-deep .el-input__inner {
    padding-right: 53px;
  }

  .btn {
    position: absolute;
    right: 16px;
    top: 10px;
    font-size: 14px;
    color: $primary-hover-color;
    cursor: pointer;
  }
}
.reset {
  font-size: 14px;
  color: $primary-hover-color;
  margin-top: 26px;
  span {
    cursor: pointer;
  }
}
</style>
