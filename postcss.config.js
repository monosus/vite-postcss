import autoprefixer from 'autoprefixer';
import postcssCalc from 'postcss-calc';
import postcssCustomMedia from 'postcss-custom-media';
import postcssGlobalData from '@csstools/postcss-global-data';
import postcssPresetEnv from 'postcss-preset-env';
import postcssPxToRem from 'postcss-pxtorem';
import reporter from 'postcss-reporter';
import stylelint from 'stylelint';

export default {
  plugins: [
    postcssGlobalData({
      files: ['./src/styles/_mixin/media.css'],
    }),
    autoprefixer(),
    postcssCalc(),
    postcssCustomMedia(),
    postcssPxToRem(),
    postcssPresetEnv({
      stage: 4,
    }),
    stylelint({
      configFile: './lint-tools/.stylelintrc.json',
    }),
    reporter({
      clearReportedMessages: true,
    }),
  ],
};
