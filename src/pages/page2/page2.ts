import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, Content, NavParams } from 'ionic-angular';
import { fadeIn } from '../http-service/animation';

import { HttpService } from '../http-service/http.service';
import { ValidaService } from '../http-service/valid.service';
import { CommonService } from '../http-service/common.service';
import { ErrorPage } from '../error/error';
import { Page3 } from '../page3/page3';
import { PdfPage } from '../pdf/pdf';

declare let customConfig: any;

@Component({
    selector: 'page-page2',
    templateUrl: 'page2.html',
    animations: [fadeIn]
})
export class Page2 {
    @ViewChild(Content) content: Content;
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('canvasMy') canvasMy: any;

    mWidth: number;
    mHeight: number;
    context: any;
    image: any;

    hasComs:boolean = true;
    hasHKID:boolean = true;
    rotateNum: number = 0;

    tuMessage:string = "<div class='tu-content'><p>A. 本人謹此同意及授權東亞銀行有限公司(「銀行」)及環聯資訊有限公司(「環聯」)及 任何信貸資料機構:</p>" +
        "<p class='p36'>(1) 可取用部份或全部本人不時於環聯及任何信貸資料機構資料庫內的個人信貸資料 (「本人的信貸資料」)用作:</p>" +
        "<p class='p54'>(a) (i) 以部份或全部本人的信貸資料核對由本人提供(包括但不限於任何圖像或文件)及由銀行轉交予環聯及任何信貸資料機構的資料;</p>" +
        "<p class='p72'>(ii) 不論單一地或是與其他資料來源混合地以部份或全部本人的信貸資料直接或間接產生的問題，向本人收集有關問題的回應及以此回應核對任何本人的信貸資料中的任何資料;及</p>" +
        "<p class='p54'>(b) 轉移本人的信貸資料予銀行作有關本人信用咭/貸款申請時評估本人信貸風險之用</p>" +
        "<p class='p36 no-indent'>作為有關本人信用咭/貸款申請時評估本人信貸風險的一部份，以驗證本人身份、文件或任何資料;及之後用作處理、使用及轉移驗證結果及因此而產生的資料予銀行。</p>" +
        "<p>B. 本人亦知悉及同意環聯及任何信貸資料機構就有關取用及使用本人於環聯或任何信貸資料機構資料庫內的個人信貸資料向銀行收取費用, 有關取用及使用不能構成本人對環聯及任何信貸資料機構作任何投訴、申索、訴訟、索求或訴訟理由或其他法律程序的基礎。</p></div>";
    private personInfo = {
        idCardPref: '',
        idCardSuf: ''
    };
    private file = {
        HKID: "",
        StuID_Back: "",
        Passbook: "",
        Perm_Addr: "",
        StuID_Front: ""
    };
    private errObj: any = {
        idCard:"",
        isAgreeArrange:"",
        HKID: "",
        StuID_Back: "",
        Passbook: "",
        Perm_Addr: "",
        StuID_Front: ""
    };
    private ekyc = {
        HKIDBtnText : " ",
        HKIDChecking:false,
        HKIDResult:false,
        selfieBtnText : " ",
        selfieChecking:false,
        selfieResult:false,
    };
    isAgreeArrange:boolean;
    constructor(
        public navCtrl: NavController,
        public navPas: NavParams,
        private cdRef: ChangeDetectorRef,
        private elRef: ElementRef,
        private httpService: HttpService,
        private validaService: ValidaService,
        private commonService: CommonService
    ) {
        this.commonService.canChange = false;
    }

