import { configure, defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

export default defineNuxtPlugin(() => {
  defineRule('required', required);
  defineRule('userName', (val) => {
    const regex = /^[a-zA-Z0-9_]{3,15}$/;
    return (
      regex.test(val) ||
      '使用者名稱只能包含字母、數字與底線，且長度須為 3 至 15 字元'
    );
  });
  defineRule('userPassword', (val) => {
    // 至少 8 個字元，且包含至少一個字母與一個數字
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(val) || '密碼需至少 8 碼以上，且必須包含英文字母與數字';
  });

  defineRule('confirmedPassword', (value, [target], ctx) => {
    // target => 取出目標 name
    // ctx form 自帶的上下文對象，存有相鄰的表單
    if (value === ctx.form[target]) {
      return true;
    }
    return '密碼並不匹配';
  });

  defineRule('userPhone', (val) => {
    const regex = /^(09)[0-9]{8}$/;
    return regex.test(val) || '手機號碼格式錯誤';
  });

  // 設定多國語系與驗證訊息
  configure({
    // 載入繁體中文的設定檔，產生繁體中文的驗證訊息
    generateMessage: localize({ zh_TW: zhTW }),
    validateOnInput: true, // 輸入文字時立即進行驗證
  });

  // 設定預設語言為繁體中文
  setLocale('zh_TW');
});
