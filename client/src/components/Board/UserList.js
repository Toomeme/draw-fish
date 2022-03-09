import React, { Component } from "react";

export default class UserList extends Component {
	render() {
		let userList = this.props.userList.map((user) => {
			return (
				<span key={user.id} className = 'text-dark'>
					<h3>Users:</h3>
					{user.username}
				</span>
			);
		});
		return <div data-aos="fade-right" className="user-list">{userList}</div>;
	}
}