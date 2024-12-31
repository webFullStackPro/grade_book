import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Faculty} from '../../types/resp/Faculty';

@Component({
  selector: 'faculty-view',
  imports: [
    SharedModule
  ],
  templateUrl: './faculty-view.component.html',
  standalone: true
})
export class FacultyViewComponent implements OnInit {
  facultyForm!: FormGroup;
  isVisible: boolean = false
  title: string = '院系信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.facultyForm = this.fb.group({
      universityName: [''],
      name: [''],
      establishmentDate: [''],
      contactPhone: [''],
      email: [''],
      officeLocation: [''],
      website: [''],
      facultyDescription: [''],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(faculty: Faculty) {
    this.isVisible = true
    this.facultyForm.patchValue(faculty);
    this.facultyForm.disable();
  }
}
