import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {AdminService} from '../../service/admin.service';
import {SharedModule} from '../shared.module';
import {AdminForm} from '../../types/req/AdminForm';
import {MODAL_WIDTH} from '../../const'

@Component({
  selector: 'admin-add',
  imports: [
    SharedModule
  ],
  templateUrl: './admin-add.component.html',
  standalone: true
})
export class AdminAddComponent implements OnInit {
  adminToSave:AdminForm = {};
  adminForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增管理员'
  modalWidth: string = MODAL_WIDTH

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.adminForm.controls) {
        this.adminForm.controls[i].markAsDirty();
        this.adminForm.controls[i].updateValueAndValidity();
      }
      if (!this.adminForm.valid) {
        this.saveLoading = false
        return
      }
      this.adminService.save(Object.assign(this.adminToSave, this.adminForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          this.message.success("保存成功")
          this.onBack(true)
        },
        complete: () => {
          this.saveLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  onReset() {
    this.title = '新增管理员'.slice()
    this.adminForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改管理员'
      this.saveLoading = true
      this.adminService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.adminToSave = resp.data
            this.adminForm.patchValue(this.adminToSave);
          }
        },
        complete: () => {
          this.saveLoading = false
        }
      })
    } else {
      this.onReset()
    }
  }
}
