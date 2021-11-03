import {
  alert,
  notice,
  info,
  success,
  error,
  defaultModules,
} from '@pnotify/core';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

export default function showNotice(msg) {
  switch (msg.type) {
    case 'totalFind':
      alert({
        text: `${msg.data} images found according to your request`,
        type: 'success',
        delay: 2500,
      });
      break;

    case 'notFind':
      error({
        text: `No images found! \n Change your request`,
        type: 'error',
        delay: 1500,
      });
      break;

    case 'emptyQuerry':
      error({
        text: `Your querry is now empty!`,
        type: 'error',
        delay: 1500,
      });
      break;

    case 'pageNav':
      info({
        text: `${msg.data} pages`,
        type: 'info',
        delay: 1500,
      });
      break;

    case 'lastPage':
      notice({
        text: `${msg.data}`,
        type: 'notice',
        delay: 1500,
      });
      break;
  }
}
