import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, LoadingController, ToastController, Content } from 'ionic-angular';

import { ResultPage } from '../result/result';
import { PdfPage } from '../pdf/pdf';
import { ErrorPage } from '../error/error';
import { HttpService } from '../http-service/http.service';
import { ValidaService } from '../http-service/valid.service';
import { CommonService } from '../http-service/common.service';
import { fadeIn } from '../http-service/animation';

declare let customConfig: any;

@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
  animations: [fadeIn]
})
export class ConfirmPage {
  @ViewChild(Content) content: Content;
  private confirmInfo = {
    loanAmount: '',
    income: ''
  };
  context: any;
  canvas: any;
  canvasObject = {
    isDraw: false,
    isSign: 'none',
    signCanvas: '',
    isClick: false
  }
  private confirmIsAgree: boolean;
  private strIsAgree: string;
  private promotionInfo: string;
  private errObj:any = {}
  liveStatus:string;
  constructor(
    public navCtrl: NavController,
    private httpService: HttpService,
    private validaService: ValidaService,
    private commonService: CommonService,
    private cdRef: ChangeDetectorRef,
    private elRef: ElementRef,
    public loading: LoadingController,
    public toastCtrl: ToastController
  ) {}
  
  goBack(n){
   this.navCtrl.popTo(this.navCtrl.getByIndex(n));
  }
  
