import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {University} from '../../types/resp/University';
import areas from '../../const/area.json';

@Component({
  selector: 'university-view',
  imports: [
    SharedModule
  ],
  templateUrl: './university-view.component.html',
  standalone: true
})
export class UniversityViewComponent implements OnInit {
  universityForm!: FormGroup;
  isVisible: boolean = false
  title: string = '学校信息详情'
  modalWidth: string = MODAL_WIDTH
  provinceCityAreaOptions = areas.provinces;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.universityForm = this.fb.group({
      name: [''],
      establishmentDate: [''],
      contactPhone: [''],
      email: [''],
      province: [''],
      city: [''],
      area: [''],
      provinceCityArea: [[]],
      location: [''],
      universityDescription: [''],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(university: University) {
    this.isVisible = true
    const provinceCityArea = []
    if (university.province) {
      provinceCityArea.push(university.province)
    }
    if (university.city) {
      provinceCityArea.push(university.city)
    }
    if (university.area) {
      provinceCityArea.push(university.area)
    }
    this.universityForm.patchValue(Object.assign({provinceCityArea: provinceCityArea}, university));
    this.universityForm.disable();
  }
}
