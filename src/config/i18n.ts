import { I18n } from 'i18n';
import path from 'path';

const i18n = new I18n();
i18n.configure({
  locales: ['fa'],
  defaultLocale: 'fa',
  directory: path.join(__dirname, '/../locales'),
});

export { i18n };
