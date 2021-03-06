import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '@app/auth';
import { UntilDestroy, untilDestroyed } from '@core';
import screenfull, { Screenfull } from 'screenfull';
import o9n from 'o9n';

@UntilDestroy()
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  location: Location;
  mobileMenuVisible: any = 0;
  public isCollapsed = true;
  public toggleScreenClass = 'fa-expand';
  private toggleButton: any;

  private sidebarVisible: boolean;
  private screenfull: Screenfull;
  private orientation: ScreenOrientation;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private i18nService: I18nService
  ) {
    this.location = location;
    this.sidebarVisible = false;
    this.screenfull = screenfull as Screenfull;
    this.orientation = o9n.getOrientation();
  }

  async toggleFullscreen() {
    try {
      this.screenfull.toggle();
    } catch (err) {
      alert(err);
    }
    if (window.isMobile()) {
      await this.orientation.lock('portrait');
    }
  }

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.pipe(untilDestroyed(this)).subscribe((event) => {
      this.sidebarClose();
      const $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
        this.mobileMenuVisible = 0;
      }
    });

    this.screenfull.onchange(
      () => (this.toggleScreenClass = this.screenfull.isFullscreen ? 'fa-compress' : 'fa-expand')
    );
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];

    if (!this.isCollapsed) {
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.remove('bg-white');
    }
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const mainPanel = document.getElementsByClassName('main-panel')[0] as HTMLElement;
    const html = document.getElementsByTagName('html')[0];
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }

    setTimeout(() => toggleButton.classList.add('toggled'), 500);

    html.classList.add('nav-open');
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    this.toggleButton.classList.remove('toggled');
    const mainPanel = document.getElementsByClassName('main-panel')[0] as HTMLElement;

    if (window.innerWidth < 991) {
      setTimeout(() => (mainPanel.style.position = ''), 500);
    }
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  }

  sidebarToggle() {
    let $layer: HTMLElement;
    const $toggle = document.getElementsByClassName('navbar-toggler')[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const html = document.getElementsByTagName('html')[0];

    if (this.mobileMenuVisible === 1) {
      html.classList.remove('nav-open');
      if ($layer) {
        $layer.remove();
      }
      setTimeout(() => $toggle.classList.remove('toggled'), 400);

      this.mobileMenuVisible = 0;
    } else {
      setTimeout(() => $toggle.classList.add('toggled'), 430);

      $layer = document.createElement('div');
      $layer.setAttribute('class', 'close-layer');

      if (html.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      } else if (html.classList.contains('off-canvas-sidebar')) {
        document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
      }

      setTimeout(() => $layer.classList.add('visible'), 100);

      // assign a function
      $layer.onclick = function () {
        html.classList.remove('nav-open');
        this.mobileMenuVisible = 0;
        $layer.classList.remove('visible');
        setTimeout(() => {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      }.bind(this);

      html.classList.add('nav-open');
      this.mobileMenuVisible = 1;
    }
  }

  getTitle() {
    return this.titleService.getTitle();
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }
}
