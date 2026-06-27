import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import Translations from './compendium/data/translations.json';

@Component({
  selector: 'app-root',
  template: `
    <div [ngClass]="currentGame">
      <div style="width: 100%; max-width: 1080px; margin: 0 auto; display: flex; flex-direction: column;">
        <div style="display: flex; flex-wrap: wrap; width: 100%;">
          <div *ngFor="let link of msgs.HomeLink; index as i" 
              [routerLink]="link" 
              routerLinkActive="active" 
              style="flex: 1 1 120px; text-align: center; background-color: #1b1b1b; border: 1px solid #333; padding: 8px 4px; cursor: pointer;">
            <a [routerLink]="link" style="color: #66BBFF; text-decoration: none; font-weight: bold;">{{ msgs.Home[i] }}</a>
          </div>
          <div *ngFor="let link of otherLinks" 
              style="flex: 1 1 120px; text-align: center; background-color: #1b1b1b; border: 1px solid #333; padding: 8px 4px;">
            <a [attr.href]="link.link" style="color: #66BBFF; text-decoration: none; font-weight: bold;">{{ link.title | translateComp:lang }}</a>
          </div>
        </div>
        <div style="width: 100%; text-align: center; background-color: white; color: black; font-weight: bold; padding: 6px 0; border: 1px solid #333;">
          {{ msgs.AppTitle | translateComp:lang }}
        </div>
      </div>
      <h4 *ngIf="loading" style="text-align: center;">{{ msgs.NowLoading | translateComp:lang }}</h4>
      <ng-container *ngIf="!loading">
        <router-outlet></router-outlet>
      </ng-container>
      <div style="text-align: center;">
        <br>
        <a href="https://www.youtube.com/watch?v=b1KfNEPKncQ">
          https://www.youtube.com/watch?v=b1KfNEPKncQ
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  static readonly GAME_PREFIXES: { [game: string]: string } = {
    smtdsj: 'smtsj', smt5v: 'smt5', rrch: 'krch',
    p3f: 'p3', p3a: 'p3', p3p: 'p3', p3e: 'p3r', p4g: 'p4', p5r: 'p5',
    dso: 'ds1', ds2br: 'ds2'
  };

  msgs = Translations.AppComponent;
  otherLinks = [
    { title: this.msgs.SaveOffline, link: 'https://aqiu384.github.io/megaten-database/how-to-use#save-offline' },
    { title: this.msgs.Help, link: 'https://aqiu384.github.io/megaten-database/how-to-use' },
    { title: this.msgs.ReportIssue, link: 'https://github.com/aqiu384/megaten-fusion-tool/issues' }
  ];
  navWidth = Math.round(1000 / (this.msgs.HomeLink.length + this.otherLinks.length)) / 10 + '%';

  lang = 'en';
  currentGame = 'home';
  loading = false;

  constructor(private router: Router) { }

  ngOnInit() {
    const loadErrorMsg = document.getElementById('loadErrorMsg');
    if (loadErrorMsg) { loadErrorMsg.style.display = 'none'; }
    this.router.events.subscribe(v => this.interceptNavigation(v));
  }

  interceptNavigation(event: Event) {
    if (event instanceof NavigationStart) {
      this.loading = true;
    } else if (event instanceof NavigationEnd) {
      this.loading = false;
      const parts = event.url.split('/');
      this.lang = Translations.Languages.Languages.includes(parts[1]) ? parts[1] : 'en';
      const currentGame = this.lang === 'en' ? parts[1] : parts[2];
      this.currentGame = AppComponent.GAME_PREFIXES[currentGame] || currentGame;
      window.scrollTo(0, 0);
    } else if (
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      this.loading = false;
    }
  }
}
