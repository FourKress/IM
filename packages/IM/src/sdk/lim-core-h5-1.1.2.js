(function () {
  //SDK 事件
  let EVENTS = {
    //im sdk ready 事件，已经连接服务器成功，可以发送消息，调用接口（无参数）
    IM_SDK_READY: 'IM_SDK_READY', //IM SDK not ready 事件（退出、被踢出），不可发送消息，不可调用接口（），如想恢复，则调用login接口
    IM_SDK_NOT_READY: 'IM_SDK_NOT_READY', //收到消息 事件（e.data）
    ON_RECEIVED_MESSAGE: 'ON_RECEIVED_MESSAGE', //消息已读事件
    ON_MESSAGE_READ: 'ON_MESSAGE_READ', //消息修改事件
    ON_MESSAGE_MODIFY: 'ON_MESSAGE_MODIFY', //收到echo事件（e.data）
    ON_RECEIVED_ECHO: 'ON_RECEIVED_ECHO', //出现 错误 事件(e.data)
    ON_ERROR: 'ON_ERROR', //网络状态发生变化(e.data) 1网络正常，2网络断开sdk重连中（可在顶部提示 "连接中"）
    NET_STATE_CHANGE: 'NET_STATE_CHANGE', //收到 被踢出 事件 (e.data)
    ON_KICK_OUT_EVENT: 'ON_KICK_OUT_EVENT', //会话列表 更新 事件 (e.data)
    ON_SESSION_UPDATE: 'ON_SESSION_UPDATE', //会话列表总未读数更新 事件 (e.data)
    ON_SESSION_UNREAD_TOTAL_UPDATE: 'ON_SESSION_UNREAD_TOTAL_UPDATE', //事件同步开始（可在顶部显示 "收取中..."、"同步中..."）
    ON_EVENT_SYNC_START: 'ON_EVENT_SYNC_START', //事件同步完成（取消顶部显示的 "收取中..."、"同步中..."）
    ON_EVENT_SYNC_FINISH: 'ON_EVENT_SYNC_FINISH',
  };

  let CONST = {
    gateway: 'https://im.lanshusoft.com/lim',
    wsUrl: 'wss://im.lanshusoft.com/websocket',

    // gateway: "http://localhost:5674"
    // , wsUrl: "ws://localhost:9193/websocket",

    isSdkReady: false,
  };

  /**
   * 事件处理handler
   * @type {{e:f}}
   */
  let EVENT_HANDLER = {};

  /**
   * 注册事件
   * @param e 事件
   * @param f 处理函数
   */
  let registerEvent = (e, f) => {
    EVENT_HANDLER[e] = f;
  };

  let Cl =
    'undefined' != typeof global
      ? global
      : 'undefined' != typeof self
      ? self
      : 'undefined' != typeof window
      ? window
      : {};

  let Ll =
    'undefined' != typeof console
      ? console
      : void 0 !== Cl && Cl.console
      ? Cl.console
      : 'undefined' != typeof window && window.console
      ? window.console
      : {};

  //日志等级
  //0: 普通级别，日志较多
  //1: release级别，输出关键信息，建议生产环境使用
  //2：警告级别，只输出警告级别日志
  //3：错误级别，只输出错误级别日志
  //4: 关闭，不输出日志
  let logLevel = 1;

  let log = {
    isDebugLevel: () => {
      return logLevel <= -1;
    },
    debug: (msg) => {
      if (log.isDebugLevel()) {
        Ll.debug('[im debug] '.concat(msg));
      }
    },
    log: (msg) => {
      if (logLevel <= 0) {
        Ll.log('[im log] '.concat(msg));
      }
    },
    info: (msg) => {
      if (logLevel <= 1) {
        Ll.info('[im info] '.concat(msg));
      }
    },
    warn: (msg) => {
      if (logLevel <= 2) {
        Ll.warn('[im warn] '.concat(msg));
      }
    },
    error: (msg) => {
      if (logLevel <= 3) {
        Ll.error('[im error] '.concat(msg));
      }
    },
    setLogLevel: (level) => {
      logLevel = level;
    },
  };

  /**
   * 移除事件
   * @param e 事件
   * @param f 处理函数
   */
  let removeEvent = (e, f) => {
    EVENT_HANDLER[e] = null;
  };

  let getEventHandler = (e) => {
    return EVENT_HANDLER[e];
  };

  function isNull(str) {
    return typeof str == 'undefined' || str == null || str === '';
  }

  function getModelOfBrowser() {
    let ua = navigator.userAgent.toLowerCase();

    function testUa(regexp) {
      return regexp.test(ua);
    }

    function testVs(regexp) {
      return (ua.match(regexp) + '')
        .replace(/[^0-9|_.]/gi, '')
        .replace(/_/gi, '.');
    }

    let system = 'unknown';
    if (testUa(/windows|win32|win64|wow32|wow64/gi)) {
      system = 'windows'; //Windows系统
    } else if (testUa(/macintosh|macintel/gi)) {
      system = 'macos'; //Macos系统
    } else if (testUa(/x11/gi)) {
      system = 'linux'; //Linux系统
    } else if (testUa(/android|adr/gi)) {
      system = 'andriod'; //Android 系统
    } else if (testUa(/ios|iphone|ipad|iwatch/gi)) {
      system = 'ios'; // iOS系统
    }
    //系统版本
    let systemVs = 'unknown';
    if (system === 'windows') {
      //windos版本
      if (testUa(/windos nt 5.0|windows 2000/gi)) {
        systemVs = '2000';
      } else if (testUa(/windows nt 5.1|windows xp/gi)) {
        systemVs = 'xp';
      } else if (testUa(/windows nt 5.2|windows 2003/gi)) {
        systemVs = '2003';
      } else if (testUa(/windows nt 6.0|windows vista/gi)) {
        systemVs = 'vista';
      } else if (testUa(/windows nt 6.1|windows 7/gi)) {
        systemVs = '7';
      } else if (testUa(/windows nt 6.2|windows 8/gi)) {
        systemVs = '8';
      } else if (testUa(/windows nt 6.3|windows 8.1/gi)) {
        systemVs = '8.1';
      } else if (testUa(/windows nt 10.0|windows 10/gi)) {
        systemVs = '10';
      }
    } else if (system === 'macos') {
      systemVs = testVs(/os x [\d._]+/gi);
    } else if (system === 'andriod') {
      systemVs = testVs(/andriod [\d._]+/gi);
    } else if (system === 'ios') {
      systemVs = testVs(/os [\d._]+/gi);
    }

    let platform = 'unknow';
    if (system === 'windows' || system === 'macos' || system === 'linux') {
      platform = 'computer'; //桌面端
    } else if (system === 'andriod' || system === 'ios' || testUa(/mobile/gi)) {
      platform = 'phone'; //移动端
    }

    //平台

    //内核+载体
    let engine = 'unknown';
    let supporter = 'unknown';
    if (testUa(/applewebkit/gi) && testUa(/safari/gi)) {
      engine = 'webkit'; //webkit内核
      if (testUa(/edge/gi)) {
        supporter = 'edge'; //Edge浏览器
      } else if (testUa(/opr/gi)) {
        supporter = 'opr'; //Opera浏览器
      } else if (testUa(/chrome/gi)) {
        supporter = 'chrome'; //Chrome浏览器
      } else {
        supporter = 'safari'; //Safari浏览器
      }
    } else if (testUa(/gecko/gi) && testUa(/firefox/gi)) {
      engine = 'gecko'; //gecko内核
      supporter = 'firefox'; //Firefox浏览器
    } else if (testUa(/presto/gi)) {
      engine = 'presto'; //presto 内核
      supporter = 'opera'; //Opera 浏览器
    } else if (testUa(/trident|compatible|msie/gi)) {
      engine = 'trident'; //trident 内核
      supporter = 'iexplore'; //IE 浏览器
    }
    //内核版本
    let engineVs = 'unknown';
    if (engine === 'webkit') {
      engineVs = testVs(/applewebkit\/[\d.]+/gi);
    } else if (engine === 'gecko') {
      engineVs = testVs(/gecko\/[\d.]+/gi);
    } else if (engine === 'presto') {
      engineVs = testVs(/presto\/[\d.]+/gi);
    } else if (engine === 'trident') {
      engineVs = testVs(/trident\/[\d.]+/gi);
    }
    //载体版本
    let supporterVs = 'unknown';
    if (supporter === 'chrome') {
      supporterVs = testVs(/chrome\/[\d.]+/gi);
    } else if (supporter === 'safari') {
      supporterVs = testVs(/verison\/[\d.]+/gi);
    } else if (supporter === 'firefox') {
      supporterVs = testVs(/firefox\/[\d.]+/gi);
    } else if (supporter === 'opera') {
      supporterVs = testVs(/opr\/[\d.]+/gi);
    } else if (supporter === 'iexploer') {
      supporterVs = testVs(/(msie\/[\d.]+)|(rv:[\d.]+)/gi);
    } else if (supporter === 'edge') {
      supporterVs = testVs(/edge\/[\d.]+/gi);
    }
    //外壳+外壳版本
    let shell = 'none'; //外壳
    let shellVs = 'unknown';
    if (testUa(/micromessenger/gi)) {
      shell = 'wechat'; //微信浏览器
      shellVs = testVs(/micromessenger\/[\d.]+/gi);
    } else if (testUa(/qqbrowser/gi)) {
      shell = 'qq'; //QQ浏览器
      shellVs = testVs(/qqbrowser\/[\d.]+/gi);
    } else if (testUa(/ubrowser/gi)) {
      shell = 'uc'; //UC浏览器
      shellVs = testVs(/ubrowser\/[\d.]+/gi);
    } else if (testUa(/2345explorer/gi)) {
      shell = '2345'; //2345浏览器
      shellVs = testVs(/2345explorer\/[\d.]+/gi);
    } else if (testUa(/metasr/gi)) {
      shell = 'sougou'; //搜狗浏览器
    } else if (testUa(/lbbrowser/gi)) {
      shell = 'liebao'; //猎豹浏览器
    } else if (testUa(/maxthon/gi)) {
      shell = 'maxthon'; //傲游浏览器
      shellVs = testVs(/maxthon\/[\d.]+/gi);
    } else if (testUa(/bidubrowser/gi)) {
      shell = 'baidu';
      shellVs = testVs(/bidubrowser [\d.]+/gi);
    } else if (testUa(/Edg/gi)) {
      shell = 'Edg';
      shellVs = testVs(/Edg [\d.]+/gi);
    }

    return {
      modelName: supporter,
      osName: system,
      osVersion: systemVs,
      platform: platform,
      supporter: 'browse',
      supporterVersion: supporterVs,
    };
  }

  let ModelInfo = {};

  let Model = {
    getInfo() {
      switch (Storage.getEnv()) {
        case 'wx':
          ModelInfo = {
            modelName: '终端型号名称',
            osName: '操作系统名称',
            osVersion: '操作系统版本',
            platform: '终端类型',
            supporter: '载体',
            supporterVersion: '',
            tag: null,
          };
          break;
        case 'browser':
          ModelInfo = getModelOfBrowser();
          break;
        case 'uni':
          break;
      }

      return ModelInfo;
    },
  };

  //持久存储
  let Storage = {
    set: (k, v) => {
      switch (Storage.getEnv()) {
        case 'wx':
          wx.setStorageSync(k, v);
          break;
        case 'browser':
          localStorage.setItem(k, v);
          break;
        case 'uni':
          uni.setStorageSync(key, v);
      }
    },
    get: (k) => {
      switch (Storage.getEnv()) {
        case 'wx':
          return wx.getStorageSync(k);
        case 'browser':
          return localStorage.getItem(k);
        case 'uni':
          return uni.getStorageSync(k);
      }
    }, //获取环境
    getEnv() {
      if (typeof wx == 'object') {
        //微信
        return 'wx';
      }

      if (typeof uni == 'object') {
        return 'uni';
      }

      //浏览器
      return 'browser';
    }, //获取设备id
    getDeviceId() {
      return Storage.get('deviceId');
    },

    getLoginTime() {
      return Storage.get('loginTime');
    },

    setDeviceId(deviceId) {
      Storage.set('deviceId', deviceId);
    },

    setLoginTime(loginTime) {
      Storage.set('loginTime', loginTime);
    },

    /**
     * 设置已读会话的最后一条消息id，刷新时，该id之前包括该id的不计入未读
     * @param sessId 会话id
     * @param cliMsgId 客户端消息id
     */
    setSessionUnreadMsgId(sessId, cliMsgId) {
      Storage.set('cUnread' + sessId, cliMsgId);
    },

    /**
     * 获取已读会话的最后一条消息id，刷新时，该id之前包括该id的不计入未读
     * @param sessId 会话id
     * @return CliMsgId
     */
    getSessionUnreadMsgId(sessId) {
      return Storage.get('cUnread' + sessId);
    },
  };

  let AutoReLogin = {
    execute: false,
    tId: null,
    destroy: false,

    start() {
      if (AutoReLogin.destroy === false) {
        AutoReLogin.tId = setInterval(function () {
          if (!AutoReLogin.execute) {
            AutoReLogin.execute = true;
            try {
              if (!isNull(AutoReLogin.p)) {
                LS.reconnect(() => {
                  AutoReLogin.p.id = createUUID();
                  let send = LS.send(JSON.stringify(AutoReLogin.p));
                  if (send) {
                    log.debug('reLogin send success');
                  }
                });
              } else {
                loginState = -1;
                let promise = doLogin({ lt: Storage.get('lt') });
                promise
                  .then(() => {
                    log.debug('reLogin send success');
                  })
                  .catch(() => {
                    log.debug('reLogin send failed');
                  });
              }
            } finally {
              AutoReLogin.execute = false;
            }
          }
        }, 5000);

        log.debug('auto login startup');
      }
    },

    stop() {
      if (!isNull(AutoReLogin.tId)) {
        AutoReLogin.execute = false;
        clearInterval(AutoReLogin.tId);
        AutoReLogin.tId = null;
        log.debug('auto login stop');
      }
    },
  };

  let MsgReceiver = {
    tid: null,

    execute: false,

    receives: new Map(),

    start() {
      if (isNull(MsgReceiver.tid)) {
        MsgReceiver.tid = setInterval(() => {
          if (MsgReceiver.receives.size > 0) {
            let iterator = MsgReceiver.receives.entries();
            let kv = iterator.next().value;
            while (!isNull(kv)) {
              MsgReceiver.receives.set(kv[0], new Date().getTime());
              kv = iterator.next().value;
            }
          }

          if (!MsgReceiver.execute) {
            try {
              log.log(
                '[IM][RUNNING] 消息去重保障机制正在运行中... 当前需要处理的队列大小为：' +
                  MsgReceiver.receives.size,
              );

              if (MsgReceiver.receives.size > 0) {
                let iterator = MsgReceiver.receives.entries();
                let kv = iterator.next().value;
                let current = new Date().getTime();
                while (!isNull(kv)) {
                  if (current - kv[1] > 600000) {
                    MsgReceiver.receives.delete(kv[0]);
                  }
                  kv = iterator.next().value;
                }
              }
            } finally {
              MsgReceiver.execute = false;
            }
          }
        }, 1000 * 60 * 10);

        log.debug('receiver qos startup');
      }
    },

    stop() {
      if (!isNull(MsgReceiver.tid)) {
        clearInterval(MsgReceiver.tid);
        MsgReceiver.tid = null;
        MsgReceiver.execute = false;
        log.debug('receiver qos stop');
      }
    },

    handlerMessage(text) {
      if (isNull(text)) {
        return true;
      }
      let p = JSON.parse(text);

      if (p.qos === 1) {
        if (p.type === 101 && p.content.code !== 111) {
        } else {
          let received = MsgReceiver.hasReceived(p.id);
          if (received) {
            MsgReceiver.addReceived(p);
            MsgSender.replyAck(p);
            return;
          }

          MsgReceiver.addReceived(p);
          MsgSender.replyAck(p);
        }
      }

      switch (p.type) {
        case 2:
          MsgReceiver.onReceivedMessage(p.content);
          break;
        case 3:
          MsgReceiver.onReceivedMessageAck(p.content);
          break;
        case 102:
          KeepAlive.onReceivedKeepAlive(p.content);
          break;
        case 5:
          MsgReceiver.onReceivedEcho(p.content);
          break;
        case 100:
          MsgReceiver.onReceivedError(p.content);
          break;
        case 101:
          MsgReceiver.onReceivedLoginResponse(p.content);
          break;
        case 103:
          MsgReceiver.onReceivedKickOut(p.content);
          break;
      }
    },

    addReceived(p) {
      MsgReceiver.receives.set(p.id, new Date().getTime());
    },

    //是否已经收到过
    hasReceived(pid) {
      let time = MsgReceiver.receives.get(pid);
      return !isNull(time);
    },

    //收到新消息
    onReceivedMessage(msg) {
      log.log('received new message '.concat(msg.msgId));
      Message.receivedMessage(msg);
    },

    //消息已经被对方收到
    onReceivedMessageAck(msg) {
      log.log('message received ack '.concat(msg.cliMsgId));
      MsgSender.sendSuccessMessage(msg.cliMsgId);
      Message.onReceivedMessageAck(msg);
      let observer = MsgSender.getSenderObserver(msg.cliMsgId);
      if (!isNull(observer)) {
        observer.resolve({ data: msg });
      }
      MsgSender.delSenderObserver(msg.cliMsgId);
    },

    //收到echo消息
    onReceivedEcho(msg) {
      let handler = getEventHandler(EVENTS.ON_RECEIVED_ECHO);
      if (!isNull(handler)) {
        handler({ data: msg });
      }
    },

    //收到错误
    onReceivedError(msg) {
      let handler = getEventHandler(EVENTS.ON_ERROR);
      if (!isNull(handler)) {
        handler(msg);
      }
    },

    //收到登录响应
    onReceivedLoginResponse(msg) {
      if (msg.code === 11111) {
        // 登录成功   自动重连关闭、心跳启动、发送qos启动、接收qos启动、回调sdk ready、设置loginState
        AutoReLogin.stop();
        KeepAlive.start();
        MsgSender.start();
        MsgReceiver.start();
        loginState = 5;
        log.debug('change loginState =[' + loginState + ']');

        EventSync.doSync();

        if (CONST.isSdkReady === true) {
          //重连成功时 回调网络连接状态
          handler = getEventHandler(EVENTS.NET_STATE_CHANGE);
          if (!isNull(handler)) {
            //标识网络正常
            handler({ data: 1 });
          }
        }
      }
    },

    //登录被踢出
    onReceivedKickOut(msg) {
      doDestroy();
      let handler = getEventHandler(EVENTS.ON_KICK_OUT_EVENT);
      if (!isNull(handler)) {
        handler({ data: msg });
      }
    },
  };

  //个人信息
  let User = {};

  //会话信息
  let Conversation = {
    //会话列表
    sessionList: [],

    //会话列表map存储 key：sessId
    sessionListMap: new Map(),

    //会话列表map存储 key：appUser
    sessionAppUserListMap: new Map(),

    //会话总未读数
    totalUnreadCount: 0,

    //会话更新回调
    notifySessionUpdate() {
      if (Conversation.sessionList.length > 0) {
        Conversation.sessionList.sort((a, b) => {
          //按照最后发送时间排序
          if (!isNull(a.lastMsg) && !isNull(a.lastMsg.timestamp)) {
            if (!isNull(b.lastMsg) && !isNull(b.lastMsg.timestamp)) {
              return b.lastMsg.timestamp - a.lastMsg.timestamp;
            }
            return -1;
          } else if (!isNull(b.lastMsg) && !isNull(b.lastMsg.timestamp)) {
            return 1;
          } else {
            //判断修改时间
            if (!isNull(a.updateTime)) {
              if (!isNull(b.updateTime)) {
                return b.updateTime - a.updateTime;
              }
              return -1;
            } else if (!isNull(b.updateTime)) {
              return 1;
            }
          }
          return 0;
        });
        let sessUpdateHandler = getEventHandler(EVENTS.ON_SESSION_UPDATE);
        if (!isNull(sessUpdateHandler)) {
          sessUpdateHandler({ data: Conversation.sessionList });
        }
      }
    },

    //总未读数事件通知
    notifyTotalUnreadCountHandler() {
      let sessUpdateHandler = getEventHandler(
        EVENTS.ON_SESSION_UNREAD_TOTAL_UPDATE,
      );
      if (!isNull(sessUpdateHandler)) {
        sessUpdateHandler({ data: Conversation.totalUnreadCount });
      }
    },

    //设置最后会话一条消息
    setLastMsg(msg) {
      if (msg) {
        let session = Conversation.sessionListMap.get(msg.sessId);
        if (session != null) {
          //设置最后一条消息和增加未读数
          Conversation.setLastMsgAndIncrUnreadCount(session, msg);
        } else {
          //会话不存在，调用接口创建会话
          //检查sessId正确性
          let sessId = Conversation.getSessId(
            msg.fromUser,
            msg.fromUserType,
            msg.toUser,
            msg.toUserType,
          );
          if (sessId === msg.sessId) {
            // 会话不存在，调用接口创建会话
            let promise = Conversation.getBySessId(sessId);
            promise
              .then((e) => {
                session = e.data;
                Conversation.setLastMsgAndIncrUnreadCount(session, msg);
                //设置最后一条消息和增加未读数
                Conversation.setLastMsgAndIncrUnreadCount(session, msg);
                //刷新一次
                Conversation.notifySessionUpdate();
              })
              .catch((e) => {
                log.error(
                  '获取会话失败，sessId=' + sessId + '  errmsg:' + e.message,
                );
              });
          } else {
            //忽略，sessid不正确，忽略
          }
        }
      }
    },

    //设置最后一条消息和增加未读数
    setLastMsgAndIncrUnreadCount(session, msg) {
      session.lastMsg = msg;
      session.unreadCount = isNull(session.unreadCount)
        ? 0
        : session.unreadCount;
      Conversation.totalUnreadCount = isNull(Conversation.totalUnreadCount)
        ? 0
        : Conversation.totalUnreadCount;
      if (msg.fromUser && msg.fromUser !== User.id) {
        let cliMsgId = Storage.getSessionUnreadMsgId(session.sessId);
        cliMsgId = !isNull(cliMsgId) ? cliMsgId : 0;
        if (!isNull(msg.cliMsgId)) {
          if (msg.cliMsgId > cliMsgId) {
            //计入会话未读
            session.unreadCount += 1;
            Conversation.totalUnreadCount += 1;
          }
        }
      }
    },

    /**
     * 获取或创建一个会话(不存在则调用接口创建)
     * @param toUser 对方用户id
     * @return new Promise({data: session})
     */ getBySessId(sessId) {
      return new Promise((resolve, reject) => {
        let session = Conversation.sessionListMap.get(sessId);
        if (!isNull(session)) {
          resolve({ data: session });
        } else {
          let split = sessId.split(':');
          if (isNull(split) || isNull(split.length) || split.length !== 2) {
            reject({
              code: -1,
              message: 'sessId 错误',
            });
          } else {
            doRequest({
              method: 'POST',
              url: CONST.gateway + '/session/get',
              body: JSON.stringify({
                toUser: split[0] === User.id ? split[1] : split[0],
              }),
              success(e) {
                if (!isNull(e.code) && e.code === 0) {
                  if (!isNull(e.data)) {
                    let session = Conversation.sessionListMap.get(sessId);
                    if (isNull(session)) {
                      Conversation.sessionList.push(e.data);
                      Conversation.sessionListMap.set(e.data.sessId, e.data);
                      Conversation.sessionAppUserListMap.set(
                        e.data.appUser,
                        e.data,
                      );
                      //会话更新回调
                      Conversation.notifySessionUpdate();
                    }
                    resolve({ data: e.data });
                  }
                } else {
                  reject(e);
                }
              },

              fail(e) {
                reject(e);
              },

              setHeader(request) {
                request.setRequestHeader('Request-V', Storage.get('lt'));
                request.setRequestHeader('deviceId', Storage.getDeviceId());
                request.setRequestHeader(
                  'Content-Type',
                  'application/json;charset=UTF-8',
                );
              },
            });
          }
        }
      });
    },

    /**
     * 通过应用账号获取会话，不存在则创建
     * @param appUser
     */ getByAppUser(appUser) {
      return new Promise((resolve, reject) => {
        if (isNull(appUser)) {
          reject({
            code: -1,
            message: 'appUser 错误',
          });
        } else {
          let session = Conversation.sessionAppUserListMap.get(appUser);
          if (!isNull(session)) {
            resolve({ data: session });
          } else {
            doRequest({
              method: 'POST',
              url: CONST.gateway + '/session/get/appUser',
              body: JSON.stringify({ toUser: appUser }),

              success(e) {
                if (!isNull(e.code) && e.code === 0) {
                  if (!isNull(e.data)) {
                    let session = Conversation.sessionListMap.get(
                      e.data.sessId,
                    );
                    if (isNull(session)) {
                      Conversation.sessionList.push(e.data);
                      Conversation.sessionListMap.set(e.data.sessId, e.data);
                      Conversation.sessionAppUserListMap.set(
                        e.data.appUser,
                        e.data,
                      );
                      //会话更新回调
                      Conversation.notifySessionUpdate();
                    }
                    resolve({ data: e.data });
                  }
                } else {
                  reject(e);
                }
              },

              fail(e) {
                reject(e);
              },

              setHeader(request) {
                request.setRequestHeader('Request-V', Storage.get('lt'));
                request.setRequestHeader('deviceId', Storage.getDeviceId());
                request.setRequestHeader(
                  'Content-Type',
                  'application/json;charset=UTF-8',
                );
              },
            });
          }
        }
      });
    },

    /**
     * 获取会话id
     * @param fromUser 发送方或接收方
     * @param toUser 发送方或接收方
     * @return {string} sessId
     */ getSessId(fromUser, fromUserType, toUser, toUserType) {
      switch (toUserType) {
        case 0:
        case 9:
          let sessArr = [fromUser, toUser];
          sessArr.sort();
          return sessArr[0] + ':' + sessArr[1];
        case 15:
          return toUser;
      }
    },

    /**
     * 拉取昵称头像等信息
     */ fetchNickInfo() {
      if (Conversation.sessionList.length > 0) {
        let users = [];
        for (let i = 0; i < Conversation.sessionList.length; i++) {
          users.push(Conversation.sessionList[i].toUser);
        }
        doRequest({
          method: 'POST',
          url: CONST.gateway + '/user/infos',
          body: JSON.stringify({ users: users }),

          success(e) {
            if (!isNull(e.code) && e.code === 0) {
              if (!isNull(e.data) && e.data.length > 0) {
                for (let i = 0; i < e.data.length; i++) {
                  let u = e.data[i];
                  let session = Conversation.sessionListMap.get(
                    Conversation.getSessId(
                      User.id,
                      User.userType,
                      u.id,
                      u.userType,
                    ),
                  );
                  if (!isNull(session)) {
                    session.avatar = u.avatar;
                    session.appUser = u.appUser;
                    session.nickname = u.nickname;
                    Conversation.sessionAppUserListMap.set(
                      session.appUser,
                      session,
                    );
                  }
                }
                //会话更新回调（需要调用刷新一下，否则昵称头像为undefined）
                Conversation.notifySessionUpdate();
              } else {
                log.error('会话信息同步失败');
              }
            }
          },

          fail(e) {},

          setHeader(request) {
            request.setRequestHeader('Request-V', Storage.get('lt'));
            request.setRequestHeader('deviceId', Storage.getDeviceId());
            request.setRequestHeader(
              'Content-Type',
              'application/json;charset=UTF-8',
            );
          },
        });
      }
    },

    /**
     * 清除单个会话未读数
     * @param op {sessId : xxx}
     * @return Promise<>
     */ clearSessionUnreadCount(op) {
      return new Promise((resolve, reject) => {
        if (isNull(op) || isNull(op.sessId)) {
          reject({ code: -1, message: 'sessId不能为空' });
        } else {
          let session = Conversation.sessionListMap.get(op.sessId);
          if (isNull(session)) {
            reject({ code: -1, message: '会话不存在' });
          } else {
            //使用缓存解决未读数问题
            if (!isNull(session.lastMsg) && !isNull(session.lastMsg.cliMsgId)) {
              Storage.setSessionUnreadMsgId(
                session.sessId,
                session.lastMsg.cliMsgId,
              );
            }
            Conversation.totalUnreadCount =
              Conversation.totalUnreadCount - session.unreadCount;
            Conversation.totalUnreadCount =
              Conversation.totalUnreadCount < 0
                ? 0
                : Conversation.totalUnreadCount;
            session.unreadCount = 0;
            Conversation.notifySessionUpdate();
            Conversation.notifyTotalUnreadCountHandler();
            resolve({ code: 0 });
          }
        }
      });
    },
  };

  let Message = {
    //消息缓存 k:sessId, v: [msg,msg,msg]
    msgStore: new Map(),

    //全部历史消息 k:msgId, v: msg
    historyMsg: new Map(),

    value: 0,

    timestamp: new Date().getTime(), //新消息事件通知

    notifyOnReceivedMessageHandler(msg) {
      let handler = getEventHandler(EVENTS.ON_RECEIVED_MESSAGE);
      if (!isNull(handler)) {
        handler({ data: msg });
      }
    }, //新收到消息，需历经 缓存
    receivedMessage(msg) {
      if (!isNull(msg) && !isNull(msg.msgType)) {
        if (msg.msgType === 101) {
          //消息已读
          if (
            !isNull(msg.data) &&
            !isNull(msg.data.msgIds) &&
            msg.data.msgIds.length > 0 &&
            User.id !== msg.data.readUser
          ) {
            //修改历史记录
            for (let j = 0; j < msg.data.msgIds.length; j++) {
              let msgId = msg.data.msgIds[i];
              let historyMsg = Message.historyMsg.get(msgId);
              if (!isNull(historyMsg)) {
                if (isNull(historyMsg.readUsers)) {
                  historyMsg.readUsers = [];
                }
                historyMsg.readUsers.push({
                  userId: msg.data.readerUser,
                  userType: msg.data.readerUserType,
                });
              }
            }
            //TODO 修改未读为0、总未读数
            //消息已读通知
            Message.notifyMessageReadEvent(msg.data);
          }
        } else if (msg.msgType === 102) {
          //消息修改通知 modify
          console.error('修改消息。。。。', msg);
          if (!isNull(msg.data) && !isNull(msg.data.msgId)) {
            let historyMsg = Message.historyMsg.get(msg.data.msgId);
            if (!isNull(historyMsg)) {
              historyMsg.data = msg.data.data;
              Message.notifyMessageModifyEvent(historyMsg);
            }
          }
        } else if (msg.msgType === 201) {
          //会话创建 msg.data中就是会话信息
          if (!isNull(msg.data) && !isNull(msg.data.sessId)) {
            let session = Conversation.sessionListMap.get(msg.data.sessId);
            if (isNull(session)) {
              Conversation.sessionListMap.set(msg.data.sessId, msg.data);
              Conversation.sessionAppUserListMap.set(
                msg.data.appUser,
                msg.data,
              );
              Conversation.sessionList.push(msg.data);
              Conversation.notifySessionUpdate();
            }
          }
        } else {
          //其他普通消息
          //缓存消息
          Message.addToCache(msg);
          //消息插入会话最后一条消息
          Conversation.setLastMsg(msg);
          //新消息事件回调
          Message.notifyOnReceivedMessageHandler(msg);
          //会话更新回调
          Conversation.notifySessionUpdate();
          //总未读数回调
          Conversation.notifyTotalUnreadCountHandler();
        }

        if (!isNull(msg.eventId)) {
          //更新事件id
          EventSync.lastSyncEventID = msg.eventId;
        }
      }
    }, //消息已读通知
    notifyMessageReadEvent(msgData) {
      let handler = getEventHandler(EVENTS.ON_MESSAGE_READ);
      if (!isNull(handler)) {
        handler({ data: msgData });
      }
    }, //消息修改通知，取其 msgId 更新页面上同 ID 消息的内容
    notifyMessageModifyEvent(modifyMsg) {
      let handler = getEventHandler(EVENTS.ON_MESSAGE_MODIFY);
      if (!isNull(handler)) {
        handler({ data: modifyMsg });
      }
    }, //分页拉取消息
    getMessageList(op) {
      return new Promise((resolve, reject) => {
        if (!isNull(op) && !isNull(op.sessId)) {
          if (isNull(op.nextMsgId)) {
            op.nextMsgId = 0;
          }
          let res = {
            data: {
              isCompleted: true, //消息是否全部拉取完
              nextMsgId: op.nextMsgId, //下一次的nextMsgId
              messageList: [], //消息列表
            },
          };
          let sessionMsgList = Message.msgStore.get(op.sessId);
          if (!isNull(sessionMsgList)) {
            if (sessionMsgList.length > 0) {
              for (let i = 0; i < sessionMsgList.length; i++) {
                if (sessionMsgList[i].cliMsgId > op.nextMsgId) {
                  if (res.data.messageList.length >= 20) {
                    if (sessionMsgList.length > i) {
                      res.data.isCompleted = false;
                    }
                    break;
                  }
                  res.data.nextMsgId = sessionMsgList[i].cliMsgId;
                  //添加到数组第一位
                  res.data.messageList.push(sessionMsgList[i]);
                }
              }
            }
          }
          resolve(res);
        } else {
          reject({ code: -1, message: '参数错误，sessId不能为空' });
        }
      });
    }, //创建自定义消息 op:{msgType, data:{}, extraData:{}, toUser, toUserType}
    createCustomMessage(op) {
      let time = new Date().getTime();
      return {
        toUser: op.toUser,
        toUserType: op.toUserType,
        timestamp: time < Message.timestamp ? Message.getNextCliMsgId() : time,
        cliMsgId: Message.getNextCliMsgId(),
        msgType: op.msgType, //文本消息
        version: IMSDK.version,
        data: op.data,
        extraData: op.extraData,
      };
    }, //创建文本消息 op:{content, toUser, toUserType}
    createTextMessage(op) {
      let time = new Date().getTime();
      return {
        toUser: op.toUser,
        toUserType: op.toUserType,
        timestamp: time < Message.timestamp ? Message.getNextCliMsgId() : time,
        cliMsgId: Message.getNextCliMsgId(),
        msgType: 1, //文本消息
        version: IMSDK.version,
        data: {
          content: op.content,
        },
      };
    }
    /**
     * 创建图片消息
     * @param op：{
     *     data:{
     *         name:文件名,
     *         type:文件类型,
     *         size:文件大小,
     *         md5:文件MD5，
     *         smallUrl:图片缩略图，
     *         url：图片url,
     *         high:图片高度,
     *         wide:图片宽度
     *     }
     *      toUser,
     *      toUserType
     * }
     */,
    createImgMessage(op) {
      return Message.createCustomMessage({
        msgType: 2, //图片消息
        data: op.data,
        toUser: op.toUser,
        toUserType: op.toUserType,
      });
    },

    /**
     * 创建语音消息
     * @param op：{
     *     data:{
     *         name: 语音文件名,
     *         type: 语音文件类型,
     *         size: 语音文件大小,
     *         md5: 语音文件MD5，
     *         time:语音时长，
     *         url：图片url,
     *     }
     *      toUser,
     *      toUserType
     * }
     */
    createVoiceMessage(op) {
      return Message.createCustomMessage({
        msgType: 5, //语音消息
        data: op.data,
        toUser: op.toUser,
        toUserType: op.toUserType,
      });
    },

    /**
     * 创建文件消息
     * @param op：{
     *     data:{
     *         name: 文件名,
     *         type: 文件类型,
     *         size: 文件大小,
     *         md5: 文件MD5，
     *         url：文件url,
     *     }
     * toUser：接收方
     * toUserType：接收方类型
     * }
     */
    createFileMessage(op) {
      return Message.createCustomMessage({
        msgType: 3,
        data: op.data,
        toUser: op.toUser,
        toUserType: op.toUserType,
      });
    },

    /**
     * 创建短视频消息
     * @param op：{
     *     data:{
     *         videoUrl: 视频url,
     *         type: 视频类型,
     *         time: 视频时长,
     *         snapshotUrl：视频封面图片路径,
     *     }
     * toUser：接收方
     * toUserType：接收方类型
     * }
     */
    createVideoMessage(op) {
      return Message.createCustomMessage({
        msgType: 4,
        data: op.data,
        toUser: op.toUser,
        toUserType: op.toUserType,
      });
    },

    /**
     * 创建地理位置消息
     * @param op：{
     *     data:{
     *         longitude: 经度,
     *         latitude: 纬度,
     *         placeName: 地名,
     *         detailAddress:详细地址，
     *     }
     * toUser：接收方
     * toUserType：接收方类型
     * }
     */
    createPositionMessage(op) {
      return Message.createCustomMessage({
        msgType: 6,
        data: op.data,
        toUser: op.toUser,
        toUserType: op.toUserType,
      });
    },

    //获取下一个msgId
    getNextCliMsgId() {
      let none = ++Message.value;
      if (KeepAlive.lastServerKeepAliveTime !== 0) {
        return KeepAlive.lastServerKeepAliveTime + none + '';
      }
      return Message.timestamp + none + '';
    }, //将消息添加到缓存
    addToCache(msg) {
      if (isNull(msg.msgId)) {
        //    刚发出的消息是没有 msgId的，只有CliMsgId，发送成功后，在修改回来
        Message.historyMsg.set(msg.cliMsgId, msg);
      } else {
        Message.historyMsg.set(msg.msgId, msg);
      }
      let sessMsgMap = Message.msgStore.get(msg.sessId);
      if (isNull(sessMsgMap)) {
        sessMsgMap = [];
        Message.msgStore.set(msg.sessId, sessMsgMap);
      }
      sessMsgMap.push(msg);
    }, //的消息是没有 msgId的，只有CliMsgId，发送成功后，在修改回来
    onReceivedMessageAck(msg) {
      let beforeMsg = Message.historyMsg.get(msg.cliMsgId);
      if (!isNull(beforeMsg)) {
        beforeMsg.msgId = msg.msgId;
        Message.historyMsg.delete(msg.cliMsgId);
        Message.historyMsg.set(msg.msgId, beforeMsg);
        Conversation.notifySessionUpdate();
      }
    },
  };

  let EventSync = {
    //最后同步的eventId
    lastSyncEventID: '0',

    //开始同步
    doSync() {
      //异步，以免数据太多，导致心跳超时
      setTimeout(() => {
        //开始同步
        let startSync = getEventHandler(EVENTS.ON_EVENT_SYNC_START);
        if (!isNull(startSync)) {
          startSync();
        }
        if (CONST.isSdkReady === false) {
          //第一次登录
          //拉取会话列表
          doRequest({
            method: 'POST',
            url: CONST.gateway + '/session/all',
            body: '{}',
            success(e) {
              if (!isNull(e.code) && e.code === 0) {
                if (
                  !isNull(e.data) &&
                  !isNull(e.data.length) &&
                  e.data.length > 0
                ) {
                  Conversation.sessionList = e.data;
                  //解析到map中
                  for (let i = 0; i < e.data.length; i++) {
                    Conversation.sessionListMap.set(
                      e.data[i].sessId,
                      e.data[i],
                    );
                  }
                  //第一次登录拉取昵称头像
                  Conversation.fetchNickInfo();
                  //会话更新回调
                  Conversation.notifySessionUpdate();
                }
              }
            },

            fail(e) {},

            setHeader(request) {
              request.setRequestHeader('Request-V', Storage.get('lt'));
              request.setRequestHeader('deviceId', Storage.getDeviceId());
            },
          });

          // 触发事件
          CONST.isSdkReady = true;
          let handler = getEventHandler(EVENTS.IM_SDK_READY);
          if (!isNull(handler)) {
            handler();
          }
        }

        //同步事件
        EventSync.doSyncEvent();
      }, 1);
    },

    doSyncEvent() {
      doRequest({
        method: 'POST',
        url: CONST.gateway + '/synchro/event/' + EventSync.lastSyncEventID,
        body: '{"offset":0,"count":999999999}',

        success(e) {
          if (!isNull(e.code) && e.code === 0) {
            if (
              !isNull(e.data) &&
              !isNull(e.data.data) &&
              e.data.data.length > 0
            ) {
              //解析事件
              for (let i = e.data.data.length - 1; i >= 0; i--) {
                let cData = e.data.data[i];
                if (cData.eventType === 0) {
                  //消息事件，纯消息
                  Message.receivedMessage(cData.event);
                } else {
                  log.error(
                    '接受到新的事件消息，但是当前sdk 无法处理，请升级为最新的sdk',
                  );
                }
              }

              //更新最后一次id
              EventSync.lastSyncEventID = e.data.data[0].eventId;
            }

            //同步完成
            let finish = getEventHandler(EVENTS.ON_EVENT_SYNC_FINISH);
            if (!isNull(finish)) {
              finish();
            }
          }
        },

        fail(e) {},

        setHeader(request) {
          request.setRequestHeader('Request-V', Storage.get('lt'));
          request.setRequestHeader('deviceId', Storage.getDeviceId());
          request.setRequestHeader(
            'Content-Type',
            'application/json;charset=UTF-8',
          );
        },
      });
    },
  };

  let MsgSender = {
    //发送状态的观察者
    senderObserver: new Map(), //需要qos的消息
    senderMsg: new Map(), //定时器id
    tid: null, //执行状态
    execute: null,

    start() {
      if (isNull(MsgSender.tid)) {
        MsgSender.execute = false;
        MsgSender.tid = setInterval(() => {
          try {
            if (MsgSender.execute === false) {
              MsgSender.execute = true;

              let entries = MsgSender.senderMsg.entries();
              let kv = entries.next().value;
              let failedMsg = [];
              while (!isNull(kv)) {
                let k = kv[0];
                let v = kv[1];
                let currTime = new Date().getTime();
                if (v.count >= 2) {
                  failedMsg.push(v);
                  MsgSender.senderMsg.delete(k);
                } else if (currTime - v.lastTime >= 3000) {
                  let send = LS.send(JSON.stringify(v.p));
                  v.incrCount();
                }

                kv = entries.next().value;
              }
              if (failedMsg.length > 0) {
                MsgSender.notifyFailedMsg(failedMsg);
              }
            }
          } catch (e) {
          } finally {
            MsgSender.execute = false;
          }
        }, 5000);

        log.debug('sender qos startup');
      }
    },

    stop() {
      if (!isNull(MsgSender.tid)) {
        clearInterval(MsgSender.tid);
        MsgSender.execute = false;
        MsgSender.tid = null;
        log.debug('sender qos stop');
      }
    },

    //回复ack
    replyAck(p) {
      if (!isNull(p)) {
        let rp = {
          content: {
            pId: p.id,
            msgId: isNull(p.content) ? '' : p.content.msgId,
            cliMsgId: isNull(p.content) ? '' : p.content.cliMsgId,
          },
          type: 3,
          qos: 0,
          id: createUUID(),
        };

        let send = LS.send(JSON.stringify(rp));
        if (send) {
          log.debug('message reply ack success pid= ' + p.id);
        } else {
          log.debug('message reply ack failed  pid= ' + p.id);
        }
      }
    },

    /**
     * 发送消息并且加入qos队列
     * @param msg 消息 obj
     * @param resolve 发送成功后的回调
     * @param reject 发送失败的回调
     */
    messageSendAndQos(msg, resolve, reject) {
      if (isNull(msg.cliMsgId) || msg.cliMsgId <= 0) {
        log.error(
          'error  cliMsgId 不能为空  --->  '.concat(JSON.stringify(msg)),
        );
        reject({ code: -1, message: 'cliMsgId 不能为空' });
        return;
      }

      if (isNull(msg.toUser)) {
        log.error('error  toUser 不能为空  --->  '.concat(JSON.stringify(msg)));
        reject({ code: -1, message: 'toUser 消息接收方 不能为空' });
        return;
      }

      if (isNull(msg.toUserType)) {
        log.error(
          'error  toUserType 不能为空  --->  '.concat(JSON.stringify(msg)),
        );
        reject({ code: -1, message: 'toUserType 消息接收方类型 不能为空' });
        return;
      }

      if (
        isNull(msg.msgType) ||
        (typeof msg.msgType !== 'number' && isNaN(msg.msgType))
      ) {
        log.error(
          'error  msgType 不能为空，必须是一个 number  --->  '.concat(
            JSON.stringify(msg),
          ),
        );
        reject({
          code: -1,
          message: 'msgType 消息类型 不能为空，必须是一个 number',
        });
        return;
      }

      if (isNull(msg.data) || typeof msg.data !== 'object') {
        log.error(
          'error  data 不能为空，必须是一个 object  --->  '.concat(
            JSON.stringify(msg),
          ),
        );
        reject({
          code: -1,
          message: 'data 消息数据 不能为空，必须是一个 object',
        });
        return;
      }

      msg.fromUser = User.id;
      msg.fromUserType = User.userType;

      if (isNull(User.id)) {
        log.error('error  SDK 还未准备好');
        reject({ code: -1, message: 'SDK 还未准备好' });
        return;
      }

      switch (msg.toUserType) {
        case 0:
        case 9:
        case 15:
          //允许发送的接收方类型
          break;
        default:
          //0是普通用户
          log.error(
            '当前sdk不支持 发送 toUserType=[' + msg.toUserType + '] 的消息',
          );
          reject({
            code: -1,
            message:
              '当前sdk不支持 发送 toUserType=[' + msg.toUserType + '] 的消息',
          });
          return;
      }

      // 填充会话id
      msg.sessId = Conversation.getSessId(
        msg.fromUser,
        msg.fromUserType,
        msg.toUser,
        msg.toUserType,
      );

      if (isNull(msg.version)) {
        msg.version = IMSDK.version;
      }
      let p = {
        content: msg,
        id: createUUID(),
        qos: 1,
        type: 2,
      };

      MsgSender.senderMsg.set(msg.cliMsgId, {
        msg: msg,
        p: p,
        lastTime: new Date().getTime(),
        count: 0,
        incrCount() {
          return ++this.count;
        },
      });

      MsgSender.setSenderObserver(msg.cliMsgId, resolve, reject);
      //缓存到消息
      Message.addToCache(msg);
      //消息插入会话最后一条消息
      Conversation.setLastMsg(msg);
      //会话更新回调
      Conversation.notifySessionUpdate();
      // Conversation.
      let send = LS.send(JSON.stringify(p));
      if (send) {
        MsgSender.senderMsg.get(msg.cliMsgId).incrCount();
      }
    },

    getSenderObserver(cliMsgId) {
      return MsgSender.senderObserver.get(cliMsgId);
    },

    delSenderObserver(cliMsgId) {
      if (!isNull(cliMsgId)) {
        MsgSender.senderObserver.delete(cliMsgId);
      }
    },

    sendSuccessMessage(cliMsgId) {
      if (!isNull(cliMsgId)) {
        MsgSender.senderMsg.delete(cliMsgId);
      }
    },

    setSenderObserver(cliMsgId, resolve, reject) {
      MsgSender.senderObserver.set(cliMsgId, {
        resolve: resolve,
        reject: reject,
      });
    },

    /**
     * 通知发送失败
     * @param failedMsg []
     */
    notifyFailedMsg(failedMsg) {
      for (let i = 0; i < failedMsg.length; i++) {
        let observer = MsgSender.getSenderObserver(failedMsg[i].msg.cliMsgId);
        if (!isNull(observer)) {
          observer.reject({ msg: failedMsg[i].msg });
        }
      }
    },
  };

  let KeepAlive = {
    //timer id
    tid: null,
    lastServerKeepAliveTime: 0,
    handlerClose: false,

    //处理连接断开，socket onclose 调用，心跳丢失调用
    handlerConnectClose() {
      if (KeepAlive.handlerClose === false) {
        KeepAlive.handlerClose = true;
        //首次调用，调用回调事件通知ui
        loginState = 3;
        //关闭心跳
        KeepAlive.stop();
        MsgSender.stop();
        MsgReceiver.stop();
        AutoReLogin.start();

        //关闭心跳、关闭发送qos、开启重连
        let handler = getEventHandler(EVENTS.NET_STATE_CHANGE);
        if (!isNull(handler)) {
          //标识网络断开，sdk重连中
          handler({ data: 2 });
        }
      }
    },

    //收到服务端发来的心跳
    onReceivedKeepAlive(msg) {
      KeepAlive.lastServerKeepAliveTime = new Date().getTime();
      log.debug('keep alive time : ' + KeepAlive.lastServerKeepAliveTime);
    },

    //启动心跳
    start() {
      if (isNull(KeepAlive.tid)) {
        KeepAlive.handlerClose = false;

        KeepAlive.tid = setInterval(() => {
          if (
            !isNull(KeepAlive.lastServerKeepAliveTime) &&
            new Date().getTime() - KeepAlive.lastServerKeepAliveTime > 20000
          ) {
            log.debug(
              'long time not receiver server keep alive, last receiver time ：' +
                KeepAlive.lastServerKeepAliveTime,
            );

            KeepAlive.handlerConnectClose();
          } else {
            KeepAlive.sendKeep();
          }
        }, 15000);

        KeepAlive.sendKeep();

        log.debug('keep alive startup');
      }
    },

    sendKeep() {
      let p = {
        content: {},
        id: createUUID(),
        qos: 0,
        type: 4,
      };
      let send = LS.send(JSON.stringify(p));
    },

    stop() {
      if (!isNull(KeepAlive.tid)) {
        clearInterval(KeepAlive.tid);
        KeepAlive.tid = null;
        log.debug('keep alive stop');
      }
    },
  };

  //socket管理
  let LS = {
    ws: null,
    t: null,

    //关闭socket
    closeConnect: () => {
      if (!isNull(LS.ws)) {
        LS.ws.close();
      }
    },

    //重连，连接打开的回调observer
    reconnect: (observer) => {
      LS.closeConnect(true);
      LS.connect(observer);
    },

    //连接ws，连接打开的回调observer
    connect: (observer) => {
      LS.ws = new WebSocket(CONST.wsUrl);

      LS.ws.onopen = (e) => {
        if (!isNull(observer)) {
          observer(e);
        }
      };

      LS.ws.onmessage = (e) => {
        MsgReceiver.handlerMessage(e.data);
      };

      LS.ws.onclose = (e) => {
        KeepAlive.handlerConnectClose();
      };

      LS.ws.onerror = (e) => {
        log.warn('socket onerror e='.concat(e));
      };
    },

    //发送消息
    send: (p) => {
      if (!isNull(LS.ws) && LS.ws.readyState === 1) {
        LS.ws.send(p);
        return true;
      }
      return false;
    },
  };

  /**
   * 文件相关
   * @type {{}}
   */
  let IMFile = {
    /**
     * 上传文件
     * @param
     *     file: 文件
     *     progress: 上传进度回调函数，直接赋值于：xhr.upload.onprogress
     *
     * @return Promise
     */
    doUploadFile(file, progress) {
      return new Promise((resolve, reject) => {
        if (file instanceof File) {
          log.log(
            'Common.doUploadFile 准备上传文件'
              .concat('  fileName: ')
              .concat(file.name),
          );

          let formdata = new FormData();
          formdata.append('file', file);

          let request = new XMLHttpRequest();
          request.open('POST', CONST.gateway + '/msgFile/upload');
          request.setRequestHeader('Request-V', Storage.get('lt'));
          request.setRequestHeader('deviceId', Storage.getDeviceId());

          //5分钟还未调用，则超时返回错误
          request.timeout = 300000;
          request.ontimeout = () => {
            log.log(
              'Common.doUploadFile 上传文件失败，网络超时！'
                .concat('  fileName: ')
                .concat(file.name),
            );
            reject({
              code: -1,
              message: '网络超时',
            });
          };
          request.onerror = function (XMLHttpRequest, textStatus, errorThrown) {
            log.log(
              'Common.doUploadFile 上传文件失败，网络错误！'
                .concat('  fileName: ')
                .concat(file.name),
            );
            reject({
              code: -1,
              message: '网络错误',
            });
          };
          request.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
              log.log(
                'Common.doUploadFile 上传文件成功 - --->  ok!'
                  .concat('  fileName: ')
                  .concat(file.name),
              );
              let res = JSON.parse(this.responseText);
              if (res.code == 0) {
                res.data.url = CONST.gateway + res.data.url;
                resolve(res);
              } else {
                reject(res);
              }
            }
          };
          //获取上传的进度
          request.upload.onprogress = progress;

          request.send(formdata);
        } else {
          reject({ code: -1, message: 'file 不是一个文件' });
        }
      });
    },
  };

  /**
   * http
   * @param op {
   *     method:"请求方式",
   *     url:"资源路径",
   *     body:"请求参数",
   *     success():"成功回调", http==200
   *     fail():"失败回调",
   *     setHeader():"设置请求头",
   * }
   */
  let doRequest = (op) => {
    if (log.isDebugLevel()) {
      log.debug('Common.doRequest'.concat('  op: ').concat(op));
    }

    let request = new XMLHttpRequest();
    request.open(op.method, op.url);
    if (!isNull(op.setHeader)) {
      op.setHeader(request);
    }
    //十秒钟还未调用，则超时返回错误
    request.timeout = 60000;
    request.ontimeout = () => {
      op.fail({
        code: -1,
        message: '网络超时',
      });
      if (log.isDebugLevel()) {
        log.debug(
          'Request Error Common.doRequest.url= '
            .concat(op.url)
            .concat('  网络超过30秒未正常返回'),
        );
      }
    };
    request.onerror = function (XMLHttpRequest, textStatus, errorThrown) {
      op.fail({
        code: -1,
        message: '网络错误',
      });
    };
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (!isNull(op.success)) {
          op.success(JSON.parse(this.responseText));
        }
        if (log.isDebugLevel()) {
          log.debug(
            'Request Success Common.doRequest.url= '
              .concat(op.url)
              .concat('  res= ')
              .concat(this.responseText),
          );
        }
      }
    };

    request.send(op.body);
  };

  let doDestroy = () => {
    //抢在ls之前关闭自动重连机制
    AutoReLogin.destroy = true;
    KeepAlive.handlerConnectClose();
    LS.closeConnect();
    AutoReLogin.stop();
    KeepAlive.stop();
    MsgSender.stop();
    MsgReceiver.stop();
    //登录状态恢复为 -1
    loginState = -1;
    AutoReLogin.destroy = false;
    CONST.isSdkReady = false;
    let handler = getEventHandler(EVENTS.IM_SDK_NOT_READY);
    if (!isNull(handler)) {
      handler();
    }
  };

  let createUUID = () => {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
  };

  //登录装态 -1未点击
  //登录状态 0未登录
  //登录状态 1已发出登录请求
  //登录状态 2登录成功
  //登录状态 3未连接
  //登录状态 4认证中
  //登录状态 5连接成功，可以发送消息，触发sdk ready 事件
  let loginState = -1;

  let doLogin = (options) => {
    Storage.set('lt', options.lt);
    if (loginState > -1) {
      return new Promise((resolve, reject) => {
        reject({
          code: -1,
          message: '请不要重复点击',
        });
      });
    }
    loginState = 0;
    log.debug('change loginState =[' + loginState + ']');
    return new Promise((resolve, reject) => {
      log.debug('doLogin '.concat(JSON.stringify(options)));
      if (typeof options !== 'object' || isNull(options.lt)) {
        reject({
          code: -1,
          message: '登录参数错误,[lt] 必填!',
        });
        return;
      }
      //获取系统信息
      loginState = 1;
      log.debug('change loginState =[' + loginState + ']');
      doRequest({
        method: 'POST',
        url: CONST.gateway.concat('/auth/login'),
        body: JSON.stringify({
          deviceId: Storage.getDeviceId(),
          model: Model.getInfo(),
        }),
        success: (res) => {
          loginState = 2;
          log.debug('change loginState =[' + loginState + ']');
          if (!isNull(res.code) && res.code === 0) {
            Storage.setDeviceId(res.data.deviceId);
            Storage.setLoginTime(res.data.loginTime);
            Message.timestamp = res.data.loginTime;
            //个人信息
            User = res.data.user;

            //触发socket登录连接
            log.debug('socket connect ...');
            loginState = 3;
            log.debug('change loginState =[' + loginState + ']');
            LS.reconnect((e) => {
              loginState = 4;
              log.debug('change loginState =[' + loginState + ']');
              //连接成功后，立即发送认证消息
              let p = {
                content: {
                  deviceId: res.data.deviceId,
                  loginTime: res.data.loginTime,
                  userId: User.id,
                  token: options.lt,
                },
                id: createUUID(),
                qos: 0,
                type: 1,
              };
              AutoReLogin.p = p;
              LS.send(JSON.stringify(p));
            });
          }
          resolve(res);
        },
        fail: (res) => {
          reject(res);
          // AutoReLogin.start();
        },
        setHeader: (request) => {
          request.setRequestHeader('Request-V', options.lt);
          request.setRequestHeader(
            'Content-Type',
            'application/json;charset=UTF-8',
          );
        },
      });
    });
  };

  let doLogout = () => {
    return new Promise((resolve, reject) => {
      doDestroy();
      doRequest({
        method: 'GET',
        url: CONST.gateway.concat('/auth/logout'),
        body: '',
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        },
        setHeader: (request) => {
          request.setRequestHeader('Request-V', Storage.get('lt'));
          request.setRequestHeader('deviceId', Storage.getDeviceId());
          request.setRequestHeader(
            'Content-Type',
            'application/json;charset=UTF-8',
          );
        },
      });
    });
  };

  return (IMSDK = {
    EVENTS: EVENTS,

    version: '1.1.0',

    registerEvent: registerEvent,

    removeEvent: removeEvent,

    setLogLevel: (level) => {
      log.setLogLevel(level);
    },

    destroy: () => {
      return doDestroy();
    },

    login: (options) => {
      return doLogin(options);
    },

    logout: () => {
      return doLogout();
    },

    //返回自己的信息
    getSelfUserSync() {
      if (CONST.isSdkReady === true) {
        return {
          userId: User.id,
          appUser: User.appUser,
          nickname: User.nickname,
          avatar: User.avatar,
        };
      }
      return {};
    },

    /**
     * 获取所有会话列表
     * @return {[]}
     */
    getAllSession() {
      return Conversation.sessionList;
    },

    /**
     * 通过sessId获取会话
     * @param sessId 会话id
     * @return {Promise<unknown>}
     */
    getSessionBySessId(sessId) {
      return Conversation.getBySessId(sessId);
    },

    /**
     * 通过appUser获取会话
     * @param appUser 应用userId
     * @return {Promise<unknown>}
     */
    getSessionByAppUser(appUser) {
      return Conversation.getByAppUser(appUser);
    },

    /**
     * 清除单个会话未读数
     * @param op {sessId : xxx}
     * @return Promise<>
     */
    clearSessionUnreadCount(op) {
      return Conversation.clearSessionUnreadCount(op);
    },

    /**
     * 创建一个uuid
     * @return {*}
     */
    UUID: () => {
      return createUUID();
    },

    /**
     * 发送消息
     * @param msg 必须由 createXXXMessage 方法创建
     * @return {Promise<unknown>}
     */
    sendMessage: (msg) => {
      return new Promise((resolve, reject) => {
        if (typeof msg != 'object') {
          reject({
            code: -1,
            message: '消息必须是一个 object！',
          });
        } else {
          MsgSender.messageSendAndQos(msg, resolve, reject);
        }
      });
    },

    /**
         * 拉取历史消息
         * @param op {
            sessId:"",  会话id
            nextMsgId:"", 用于分页续拉的消息 ID。第一次拉取时不要传入 nextReqMessageID，续拉时填入上次调用 getMessageList 接口返回的该字段的值
                       }

         * @return promise
         */
    getMessageList(op) {
      return Message.getMessageList(op);
    },

    /**
     * 创建自定义消息
     * @param op：{
     *      msgType, //消息类型
     *      data:{}, //消息数据
     *      extraData:{}, //附加数据
     *      toUser, //接收方
     *      toUserType //接收方类型
     * }
     */
    createCustomMessage(op) {
      return Message.createCustomMessage(op);
    },

    /**
     * 创建文本消息
     * @param  op :{
     * content：文本内容
     * toUser：接收方
     * toUserType：接收方类型
     * }
     * @return {} textMsg
     */
    createTextMessage(op) {
      return Message.createTextMessage(op);
    },

    /**
     * 创建图片消息
     * @param op：{
     *     data:{
     *         name:文件名,
     *         type:文件类型,
     *         size:文件大小,
     *         smallUrl:图片缩略图，
     *         url：图片url,
     *         high:图片高度,
     *         wide:图片宽度
     *     }
     * toUser：接收方
     * toUserType：接收方类型
     * }
     */
    createImgMessage(op) {
      return Message.createImgMessage(op);
    },

    /**
     * 创建文件消息
     * @param op：{
     *     data:{
     *         name: 文件名,
     *         type: 文件类型,
     *         size: 文件大小,
     *         url：文件url,
     *     }
     * toUser：接收方
     * toUserType：接收方类型
     * }
     */
    createFileMessage(op) {
      return Message.createFileMessage(op);
    },

    /**
     * 创建视频消息
     * @param op：{
     *     data:{
     *         videoUrl: 视频url,
     *         type: 视频类型,
     *         time: 视频时长,
     *         size: 文件大小,
     *         snapshotUrl：视频封面图片路径,
     *     }
     * toUser：接收方
     * toUserType：接收方类型
     * }
     */
    createVideoMessage(op) {
      return Message.createVideoMessage(op);
    },

    /**
     * 创建语音消息
     * @param op：{
     *     data:{
     *         type: 语音文件类型,
     *         size: 语音文件大小,
     *         time:语音时长，
     *         url：图片url,
     *     }
     * toUser：接收方
     * toUserType：接收方类型
     * }
     */
    createVoiceMessage(op) {
      return Message.createVoiceMessage(op);
    },

    /**
     * 创建地理位置消息
     * @param op：{
     *     data:{
     *         longitude: 经度,
     *         latitude: 纬度,
     *         placeName: 地名,
     *         detailAddress:详细地址，
     *     }
     * toUser：接收方
     * toUserType：接收方类型
     * }
     */
    createPositionMessage(op) {
      return Message.createPositionMessage(op);
    },

    /**
     * 文件处理相关api
     */
    FileApi: {
      /**
       * 上传文件
       * @param
       *     file: 文件
       *     progress: 上传进度回调函数，直接赋值于：xhr.upload.onprogress
       *
       * @return Promise
       */
      uploadFile(file, progress) {
        return IMFile.doUploadFile(file, progress);
      },
    },
  });
})();
