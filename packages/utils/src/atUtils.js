import { storeInstance } from './store';
import { PLACEHOLDER_CONFIG } from './constant';

export const getAtTagList = (content) => {
  const reg = /<at userId="(\d+|IM_AT_ALL)">(@[\s\S]*?)<\/at>/g;
  const atArr = content.match(reg) || [];
  return atArr?.length ? atArr : [];
};

export const getAtUserInfo = (atTag) => {
  const userId = atTag.match(/"(\d+|IM_AT_ALL)"/)[0].replaceAll('"', '');
  const nickname = atTag.match(/@[\s\S]+/)[0].replace('</at>', '');
  return {
    userId,
    nickname,
  };
};

export const formatAtTag = (
  msg,
  atTagList = [],
  isPreview = false,
  isCard = false,
) => {
  let msgText = msg?.data?.content;
  atTagList.forEach((d) => {
    msgText = msgText.replace(
      d,
      `${PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR}${PLACEHOLDER_CONFIG.AT_SEPARATOR}${PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR}`,
    );
  });
  msgText = msgText
    .split(PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR)
    ?.map((d) => {
      if (d === PLACEHOLDER_CONFIG.AT_SEPARATOR) {
        const atTag = atTagList.splice(0, 1)[0];
        const { userId, nickname } = getAtUserInfo(atTag);
        if (isPreview) {
          d = `${nickname} `;
        } else {
          const userInfo = storeInstance.getters['IMStore/userInfo'];
          if (isCard) {
            d = `<span class="at-tag" data-userid="${userId}" onclick="openAtUser(event)">${nickname}</span>`;
          } else {
            const isAtMe = userInfo.userId === userId;
            const isAtAll = userId === 'IM_AT_ALL';
            const isSelf = msg?.fromUser === userInfo.userId;
            const receiptUserList = msg?.receiptUserList || [];
            const isRead = receiptUserList.some((r) => r === userId);
            d = `<span class="at-tag ${
              isAtMe || isAtAll ? 'at-me' : ''
            }" data-userid="${userId}" onclick="openAtUser(event)">${nickname}${
              isSelf && !isAtMe && !isAtAll
                ? `<sup class="at-tag-sup ${
                    isRead && !isCard ? 'read' : ''
                  }"></sup>`
                : ''
            }</span>`;
          }
        }
      }
      return d;
    })
    .join('');
  return msgText;
};

export const formatCardAtTag = (msg, atTagList) => {
  return formatAtTag(msg, atTagList, false, true);
};

export const openAtUser = (ctx, event) => {
  const userId = event.target.getAttribute('data-userid');
  if (!userId || userId === 'IM_AT_ALL') return;
  ctx.$emit(
    'checkAtUser',
    {
      userId: userId,
    },
    event,
  );
};
