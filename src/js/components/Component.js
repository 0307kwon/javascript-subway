import { ID_SELECTOR } from '../constants.js';
import $ from '../utils/querySelector.js';
import State from './State.js';

class Component {
  //TODO: props와 state 나누기
  constructor(props) {
    // TODO: 객체 예외처리 생각해보기
    this.props = props;
  }

  initEvent() {}

  render({ TITLE, MAIN, MODAL }) {
    $('title').innerHTML = TITLE;
    $(`#${ID_SELECTOR.MAIN}`).innerHTML = MAIN;
    $(`#${ID_SELECTOR.MODAL}`).innerHTML = MODAL ? MODAL : '';
  }

  _onAnchorClicked = event => {
    event.preventDefault();
    const anchor = event.target.closest('a');
    if (!anchor) {
      return;
    }
    const path = anchor.getAttribute('href');
    const route = this.props?.route || this.route;

    route(path);
  };
}

export default Component;
