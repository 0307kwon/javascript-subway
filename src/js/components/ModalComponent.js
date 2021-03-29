import Component from './Component';
import { fetchLineCreation, fetchLineRevision } from '../utils/fetch.js';
import { ID_SELECTOR, KEYWORD, REQUEST_URL } from '../constants';
import $ from '../utils/querySelector.js';
import { closeModal } from '../utils/DOM';
import { loadLineList } from '../utils/loadByAJAX';
import State from './State.js';
import LINE_TEMPLATE from '../templates/lineTemplate';

export class ModalComponent extends Component {
  modalState;

  constructor(props) {
    super(props);
  }

  initState() {
    this.modalState = new State(KEYWORD.CREATION);
  }

  initStateListener() {
    this.modalState.setListener(this.handleModalTemplateToChange);
  }

  initEvent() {
    $(`#${ID_SELECTOR.MODAL}`).addEventListener('submit', event => {
      event.preventDefault();

      if (event.target.id !== ID_SELECTOR.LINE_MODAL_FORM) {
        return;
      }

      if (this.modalState.Data === KEYWORD.CREATION) {
        this.#createLine(event);
        return;
      }

      if (this.modalState.Data === KEYWORD.REVISION) {
        this.#revisionLine(event);
        return;
      }
    });
  }

  handleModalTemplateToChange = modalState => {
    if (modalState === KEYWORD.CREATION) {
      $(`#${ID_SELECTOR.MODAL}`).innerHTML = LINE_TEMPLATE.MODAL;
      return;
    }

    if (modalState === KEYWORD.REVISION) {
      $(`#${ID_SELECTOR.MODAL}`).innerHTML =
        LINE_TEMPLATE.REVISION_MODAL_COMPONENT;

      return;
    }

    console.error(
      `유효한 modal keyword가 아닙니다. (modalState: ${modalState})`
    );
  };

  #createLine = async event => {
    const lineName = event.target[ID_SELECTOR.LINE_MODAL_FORM_NAME].value;
    const upStationId =
      event.target[ID_SELECTOR.LINE_MODAL_FORM_UP_STATION].value;
    const downStationId =
      event.target[ID_SELECTOR.LINE_MODAL_FORM_DOWN_STATION].value;
    const distance = event.target[ID_SELECTOR.LINE_MODAL_FORM_DISTANCE].value;
    const duration = event.target[ID_SELECTOR.LINE_MODAL_FORM_DURATION].value;
    const color = event.target[ID_SELECTOR.LINE_MODAL_FORM_COLOR].value;

    const url = REQUEST_URL + '/lines';
    const bodyData = {
      name: lineName,
      color,
      upStationId,
      downStationId,
      distance,
      duration,
    };
    const accessToken = this.props.accessTokenState.Data;

    // TODO: try - catch 부분 loadByAJAX로 추출하기
    try {
      const response = await fetchLineCreation(url, {
        bodyData,
        accessToken,
      });

      //TODO:스낵바로 확인
      alert('노선 추가 완료');

      const { id, name, color } = await response.json();
      const lines = this.props.linesState.Data;

      // TODO: State 클래스에 pushData 만들기
      lines.push({ id, name, color });
      this.props.linesState.Data = lines;
      closeModal();
      this.#clearModalInput();
    } catch (err) {
      alert(err.message);
      return;
    }
  };

  #revisionLine = async event => {
    const id = $(`.${ID_SELECTOR.MODAL}`).dataset.id;
    const lineName = event.target[ID_SELECTOR.LINE_MODAL_FORM_NAME].value;
    const color = event.target[ID_SELECTOR.LINE_MODAL_FORM_COLOR].value;

    const url = REQUEST_URL + `/lines/${id}`;
    const bodyData = {
      name: lineName,
      color,
    };
    const accessToken = this.props.accessTokenState.Data;

    // TODO: try - catch 부분 loadByAJAX로 추출하기
    try {
      await fetchLineRevision(url, {
        bodyData,
        accessToken,
      });

      //TODO:스낵바로 확인
      alert('노선 수정 완료');

      loadLineList(this.props.linesState, this.props.accessTokenState.Data);
      closeModal();
    } catch (err) {
      alert(err.message);
      return;
    }
  };

  #clearModalInput() {
    $(`#${ID_SELECTOR.LINE_MODAL_FORM_NAME}`).value = '';
    $(`#${ID_SELECTOR.LINE_MODAL_FORM_DISTANCE}`).value = '';
    $(`#${ID_SELECTOR.LINE_MODAL_FORM_DURATION}`).value = '';
    $(`#${ID_SELECTOR.LINE_MODAL_FORM_COLOR}`).value = '';
  }
}
