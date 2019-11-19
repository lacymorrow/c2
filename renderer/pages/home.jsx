import electron, {ipcRenderer} from 'electron';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
  const [message, setMessage] = useState('no ipc message');

  const onClickWithIpc = () => {
    if (ipcRenderer) {
			console.log('messaging worker...')
      ipcRenderer.send('for-worker', 'message to worker');
    }
  };

  useEffect(() => {
    // componentDidMount()
    if (ipcRenderer) {
      // register ipc events
      ipcRenderer.on('to-renderer', (event, arg) => {
				console.log(arg)
				setMessage(arg)
			});

    }

    return () => {
      // componentWillUnmount()
      if (ipcRenderer) {
        // unregister it
        ipcRenderer.removeAllListeners('to-renderer');
      }
    };
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (ipc-communication)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/next">
            <a>Go to next page</a>
          </Link>
        </p>
        <img src="/static/logo.png" />
        <hr />
        <button onClick={onClickWithIpc}>IPC messaging</button>
        <p>{message}</p>
      </div>
    </React.Fragment>
  );
};

export default Home;
