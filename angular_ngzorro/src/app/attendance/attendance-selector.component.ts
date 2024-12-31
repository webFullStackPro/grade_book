import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {AttendanceService} from '../../service/attendance.service';
import {AttendanceQueryForm} from '../../types/req/AttendanceQueryForm';
import {SharedModule} from '../shared.module';
import {Attendance} from '../../types/resp/Attendance';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {CourseSelectorComponent} from '../course/course-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';

@Component({
  selector: 'attendance-selector',
  imports: [
    CourseSelectorComponent,
    StudentSelectorComponent,
    SharedModule
  ],
  templateUrl: './attendance-selector.component.html',
  standalone: true
})
export class AttendanceSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Attendance[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '考勤信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(CourseSelectorComponent, { static: false }) courseSelectorComponent!: CourseSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;

  @Output() attendanceSelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private attendanceService: AttendanceService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      courseId: [0],
      courseName: [''],
      studentId: [0],
      studentNumber: [''],
      status: [undefined],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.attendanceService.find(new AttendanceQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Attendance> | undefined = resp.data
          if (page && page.list.length > 0) {
            this.listOfData = page.list
            this.total = page.total
          }
        },
        complete: () => {
          this.searchLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  onRowDblClick(row: Attendance, event: MouseEvent) {
    this.isVisible = false
    this.attendanceSelectedEvent.emit({
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
  }

  findCourse() {
    this.courseSelectorComponent.display()
  }

  handleCourseSelectedEvent(selectedCourse: { courseId?: number; courseName?: string; }) {
    if (selectedCourse && 'courseId' in selectedCourse) {
      this.searchForm.patchValue(selectedCourse);
    }
  }
  findStudent() {
    this.studentSelectorComponent.display()
  }

  handleStudentSelectedEvent(selectedStudent: { studentId?: number; studentNumber?: string; }) {
    if (selectedStudent && 'studentId' in selectedStudent) {
      this.searchForm.patchValue(selectedStudent);
    }
  }
}
