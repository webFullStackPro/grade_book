import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {TeacherService} from '../../service/teacher.service';
import {SharedModule} from '../shared.module';
import {TeacherForm} from '../../types/req/TeacherForm';
import {MODAL_WIDTH} from '../../const'
import {FacultySelectorComponent} from '../faculty/faculty-selector.component';

@Component({
  selector: 'teacher-personal-info',
  imports: [
    FacultySelectorComponent,
    SharedModule
  ],
  templateUrl: './teacher-personal-info.component.html',
  standalone: true
})
export class TeacherPersonalInfoComponent implements OnInit {
  teacherToSave:TeacherForm = {};
  teacherForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增教师信息'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(FacultySelectorComponent, { static: false }) facultySelectorComponent!: FacultySelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.teacherForm = this.fb.group({
      facultyId: [0],
      facultyName: ['', [Validators.required]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      title: [undefined, [Validators.required]],
      gender: [undefined, [Validators.required]],
      contactPhone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      profile: [''],
    })

    this.display(1)
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
      this.teacherService.save(Object.assign(this.teacherToSave, this.teacherForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          this.message.success("保存成功")
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
    this.title = '新增教师信息'.slice()
    this.teacherForm.reset()
  }

  display(id: number) {
    this.saveLoading = true
    this.teacherService.findById(id).subscribe({
      next: (resp) => {
        if (resp && resp.code === 1 && resp.data) {
          this.teacherToSave = resp.data
          this.teacherForm.patchValue(this.teacherToSave);
        }
      },
      complete: () => {
        this.saveLoading = false
      }
    })
  }

  findFaculty() {
    this.facultySelectorComponent.display()
  }

  handleFacultySelectedEvent(selectedFaculty: { facultyId?: number; facultyName?: string; }) {
    if (selectedFaculty && 'facultyId' in selectedFaculty) {
      this.teacherForm.patchValue(selectedFaculty);
    }
  }
}
