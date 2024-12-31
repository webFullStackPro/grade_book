import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {MajorService} from '../../service/major.service';
import {MajorQueryForm} from '../../types/req/MajorQueryForm';
import {SharedModule} from '../shared.module';
import {Major} from '../../types/resp/Major';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {FacultySelectorComponent} from '../faculty/faculty-selector.component';

@Component({
  selector: 'major-selector',
  imports: [
    FacultySelectorComponent,
    SharedModule
  ],
  templateUrl: './major-selector.component.html',
  standalone: true
})
export class MajorSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Major[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '专业信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(FacultySelectorComponent, { static: false }) facultySelectorComponent!: FacultySelectorComponent;

  @Output() majorSelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private majorService: MajorService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      facultyId: [0],
      facultyName: [''],
      name: [''],
      degreeType: [undefined],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.majorService.find(new MajorQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Major> | undefined = resp.data
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

  onRowDblClick(row: Major, event: MouseEvent) {
    this.isVisible = false
    this.majorSelectedEvent.emit({
      majorId: row.id,
      majorName: row.name,
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
