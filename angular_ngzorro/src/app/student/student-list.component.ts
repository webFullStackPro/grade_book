import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {StudentService} from '../../service/student.service';
import {StudentQueryForm} from '../../types/req/StudentQueryForm';
import {SharedModule} from '../shared.module';
import {Student} from '../../types/resp/Student';
import {Page} from '../../types/page';
import {StudentAddComponent} from './student-add.component';
import {StudentViewComponent} from './student-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MajorSelectorComponent} from '../major/major-selector.component';
import {GradeQueryForm} from '../../types/req/GradeQueryForm';
import {exportToExcel} from '../../util/exportUtil';
import {getGenderText} from '../../util/dictTranslator';

@Component({
  selector: 'student-list',
  imports: [
    MajorSelectorComponent,
    StudentAddComponent,
    StudentViewComponent,
    SharedModule
  ],
  templateUrl: './student-list.component.html',
  standalone: true
})
export class StudentListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Student[] = [];
  total: number = 0

  @ViewChild(MajorSelectorComponent, { static: false }) majorSelectorComponent!: MajorSelectorComponent;
  @ViewChild(StudentAddComponent, { static: false }) studentAddComponent!: StudentAddComponent;
  @ViewChild(StudentViewComponent, { static: false }) studentViewComponent!: StudentViewComponent;

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

  onAdd() {
    this.studentAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['学号', '姓名', '性别', '出生日期', '专业名称', '年级', '联系电话', '邮箱', '省', '市', '区', '家庭地址', '入学日期', '毕业日期']
      this.searchLoading = true
      this.studentService.find(new StudentQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.studentNumber, d.name, getGenderText(d.gender), d.birthDate, d.majorName, d.grade, d.contactPhone, d.email,
              d.provinceName, d.cityName, d.areaName, d.address, d.enrollmentDate, d.graduationDate])
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
    this.studentAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.studentService.del(id).subscribe({
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

  detailRow(record: Student) {
    this.studentViewComponent.display(record)
  }

  findMajor() {
    this.majorSelectorComponent.display()
  }

  handleMajorSelectedEvent(selectedMajor: { majorId?: number; majorName?: string; }) {
    if (selectedMajor && 'majorId' in selectedMajor) {
      this.searchForm.patchValue(selectedMajor);
    }
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
