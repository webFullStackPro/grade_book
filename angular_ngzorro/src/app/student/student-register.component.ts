import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {StudentService} from '../../service/student.service';
import {SharedModule} from '../shared.module';
import {StudentForm} from '../../types/req/StudentForm';
import {MajorSelectorComponent} from '../major/major-selector.component';
import areas from '../../const/area.json'
import {TITLE} from '../../const';
import {CaptchaComponent} from '../captcha/captcha.component';
import {Router} from '@angular/router';

@Component({
  selector: 'student-register',
  imports: [
    MajorSelectorComponent,
    SharedModule,
    CaptchaComponent
  ],
  templateUrl: './student-register.component.html',
  standalone: true,
  styleUrls: ['../../assets/register.less']
})
export class StudentRegisterComponent implements OnInit {
  studentToSave:StudentForm = {};
  studentForm!: FormGroup;
  verificationCode: string = '';
  saveLoading: boolean = false
  title: string = TITLE
  studentRegisterTitle: string = '学生注册'
  provinceCityAreaOptions = areas.provinces;

  @ViewChild(MajorSelectorComponent, { static: false }) majorSelectorComponent!: MajorSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      studentNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]],
      gender: [undefined, [Validators.required]],
      birthDate: ['', [Validators.required]],
      majorId: [0],
      majorName: ['', [Validators.required]],
      grade: [2000, [Validators.required]],
      contactPhone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      province: [''],
      city: [''],
      area: [''],
      provinceCityArea: [[]],
      address: [''],
      enrollmentDate: [''],
      graduationDate: [''],
      verificationCode: ['', [Validators.required]],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.studentForm.controls) {
        this.studentForm.controls[i].markAsDirty();
        this.studentForm.controls[i].updateValueAndValidity();
      }
      if (!this.studentForm.valid) {
        this.saveLoading = false
        return
      }
      const formValue = this.studentForm.value;
      if (formValue.verificationCode.toLowerCase() !== this.verificationCode.toLowerCase()) {
        this.message.error('验证码错误');
        this.onReset()
        this.saveLoading = false
        return
      }
      this.studentService.save(Object.assign(this.studentToSave, formValue)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          this.message.success("保存成功")
          this.router.navigate(['/login'], { queryParams: { type: 3 } })
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
    this.studentForm.reset()
  }

  onBack() {
    this.router.navigate(['/login'])
  }

  findMajor() {
    this.majorSelectorComponent.display()
  }

  handleMajorSelectedEvent(selectedMajor: { majorId?: number; majorName?: string; }) {
    if (selectedMajor && 'majorId' in selectedMajor) {
      this.studentForm.patchValue(selectedMajor);
    }
  }
  onVerificationCodeGenerated(verificationCode: string): void {
    this.verificationCode = verificationCode
  }
}
