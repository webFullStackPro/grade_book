import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Course} from '../../types/resp/Course';

@Component({
  selector: 'course-view',
  imports: [
    SharedModule
  ],
  templateUrl: './course-view.component.html',
  standalone: true
})
export class CourseViewComponent implements OnInit {
  courseForm!: FormGroup;
  isVisible: boolean = false
  title: string = '课程信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      facultyName: [''],
      teacherName: [''],
      code: [''],
      name: [''],
      credit: [0],
      courseDescription: [''],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(course: Course) {
    this.isVisible = true
    this.courseForm.patchValue(course);
    this.courseForm.disable();
  }
}
