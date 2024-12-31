import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Student} from '../../types/resp/Student';
import areas from '../../const/area.json';

@Component({
  selector: 'student-view',
  imports: [
    SharedModule
  ],
  templateUrl: './student-view.component.html',
  standalone: true
})
export class StudentViewComponent implements OnInit {
  studentForm!: FormGroup;
  isVisible: boolean = false
  title: string = '学生信息详情'
  modalWidth: string = MODAL_WIDTH
  provinceCityAreaOptions = areas.provinces;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      studentNumber: [''],
      name: [''],
      password: [''],
      gender: [undefined],
      birthDate: [''],
      majorName: [''],
      grade: [0],
      contactPhone: [''],
      email: [''],
      province: [''],
      city: [''],
      area: [''],
      provinceCityArea: [[]],
      address: [''],
      enrollmentDate: [''],
      graduationDate: [''],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(student: Student) {
    this.isVisible = true
    const provinceCityArea = []
    if (student.province) {
      provinceCityArea.push(student.province)
    }
    if (student.city) {
      provinceCityArea.push(student.city)
    }
    if (student.area) {
      provinceCityArea.push(student.area)
    }
    this.studentForm.patchValue(Object.assign({provinceCityArea: provinceCityArea}, student));
    this.studentForm.disable();
  }
}
