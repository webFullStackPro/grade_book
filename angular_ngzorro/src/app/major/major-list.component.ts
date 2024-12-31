import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {MajorService} from '../../service/major.service';
import {MajorQueryForm} from '../../types/req/MajorQueryForm';
import {SharedModule} from '../shared.module';
import {Major} from '../../types/resp/Major';
import {Page} from '../../types/page';
import {MajorAddComponent} from './major-add.component';
import {MajorViewComponent} from './major-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FacultySelectorComponent} from '../faculty/faculty-selector.component';

@Component({
  selector: 'major-list',
  imports: [
    FacultySelectorComponent,
    MajorAddComponent,
    MajorViewComponent,
    SharedModule
  ],
  templateUrl: './major-list.component.html',
  standalone: true
})
export class MajorListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Major[] = [];
  total: number = 0

  @ViewChild(FacultySelectorComponent, { static: false }) facultySelectorComponent!: FacultySelectorComponent;
  @ViewChild(MajorAddComponent, { static: false }) majorAddComponent!: MajorAddComponent;
  @ViewChild(MajorViewComponent, { static: false }) majorViewComponent!: MajorViewComponent;

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

  onAdd() {
    this.majorAddComponent.display(0)
  }

  editRow(id: number) {
    this.majorAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.majorService.del(id).subscribe({
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

  detailRow(record: Major) {
    this.majorViewComponent.display(record)
  }

  findFaculty() {
    this.facultySelectorComponent.display()
  }

  handleFacultySelectedEvent(selectedFaculty: { facultyId?: number; facultyName?: string; }) {
    if (selectedFaculty && 'facultyId' in selectedFaculty) {
      this.searchForm.patchValue(selectedFaculty);
    }
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