    ionViewWillLoad(){
        this.canvasMy = this.canvasMy.nativeElement;
        this.context = this.canvasMy.getContext('2d');
        this.image = new Image();
        let loading = this.commonService.loadingModel('');loading.present();
        let isContinue = this.navPas.get('continue');
        this.httpService.httpRequest('docontinueservice', {"continue": isContinue}).then(res=>{
            if(res.status == 'success') {
                let result = res.resultInfo;
                this.hasComs = result.isBeaUser;
                this.hasHKID = result.isHKResidents;
                // this.httpService.isHK = this.hasHKID;
                let userId = result.id;
                this.commonService.userId = result.id;
                this.personInfo.idCardPref = result.idCardPref;
                this.personInfo.idCardSuf = result.idCardSuf;
                try {
                    localStorage.removeItem('tuid');
                    localStorage.setItem("iToken", res.resultInfo.token);
                } catch (error) {
                    console.log('safari浏览器開啟了隐身模式浏览');
                }
                !isContinue && loading.dismiss();
                isContinue && Promise.all([
                    this.httpService.httpRequest('getpictureservice', {id: userId, picId: 'HKID'}),
                    this.httpService.httpRequest('getpictureservice', {id: userId, picId: 'StuID_Back'}),
                    this.httpService.httpRequest('getpictureservice', {id: userId, picId: 'Perm_Addr'}),
                    this.httpService.httpRequest('getpictureservice', {id: userId, picId: 'StuID_Front'}),
                    this.httpService.httpRequest('getpictureservice', {id: userId, picId: 'Passbook'})
                ]).then(([ident, id_back, salary, selfie, passbook])=> {
                    loading.dismiss().then(()=> {
                        if (ident && ident.status == 'success') {
                            this.file.HKID = ident.resultInfo.HKID;
                        }
                        if (id_back && id_back.status == 'success') {
                            this.file.StuID_Back = id_back.resultInfo.StuID_Back;
                        }
                        if (salary && salary.status == 'success') {
                            this.file.Perm_Addr = salary.resultInfo.Perm_Addr;
                        }
                        if (selfie && selfie.status == 'success') {
                            this.file.StuID_Front = selfie.resultInfo.StuID_Front;
                            if (this.file.StuID_Front) {
                                this.image.src = this.file.StuID_Front;
                                this.image.onload = ()=> {
                                    this.mWidth = this.image.width;
                                    this.mHeight = this.image.height;
                                }
                            }
                        }
                        if (passbook && passbook.status == 'success') {
                            this.file.Passbook = passbook.resultInfo.Passbook;
                        }
                    });
                }).catch(res=> {
                    this.toErrorPage(res.statusText, loading);
                });
            }else {
                this.toErrorPage(res.message,loading);
            }
        }).catch(res=> {
            this.toErrorPage(res.statusText, loading);
        });
    } 

