import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SharedModule} from '../../shared.module';
import {AuthService} from '../../../service/auth.service';
import {TITLE} from '../../../const';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {UpdatePassForm} from '../../../types/req/UpdatePassForm';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-header',
  imports: [
    SharedModule
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrls: [
    './header.component.less',
  ]
})
export class HeaderComponent implements OnInit {
  title: string = TITLE
  username = sessionStorage.getItem('username')
  updatePassForm!: FormGroup;
  isVisible: boolean = false
  loading: boolean = false

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private authService: AuthService,
    private router: Router,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.updatePassForm = this.fb.group({
      oldPass: ['', [Validators.required]],
      newPass: ['', [Validators.required]],
      newPass2: ['', [Validators.required]]
    })
  }

  handleUpdatePass() {
    this.isVisible = true
  }

  handleOk() {
    this.loading = true
    for (const i in this.updatePassForm.controls) {
      this.updatePassForm.controls[i].markAsDirty();
      this.updatePassForm.controls[i].updateValueAndValidity();
    }
    if (!this.updatePassForm.valid) {
      this.loading = false
      return
    }
    const formValue = this.updatePassForm.value;
    if (formValue.newPass !== formValue.newPass2) {
      this.message.error('两次密码输入不一致');
      this.loading = false
      return
    }
    this.authService.updatePass(new UpdatePassForm(formValue)).subscribe({
      next: (resp) => {
        if (!resp || resp.code !== 1) {
          this.message.error(resp && resp.msg ? resp.msg : '操作异常')
          return
        }
        this.message.success('操作成功');
      },
      error: (error) => {
        // 处理错误
        console.error('Login failed:', error);
      },
      complete: () => {
        this.loading = false
        this.handleCancel()
      }
    });
  }

  handleCancel() {
    this.isVisible = false
    this.resetForm();
  }

  private resetForm(): void {
    if (this.updatePassForm) {
      this.updatePassForm.reset();
    }
  }

  handleLogout() {
    this.modal.confirm({
      nzTitle: '<i>退出提示</i>',
      nzContent: '<b>确定要退出吗?</b>',
      nzOnOk: () => {
        this.authService.logout();
        sessionStorage.removeItem('loginToken')
        sessionStorage.removeItem('uid')
        sessionStorage.removeItem('username')
        this.router.navigate(['/login']);
      }
    });
  }

}
