import { Component, ViewChild,ChangeDetectorRef } from '@angular/core';
import { NavController, LoadingController, Content } from 'ionic-angular';

import { ConfirmPage } from '../confirm/confirm';
import { ErrorPage } from '../error/error';
import { HttpService } from '../http-service/http.service';
import { ValidaService } from '../http-service/valid.service';
import { CommonService } from '../http-service/common.service';
import { fadeIn } from '../http-service/animation';

@Component({
  selector: 'page-page5',
  templateUrl: 'page5.html',
  animations: [fadeIn]
})
export class Page5 {
  @ViewChild(Content) content: Content;
  @ViewChild('relativeName') relativeName: any;
  @ViewChild('relative') relative: any;
  private checkObj = {
    email: false,
    flowMSM: false,
    promotion: false,
    endCase: false,
    mobile: false,
    reject: false,
  };
  private isShow = 0;
  private isRelative = false;
  private relativeItems = [];
  private errObj: any= {};
  private itemStatus = {
    "relativeMessage": "none"
  };

  constructor(
    public navCtrl: NavController,
    private httpService: HttpService,
    private validaService: ValidaService,
    public loading: LoadingController,
    public commonService: CommonService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ionViewWillLoad() {
    let loading = this.commonService.loadingModel('');loading.present();
    Promise.all([
      this.httpService.httpRequest('updateinfoservice', this.httpService.sendData),
      this.httpService.httpRequest('getrelationservice'),
    ]).then(([update, relation ]) => {
      loading.dismiss().then(() => {
        if(relation.status == 'success' && update.status == 'success') {
          this.relativeItems = relation.resultInfo;

          let dataInfo = update.resultInfo;
          this.isRelative = dataInfo.isRelative || false;
          // this.showClicked();
          if(this.isRelative) {
            this.relativeName.inputValue = dataInfo.relativeName;
            this.relative.inputValue = dataInfo.relative;
          }
          this.checkObj.email = dataInfo.useEmail;
          this.checkObj.flowMSM = dataInfo.useSMS;
          this.checkObj.promotion = dataInfo.useAdMail;
          this.checkObj.endCase = dataInfo.useFlyer;
          this.checkObj.mobile = dataInfo.useMobile;
          this.checkObj.reject = dataInfo.useOther;
        }else {
          this.toErrorPage((update.message || relation.message), loading);
        }
      })
    }).catch((res) => {
      this.toErrorPage(res.statusText, loading);
    })
  }

  scrollTo( elementId:string) {
      let yOffset = document.getElementById(elementId).offsetTop;
      this.content.scrollTo(0, yOffset, 500);
  }

  ckReset(reset) {
    var isShow = 0;
    this.checkObj.email ? isShow ++ : {};
    this.checkObj.flowMSM ? isShow ++ : {};
    this.checkObj.promotion ? isShow ++ : {};
    this.checkObj.endCase ? isShow ++ : {};
    this.checkObj.mobile ? isShow ++ : {};
    if (isShow == 1 && this.isShow < isShow) {
      setTimeout(()=>{
        let prompt = this.commonService.comfirmModel('注意', '<span class=\"sc-alert-msg\">一經確認，你將不能收到任何優惠情報。</span>', '返回', ()=>{
          this.checkObj[reset] = false;
        }, '確認');
        prompt.present();
      }, 0);
    }else {
      this.isShow = isShow;
    }
  }

  // showClicked() {
  //   if (this.isRelative) {
  //     this.itemStatus.relativeMessage = "block";
  //   }
  // }

  showHide(type) {
    if (this.itemStatus[type] == "none") {
      this.itemStatus[type] = "block";
    } else {
      this.itemStatus[type] = "none";
    }
  }

  nextStep(){
    this.errObj = { };
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
    if (this.isRelative) {
      this.errObj.relativeName = this.validaService.isEngName(this.relativeName.inputValue, '請填寫董事/僱員香港身份證上之英文姓名', '董事/僱員香港身份證上之英文姓名填寫不正確');
      this.errObj.relative = this.validaService.isEmpty(this.relative.inputValue, '請選擇關係');
    }

    let isRightToNext = this.commonService.scrollTo(this.content,this.errObj);
    if (isRightToNext) {
      let loading = this.commonService.loadingModel('');loading.present();
      if (!this.isRelative) {
        this.relativeName.inputValue = '';
        this.relative.inputValue = '';
      }
      this.httpService.sendData = {
        "id": this.commonService.userId,
        "isRelative": this.isRelative,
        // "relativeName": this.isRelative ? this.relativeName.inputValue : '',
        // "relative": this.isRelative ? this.relative.inputValue : '',
        "relativeName": this.relativeName.inputValue,
        "relative": this.relative.inputValue,
        "useEmail": this.checkObj.email,
        "useSMS": this.checkObj.flowMSM,
        "useAdMail": this.checkObj.promotion,
        "useFlyer": this.checkObj.endCase,
        "useMobile": this.checkObj.mobile,
        "useOther": this.checkObj.reject
      };
      this.httpService.httpRequest('updateinfoservice',this.httpService.sendData).then((res) => {
        if(res.status == 'success') {
          loading.dismiss().then(()=> {
            this.navCtrl.push(ConfirmPage);
          })
        } else if(res.status == 'fail') {
          this.toErrorPage(res.message, loading);
        }
      }).catch((res) => {
        this.toErrorPage(res.statusText, loading);
      })
    }
  }

  toErrorPage(errMsg, loader?: any) {
        loader.dismiss().then(()=> {
            this.navCtrl.setRoot(ErrorPage, {
                errMsg: errMsg
            });
        });
    }
}
