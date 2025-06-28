import Splide from '@splidejs/splide';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

// Instantiate Splide for all elements with the class 'splide'

document.addEventListener( 'DOMContentLoaded', function() {
    var elms = document.getElementsByClassName( 'splide' );

    for ( var i = 0; i < elms.length; i++ ) {
        new Splide( elms[ i ] ).mount();        
    }
});

// GSAP Animations

// Home hero avatar decoration
if (document.querySelector('.js-avatar-decoration')) {
    gsap.to('.js-avatar-decoration', {
        duration: 1,
        opacity: 0.25, 
        delay: 0.15,
        ease: 'sine.out',
        y: -20
    });

    document.querySelectorAll('.js-avatar-decoration__line').forEach(function() {
        gsap.to('.js-avatar-decoration__line', {
            duration: 0.75, 
            opacity: 1,  
            stagger: 0.1,
            ease: 'back.in'
        });
    });
}

// Animate the footer decoration
const footerPath = document.querySelector('.js-footer-decoration');

if (footerPath) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    });
  
    gsap.set(footerPath, {
      drawSVG: '0%',
      y: 200,
      fill: 'transparent',
      transformOrigin: 'bottom'
    });
  
    tl.to(footerPath, {
      drawSVG: '100%',
      y: 0,
      duration: 2.5,
      ease: 'power2.out'
    });

    tl.to(footerPath, {
      fill: 'var(--color-brand-yellow)',
      duration: 1,
      ease: 'power2.out'
    }, '+=0.15');
}

// My approach

if (document.querySelector('.js-pillar-decoration')) {
gsap.fromTo('.js-pillar-decoration',
    {
      opacity: 0,
      x: 40
    },
    {
      opacity: 1,
      x: 80,
      duration: 1,
      stagger: 0.3,
      scrollTrigger: {
        trigger: '.js-pillars',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    }
  );
}
