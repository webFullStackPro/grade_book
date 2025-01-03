import {Component} from '@angular/core';
import {ad1, ad2, ad3, WEIXIN_ALT, WELCOME_MESSAGE} from '../../const';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.less'
})
export class HomeComponent {
  welcomeMessage: string = WELCOME_MESSAGE
  ad1: string = ad1
  ad2: string = ad2
  ad3: string = ad3
  weixinAlt: string = WEIXIN_ALT
  imagePath = `${environment.deployUrl}assets/weixinqrcode_small.jpg`
}
