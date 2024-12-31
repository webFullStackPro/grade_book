import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {AttendanceService} from '../../service/attendance.service';
import {SharedModule} from '../shared.module';
import {AttendanceForm} from '../../types/req/AttendanceForm';
import {MODAL_WIDTH} from '../../const'
import {CourseSelectorComponent} from '../course/course-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';

@Component({
  selector: 'attendance-add',
  imports: [
    CourseSelectorComponent,
    StudentSelectorComponent,
    SharedModule
  ],
  templateUrl: './attendance-add.component.html',
  standalone: true
})
export class AttendanceAddComponent implements OnInit {
  attendanceToSave:AttendanceForm = {};
  attendanceForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增考勤信息'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(CourseSelectorComponent, { static: false }) courseSelectorComponent!: CourseSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.attendanceForm = this.fb.group({
      courseId: [0],
      courseName: ['', [Validators.required]],
      studentId: [0],
      studentNumber: ['', [Validators.required]],
      attendanceDate: ['', [Validators.required]],
      status: [undefined, [Validators.required]],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.attendanceForm.controls) {
        this.attendanceForm.controls[i].markAsDirty();
        this.attendanceForm.controls[i].updateValueAndValidity();
      }
      if (!this.attendanceForm.valid) {
        this.saveLoading = false
        return
      }
      this.attendanceService.save(Object.assign(this.attendanceToSave, this.attendanceForm.value)).subscribe({
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
    this.title = '新增考勤信息'.slice()
    this.attendanceForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改考勤信息'
      this.saveLoading = true
      this.attendanceService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.attendanceToSave = resp.data
            this.attendanceForm.patchValue(this.attendanceToSave);
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

  findCourse() {
    this.courseSelectorComponent.display()
  }

  handleCourseSelectedEvent(selectedCourse: { courseId?: number; courseName?: string; }) {
    if (selectedCourse && 'courseId' in selectedCourse) {
      this.attendanceForm.patchValue(selectedCourse);
    }
  }

  findStudent() {
    this.studentSelectorComponent.display()
  }

  handleStudentSelectedEvent(selectedStudent: { studentId?: number; studentNumber?: string; }) {
    if (selectedStudent && 'studentId' in selectedStudent) {
      this.attendanceForm.patchValue(selectedStudent);
    }
  }
}
