import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CourseService} from '../../service/course.service';
import {CourseQueryForm} from '../../types/req/CourseQueryForm';
import {SharedModule} from '../shared.module';
import {Course} from '../../types/resp/Course';
import {Page} from '../../types/page';
import {CourseAddComponent} from './course-add.component';
import {CourseViewComponent} from './course-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FacultySelectorComponent} from '../faculty/faculty-selector.component';
import {TeacherSelectorComponent} from '../teacher/teacher-selector.component';
import {AttendanceQueryForm} from '../../types/req/AttendanceQueryForm';
import {getAttendanceStatusText} from '../../util/dictTranslator';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'course-list',
  imports: [
    FacultySelectorComponent,
    TeacherSelectorComponent,
    CourseAddComponent,
    CourseViewComponent,
    SharedModule
  ],
  templateUrl: './course-list.component.html',
  standalone: true
})
export class CourseListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Course[] = [];
  total: number = 0

  @ViewChild(FacultySelectorComponent, { static: false }) facultySelectorComponent!: FacultySelectorComponent;
  @ViewChild(TeacherSelectorComponent, { static: false }) teacherSelectorComponent!: TeacherSelectorComponent;
  @ViewChild(CourseAddComponent, { static: false }) courseAddComponent!: CourseAddComponent;
  @ViewChild(CourseViewComponent, { static: false }) courseViewComponent!: CourseViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private courseService: CourseService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      facultyId: [0],
      facultyName: [''],
      teacherId: [0],
      teacherName: [''],
      name: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.courseService.find(new CourseQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Course> | undefined = resp.data
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
    this.courseAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['院系名称', '教师姓名', '课程代码', '课程名称', '学分', '课程描述']
      this.searchLoading = true
      this.courseService.find(new CourseQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.facultyName, d.teacherName, d.code, d.name, d.credit, d.courseDescription])
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
    this.courseAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.courseService.del(id).subscribe({
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

  detailRow(record: Course) {
    this.courseViewComponent.display(record)
  }

  findFaculty() {
    this.facultySelectorComponent.display()
  }

  handleFacultySelectedEvent(selectedFaculty: { facultyId?: number; facultyName?: string; }) {
    if (selectedFaculty && 'facultyId' in selectedFaculty) {
      this.searchForm.patchValue(selectedFaculty);
    }
  }

  findTeacher() {
    this.teacherSelectorComponent.display()
  }

  handleTeacherSelectedEvent(selectedTeacher: { teacherId?: number; teacherName?: string; }) {
    if (selectedTeacher && 'teacherId' in selectedTeacher) {
      this.searchForm.patchValue(selectedTeacher);
    }
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
