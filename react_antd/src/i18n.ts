import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhTranslation from '@/locales/zh.json'

// 初始化 i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: {
        translation: zhTranslation
      }
    },
    supportedLngs: ['zh'],
    fallbackLng: 'zh',
    detection: {
      order: ['navigator'], // 使用浏览器语言作为默认语言
    },
    interpolation: {
      escapeValue: false, // React 默认已转义，不需要再次转义
    }
  });

export default i18n;