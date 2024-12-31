import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzIconDirective, NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputDirective, NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzModalModule} from 'ng-zorro-antd/modal';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzCascaderModule} from 'ng-zorro-antd/cascader';
import {NzRadioModule} from 'ng-zorro-antd/radio';

// 导入其他需要共享的模块或服务...

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzBreadCrumbModule,
    NzCascaderModule,
    NzDatePickerModule,
    NzDropDownModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzLayoutModule,
    NzMenuModule,
    NzModalModule,
    NzFormModule,
    NzInputDirective,
    NzButtonModule,
    NzIconDirective,
    NzRadioModule,
    NzSelectModule,
    NzTableModule,
    RouterLink
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzBreadCrumbModule,
    NzCascaderModule,
    NzDatePickerModule,
    NzDropDownModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzLayoutModule,
    NzMenuModule,
    NzModalModule,
    NzFormModule,
    NzInputDirective,
    NzButtonModule,
    NzIconDirective,
    NzRadioModule,
    NzSelectModule,
    NzTableModule,
    RouterLink
  ]
})
export class SharedModule {}
