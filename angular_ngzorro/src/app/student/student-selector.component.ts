import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {StudentService} from '../../service/student.service';
import {StudentQueryForm} from '../../types/req/StudentQueryForm';
import {SharedModule} from '../shared.module';
import {Student} from '../../types/resp/Student';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {MajorSelectorComponent} from '../major/major-selector.component';

@Component({
  selector: 'student-selector',
  imports: [
    MajorSelectorComponent,
    SharedModule
  ],
  templateUrl: './student-selector.component.html',
  standalone: true
})
export class StudentSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Student[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '学生信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(MajorSelectorComponent, { static: false }) majorSelectorComponent!: MajorSelectorComponent;

  @Output() studentSelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private studentService: StudentService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      studentNumber: [''],
      gender: [undefined],
      majorId: [0],
      majorName: [''],
      grade: [2000],
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
      this.studentService.find(new StudentQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Student> | undefined = resp.data
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

  onRowDblClick(row: Student, event: MouseEvent) {
    this.isVisible = false
    this.studentSelectedEvent.emit({
      studentId: row.id,
      studentNumber: row.studentNumber,
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
  }

  findMajor() {
    this.majorSelectorComponent.display()
  }

  handleMajorSelectedEvent(selectedMajor: { majorId?: number; majorName?: string; }) {
    if (selectedMajor && 'majorId' in selectedMajor) {
      this.searchForm.patchValue(selectedMajor);
    }
  }
}
