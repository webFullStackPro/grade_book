import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

const messages = {
  en: en,
  zh: zh,
};

export const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  messages,
});
