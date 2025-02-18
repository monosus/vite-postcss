import autoprefixer from 'autoprefixer';
import postcssCalc from 'postcss-calc';
import postcssPresetEnv from 'postcss-preset-env';
import reporter from 'postcss-reporter';
import stylelint from 'stylelint';
import postcssCustomMedia from 'postcss-custom-media';
import postcssPxtorem from 'postcss-pxtorem';

export default {
  plugins: [
    autoprefixer(),
    postcssCalc(),
    postcssPxtorem(),
    postcssCustomMedia(),
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
