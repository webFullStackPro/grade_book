import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FacultyService} from '../../service/faculty.service';
import {FacultyQueryForm} from '../../types/req/FacultyQueryForm';
import {SharedModule} from '../shared.module';
import {Faculty} from '../../types/resp/Faculty';
import {Page} from '../../types/page';
import {FacultyAddComponent} from './faculty-add.component';
import {FacultyViewComponent} from './faculty-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {UniversitySelectorComponent} from '../university/university-selector.component';

@Component({
  selector: 'faculty-list',
  imports: [
    UniversitySelectorComponent,
    FacultyAddComponent,
    FacultyViewComponent,
    SharedModule
  ],
  templateUrl: './faculty-list.component.html',
  standalone: true
})
export class FacultyListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Faculty[] = [];
  total: number = 0

  @ViewChild(UniversitySelectorComponent, { static: false }) universitySelectorComponent!: UniversitySelectorComponent;
  @ViewChild(FacultyAddComponent, { static: false }) facultyAddComponent!: FacultyAddComponent;
  @ViewChild(FacultyViewComponent, { static: false }) facultyViewComponent!: FacultyViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private facultyService: FacultyService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      universityId: [0],
      universityName: [''],
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
      this.facultyService.find(new FacultyQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Faculty> | undefined = resp.data
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
    this.facultyAddComponent.display(0)
  }

  editRow(id: number) {
    this.facultyAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.facultyService.del(id).subscribe({
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

  detailRow(record: Faculty) {
    this.facultyViewComponent.display(record)
  }

  findUniversity() {
    this.universitySelectorComponent.display()
  }

  handleUniversitySelectedEvent(selectedUniversity: { universityId?: number; universityName?: string; }) {
    if (selectedUniversity && 'universityId' in selectedUniversity) {
      this.searchForm.patchValue(selectedUniversity);
    }
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
