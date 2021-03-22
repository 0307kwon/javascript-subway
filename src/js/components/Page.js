import Component from './Component';

class Page extends Component {
  url;
  initialUrl;

  constructor(props) {
    super(props);
    this.initialUrl = window.location.origin;
  }

  initialRoute(path) {
    history.replaceState({ path: this.initialUrl + '/' }, null, '/');
    this.route(path, false);
  }

  route = (path, shouldPushState = true) => {
    if (!this.url) {
      alert('Page 인스턴스에 url이 정의되어 있지 않습니다.');
    }

    if (shouldPushState) {
      const actualPath = this.initialUrl + path;
      history.pushState({ path: actualPath }, null, actualPath);
    }

    this.url[path].render();
    this.url[path].initEvent();
  };
}

export default Page;
