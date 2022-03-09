import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className=" mb-5 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h2 className='mt-3 text-dark'>DRAWFISH</h2>
        </Link>
      </div>
    </header>
  );
};

export default Header;
