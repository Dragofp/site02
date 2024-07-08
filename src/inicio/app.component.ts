import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Pagina01} from "../pagina01/pagina01.component";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import 'reflect-metadata';

@Component({
  selector: 'inicio',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Pagina01],
  providers: [CommonModule,BrowserModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'site03';
}
