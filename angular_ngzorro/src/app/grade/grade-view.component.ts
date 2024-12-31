import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Grade} from '../../types/resp/Grade';

@Component({
  selector: 'grade-view',
  imports: [
    SharedModule
  ],
  templateUrl: './grade-view.component.html',
  standalone: true
})
export class GradeViewComponent implements OnInit {
  gradeForm!: FormGroup;
  isVisible: boolean = false
  title: string = '成绩信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.gradeForm = this.fb.group({
      courseName: [''],
      studentNumber: [''],
      grade: [0],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(grade: Grade) {
    this.isVisible = true
    this.gradeForm.patchValue(grade);
    this.gradeForm.disable();
  }
}
