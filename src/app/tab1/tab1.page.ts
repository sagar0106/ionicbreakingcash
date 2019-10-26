import { Component } from '@angular/core';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  animations: [

    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true}),

        query(':leave', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 1, transform: 'translateY(0)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 0, transform: 'translateY(-75%)',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])

  ]
})
export class Tab1Page {
  item = {};
  allItems: any[] = [];
  amount;
  value = 0;
  showErrMsg;
  showErrMsgValid;
  denominations = [2000, 500, 200, 100, 50, 20, 10];
  newDenomination;
  denominationExists = false;
  filterType = {
    showDenominationPopup : false,
    showFilterBody : false,
  };
  // #077696

  addItem() {
    this.showErrMsg = '';
    if (this.checkOverFlow()) {
      return;
    }
    this.value += this.item['denomination'] * this.item['total'];
    if (this.matchFound(this.item['denomination']) > -1) {
      this.allItems[this.matchFound(this.item['denomination'])].total += this.item['total'];
    } else {
      this.allItems.push(this.item);
    }
    this.item = {};
  }

  matchFound(denomination) {
    return this.allItems.findIndex((item) => {
      return item.denomination == denomination;
    });
  }

  checkOverFlow() {
     if (this.value + (this.item['denomination'] * this.item['total']) > this.amount) {
      this.showErrMsg = 'Value is exceeding the amount.';
      return true;
     }
     return false;
  }

  checkIfValid() {
      if (this.amount < this.value) {
      this.showErrMsgValid = 'Amount cannot be less than value.';
      return;
     }
     this.showErrMsgValid = '';
     return;
  }

  removeItem(index) {
   const deletedItem = this.allItems.splice(index, 1);
   this.value -= deletedItem[0]['denomination'] * deletedItem[0]['total'];
  }

  breakMyCash() {
    if (this.allItems.length) {
      let amtToBreak = this.amount - this.value;
      this.denominations.forEach(denomination => {
        if (amtToBreak > 0 && this.matchFound(denomination) === -1) {
          this.prepareItems(amtToBreak, denomination);
          amtToBreak = amtToBreak % denomination;
        }
      });
    } else {
      this.allItems = [];
      this.value = 0;
      let amtToBreak = this.amount;
      this.denominations.forEach(denomination => {
        if (amtToBreak > 0) {
          this.prepareItems(amtToBreak, denomination);
          amtToBreak = amtToBreak % denomination;
        }
      });
    }
  }

  prepareItems(amtToBreak, denomination) {
    let total;
    total = (amtToBreak / denomination);
    this.item['denomination'] = denomination;
    this.item['total'] = Math.floor(total);
    this.addItem();
  }

  checkDenominationExists() {
    const denominationFound = this.denominations.indexOf(this.newDenomination);
    if (denominationFound > -1) {
      this.denominationExists = true;
    } else {
      this.denominationExists = false;
    }
  }
  addDenomination() {
    this.denominations.push(this.newDenomination);
    this.newDenomination = '';
    this.denominationExists = false;
  }
  removeDenomination() {
    this.denominations.splice(this.denominations.indexOf(this.newDenomination), 1);
    this.newDenomination = '';
    this.denominationExists = false;
  }

  showHidePopup() {
    this.filterType.showDenominationPopup = !this.filterType.showDenominationPopup;
    this.filterType.showFilterBody = !this.filterType.showFilterBody;
  }

  clearAll() {
    this.item = {};
    this.allItems = [];
    this.value = 0;
    this.amount = '';
    this.showErrMsg = '';
    this.showErrMsgValid = '';
    this.newDenomination = '';
    this.denominationExists = false;
  }

}
