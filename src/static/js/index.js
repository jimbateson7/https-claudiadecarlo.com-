import Splide from '@splidejs/splide';
import { gsap } from 'gsap';

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
        delay: 0.25,
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
