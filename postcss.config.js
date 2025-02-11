import autoprefixer from 'autoprefixer';
import postcssCalc from 'postcss-calc';
import postcssPresetEnv from 'postcss-preset-env';
import reporter from 'postcss-reporter';
import stylelint from 'stylelint';

export default {
  plugins: [
    autoprefixer(),
    postcssCalc(),
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
