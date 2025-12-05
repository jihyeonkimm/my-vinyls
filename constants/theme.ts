import { Platform } from 'react-native';

const tintColorLight = '#f3571a';
const tintColorDark = '#ff7e45';

export const Colors = {
  light: {
    text: '#212121',
    background: '#fff',
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#666666',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#E0E0E0',
    background: '#151718',
    tint: tintColorDark,
    icon: '#A0A0A0',
    tabIconDefault: '#A0A0A0',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
