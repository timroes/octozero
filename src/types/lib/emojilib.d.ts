declare module 'emojilib' {

  interface EmojiDescription {
    keywords: string[];
    char: string;
    fitzpatrick_scale: boolean;
    category: string;
  }

  const lib: { [emojiName: string]: EmojiDescription };
  const ordered: string[];
  const fitzpatrick_scale_modifiers: string[];

  export default {
    lib, ordered, fitzpatrick_scale_modifiers
  }
}