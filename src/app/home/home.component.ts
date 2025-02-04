  import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
  import { RouterModule } from '@angular/router';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { CommonModule } from '@angular/common';



  interface CircleElement extends HTMLElement {
    x: number;
    y: number;
  }

  @Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
  })
  export class HomeComponent implements OnInit {


    ngOnInit(): void {
      gsap.registerPlugin(ScrollTrigger);
      this.animateElements();
    }

    animateElements(): void {
      gsap.from('.logo', { opacity: 0, y: -50, duration: 1, delay: 0.5 });
      gsap.from('.newbutns', { opacity: 0, x: 50, duration: 1,delay: 1 });
      gsap.from('.f12t', { scrollTrigger:'.f12t' , opacity: 0, x: -50, duration: 1, delay: 2 });
      gsap.from('.f12btn', { opacity: 0, x: -50, duration: 2, delay: 3 });
      gsap.from('.secondDiv', { opacity: 0, y: 50, duration: 1, delay: 1.5 });
      gsap.from('.secureStorage', { opacity: 0, y: 50, stagger: 0.2, duration: 1, delay: 1.8 });
      gsap.from('.thirdDiv', { opacity: 0, y: 50, duration: 1, delay: 2 });
      gsap.from('.summerMemories', { opacity: 0, y: 50, stagger: 0.2, duration: 1,
        scrollTrigger: {
          trigger: '.summerMemories',
          start: 'top 80%',
          end: 'bottom 20%',
        },
      });

      gsap.from('.footer-links a', {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 1,
        scrollTrigger: {
          trigger: '.end',
          start: 'top 100%',
        },
      });
    }


    @ViewChild('thirdDiv') thirdDiv!: ElementRef;

    scrollToCapsules() {
      if(this.thirdDiv) {
        this.thirdDiv.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start' });
      }
    }


  }