    saveAnext(){
        this.errObj = {};
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();

        if(this.hasComs){
            this.errObj.idCard = this.validaService.ckHKID(this.personInfo.idCardPref, this.personInfo.idCardSuf);
            this.errObj.Perm_Addr = this.validaService.isEmpty(this.file.Perm_Addr, '請上載薪金證明');
        }else {
            // this.errObj.isAgreeArrange = this.validaService.isEmpty(this.isAgreeArrange, '請按空格以確認你已參閱、明白及同意各項信貸資料授權');
            this.errObj.HKID = this.validaService.isEmpty(this.file.HKID, '請上載香港身份證');
            this.errObj.StuID_Back = this.validaService.isEmpty(this.file.StuID_Back, '請上載香港身份證背面');
            this.ekyc.selfieResult && (this.errObj.Perm_Addr = this.validaService.isEmpty(this.file.Perm_Addr, '請上載薪金證明'));
            this.ekyc.HKIDResult && (this.errObj.StuID_Front = this.validaService.isEmpty(this.file.StuID_Front, '請上載自拍照'));
            !this.hasHKID && (this.errObj.Passbook = this.validaService.isEmpty(this.file.Passbook, '請上載護照／往來或前往(單程證)港澳通行證／香港特別行政區簽証身份書。'));

            if(!this.ekyc.HKIDChecking && !this.ekyc.HKIDResult && !this.errObj.HKID && !this.errObj.StuID_Back) {
                if(this.hasHKID || (!this.hasHKID && !this.errObj.Passbook)){
                    this.commonService.alertModel('注意','請先確認及上載香港身份證','確定')
                }
            }else if(this.ekyc.HKIDChecking) {
                this.commonService.alertModel('注意','正在確認及上載香港身份證，請稍候...','確定')
            }else if(this.ekyc.HKIDResult && !this.ekyc.selfieChecking  && !this.ekyc.selfieResult && !this.errObj.StuID_Front) {
                this.commonService.alertModel('注意','請先確認及上載自拍照','確定')
            }else if(this.ekyc.selfieChecking) {
                this.commonService.alertModel('注意','正在確認及上載自拍照，請稍候...','確定')
            }
        }

        let isRightToNext = this.commonService.scrollTo(this.content,this.errObj);

        if (!isRightToNext) {
            return 0;
        }

        this.httpService.sendData = {
            id: this.commonService.userId,
            isBeaUser: this.hasComs,
            isHKResidents: this.hasHKID
        };
        this.httpService.isHK = this.hasComs || this.hasHKID;
        if (this.ekyc.HKIDResult && this.ekyc.selfieResult && !this.hasComs) {
            this.navCtrl.push(Page3,{"isBeaUser":this.hasComs});
        }else if (this.hasComs) {
            let loading = this.commonService.loadingModel('');loading.present();
            this.httpService.httpRequest('checkHKIDService', {
                "idCardPref": this.personInfo.idCardPref,
                "idCardSuf": this.personInfo.idCardSuf,
                "isBeaUser":this.hasComs,
                "step":"2"
            }).then(res=> {
                loading.dismiss().then(()=> {
                    if (res.status == 'success') {
                        this.navCtrl.push(Page3,{"isBeaUser":this.hasComs});
                    }else if(res.status == 'fail' && res.errorCode == "err-2222"){
                        this.commonService.alertModel('注意','根據你輸入的資料並不屬於現有東亞銀行客戶，請重新輸入或致電貸款申請熱線<a href="tel:' + customConfig.alertMobile + '">' + customConfig.alertMobile + '</a>。','確定')
                    }else {
                        this.toErrorPage(res);
                    }
                })
            }).catch(error=> {
                this.toErrorPage(error.statusText,loading);
            });
        }
    }

