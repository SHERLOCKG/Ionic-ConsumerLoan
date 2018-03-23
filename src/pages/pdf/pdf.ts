import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Gesture, NavParams } from 'ionic-angular';

import { CommonService } from '../http-service/common.service';
declare let PDFJS: any;

@Component({
  selector: 'page-pdf',
  templateUrl: 'pdf.html',
})
export class PdfPage {
  // pdf
  pdfDoc = null;
  pageNum = 1;
  scale = 3;
  canvas: any;
  ctx: any;
  // ctx = canvas.getContext('2d');
  
  //zoom
  @ViewChild('image') image;
  @ViewChild('container') container;
  @ViewChild('ionScrollContainer', { read: ElementRef }) ionScrollContainer: ElementRef;

  private scrollableElement: any;
  private scrollListener: any;

  private gesture: Gesture;
  private scaleZoom: number = 1;
  private scaleStart: number = 1;

  private maxScale: number = 3;
  private minScale: number = 1;

  private imageWidth: number = 0;
  private imageHeight: number = 0;

  private position: any = {
    x: 0,
    y: 0,
  };
  private dimensions: any = {
    width: 0,
    height: 0,
  };
  private scroll: any = {
    x: 0,
    y: 0
  };

  constructor(public navCtrl: NavController, private elRef: ElementRef, private navParams: NavParams, public commonService: CommonService) { }

  public ngOnInit() {
    // Get the scrollable element
    this.scrollableElement = this.ionScrollContainer.nativeElement.querySelector('.scroll-content');

    // Attach events
    this.attachEvents();
  }

  public ngOnDestroy() {
    this.scrollableElement.removeEventListener('scroll', this.scrollListener);
  }

  /**
   * Attach the events to the items
   */
  private attachEvents() {
    // Gesture events
    this.gesture = new Gesture(this.container.nativeElement);
    this.gesture.listen();
    this.gesture.on('pinch', e => this.pinchEvent(e));
    this.gesture.on('pinchstart', e => this.pinchStartEvent(e));
    this.gesture.on('pan', e => this.panEvent(e));
  }

  /**
   * While the user is pinching
   *
   * @param  {Event} event
   */
  private pinchEvent(event) {
    let scaleZoom = this.scaleStart * event.scale;

    if (scaleZoom > this.maxScale) {
      scaleZoom = this.maxScale;
    } else if (scaleZoom < this.minScale) {
      scaleZoom = this.minScale;
    }

    this.scaleZoom = scaleZoom;
    this.displayScale();

    event.preventDefault();
  }

  /**
   * When the user starts pinching
   *
   * @param  {Event} event
   */
  private pinchStartEvent(event) {
    this.scaleStart = this.scaleZoom;
  }

  private panEvent(event) {
    let x = this.scroll.x + event.deltaX * 0.05;
    let y = this.scroll.y + event.deltaY * 0.05;
    let screenW = screen.width;
    let screenH = screen.height;
    if (x < screenW * (1 - this.scaleZoom)){
      x = screenW * (1 - this.scaleZoom);
    }else if (x >= 0) {
      x = 0;
    }
    if (y >= 0 || screenH > (this.image.nativeElement.offsetHeight * this.scaleZoom + 67)) {
      y = 0;
    }else if (y < screenH - this.image.nativeElement.offsetHeight * this.scaleZoom - 160) {
      y = screenH - this.image.nativeElement.offsetHeight * this.scaleZoom - 160;
    }
    this.image.nativeElement.style.left = `${ x }px`;
    this.image.nativeElement.style.top = `${ y }px`;
    this.scroll.x = x;
    this.scroll.y = y;
    this.displayScale();
  }


  /**
   * Calculate the position and set the proper scale to the element and the
   * container
   */
  private displayScale() {
    const realImageWidth = this.imageWidth * this.scaleZoom;
    const realImageHeight = this.imageHeight * this.scaleZoom;

    this.position.x = Math.max((this.dimensions.width - realImageWidth) / (2 * this.scaleZoom), 0);
    this.position.y = Math.max((this.dimensions.height - realImageHeight) / (2 * this.scaleZoom), 0);

    this.image.nativeElement.style.transform = `scale(${this.scaleZoom}) translate(${this.position.x}px, ${this.position.y}px)`;
    this.container.nativeElement.style.width = `${realImageWidth}px`;
    this.container.nativeElement.style.height = `${realImageHeight}px`;

  }

  /**
   * Animates to a certain scale (with ease)
   *
   * @param  {number} scale
   */
  private animateScale(scaleZoom:number) {
    this.scaleZoom += (scaleZoom - this.scaleZoom) / 5;

    if (Math.abs(this.scaleZoom - scaleZoom) <= 0.1) {
      this.scaleZoom = scaleZoom;
    }

    this.displayScale();

    if (Math.abs(this.scaleZoom - scaleZoom) > 0.1) {
      window.requestAnimationFrame(this.animateScale.bind(this, scaleZoom));
    }
  }

  ionViewDidLoad() {
    this.canvas = this.elRef.nativeElement.querySelector("#the-canvas");
    this.ctx = this.canvas.getContext('2d');
    // var url = JSON.parse(sessionStorage.getItem("commonData")).program == "OO" ?  Config.domain + '/pdf/tc/credit-card/cih_preapprove_oneoff_tnc.pdf' : Config.domain + '/pdf/tc/credit-card/cih_preapprove_tnc.pdf';
    // var url = 'assets/test.pdf';
    var url = this.navParams.get('pdfUrl');
    PDFJS.getDocument(url).then((_pdfDoc) =>{
      this.pdfDoc = _pdfDoc;
      this.renderPage(this.pageNum);
    });
  };

  clickEvent(ev) {
    let toPinch = this.elRef.nativeElement.querySelector(".base-canvas");
    toPinch.style.width = this.canvas.width * ev.scale + 'px';
  }
  renderPage(num) {
      // Using promise to fetch the page
    this.pdfDoc.getPage(num).then((page) =>{
      var viewport = page.getViewport(this.scale);
      this.canvas.height = viewport.height;
      this.canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: this.ctx,
        viewport: viewport
      };
      page.render(renderContext);
    });

    // Update page counters
    this.elRef.nativeElement.querySelector('#page_num').textContent = this.pageNum;
    this.elRef.nativeElement.querySelector('#page_count').textContent = this.pdfDoc.numPages;
  }

  goPrevious() {
    if (this.pageNum <= 1)
      return;
    this.pageNum--;
    this.renderPage(this.pageNum);
  }

  goNext() {
    if (this.pageNum >= this.pdfDoc.numPages)
      return;
    this.pageNum++;
    this.renderPage(this.pageNum);
  }

  backToPage() {
    this.navCtrl.pop();
  }
}
