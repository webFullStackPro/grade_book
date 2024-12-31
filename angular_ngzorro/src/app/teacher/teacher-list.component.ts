import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {TeacherService} from '../../service/teacher.service';
import {TeacherQueryForm} from '../../types/req/TeacherQueryForm';
import {SharedModule} from '../shared.module';
import {Teacher} from '../../types/resp/Teacher';
import {Page} from '../../types/page';
import {TeacherAddComponent} from './teacher-add.component';
import {TeacherViewComponent} from './teacher-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FacultySelectorComponent} from '../faculty/faculty-selector.component';
import {StudentQueryForm} from '../../types/req/StudentQueryForm';
import {getGenderText, getTitleText} from '../../util/dictTranslator';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'teacher-list',
  imports: [
    FacultySelectorComponent,
    TeacherAddComponent,
    TeacherViewComponent,
    SharedModule
  ],
  templateUrl: './teacher-list.component.html',
  standalone: true
})
export class TeacherListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Teacher[] = [];
  total: number = 0

  @ViewChild(FacultySelectorComponent, { static: false }) facultySelectorComponent!: FacultySelectorComponent;
  @ViewChild(TeacherAddComponent, { static: false }) teacherAddComponent!: TeacherAddComponent;
  @ViewChild(TeacherViewComponent, { static: false }) teacherViewComponent!: TeacherViewComponent;

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

  onAdd() {
    this.teacherAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['院系名称', '姓名', '职称', '性别', '联系电话', '邮箱', '教师简介']
      this.searchLoading = true
      this.teacherService.find(new TeacherQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.facultyName, d.name, getTitleText(d.title), getGenderText(d.gender), d.contactPhone, d.email, d.profile])
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
    this.teacherAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.teacherService.del(id).subscribe({
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

  detailRow(record: Teacher) {
    this.teacherViewComponent.display(record)
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
