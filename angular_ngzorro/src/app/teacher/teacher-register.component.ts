import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SharedModule} from '../shared.module';
import areas from '../../const/area.json'
import {CaptchaComponent} from '../captcha/captcha.component';
import {TITLE} from '../../const';
import {TeacherForm} from '../../types/req/TeacherForm';
import {TeacherService} from '../../service/teacher.service';
import {Router} from '@angular/router';
import {FacultySelectorComponent} from '../faculty/faculty-selector.component';

@Component({
  selector: 'teacher-register',
  imports: [
    SharedModule,
    CaptchaComponent,
    FacultySelectorComponent
  ],
  templateUrl: './teacher-register.component.html',
  standalone: true,
  styleUrls: ['../../assets/register.less']
})
export class TeacherRegisterComponent implements OnInit {
  teacherToSave:TeacherForm = {};
  teacherForm!: FormGroup;
  verificationCode: string = '';
  saveLoading: boolean = false
  title: string = TITLE
  teacherRegisterTitle: string = '教师注册'
  provinceCityAreaOptions = areas.provinces;

  @ViewChild(FacultySelectorComponent, { static: false }) facultySelectorComponent!: FacultySelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private teacherService: TeacherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.teacherForm = this.fb.group({
      facultyId: [0],
      facultyName: ['', [Validators.required]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]],
      title: [undefined, [Validators.required]],
      gender: [undefined, [Validators.required]],
      contactPhone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      profile: [''],
      verificationCode: ['', [Validators.required]],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.teacherForm.controls) {
        this.teacherForm.controls[i].markAsDirty();
        this.teacherForm.controls[i].updateValueAndValidity();
      }
      if (!this.teacherForm.valid) {
        this.saveLoading = false
        return
      }
      const formValue = this.teacherForm.value;
      if (formValue.verificationCode.toLowerCase() !== this.verificationCode.toLowerCase()) {
        this.message.error('验证码错误');
        this.onReset()
        this.saveLoading = false
        return
      }
      this.teacherService.save(Object.assign(this.teacherToSave, formValue)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          this.message.success("保存成功")
          this.router.navigate(['/login'], { queryParams: { type: 2 } })
        },
        complete: () => {
          this.saveLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  onReset() {
    this.teacherForm.reset()
  }

  onBack() {
    this.router.navigate(['/login'])
  }

  findFaculty() {
    this.facultySelectorComponent.display()
  }

  handleFacultySelectedEvent(selectedFaculty: { facultyId?: number; facultyName?: string; }) {
    if (selectedFaculty && 'facultyId' in selectedFaculty) {
      this.teacherForm.patchValue(selectedFaculty);
    }
  }

  onVerificationCodeGenerated(verificationCode: string): void {
    this.verificationCode = verificationCode
  }
}
