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

export const formatAtTag = (content, atTagList = [], isPreview = false) => {
  let msgText = content;
  atTagList.forEach((d) => {
    msgText = msgText.replace(d, `#_&_#AT#_&_#`);
  });
  msgText = msgText
    .split('#_&_#')
    .filter((d) => d && d !== ' ')
    .map((d) => {
      if (d === 'AT') {
        const atTag = atTagList.splice(0, 1)[0];
        const { userId, nickname } = getAtUserInfo(atTag);
        if (isPreview) {
          d = `${nickname}`;
        } else {
          const userInfo = storeInstance.getters['IMStore/userInfo'];
          d = `<span class="at-tag ${
            userInfo.userId === userId || userId === 'IM_AT_ALL' ? 'at-me' : ''
          }" data-userid="${userId}" onclick="openAtUser(event)">${nickname}</span>`;
        }
      }
      return d;
    })
    .join('');
  return msgText;
};

export const openAtUser = (ctx, event) => {
  const userId = event.target.getAttribute('data-userid');
  const userInfo = storeInstance.getters['IMStore/userInfo'];
  if (!userId || userId === 'IM_AT_ALL' || userId === userInfo.userId) return;
  ctx.$emit(
    'checkAtUser',
    {
      fromUser: userId,
    },
    event,
  );
};
