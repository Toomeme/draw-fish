import React, { Component } from "react";

export default class UserList extends Component {
	render() {
		let userList = this.props.userList.map((user) => {
			return (
				<span key={user.id} className = 'text-dark'>
					
					{user.username}
				</span>
			);
		});
		return <div data-aos="fade-right">{userList}</div>;
	}
}