import webFont from 'webfontloader';

export default function webFontLoader() {
  webFont.load({
    google: {
      families: ['Noto+Sans+JP:400,700'],
    },
    timeout: 3000,
    events: false,
  });
}
