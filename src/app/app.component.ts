import { Component } from '@angular/core';
import { HomePage } from '../pages/home/home';
// import { Page2 } from '../pages/page2/page2';
// import { Page3 } from '../pages/page3/page3';
// import { Page4 } from '../pages/page4/page4';
// import { Page5 } from '../pages/page5/page5';
import { ConfirmPage } from '../pages/confirm/confirm';
// import { ResultPage } from '../pages/result/result';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  constructor() {
  }
}

