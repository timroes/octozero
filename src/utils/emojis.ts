import emojis from 'emojilib';

const EMOJI_NAME_REGEX = /([\s^]):(\w+):([$\s])/g;

export function replaceEmojis(input: string) {
  return input.replace(EMOJI_NAME_REGEX, (match, prefix, emojiName, suffix) => {
    if (emojis.lib[emojiName]) {
      return `${prefix}${emojis.lib[emojiName].char}${suffix}`;
    }
    return match;
  });
}
