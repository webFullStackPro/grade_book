import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {AdminService} from '../../service/admin.service';
import {AdminQueryForm} from '../../types/req/AdminQueryForm';
import {SharedModule} from '../shared.module';
import {Admin} from '../../types/resp/Admin';
import {Page} from '../../types/page';
import {AdminAddComponent} from './admin-add.component';
import {AdminViewComponent} from './admin-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'admin-list',
  imports: [
    AdminAddComponent,
    AdminViewComponent,
    SharedModule
  ],
  templateUrl: './admin-list.component.html',
  standalone: true
})
export class AdminListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Admin[] = [];
  total: number = 0

  @ViewChild(AdminAddComponent, { static: false }) adminAddComponent!: AdminAddComponent;
  @ViewChild(AdminViewComponent, { static: false }) adminViewComponent!: AdminViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private adminService: AdminService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      username: [''],
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
      this.adminService.find(new AdminQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Admin> | undefined = resp.data
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
    this.adminAddComponent.display(0)
  }

  editRow(id: number) {
    this.adminAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.adminService.del(id).subscribe({
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

  detailRow(record: Admin) {
    this.adminViewComponent.display(record)
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
