import i18next from "i18next";
import I18NexFsBackend from "i18next-fs-backend";
import middleware from 'i18next-http-middleware'

i18next
  .use(I18NexFsBackend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
  });

