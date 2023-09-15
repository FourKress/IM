import { renderProcess } from '@lanshu/render-process';
import { PLACEHOLDER_CONFIG } from './constant';

export const getLinkTagList = (content) => {
  const reg = /http(s)?:\/\/\S+(?<=[a-zA-Z])/g;
  const matchArr = content.match(reg) || [];
  let linkArr = [];
  matchArr.forEach((d) => {
    linkArr.push(...d.split(/&nbsp;|<br>|\n/).filter((c) => reg.test(c)));
  });
  return linkArr?.length ? linkArr : [];
};

export const formatLinkTag = (msg, linkTagList = []) => {
  let msgText = msg?.data?.content;
  linkTagList.forEach((d) => {
    msgText = msgText.replace(
      d,
      `${PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR}${PLACEHOLDER_CONFIG.LINK_SEPARATOR}${PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR}`,
    );
  });
  msgText = msgText
    .split(PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR)
    .filter((d) => d && d !== ' ')
    .map((d) => {
      if (d === PLACEHOLDER_CONFIG.LINK_SEPARATOR) {
        const url = linkTagList.splice(0, 1)[0];
        d = `<span class="link-jump" data-url="${url}" onclick="openTargetUrl(event)">${url}</span>`;
      }
      return d;
    })
    .join('');
  return msgText;
};

export const openTargetUrl = (ctx, event) => {
  const url = event.target.getAttribute('data-url');
  if (!url) return;
  renderProcess.openUrl(url);
};
