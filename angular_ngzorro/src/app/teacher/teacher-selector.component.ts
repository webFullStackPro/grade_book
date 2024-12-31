import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {TeacherService} from '../../service/teacher.service';
import {TeacherQueryForm} from '../../types/req/TeacherQueryForm';
import {SharedModule} from '../shared.module';
import {Teacher} from '../../types/resp/Teacher';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {FacultySelectorComponent} from '../faculty/faculty-selector.component';

@Component({
  selector: 'teacher-selector',
  imports: [
    FacultySelectorComponent,
    SharedModule
  ],
  templateUrl: './teacher-selector.component.html',
  standalone: true
})
export class TeacherSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Teacher[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '教师信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(FacultySelectorComponent, { static: false }) facultySelectorComponent!: FacultySelectorComponent;

  @Output() teacherSelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private teacherService: TeacherService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      facultyId: [0],
      facultyName: [''],
      name: [''],
      title: [undefined],
      gender: [undefined],
      contactPhone: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.teacherService.find(new TeacherQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Teacher> | undefined = resp.data
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

  onRowDblClick(row: Teacher, event: MouseEvent) {
    this.isVisible = false
    this.teacherSelectedEvent.emit({
      teacherId: row.id,
      teacherName: row.name,
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
}
