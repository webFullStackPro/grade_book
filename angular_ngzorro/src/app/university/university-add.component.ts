import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {UniversityService} from '../../service/university.service';
import {SharedModule} from '../shared.module';
import {UniversityForm} from '../../types/req/UniversityForm';
import {MODAL_WIDTH} from '../../const'
import areas from '../../const/area.json';

@Component({
  selector: 'university-add',
  imports: [
    SharedModule
  ],
  templateUrl: './university-add.component.html',
  standalone: true
})
export class UniversityAddComponent implements OnInit {
  universityToSave:UniversityForm = {};
  universityForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增学校信息'
  modalWidth: string = MODAL_WIDTH
  provinceCityAreaOptions = areas.provinces;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private universityService: UniversityService
  ) {}

  ngOnInit(): void {
    this.universityForm = this.fb.group({
      name: ['', [Validators.required]],
      establishmentDate: [''],
      contactPhone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      province: [''],
      city: [''],
      area: [''],
      provinceCityArea: [[]],
      location: ['', [Validators.required]],
      universityDescription: [''],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.universityForm.controls) {
        this.universityForm.controls[i].markAsDirty();
        this.universityForm.controls[i].updateValueAndValidity();
      }
      if (!this.universityForm.valid) {
        this.saveLoading = false
        return
      }
      this.universityService.save(Object.assign(this.universityToSave, this.universityForm.value)).subscribe({
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
    this.title = '新增学校信息'.slice()
    this.universityForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改学校信息'
      this.saveLoading = true
      this.universityService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.universityToSave = resp.data
            const provinceCityArea = []
            if (this.universityToSave.province) {
              provinceCityArea.push(this.universityToSave.province)
            }
            if (this.universityToSave.city) {
              provinceCityArea.push(this.universityToSave.city)
            }
            if (this.universityToSave.area) {
              provinceCityArea.push(this.universityToSave.area)
            }
            this.universityForm.patchValue(Object.assign({provinceCityArea: provinceCityArea},this.universityToSave));
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
