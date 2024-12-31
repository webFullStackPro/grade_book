import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {GradeService} from '../../service/grade.service';
import {SharedModule} from '../shared.module';
import {GradeForm} from '../../types/req/GradeForm';
import {MODAL_WIDTH} from '../../const'
import {CourseSelectorComponent} from '../course/course-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';

@Component({
  selector: 'grade-add',
  imports: [
    CourseSelectorComponent,
    StudentSelectorComponent,
    SharedModule
  ],
  templateUrl: './grade-add.component.html',
  standalone: true
})
export class GradeAddComponent implements OnInit {
  gradeToSave:GradeForm = {};
  gradeForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增成绩信息'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(CourseSelectorComponent, { static: false }) courseSelectorComponent!: CourseSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    this.gradeForm = this.fb.group({
      courseId: [0],
      courseName: ['', [Validators.required]],
      studentId: [0],
      studentNumber: ['', [Validators.required]],
      grade: [0],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.gradeForm.controls) {
        this.gradeForm.controls[i].markAsDirty();
        this.gradeForm.controls[i].updateValueAndValidity();
      }
      if (!this.gradeForm.valid) {
        this.saveLoading = false
        return
      }
      this.gradeService.save(Object.assign(this.gradeToSave, this.gradeForm.value)).subscribe({
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
    this.title = '新增成绩信息'.slice()
    this.gradeForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改成绩信息'
      this.saveLoading = true
      this.gradeService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.gradeToSave = resp.data
            this.gradeForm.patchValue(this.gradeToSave);
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
      this.gradeForm.patchValue(selectedCourse);
    }
  }

  findStudent() {
    this.studentSelectorComponent.display()
  }

  handleStudentSelectedEvent(selectedStudent: { studentId?: number; studentNumber?: string; }) {
    if (selectedStudent && 'studentId' in selectedStudent) {
      this.gradeForm.patchValue(selectedStudent);
    }
  }
}
