import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CourseService} from '../../service/course.service';
import {SharedModule} from '../shared.module';
import {CourseForm} from '../../types/req/CourseForm';
import {MODAL_WIDTH} from '../../const'
import {FacultySelectorComponent} from '../faculty/faculty-selector.component';
import {TeacherSelectorComponent} from '../teacher/teacher-selector.component';

@Component({
  selector: 'course-add',
  imports: [
    FacultySelectorComponent,
    TeacherSelectorComponent,
    SharedModule
  ],
  templateUrl: './course-add.component.html',
  standalone: true
})
export class CourseAddComponent implements OnInit {
  courseToSave:CourseForm = {};
  courseForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增课程信息'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(FacultySelectorComponent, { static: false }) facultySelectorComponent!: FacultySelectorComponent;
  @ViewChild(TeacherSelectorComponent, { static: false }) teacherSelectorComponent!: TeacherSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      facultyId: [0],
      facultyName: ['', [Validators.required]],
      teacherId: [0],
      teacherName: ['', [Validators.required]],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      credit: [0, [Validators.required]],
      courseDescription: [''],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.courseForm.controls) {
        this.courseForm.controls[i].markAsDirty();
        this.courseForm.controls[i].updateValueAndValidity();
      }
      if (!this.courseForm.valid) {
        this.saveLoading = false
        return
      }
      this.courseService.save(Object.assign(this.courseToSave, this.courseForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          this.message.success("保存成功")
          this.onBack(true)
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
    this.title = '新增课程信息'.slice()
    this.courseForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改课程信息'
      this.saveLoading = true
      this.courseService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.courseToSave = resp.data
            this.courseForm.patchValue(this.courseToSave);
          }
        },
        complete: () => {
          this.saveLoading = false
        }
      })
    } else {
      this.onReset()
    }
  }

  findFaculty() {
    this.facultySelectorComponent.display()
  }

  handleFacultySelectedEvent(selectedFaculty: { facultyId?: number; facultyName?: string; }) {
    if (selectedFaculty && 'facultyId' in selectedFaculty) {
      this.courseForm.patchValue(selectedFaculty);
    }
  }

  findTeacher() {
    this.teacherSelectorComponent.display()
  }

  handleTeacherSelectedEvent(selectedTeacher: { teacherId?: number; teacherName?: string; }) {
    if (selectedTeacher && 'teacherId' in selectedTeacher) {
      this.courseForm.patchValue(selectedTeacher);
    }
  }
}
