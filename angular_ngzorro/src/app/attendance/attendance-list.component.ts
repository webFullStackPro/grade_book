import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {AttendanceService} from '../../service/attendance.service';
import {AttendanceQueryForm} from '../../types/req/AttendanceQueryForm';
import {SharedModule} from '../shared.module';
import {Attendance} from '../../types/resp/Attendance';
import {Page} from '../../types/page';
import {AttendanceAddComponent} from './attendance-add.component';
import {AttendanceViewComponent} from './attendance-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {CourseSelectorComponent} from '../course/course-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';
import {getAttendanceStatusText} from '../../util/dictTranslator';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'attendance-list',
  imports: [
    CourseSelectorComponent,
    StudentSelectorComponent,
    AttendanceAddComponent,
    AttendanceViewComponent,
    SharedModule
  ],
  templateUrl: './attendance-list.component.html',
  standalone: true
})
export class AttendanceListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Attendance[] = [];
  total: number = 0

  @ViewChild(CourseSelectorComponent, { static: false }) courseSelectorComponent!: CourseSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;
  @ViewChild(AttendanceAddComponent, { static: false }) attendanceAddComponent!: AttendanceAddComponent;
  @ViewChild(AttendanceViewComponent, { static: false }) attendanceViewComponent!: AttendanceViewComponent;

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

  onAdd() {
    this.attendanceAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['课程名称', '学生学号', '考勤日期', '状态']
      this.searchLoading = true
      this.attendanceService.find(new AttendanceQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.courseName, d.studentNumber, d.attendanceDate, getAttendanceStatusText(d.status)])
          }
          exportToExcel(headers, exportData)
        },
        complete: () => {
          this.searchLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  editRow(id: number) {
    this.attendanceAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.attendanceService.del(id).subscribe({
          next: (resp) => {
            if (resp && resp.code === 1) {
              this.message.success('删除成功!')
              this.onSearch()
            } else {
              this.message.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
            }
          },
          complete: () => {
            this.searchLoading = false
          }
        })
      }
    });
  }

  detailRow(record: Attendance) {
    this.attendanceViewComponent.display(record)
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

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
