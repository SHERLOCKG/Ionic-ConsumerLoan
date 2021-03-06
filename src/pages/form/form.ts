import { Component, Input, Output, EventEmitter } from '@angular/core';

import { fadeIn } from '../http-service/animation';
import { HttpService } from '../http-service/http.service';

@Component({
  selector: 'form-item',
  templateUrl: 'form.html',
  animations: [fadeIn]
})
export class FormPage {
    @Input() name: string;
    @Input() errMsg: string = '';
    @Input() inputType: string = 'text';
    @Input() opItem: any = null;
    @Input() maxLen: number;
    @Input() isDisabled: boolean = false;
    @Input() keyFilter: any = null;
    @Input() isMobile: boolean = false;
    // @Input() regExp: any;
    // @Input() isInput: boolean =  true;
    // @Input() isInput: boolean =  true;
    @Output() changeBack: EventEmitter<string> = new EventEmitter();
    inputValue: string = '';
    // isFocus: boolean = true;
    private userType: string = 'TC';
    constructor(httpService: HttpService) {
      this.userType = httpService.userType;
    }

    // isShowMobile(isFocus) {
    //   if (this.isMobile && isFocus) {
    //     this.isFocus = true;
    //   }else if(this.isMobile && !isFocus && !this.inputValue){
    //     this.isFocus = false;
    //   }
    // }



    keyUp(e) {
      // alert(e.target.value);
      if(this.keyFilter) {
        setTimeout(()=> {
          this.inputValue = this.inputValue.toString().replace(this.keyFilter, "");
        }, 0);
      }
    }

    changeValue() {
      this.changeBack.emit(this.inputValue);
    }
}
