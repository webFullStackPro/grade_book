import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Teacher} from '../../types/resp/Teacher';

@Component({
  selector: 'teacher-view',
  imports: [
    SharedModule
  ],
  templateUrl: './teacher-view.component.html',
  standalone: true
})
export class TeacherViewComponent implements OnInit {
  teacherForm!: FormGroup;
  isVisible: boolean = false
  title: string = '教师信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.teacherForm = this.fb.group({
      facultyName: [''],
      name: [''],
      password: [''],
      title: [undefined],
      gender: [undefined],
      contactPhone: [''],
      email: [''],
      profile: [''],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(teacher: Teacher) {
    this.isVisible = true
    this.teacherForm.patchValue(teacher);
    this.teacherForm.disable();
  }
}
