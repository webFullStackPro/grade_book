import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {GradeService} from '../../service/grade.service';
import {GradeQueryForm} from '../../types/req/GradeQueryForm';
import {SharedModule} from '../shared.module';
import {Grade} from '../../types/resp/Grade';
import {Page} from '../../types/page';
import {GradeAddComponent} from './grade-add.component';
import {GradeViewComponent} from './grade-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {CourseSelectorComponent} from '../course/course-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';
import {AttendanceQueryForm} from '../../types/req/AttendanceQueryForm';
import {getAttendanceStatusText} from '../../util/dictTranslator';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'grade-list',
  imports: [
    CourseSelectorComponent,
    StudentSelectorComponent,
    GradeAddComponent,
    GradeViewComponent,
    SharedModule
  ],
  templateUrl: './grade-list.component.html',
  standalone: true
})
export class GradeListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Grade[] = [];
  total: number = 0

  @ViewChild(CourseSelectorComponent, { static: false }) courseSelectorComponent!: CourseSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;
  @ViewChild(GradeAddComponent, { static: false }) gradeAddComponent!: GradeAddComponent;
  @ViewChild(GradeViewComponent, { static: false }) gradeViewComponent!: GradeViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private gradeService: GradeService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      courseId: [0],
      courseName: [''],
      studentId: [0],
      studentNumber: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.gradeService.find(new GradeQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Grade> | undefined = resp.data
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
    this.gradeAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['课程名称', '学生学号', '成绩']
      this.searchLoading = true
      this.gradeService.find(new GradeQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.courseName, d.studentNumber, d.grade])
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
    this.gradeAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.gradeService.del(id).subscribe({
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

  detailRow(record: Grade) {
    this.gradeViewComponent.display(record)
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
