import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Attendance} from '../../types/resp/Attendance';

@Component({
  selector: 'attendance-view',
  imports: [
    SharedModule
  ],
  templateUrl: './attendance-view.component.html',
  standalone: true
})
export class AttendanceViewComponent implements OnInit {
  attendanceForm!: FormGroup;
  isVisible: boolean = false
  title: string = '考勤信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.attendanceForm = this.fb.group({
      courseName: [''],
      studentNumber: [''],
      attendanceDate: [''],
      status: [undefined],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(attendance: Attendance) {
    this.isVisible = true
    this.attendanceForm.patchValue(attendance);
    this.attendanceForm.disable();
  }
}
