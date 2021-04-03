import $ from '../utils/querySelector.js';
import HomeComponent from '../components/HomeComponent.js';
import StationComponent from '../components/StationComponent.js';
import LineComponent from '../components/LineComponent.js';
import LoginComponent from '../components/LoginComponent.js';
import SignupComponent from '../components/SignupComponent.js';
import MyInfoComponent from '../components/MyInfoComponent.js';
import Page from './Page.js';
import State from '../State.js';
import { CLASS_SELECTOR, ID_SELECTOR, KEYWORD, URL } from '../constants.js';
import { show, hide, closeModal } from '../utils/DOM.js';
import { loadStationList, loadLineList } from '../utils/loadByAJAX.js';
import SectionComponent from '../components/SectionComponent.js';
import FullMapComponent from '../components/FullMapComponent.js';

class AppPage extends Page {
  constructor(props) {
    super(props);
  }

  initState() {
    this.accessTokenState = new State(KEYWORD.LOGOUT);
    this.stationsState = new State([]);
    this.linesState = new State([]);
  }

  initStateListener() {
    this.accessTokenState.initListener();
    this.stationsState.initListener();
    this.linesState.initListener();
    this.accessTokenState.setListener(this.handleUserDataToInit);
    this.accessTokenState.setListener(this.handleNavButtonToChange);
    this.accessTokenState.setListener(this.handlePageToRedirect);
  }

  initRouter() {
    this._router = {
      [URL.HOME]: new HomeComponent(),
      [URL.STATION]: new StationComponent({
        accessTokenState: this.accessTokenState,
        stationsState: this.stationsState,
      }),
      [URL.LINE]: new LineComponent({
        accessTokenState: this.accessTokenState,
        stationsState: this.stationsState,
        linesState: this.linesState,
      }),
      [URL.LOGIN]: new LoginComponent({
        route: this.route,
        accessTokenState: this.accessTokenState,
      }),
      [URL.SIGNUP]: new SignupComponent({ route: this.route }),
      [URL.MY_INFO]: new MyInfoComponent({
        accessTokenState: this.accessTokenState,
      }),
      [URL.SECTION]: new SectionComponent({
        accessTokenState: this.accessTokenState,
        linesState: this.linesState,
        stationsState: this.stationsState,
      }),
      [URL.FULL_MAP]: new FullMapComponent({
        accessTokenState: this.accessTokenState,
      }),
    };
  }

  initEvent() {
    window.addEventListener('popstate', e => {
      const path = e.state.path.replace(/.+\/\/[^\/]+/g, '');

      this.route(path, false);
    });

    $('header').addEventListener('click', this._onAnchorClicked);

    $(`#${ID_SELECTOR.NAV_LOGOUT}`).addEventListener('click', this.#onLogout);

    $(`#${ID_SELECTOR.MODAL}`).addEventListener('click', ({ target }) => {
      if (!target.closest(`.${CLASS_SELECTOR.MODAL_CLOSE}`)) return;

      closeModal();
    });
  }

  handleUserDataToInit = accessToken => {
    const isLogout = accessToken === KEYWORD.LOGOUT;

    if (isLogout) {
      this.initStateListener();

      return;
    }

    loadStationList(this.stationsState, this.accessTokenState.Data);
    loadLineList(this.linesState, this.accessTokenState.Data);
  };

  handleNavButtonToChange = accessToken => {
    const isLogout = accessToken === KEYWORD.LOGOUT;

    if (isLogout) {
      this.#renderGuestNavBar();

      return;
    }

    this.#renderUserNavBar();
  };

  handlePageToRedirect = accessToken => {
    const isLogout = accessToken === KEYWORD.LOGOUT;

    if (isLogout) {
      this.route(URL.LOGIN);

      return;
    }

    this.route(URL.HOME);
  };

  #onLogout = () => {
    this.accessTokenState.Data = KEYWORD.LOGOUT;
  };

  #renderUserNavBar() {
    show(`#${ID_SELECTOR.NAV_LINE}`);
    show(`#${ID_SELECTOR.NAV_STATION}`);
    show(`#${ID_SELECTOR.NAV_SECTION}`);
    show(`#${ID_SELECTOR.NAV_FULL_MAP}`);
    show(`#${ID_SELECTOR.NAV_SEARCH}`);
    show(`#${ID_SELECTOR.NAV_MY_INFO}`);
    show(`#${ID_SELECTOR.NAV_LOGOUT}`);

    hide(`#${ID_SELECTOR.NAV_LOGIN}`);
  }

  #renderGuestNavBar() {
    hide(`#${ID_SELECTOR.NAV_LINE}`);
    hide(`#${ID_SELECTOR.NAV_STATION}`);
    hide(`#${ID_SELECTOR.NAV_SECTION}`);
    hide(`#${ID_SELECTOR.NAV_FULL_MAP}`);
    hide(`#${ID_SELECTOR.NAV_SEARCH}`);
    hide(`#${ID_SELECTOR.NAV_MY_INFO}`);
    hide(`#${ID_SELECTOR.NAV_LOGOUT}`);

    show(`#${ID_SELECTOR.NAV_LOGIN}`);
  }
}

export default AppPage;
