import pinyin from 'pinyin';

export const sortedPY = (array) => {
  return array.sort((a, b) => {
    const aPy = pinyin(a.nickname, { style: pinyin.STYLE_FIRST_LETTER }).join(
      '',
    );
    const bPy = pinyin(b.nickname, { style: pinyin.STYLE_FIRST_LETTER }).join(
      '',
    );
    return aPy.localeCompare(bPy);
  });
};

export const groupedPy = (sortedPYArr) => {
  const groups = sortedPYArr.reduce((groups, item) => {
    let letter = pinyin(item.nickname, {
      style: pinyin.STYLE_FIRST_LETTER,
    })[0][0].toUpperCase();

    letter = /^[A-Z]$/.test(letter) ? letter : 'special';

    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(item);

    return groups;
  }, {});
  const { special, ...other } = groups;
  if (special)
    return {
      ...other,
      special,
    };
  return {
    ...other,
  };
};
