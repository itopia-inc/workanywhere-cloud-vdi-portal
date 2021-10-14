import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rd-web-client',
  templateUrl: './rd-web-client.component.html',
  styleUrls: ['./rd-web-client.component.scss']
})
export class RdWebClientComponent implements OnInit {
  @Input()
  webClientUrl: string;
  constructor() { }

  ngOnInit(): void {
  }

}
