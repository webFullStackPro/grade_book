import {Component} from '@angular/core';
import {ADVERTISEMENT, ADVERTISEMENT2, WEIXIN_ALT, WELCOME_MESSAGE} from '../../const';
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
  advertisement: string = ADVERTISEMENT
  advertisement2: string = ADVERTISEMENT2
  weixinAlt: string = WEIXIN_ALT
  imagePath = `${environment.deployUrl}assets/weixinqrcode_small.jpg`
}
