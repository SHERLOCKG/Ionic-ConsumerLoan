import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MultiPickerModule } from 'ion-multi-picker';

import { HttpService } from '../pages/http-service/http.service'
import { ValidaService } from '../pages/http-service/valid.service';
import { CommonService } from '../pages/http-service/common.service';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HeaderStep } from '../pages/step/step';
import { FormPage } from '../pages/form/form';
import { Page2 } from '../pages/page2/page2';
import { Page3 } from '../pages/page3/page3';
import { Page4 } from '../pages/page4/page4';
import { Page5 } from '../pages/page5/page5';
import { ErrorPage } from '../pages/error/error';
import { ConfirmPage } from '../pages/confirm/confirm';
import { ResultPage } from '../pages/result/result';
import { PdfPage } from '../pages/pdf/pdf';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    HeaderStep,
    FormPage,
    ConfirmPage,
    ResultPage,
    Page2,
    Page3,
    Page4,
    Page5,
    ErrorPage,
    PdfPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MultiPickerModule,
    IonicModule.forRoot(MyApp,{
      iconMode: 'ios',
      mode: 'ios',
      monthShortNames: ['Jan', 'Feb', 'Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',],
      backButtonText:'',
      scrollAssist:false,
      autoFocusAssist:false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    HeaderStep,
    FormPage,
    ConfirmPage,
    ResultPage,
    Page2,
    Page3,
    Page4,
    Page5,
    ErrorPage,
    PdfPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpService,
    ValidaService,
    CommonService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
