import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'header-step',
  templateUrl: 'step.html'
})
export class HeaderStep {
    stepNo: Array<number> = [1, 2, 3, 4, 5, 6];
    @Input() step;
    @Input() finish: boolean = false;
    @Input() isHalf: boolean = false;
    @Input() isStep: boolean = true;
  constructor(public navCtrl: NavController) {
  }
  goBack(idx) {
    
    if (idx < this.navCtrl.getViews().length && idx != this.step)
        this.navCtrl.popTo(this.navCtrl.getByIndex(idx));
  }
}