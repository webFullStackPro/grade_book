import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Admin} from '../../types/resp/Admin';

@Component({
  selector: 'admin-view',
  imports: [
    SharedModule
  ],
  templateUrl: './admin-view.component.html',
  standalone: true
})
export class AdminViewComponent implements OnInit {
  adminForm!: FormGroup;
  isVisible: boolean = false
  title: string = '管理员详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      username: [''],
      password: [''],
      name: [''],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(admin: Admin) {
    this.isVisible = true
    this.adminForm.patchValue(admin);
    this.adminForm.disable();
  }
}
