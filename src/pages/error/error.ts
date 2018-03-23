import { Component } from '@angular/core';
import { NavController,LoadingController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-error',
  templateUrl: 'error.html'
})
export class ErrorPage {
  errMsg: string = '';
  Translate: any = {
    tips: ''
  };
  constructor(public navCtrl: NavController, public loading: LoadingController, private navParam: NavParams) {
    this.errMsg = this.navParam.get('errMsg') ? this.navParam.get('errMsg') : '';
    if(!(this.errMsg.indexOf('你填寫錯誤的一次性密碼已超出上限') != -1)) {
      this.errMsg = '';
    }
  }

}