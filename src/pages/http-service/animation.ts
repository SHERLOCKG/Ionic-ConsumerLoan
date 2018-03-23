import {trigger, state, style, transition, animate, keyframes} from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
    state('in', style({ display: 'none' })),
    transition('void => *', [
        animate(200,keyframes([
            style({transform:'scale(0)',opacity: 0}),
            style({transform:'scale(1.2)',opacity: 1}),
            style({transform:'scale(1)',opacity: 1}),
        ]))
    ]),
    transition('* => void', [
        animate(200, keyframes([
            style({transform:'scale(1)',opacity: 1}),
            style({transform:'scale(0)',opacity: 0}),
        ]))
    ]),
]);