    fileUpload(event, id) {
        let hasPic:boolean = false ;
        if(this.file[id]){
            hasPic = true;
        }
        var file = event.target.files[0];
        //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
        // || customConfig.maxFileSize < (file.size / 1024 / 1024)                  最大文件限制
        if(!/image\/\w+/.test(file.type)){
            // this.creatToast(this.Translate.requireFile.opt.wrongPic);
            return false;
        }
    
        const rotateCtx = (orieVal, ctx, width, height) => {
        switch (orieVal) {
            case 2: 
                ctx.transform(-1, 0, 0, 1, width, 0);
                this.rotateNum = 1;
                break;
            case 3: 
                ctx.transform(-1, 0, 0, -1, width, height ); 
                this.rotateNum = 2;
                break;
            case 4: 
                ctx.transform(1, 0, 0, -1, 0, height ); 
                this.rotateNum = 3;
                break;
            case 5: 
                ctx.transform(0, 1, 1, 0, 0, 0); 
                this.rotateNum = 0;
                break;
            case 6: 
                ctx.transform(0, 1, -1, 0, height , 0); 
                this.rotateNum = 1;
                break;
            case 7: 
                ctx.transform(0, -1, -1, 0, height , width); 
                this.rotateNum = 2;
                break;
            case 8: 
                ctx.transform(0, -1, 1, 0, 0, width); 
                this.rotateNum = 3;
                break;
            default: 
                ctx.transform(1, 0, 0, 1, 0, 0);
                this.rotateNum = 0;
        }
            return ctx;
        };
        
        const af2Base64 = (af) => {
            let base64 = btoa(
            [].reduce.call(
                new Uint8Array(af), (p,c) => p + String.fromCharCode(c), '')
            );
            return 'data:image/gif;base64,' + base64;
        }

        const parse = (view) => {
        return new Promise((resolve, reject) => {
            let offset = 0
            , len = view.byteLength
            , APP1_offset
            , TIFF_offset
            , EXIF_offset
            , little
            , IFD0_offset
            , entries_count
            , entries_offset
            , resolve_value
            
            if (view.getUint16(0, false) != 0xFFD8) reject('不是 JPEG 文件')
            
            while (offset < len) {
            if (view.getUint16(offset, false) == 0xFFE1) break;
            else offset += 2;
            }
    
            if (offset >= len) reject('没找到 APP1 标识')
            APP1_offset = offset
            EXIF_offset = APP1_offset + 4;
            if (view.getUint32(EXIF_offset, false) != 0x45786966)  reject('无 EXIF 信息');
            TIFF_offset = EXIF_offset + 6;
            little = view.getUint16(TIFF_offset, false)  == 0x4949 ? true : false
            IFD0_offset = TIFF_offset + view.getUint32(TIFF_offset + 4);
            entries_count =  view.getUint16(IFD0_offset, little);
            entries_offset = IFD0_offset + 2;
    
            for (let i = 0; i < entries_count; i++ ) {
            if (view.getUint16(entries_offset + (i * 12), little) == 0x0112) {
                let resolve_value = view.getUint16(entries_offset + (i * 12) + 8, little)
                resolve(resolve_value)
            } 
            }
            reject('没有 orientation 信息')
        })
        };
    

      let FR = new FileReader();
        FR.readAsArrayBuffer(file);
        FR.onloadend = (evt) => { 
            let loader = this.commonService.loadingModel( '正在上載圖片...');
            loader.present();
            let view = new DataView(evt.target['result'])
                , image = new Image()
                ,canvas = this.canvas.nativeElement
                ,ctx = canvas.getContext('2d')
          image.src = af2Base64(evt.target['result']);
          image.onload = () => {
            var maxRate = 1, mWidth = 0, mHeight = 0;
            if (image.width > image.height) {
                mWidth = (id == 'HKID' ||  id == 'StuID_Back') ? 2000 : 1000;
                maxRate = mWidth / image.width;
                mHeight = image.height * maxRate;
            }else {
                mHeight = (id == 'HKID' ||  id == 'StuID_Back') ? 2000 : 1000;
                maxRate = mHeight / image.height;
                mWidth = image.width * maxRate;
            }
            
            canvas.width = mWidth;
            canvas.height = mHeight;

            const drawCommon = () => {
                ctx = this.drawImageIOSFix(ctx, image, 0, 0, image.width, image.height, 0, 0, mWidth, mHeight);
                // ctx.drawImage(image, 0, 0, mWidth, mHeight);
                var src = canvas.toDataURL('image/jpeg', 1.0);
                if (id == 'StuID_Front') {
                    this.canvasMy = canvas;
                    this.context = ctx;
                    this.mHeight = mHeight;
                    this.mWidth = mWidth;
                    this.image = image;
                }
                this.getImgToken(id,hasPic,src,loader);
            }
            if (id != 'StuID_Front') {
                drawCommon();
                return;
            }

            parse(view).then(val => {
                // 5, 6, 7, 8 是 1, 2, 3, 4 的镜像
                if (typeof(val) == 'number' ) {
                    if ([5,6,7,8].indexOf(val) > -1) {
                        canvas.width = mHeight;
                        canvas.height = mWidth;
                    } 
                    else {
                        canvas.width = mWidth;
                        canvas.height = mHeight;
                    }
                }
              ctx = rotateCtx(val, ctx, mWidth, mHeight);
              drawCommon();
              this.canvasMy = canvas;
              this.context = ctx;
             }).catch(()=> {
                drawCommon();
             })
          }
         };
    }

   
    drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        var vertSquashRatio = this.detectVerticalSquash(img);
        ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
            sw * vertSquashRatio, sh * vertSquashRatio,
            dx, dy, dw, dh );
        return ctx;
    }

    detectVerticalSquash(img) {
        var ih = img.naturalHeight;
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
            var alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio===0)?1:ratio;
    }

    clickRT(id) {
        let loader = this.commonService.loadingModel( '正在上載圖片...');
        loader.present();
        this.rotateNum ++;
        this.rotateImage(this.canvasMy, this.context, this.mHeight, this.mWidth, this.rotateNum % 4)
        this.context = this.drawImageIOSFix(this.context, this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.mWidth, this.mHeight);
        var src = this.canvasMy.toDataURL('image/jpeg');
        this.getImgToken(id,true,src,loader);
    }

    rotateImage(canvas, context, height, width, angel) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (angel % 2) {
            canvas.height = width;
            canvas.width =  height;
        }else {
            canvas.height = height;
            canvas.width =  width;
        }
        context.translate(width / 2, height / 2);
        context.rotate(Math.PI / 180 * 90 * angel);
        switch(angel) {
            case 0:
                context.translate(-width / 2, -height / 2);
                break;
            case 1:
                context.translate(-height / 2, width / 2 - height);
                break;
            case 2:
                context.translate(-width / 2, -height / 2);
                break;
            case 3:
                context.translate(height / 2 -width, -width / 2);
                break;
        }
    }

    getImgToken(picId,hasPic,imgSrc,loading) {
        let token;
        this.httpService.imgToken().then(res=>{
            if(res.success == 'true') {
                token = res.token;
                hasPic ? this.delImg(picId,'',imgSrc,loading,token) : this.uploadImg(picId,imgSrc,loading,token);
            }else {
                loading.dismiss().then(()=>{
                    this.showFail(picId,"uploadFail");
                })
            }
        }).catch(res=> {
            loading.dismiss().then(()=>{this.showFail(picId,"uploadFail")});
        });
        this.cleanImgValue(picId);
    }

    delImg(picId,onlyDel?,imgSrc?,loading?,token?) {
        let delLoading;
        onlyDel && (delLoading = this.commonService.loadingModel( '正在删除圖片...'),delLoading.present());
        this.httpService.httpRequest("deletepictureservice", {"id": this.commonService.userId,"picId": picId}).then(res=>{
            if(res.status == 'success') {
                onlyDel ? delLoading.dismiss().then(()=>{this.file[picId] = ''}) : this.uploadImg(picId,imgSrc,loading,token);
            }else {
                onlyDel ? delLoading.dismiss().then(()=>{ this.showFail(picId,"delFail",true)}) :
                    loading.dismiss().then(()=>{this.showFail(picId,"uploadFail",true)})
            }
        }).catch(res=> {
            onlyDel ? delLoading.dismiss().then(()=>{this.showFail(picId,"delFail")}) : loading.dismiss().then(()=>{this.showFail(picId,"uploadFail",true)});
        });
        this.cleanImgValue(picId);
    }

    uploadImg(picId,imgSrc,loading,token) {
        this.httpService.imgUpload({"id": this.commonService.userId, "picId": picId,"picContent":imgSrc,"token":token,"sys": "CLN"}).then(res=>{
            loading.dismiss().then(()=>{
                if(res.success == 'true') {
                    this.file[picId] = imgSrc;
                    this.cdRef.markForCheck();
                    this.cdRef.detectChanges();
                }else if (res.success == "false" && res.returnCode == '51') {
                    this.showFail(picId,"lineUp")
                }else {
                    this.showFail(picId,"uploadFail");
                }
            })
        }).catch(res=> {
            loading.dismiss().then(()=>{
                this.showFail(picId,"uploadFail");
            })
        });
    }

    showFail(picId,msg,savePic?){
        !savePic && (this.file[picId] = '');
        let errMsg = {
            uploadFail:'文件上載失敗，請稍後再試！',
            delFail:'文件刪除失敗，請稍後再試！',
            lineUp:'當前上載人數過多，請稍後再試！'
        };
        this.commonService.toaseModel(errMsg[msg]);
    }

    callEKYC(item){
        this.ekyc[item+'Checking'] = true;
        this.ekyc[item+'BtnText'] = "";
        this.httpService.httpRequest('callEKYC',{
            type: item,
            trustevSessionId: sessionStorage.getItem('tuid')
        }).then(res=>{
            this.ekyc[item+'Checking'] = false;
            if(res.status == "success") {
                this.ekyc[item+'BtnText'] = "完成上載";
                this.ekyc[item+'Result'] = true;
            }else if(res.status == "fail" && res.errCode == 'err-1500' ){
                this.ekyc[item+'BtnText'] = " ";
                let text;
                item == 'HKID'?(text = '香港身份證',this.file['HKID']='',this.file['StuID_Back']=''):(text='自拍照',this.file['StuID_Front'] = '');
                this.commonService.alertModel('注意',text + '確認及上載失敗，請重新確認及上載。','確定');
            } else{
                this.toErrorPage(res.statusText);
            }
        }).catch(res=> {
            this.toErrorPage(res.statusText);
        });
    }

    showEKYCMsg(item){
        this.commonService.comfirmModel('注意',"確認後的照片在本次申請中將無法修改。繼續請按確認，返回修改請按取消。",
            '取消','','確認',data=>{
                this.callEKYC(item);
            }
        ).present()
    }

    showRemind(id){
        let msg = id == 'HKID' ? "<video src=" + customConfig.videoUrl + " poster='./assets/imgs/take-photo.png' width='100%' height='100%' playsinline preload controls>您的浏览器不支持播放。 </video>":"<img src='assets/imgs/howToTakePic.jpg'><p>請於<span class='underline'>光線充足</span>的情況下，用手提電話<span class='underline'>橫向拍攝</span>。拍攝時請<span class='underline'>避免卡面反光</span>！</p>";
        let prompt = this.commonService.comfirmModel("正確拍攝方式介紹", msg, "取消", ()=> {}, "拍攝或上載", ()=> {
            let takePic = this.elRef.nativeElement.querySelector('#'+id);
            takePic.click()
        });
        prompt.present().then(()=>{
            id == 'HKID' && document.getElementsByTagName('video')[0].setAttribute('playsinline','true');
        })
    }

    showRemind2() {
        let msg = '<p class=alert-left-title>以下其中一項薪金證明：</p><p class=alert-hint><span>-   </span> 薪俸稅單</p><p class=alert-hint><span>-   </span> 最近一個月糧單</p><p class=alert-hint><span>-   </span> 附有客戶姓名、賬戶號碼及薪酬金額的最近3個月銀行結單/存摺</p><p class=alert-hint><span>-   </span> 公司商業登記證及最新稅單 (只適用於獨資經營東主或公司合夥人)</p><p class=alert-hint><span>-   </span> 如未能提供薪金證明，請致電<a href=tel:21861515 class=font-black>21861515</a> 由貸款專員為你跟進申請。</p>';
        let prompt = this.commonService.alertModel("薪金證明",msg,"確定",()=>{
            let takePic = this.elRef.nativeElement.querySelector('#Perm_Addr');
            takePic.click()
        })
    }

    cleanImgValue(id){
        this.elRef.nativeElement.querySelector('#' + id).value = ''
    }

    toErrorPage(errMsg, loader?: any) {
        if(loader)loader.dismiss();
        this.navCtrl.setRoot(ErrorPage, {
            errMsg: errMsg
        });
    }
    toPDF(url) {
        let src = customConfig.pdfUrl[url.toString()];
        this.navCtrl.push(PdfPage, {
            pdfUrl: src
        });
    }
}
