import { add } from './utils/util';
import _ from 'lodash';
import './style/index.css';

console.log('a simple example');
console.log(`10 + 9 = ${add(10, 9)}`);

const init = () => {
    const button = document.querySelector('button');
    console.log(button)
    console.log(_.join([1], 2))

    // button.onclick = () => import(/* webpackChunkName: 'print' */ './print').then(module => {
    //     console.log('ss')
    // })
}

init();