  ionViewDidLoad() {
    this.commonService.canChange = false;
    this.canvas = this.elRef.nativeElement.querySelector('#canvas');
    if (screen.width <= 350) {
      this.canvas.style.marginTop = '88px';
      this.canvas.height = 250;
      this.canvas.width = 250;
    }
    this.canvas.addEventListener('touchmove', (evt)=> this.onTouchMove(evt), false);
    this.canvas.addEventListener('touchstart', (evt)=> this.onTouchDown(evt), false);
    this.canvas.addEventListener('mousemove', (evt)=> this.onMouseMove(evt), false);
    this.canvas.addEventListener('mousedown', (evt)=> this.onMouseDown(evt), false);
    this.canvas.addEventListener('mouseup', (evt)=> this.onMouseUp(evt), false);
    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = "#fff";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  onTouchMove(evt) {
    evt.preventDefault();
    var lastX = evt.changedTouches[0].pageX - this.canvas.offsetLeft;
    var lastY = evt.changedTouches[0].pageY - evt.target.offsetTop;
    this.context.lineTo(lastX, lastY);
    this.context.save();
    this.context.lineWidth = 1;
    this.context.shadowBlur = 10;
    this.context.stroke();
    this.context.restore();
    this.canvasObject.isDraw = true;
  }
  onMouseMove(evt) {
    if (this.canvasObject.isClick) {
      evt.preventDefault();
      var lastX = evt.pageX - this.canvas.offsetLeft;
      var lastY = evt.pageY - evt.target.offsetTop;
      this.context.lineTo(lastX, lastY);
      this.context.save();
      this.context.lineWidth = 1;
      this.context.shadowBlur = 10;
      this.context.stroke();
      this.context.restore();
      this.canvasObject.isDraw = true;
    }
  }
  onTouchDown(evt) {
    evt.preventDefault();
    var lastX = evt.changedTouches[0].pageX - this.canvas.offsetLeft;
    var lastY = evt.changedTouches[0].pageY - evt.target.offsetTop;
    this.context.beginPath();
    this.context.moveTo(lastX, lastY);
  }
  onMouseDown(evt) {
    evt.preventDefault();
    var lastX = evt.pageX - this.canvas.offsetLeft;
    var lastY = evt.pageY - evt.target.offsetTop;
    this.context.beginPath();
    this.context.moveTo(lastX, lastY);
    this.canvasObject.isClick = true;
  }
  onMouseUp(evt) {
    this.canvasObject.isClick = false;
  }

  showSignBox() {
    this.errObj.isSign = '';
    this.canvasObject.isSign = 'block';
  }

  signReset() {
    this.canvasObject.isDraw = false;
    this.canvasObject.isSign = 'none';
    this.canvasObject.signCanvas = "";
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "#fff";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  signSave() {
    if (this.canvasObject.isDraw) {
      this.canvasObject.isSign = 'none';
      let loader = this.commonService.loadingModel('正在上傳簽名');
      loader.present();
      this.httpService.imgToken().then(res => {
        if (res.success == "true") {
          const token = res.token;
          let srcData = {"id": this.commonService.userId, "picId": "Signature", "picContent": this.canvas.toDataURL('image/jpeg'),"token":token, "sys": "CLN"};
          this.uploadPic(srcData, loader);
        } else {
          loader.dismiss().then(()=>{
            this.commonService.toaseModel('當前上載人數過多，請稍後再試！');
          })
        }
      }).catch((err) => {
        loader.dismiss().then(()=>{
          this.commonService.toaseModel('簽名上載失敗，請稍後在試！');
        });
      });
    }
  }

  uploadPic(srcData,myLoader){
    this.httpService.imgUpload(srcData).then(res=>{
      myLoader.dismiss().then(()=>{
        if(res.success == "false") {
          this.signReset();
          this.commonService.toaseModel('簽名上載失敗，請稍後在試！');
        }else {
          this.canvasObject.signCanvas = this.canvas.toDataURL('image/jpeg');
        }
      });
    }).catch((data) => {
        myLoader.dismiss().then(()=>{
          this.commonService.toaseModel('簽名上載失敗，請稍後在試！');
        });
    });
  }

  getLiveYear(value) {
    if (!value) return '' ;
    const time = value.split(" ")[1];
    return time.split("-")[0] + '年 ' + time.split("-")[1] + '月';
  }

  formatBankNum(str) {
    return str && str.slice(0, 3) + '-' + str.slice(3);
  }

  ionViewWillLoad() {
    let loading = this.commonService.loadingModel('');loading.present();
    this.httpService.httpRequest('showcompleteinfoservice').then(res => {
      if(res.status == 'success') {
        loading.dismiss().then(()=>{
          this.confirmInfo = res.resultInfo;
          switch (res.resultInfo.liveStatus) {
            case 'Living with Parents': this.liveStatus = '與父母同住';break;
            case 'Quarters': this.liveStatus = '宿舍';break;
            case 'Owned': this.liveStatus = '自置';break;
            case 'Rented': this.liveStatus = '租用';break;
            case 'Mortgaged': this.liveStatus = '按揭';break;
          }
          this.promotionInfo = this.showPromotionInfo(res.resultInfo);
          this.confirmInfo.loanAmount = this.commonService.moneyFormat(Number(this.confirmInfo.loanAmount));
          this.confirmInfo.income = this.commonService.moneyFormat(Number(this.confirmInfo.income));
        })
      } else if(res.status == 'fail') {
        this.toErrorPage(res.message, loading);
      }
    }).catch(res => {
      this.toErrorPage(res.statusText, loading);
    });

    this.httpService.httpRequest('getpictureservice', {id: this.commonService.userId, picId: 'Signature'}).then(res =>{
      if(res.status == 'success'){
        this.canvasObject.signCanvas = res.resultInfo.Signature;
        this.canvasObject.isDraw = true;
      }else {
        this.toErrorPage(res.statusText);
      }
    }).catch(res => {
      this.toErrorPage(res.statusText);
    });
  }

  saveAnext(){
    this.errObj = {};
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
    this.errObj.confirmIsAgree = this.validaService.isEmpty(this.confirmIsAgree, '請按空格以確認你已參閱、明白及同意各項聲明及條款細則');
    this.errObj.isSign = this.validaService.isEmpty(this.canvasObject.signCanvas, '請簽署電子簽名');
    let isRightToNext = this.commonService.scrollTo(this.content,this.errObj);
    if (isRightToNext) {
      let loading = this.commonService.loadingModel('');loading.present();
      this.httpService.httpRequest('callEKYC',{
        type: "all"
      }).then(res => {
        this.httpService.httpRequest('confirminfoservice', {"id": this.commonService.userId,"lang":"TCH"}).then(res => {
          loading.dismiss().then(()=>{
            if(res.status == 'success' && res.errorCode == '') {
              this.navCtrl.push(ResultPage, {"comfirmDetail":res.resultInfo});
            }else {
              this.toErrorPage(res.message, loading);
            }
          })
        }).catch(res => {
          this.toErrorPage(res.statusText, loading);
        })
      });
    }
  }

  toErrorPage(errMsg, loader?: any) {
    loader.dismiss().then(()=> {
        this.navCtrl.setRoot(ErrorPage, {
            errMsg: errMsg
        });
    });
  }
  showPromotionInfo(renderData) {
    let options = "";
    if (renderData.useEmail && renderData.useSMS && renderData.useAdMail && renderData.useFlyer && renderData.useMobile) {
      this.strIsAgree = "不同意";
      options = "電郵、流動訊息（短訊/多媒體訊息）、推廣郵件、隨結單郵寄之宣傳單張及電話";
    } else if (!renderData.useEmail && !renderData.useSMS && !renderData.useAdMail && !renderData.useFlyer && !renderData.useMobile) {
      this.strIsAgree = "同意";
      options = "電郵、流動訊息（短訊/多媒體訊息）、推廣郵件、隨結單郵寄之宣傳單張及電話";
    } else {
      this.strIsAgree = "同意";
      if (!renderData.useEmail){
        options += "電郵" + "、";
      }
      if (!renderData.useSMS) {
        options += "流動訊息（短訊/多媒體訊息）" + "、";
      }
      if (!renderData.useAdMail) {
        options += "推廣郵件" + "、";
      } 
      if (!renderData.useFlyer) {
        options += "隨結單郵寄之宣傳單張" + "、";
      }
      if (!renderData.useMobile) {
        options += "電話" + "、";
      }
      options = options.substr(0, options.length - 1);
    }
    return "本行透過" + options + "途徑使用你的個人資料作直接促銷。";
  }
  toPDF(url) {
    let src = customConfig.pdfUrl[url.toString()];
    this.navCtrl.push(PdfPage, {
      pdfUrl: src
    });
  }
}
