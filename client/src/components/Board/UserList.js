import React from "react";

const UserList = (props) => {
  const userList = props.userList.map((user) => {
    return (
      <span key={user.id} className='text-dark'>
        {user.username}
      </span>
    );
  });
  return <div data-aos="fade-right">{userList}</div>;
};

export default UserList;
