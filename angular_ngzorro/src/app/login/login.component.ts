import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {LoginForm} from '../../types/req/LoginForm';
import {SharedModule} from '../shared.module';
import {CaptchaComponent} from '../captcha/captcha.component';
import {LoginSession} from '../../types/resp/loginSession';
import {ADMIN_USERNAME, PASSWORD, STUDENT_USERNAME, TEACHER_USERNAME, TITLE} from '../../const';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    SharedModule,
    CaptchaComponent
  ],
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  verificationCode: string = '';
  title: string = TITLE
  type: number = 1

  @ViewChild(CaptchaComponent, { static: false }) captchaComponent!: CaptchaComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [ADMIN_USERNAME, [Validators.required]],
      password: [PASSWORD, [Validators.required]],
      verificationCode: ['', [Validators.required]],
      type: [1, [Validators.required]],
    });

    const typeControl = this.loginForm.get('type') as FormControl;
    typeControl.valueChanges.subscribe((newValue: number) => {
      this.changeInitData(newValue)
    });

    this.route.queryParams.subscribe(params => {
      this.changeInitData(+params['type'])
      this.loginForm.patchValue({
        type: this.type
      })
    });
  }

  private changeInitData(newType: number) {
    newType = newType || 1;
    this.type = newType
    let username = ADMIN_USERNAME
    if (newType === 2) {
      username = TEACHER_USERNAME
    }
    if (newType === 3) {
      username = STUDENT_USERNAME
    }
    this.loginForm.patchValue({
      username: username,
      password: PASSWORD,
      verificationCode: ''
    })
  }

  onVerificationCodeGenerated(verificationCode: string): void {
    this.verificationCode = verificationCode
  }

  initData(): void {
    this.loginForm.get('username')?.patchValue(ADMIN_USERNAME, { emitEvent: false })
    this.loginForm.get('password')?.patchValue(PASSWORD, { emitEvent: false })
    this.loginForm.get('type')?.patchValue(1, { emitEvent: false })
  }

  onReset(): void {
    this.captchaComponent.onRefresh()
    this.initData()
    this.loginForm.get('verificationCode')?.patchValue('', { emitEvent: false })
  }

  onSubmit(): void {
    this.loading = true
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
    if (!this.loginForm.valid) {
      this.loading = false
      return
    }
    const formValue = this.loginForm.value;
    if (formValue.verificationCode.toLowerCase() !== this.verificationCode.toLowerCase()) {
      this.message.error('验证码错误');
      this.onReset()
      this.loading = false
      return
    }
    this.authService.login(new LoginForm(formValue)).subscribe({
      next: (resp) => {
        if (!resp || resp.code !== 1) {
          this.message.error('用户名或密码不正确');
          this.onReset()
          return
        }
        const loginSession: LoginSession | undefined = resp.data
        if (loginSession) {
          sessionStorage.setItem('loginToken', loginSession.token)
          sessionStorage.setItem('type', String(loginSession.type))
          sessionStorage.setItem('uid', String(loginSession.uid))
          sessionStorage.setItem('username', loginSession.username)
        }
        this.router.navigate(['/']);
      },
      error: (error) => {
        // 处理错误
        console.error('Login failed:', error);
      },
      complete: () => {
        this.loading = false
      }
    });
  }

  onRegister() {
    if (this.type === 2) {
      this.router.navigate(['TeacherRegister'])
      return
    }
    if (this.type === 3) {
      this.router.navigate(['/StudentRegister'])
      return
    }
  }
}
