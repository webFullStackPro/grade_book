import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SharedModule} from './shared.module';
import {AuthService} from '../service/auth.service';
import {TITLE} from '../const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    SharedModule
  ],
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit() {
    document.title = TITLE
  }
}
