console.log('main.ts is loaded');
import * as $ from 'jquery';
import 'bootstrap';
import swal from 'sweetalert2';


window['jQuery'] = $;
window['swal'] = swal;

swal({
    title: 'Success!',
    text: 'Sweet Alert 2 succesfully loaded!',
    type: 'success',
    confirmButtonText: 'Cool!'
});

var popover = document.createElement('span')
popover.innerHTML = 'I have a popover'
document.body.appendChild(popover)

$(popover).popover({ content: 'I am popover text' });

import './partials/app.ts';
import './partials/ejercicio-1.ts';
import './partials/ejercicio-2.ts';
import './partials/ejercicio-3.ts';