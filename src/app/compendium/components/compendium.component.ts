import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { PositionEdgesService } from '../../shared/position-edges.service';
import { PositionStickyDirective } from '../../shared/position-sticky.directive';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-demon-compendium-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="3 + otherLinks.length + (hasSettings ? 1 : 0); let hlength"
      style="margin-left: auto; margin-right: auto; width: 100%; max-width: 1080px; display: flex; flex-direction: column;">
      <div style="display: flex; flex-wrap: wrap; width: 100%;">
        <div class="nav" routerLinkActive="active"
          [routerLink]="mainList + 's'"
          [routerLinkActiveOptions]="{ exact: true }"
          style="flex: 1 1 120px; text-align: center; cursor: pointer; border: 1px solid #333; background-color: #1b1b1b; padding: 8px 4px;">
          <a [routerLink]="mainList + 's'">
            {{ (mainList === 'demon' ? msgs.DemonList : msgs.PersonaList) | translateComp:lang }}
          </a>
        </div>
        <div class="nav" routerLink="skills" routerLinkActive="active" style="flex: 1 1 120px; text-align: center; cursor: pointer; border: 1px solid #333; background-color: #1b1b1b; padding: 8px 4px;">
          <a routerLink="skills">
            {{ msgs.SkillList | translateComp:lang }}
          </a>
        </div>
        <div class="nav" routerLink="chart" routerLinkActive="active" style="flex: 1 1 120px; text-align: center; cursor: pointer; border: 1px solid #333; background-color: #1b1b1b; padding: 8px 4px;">
          <a routerLink="chart">
            {{ msgs.FusionChart | translateComp:lang }}
          </a>
        </div>
        <div *ngFor="let l of otherLinks" class="nav" routerLinkActive="active"
          [routerLink]="l.link"
          [routerLinkActiveOptions]="{ exact: true }"
          style="flex: 1 1 120px; text-align: center; cursor: pointer; border: 1px solid #333; background-color: #1b1b1b; padding: 8px 4px;">
          <a [routerLink]="l.link">
            {{ l.title }}
          </a>
        </div>
        <div *ngIf="hasSettings" class="nav" routerLink="settings" routerLinkActive="active" style="flex: 1 1 120px; text-align: center; cursor: pointer; border: 1px solid #333; background-color: #1b1b1b; padding: 8px 4px;">
          <a routerLink="settings">
            {{ msgs.FusionSettings | translateComp:lang }}
          </a>
        </div>
      </div>
      <div class="title" style="width: 100%; text-align: center; background-color: #E53935; color: white; font-weight: bold; padding: 6px 0; border: 1px solid #333;">
        {{ appName }}{{ msgs.FusionCalculator | translateComp:lang }}
      </div>
    </div>
  `,
})
export class CompendiumHeaderComponent {
  @Input() appName = 'Shin Megami Tensei';
  @Input() mainList = 'demon';
  @Input() hasSettings = true;
  @Input() lang = 'en';
  @Input() otherLinks: { title: string; link: string }[] = [];
  msgs = Translations.CompendiumComponent;
}

@Component({
  selector: 'app-demon-compendium',
  providers: [PositionEdgesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '100%', maxWidth: isChart ? 'none' : '1080px' }">
      <div *ngIf="!isChart" appPositionSticky>
        <app-demon-compendium-header appPositionSticky
          [appName]="appName"
          [mainList]="mainList"
          [hasSettings]="hasSettings"
          [lang]="lang"
          [otherLinks]="otherLinks">
        </app-demon-compendium-header>
      </div>
      <div *ngIf="isChart">
        <app-demon-compendium-header appPositionSticky
          [appName]="appName"
          [mainList]="mainList"
          [hasSettings]="hasSettings"
          [lang]="lang"
          [otherLinks]="otherLinks">
        </app-demon-compendium-header>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class CompendiumComponent implements OnInit, OnDestroy {
  appName: string;
  isChart: boolean;
  lang: string;
  subscriptions: Subscription[] = [];

  @ViewChild(PositionStickyDirective) stickyTable: PositionStickyDirective;
  @Input() mainList = 'demon';
  @Input() hasSettings = true;
  @Input() otherLinks: { title: string; link: string }[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptions.push(
      this.route.data.subscribe(data => {
        this.appName = data.appName || 'Shin Megami Tensei';
        this.isChart = data.fusionTool === 'chart';
        this.lang = data.lang;
      }));

    setTimeout(() => this.stickyTable.nextEdges());
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
