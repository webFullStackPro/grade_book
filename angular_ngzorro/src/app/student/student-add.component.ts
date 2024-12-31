import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {StudentService} from '../../service/student.service';
import {SharedModule} from '../shared.module';
import {StudentForm} from '../../types/req/StudentForm';
import {MODAL_WIDTH} from '../../const'
import {MajorSelectorComponent} from '../major/major-selector.component';
import areas from '../../const/area.json'

@Component({
  selector: 'student-add',
  imports: [
    MajorSelectorComponent,
    SharedModule
  ],
  templateUrl: './student-add.component.html',
  standalone: true
})
export class StudentAddComponent implements OnInit {
  studentToSave:StudentForm = {};
  studentForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增学生信息'
  modalWidth: string = MODAL_WIDTH
  provinceCityAreaOptions = areas.provinces;

  @ViewChild(MajorSelectorComponent, { static: false }) majorSelectorComponent!: MajorSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      studentNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      gender: [undefined, [Validators.required]],
      birthDate: ['', [Validators.required]],
      majorId: [0],
      majorName: ['', [Validators.required]],
      grade: [2000, [Validators.required]],
      contactPhone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      province: [''],
      city: [''],
      area: [''],
      provinceCityArea: [[]],
      address: [''],
      enrollmentDate: [''],
      graduationDate: [''],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.studentForm.controls) {
        this.studentForm.controls[i].markAsDirty();
        this.studentForm.controls[i].updateValueAndValidity();
      }
      if (!this.studentForm.valid) {
        this.saveLoading = false
        return
      }
      this.studentService.save(Object.assign(this.studentToSave, this.studentForm.value)).subscribe({
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
    this.title = '新增学生信息'.slice()
    this.studentForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改学生信息'
      this.saveLoading = true
      this.studentService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.studentToSave = resp.data
            const provinceCityArea = []
            if (this.studentToSave.province) {
              provinceCityArea.push(this.studentToSave.province)
            }
            if (this.studentToSave.city) {
              provinceCityArea.push(this.studentToSave.city)
            }
            if (this.studentToSave.area) {
              provinceCityArea.push(this.studentToSave.area)
            }
            this.studentForm.patchValue(Object.assign({provinceCityArea: provinceCityArea},this.studentToSave));
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

  findMajor() {
    this.majorSelectorComponent.display()
  }

  handleMajorSelectedEvent(selectedMajor: { majorId?: number; majorName?: string; }) {
    if (selectedMajor && 'majorId' in selectedMajor) {
      this.studentForm.patchValue(selectedMajor);
    }
  }
}
