import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import fetch from 'isomorphic-fetch';
import { Notification } from 'react-notification';

import EventDetailsComponent from '../components/EventDetailsComponent';
import { checkStatus, parseJSON } from '../util/fetch.util';
import LoginModal from '../components/login';
import styles from '../styles/event-card.css';
import { isAuthenticated } from '../util/auth';

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      notificationMessage: '',
      notificationIsActive: false,
      user: null,
    };
  }

  async componentWillMount() {
    const response = await fetch(`/api/events/${this.props.params.uid}`, {
      credentials: 'same-origin',
    });
    let event;
    let user;
    try {
      checkStatus(response);
      event = await parseJSON(response);
      user = await isAuthenticated();
    } catch (err) {
      console.log('err at componentWillMount EventDetail', err);
      this.setState({
        notificationIsActive: true,
        notificationMessage: 'Failed to load event. Please try again later.',
      });
      return;
    }
    this.setState({ event, user });
  }

  render() {
    if (this.state.event) {
      return <EventDetailsComponent event={this.state.event} />;
    } else if (!this.state.user) {
      return <LoginModal />
    }
    return (
      <Notification
        isActive={this.state.notificationIsActive}
        message={this.state.notificationMessage}
        action="Dismiss"
        title="Error!"
        onDismiss={() => this.setState({ notificationIsActive: false })}
        onClick={() => this.setState({ notificationIsActive: false })}
        activeClassName="notification-bar-is-active"
        dismissAfter={10000}
      />
    );
  }
}

EventDetails.propTypes = {
  params: React.PropTypes.object,
};

export default cssModules(EventDetails, styles);
