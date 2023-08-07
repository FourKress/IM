import { storeInstance } from './store';

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

export const formatAtTag = (msg, atTagList = [], isPreview = false) => {
  let msgText = msg?.data?.content;
  atTagList.forEach((d) => {
    msgText = msgText.replace(d, `#_&_#AT#_&_#`);
  });
  msgText = msgText
    .split('#_&_#')
    ?.map((d) => {
      if (d === 'AT') {
        const atTag = atTagList.splice(0, 1)[0];
        const { userId, nickname } = getAtUserInfo(atTag);
        if (isPreview) {
          d = `${nickname} `;
        } else {
          const userInfo = storeInstance.getters['IMStore/userInfo'];
          const isAtMe = userInfo.userId === userId;
          const isAtAll = userId === 'IM_AT_ALL';
          const isSelf = msg?.fromUser === userInfo.userId;
          const receiptUserList = msg.receiptUserList;
          const isRead = receiptUserList.some((r) => r === userId);
          d = `<span class="at-tag ${
            isAtMe || isAtAll ? 'at-me' : ''
          }" data-userid="${userId}" onclick="openAtUser(event)">${nickname}${
            isSelf && !isAtMe && !isAtAll
              ? `<sup class="at-tag-sup ${isRead ? 'read' : ''}"></sup>`
              : ''
          }</span>`;
        }
      }
      return d;
    })
    .join('');
  return msgText;
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
