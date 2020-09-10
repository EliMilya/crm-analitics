import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {MaterialInstance, MaterialService} from '../shared/classes/material.service';
import {OrderService} from './order.service';
import {Order, OrderPosition} from '../shared/interfaces';
import {OrdersService} from '../shared/services/orders.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  isRoot: boolean;
  pending = false;
  oSub: Subscription;

  constructor(private router: Router,
              private orderService: OrderService,
              private ordersService: OrdersService) {
  }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  openModal() {
    this.modal.open();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.pending = true;
    const order: Order = {
      list: this.orderService.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.oSub = this.ordersService.create(order).subscribe(
      newOrder => {
        MaterialService.toast('Order was added');
        this.orderService.clear();
      }, error => {
        MaterialService.toast(error.error.message);
      },
      () => {
        this.modal.close();
        this.pending = false;
      }
    );
  }

  removePosition(item: OrderPosition) {
    this.orderService.remove(item);
  }
}