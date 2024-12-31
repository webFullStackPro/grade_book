import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {UniversityService} from '../../service/university.service';
import {UniversityQueryForm} from '../../types/req/UniversityQueryForm';
import {SharedModule} from '../shared.module';
import {University} from '../../types/resp/University';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';

@Component({
  selector: 'university-selector',
  imports: [
    SharedModule
  ],
  templateUrl: './university-selector.component.html',
  standalone: true
})
export class UniversitySelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: University[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '学校信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH


  @Output() universitySelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private universityService: UniversityService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: [''],
      location: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.universityService.find(new UniversityQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<University> | undefined = resp.data
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

  onRowDblClick(row: University, event: MouseEvent) {
    this.isVisible = false
    this.universitySelectedEvent.emit({
      universityId: row.id,
      universityName: row.name,
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
  }

}
