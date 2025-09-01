import Layout from '../src/components/Layout';
import MainInput from '../src/components/form/MainInput';
import {fetchRemoteJsonAction, parseLocalJsonAction} from './actions';

export const metadata = {
  title: 'EzBudget',
  description: 'Add income / expense'
};

export default function HomePage() {
  return (
    <Layout>
      <a style={{display: 'none'}} rel="me" href="https://mastodon.social/@luca00">Mastodon</a>
      <MainInput remoteAction={fetchRemoteJsonAction} localAction={parseLocalJsonAction} />
    </Layout>
  );
}


