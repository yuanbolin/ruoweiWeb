import React from 'react';
import { Redirect } from 'umi';
import PageLoading from '@/components/PageLoading';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;

    // if ((!currentUser.userid && loading) || !isReady) {
    //   return <PageLoading />;
    // }

    // if (!currentUser.userid) {
    //   return <Redirect to="/user/login"></Redirect>;
    // }

    return children;
  }
}

export default SecurityLayout;
