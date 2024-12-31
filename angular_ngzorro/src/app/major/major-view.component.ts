import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Major} from '../../types/resp/Major';

@Component({
  selector: 'major-view',
  imports: [
    SharedModule
  ],
  templateUrl: './major-view.component.html',
  standalone: true
})
export class MajorViewComponent implements OnInit {
  majorForm!: FormGroup;
  isVisible: boolean = false
  title: string = '专业信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.majorForm = this.fb.group({
      facultyName: [''],
      name: [''],
      degreeType: [undefined],
      duration: [0],
      contactPhone: [''],
      email: [''],
      officeLocation: [''],
      majorDescription: [''],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(major: Major) {
    this.isVisible = true
    this.majorForm.patchValue(major);
    this.majorForm.disable();
  }
}
