import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideNzIcons} from 'ng-zorro-antd/icon';
import {provideNzI18n, zh_CN} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {FormsModule} from '@angular/forms';
import {provideHttpClient} from '@angular/common/http';
import {IconDefinition} from '@ant-design/icons-angular';

import {
  AuditOutline,
  BankOutline,
  BellOutline,
  BookOutline,
  CustomerServiceOutline,
  HomeOutline,
  PieChartOutline,
  SolutionOutline,
  TableOutline,
  TeamOutline,
  UserOutline
} from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [ HomeOutline, UserOutline, BankOutline, CustomerServiceOutline, TableOutline,
  TeamOutline, SolutionOutline, AuditOutline, BookOutline, BellOutline, PieChartOutline ];

registerLocaleData(zh);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNzIcons(icons),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzIcons(icons)
  ]
};
