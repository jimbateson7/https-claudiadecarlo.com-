import Splide from '@splidejs/splide';

document.addEventListener( 'DOMContentLoaded', function() {
    var elms = document.getElementsByClassName( 'splide' );

    for ( var i = 0; i < elms.length; i++ ) {
        new Splide( elms[ i ] ).mount();        
    }
});
