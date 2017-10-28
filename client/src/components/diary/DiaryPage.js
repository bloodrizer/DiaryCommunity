import React from 'react';
import EntryList from './EntryList';
import EntryForm from './EntryForm';
import * as actions from '../../actions';
import Menu from './Menu';
import { connect } from 'react-redux';
import axios from 'axios';

class DiaryApp extends React.Component {
  state = {
    view: 'entries',
  };

  componentDidMount = () => {
    console.log(this.props.match.params.uri);
    actions.fetchEntries(this.props.match.params.uri);
    //await axios.post(`/api/entries/${this.props.match.params.uri}`, entryData);
  };

  addEntry = () => {
    console.log('add entry');
    this.setState({ view: 'edit' });
  };

  submitEntry = async entryData => {
    await axios.post(`/api/entries/${this.props.match.params.uri}`, entryData);
    actions.fetchEntries(this.props.match.params.uri);
    this.setState({ view: 'entries' });
  };

  showEntries = () => {
    console.log('showEntries');
    this.setState({ view: 'entries' });
  };

  render() {
    // check what we asked to show

    // check what we have in the store

    // depending on that display different stuff

    return (
      <div>
        <div className="row">
          <Menu addEntry={this.addEntry} />
          {this.state.view === 'entries' && <EntryList entries={this.props.entries} />}
          {this.state.view === 'edit' && <EntryForm onSubmit={this.submitEntry} onCancel={this.showEntries} />}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth ? state.auth.current : null,
    entries: state.entries,
  };
}

export default connect(mapStateToProps, actions)(DiaryApp);
