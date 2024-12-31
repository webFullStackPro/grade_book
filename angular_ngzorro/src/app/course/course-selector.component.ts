import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CourseService} from '../../service/course.service';
import {CourseQueryForm} from '../../types/req/CourseQueryForm';
import {SharedModule} from '../shared.module';
import {Course} from '../../types/resp/Course';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {FacultySelectorComponent} from '../faculty/faculty-selector.component';
import {TeacherSelectorComponent} from '../teacher/teacher-selector.component';

@Component({
  selector: 'course-selector',
  imports: [
    FacultySelectorComponent,
    TeacherSelectorComponent,
    SharedModule
  ],
  templateUrl: './course-selector.component.html',
  standalone: true
})
export class CourseSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Course[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '课程信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(FacultySelectorComponent, { static: false }) facultySelectorComponent!: FacultySelectorComponent;
  @ViewChild(TeacherSelectorComponent, { static: false }) teacherSelectorComponent!: TeacherSelectorComponent;

  @Output() courseSelectedEvent = new EventEmitter<{}>();

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

  onRowDblClick(row: Course, event: MouseEvent) {
    this.isVisible = false
    this.courseSelectedEvent.emit({
      courseId: row.id,
      courseName: row.name,
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
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
}
