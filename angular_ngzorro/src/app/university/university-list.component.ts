import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {UniversityService} from '../../service/university.service';
import {UniversityQueryForm} from '../../types/req/UniversityQueryForm';
import {SharedModule} from '../shared.module';
import {University} from '../../types/resp/University';
import {Page} from '../../types/page';
import {UniversityAddComponent} from './university-add.component';
import {UniversityViewComponent} from './university-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'university-list',
  imports: [
    UniversityAddComponent,
    UniversityViewComponent,
    SharedModule
  ],
  templateUrl: './university-list.component.html',
  standalone: true
})
export class UniversityListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: University[] = [];
  total: number = 0

  @ViewChild(UniversityAddComponent, { static: false }) universityAddComponent!: UniversityAddComponent;
  @ViewChild(UniversityViewComponent, { static: false }) universityViewComponent!: UniversityViewComponent;

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

  onAdd() {
    this.universityAddComponent.display(0)
  }

  editRow(id: number) {
    this.universityAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.universityService.del(id).subscribe({
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

  detailRow(record: University) {
    this.universityViewComponent.display(record)
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
