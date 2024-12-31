import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {MajorService} from '../../service/major.service';
import {SharedModule} from '../shared.module';
import {MajorForm} from '../../types/req/MajorForm';
import {MODAL_WIDTH} from '../../const'
import {FacultySelectorComponent} from '../faculty/faculty-selector.component';

@Component({
  selector: 'major-add',
  imports: [
    FacultySelectorComponent,
    SharedModule
  ],
  templateUrl: './major-add.component.html',
  standalone: true
})
export class MajorAddComponent implements OnInit {
  majorToSave:MajorForm = {};
  majorForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增专业信息'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(FacultySelectorComponent, { static: false }) facultySelectorComponent!: FacultySelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private majorService: MajorService
  ) {}

  ngOnInit(): void {
    this.majorForm = this.fb.group({
      facultyId: [0],
      facultyName: ['', [Validators.required]],
      name: ['', [Validators.required]],
      degreeType: [undefined, [Validators.required]],
      duration: [0, [Validators.required]],
      contactPhone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      officeLocation: ['', [Validators.required]],
      majorDescription: [''],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.majorForm.controls) {
        this.majorForm.controls[i].markAsDirty();
        this.majorForm.controls[i].updateValueAndValidity();
      }
      if (!this.majorForm.valid) {
        this.saveLoading = false
        return
      }
      this.majorService.save(Object.assign(this.majorToSave, this.majorForm.value)).subscribe({
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
    this.title = '新增专业信息'.slice()
    this.majorForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改专业信息'
      this.saveLoading = true
      this.majorService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.majorToSave = resp.data
            this.majorForm.patchValue(this.majorToSave);
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

  findFaculty() {
    this.facultySelectorComponent.display()
  }

  handleFacultySelectedEvent(selectedFaculty: { facultyId?: number; facultyName?: string; }) {
    if (selectedFaculty && 'facultyId' in selectedFaculty) {
      this.majorForm.patchValue(selectedFaculty);
    }
  }
}
