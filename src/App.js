import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import AddUserForm from './AddUserForm';

import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
Amplify.configure(aws_exports);

const GET_USERS = gql`
  {
    listUsers{
      items{
        userName
      }
    }
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
  }
  signOut() {
    Auth.signOut({ global: true }).then(data => console.log(data)).catch(err => console.log(err));
  }
  logUser() {
    Auth.currentAuthenticatedUser({
  bypassCache: false}).then(user => console.log(user)).catch(err => console.log(err))
  }
  render() {
    console.log(this.props)
    return (
      <div>
      <Query query={GET_USERS}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          console.log(data)
          return (
            <div>
              <select>
                {data.listUsers.items.map(item => (
                  <option key={item.userName} value={item.userName}>
                    {item.userName}
                  </option>
                ))}
              </select>
            </div>
          );
        }}
      </Query>
      <AddUserForm />
      <br/>
      <button type="button" onClick={() => this.signOut()}>Sign Out</button>
      <button onClick={() => this.logUser()}>Log user</button>
    </div>
    );
  }
}

export default withAuthenticator(App);
