import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import cardImage from '../assets/fishlogo.svg'
import { QUERY_THOUGHTS} from '../utils/queries';
import ThoughtList from '../components/ThoughtList';

const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive

  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className='hero'>
        <div data-aos="fade-right" className='mt-4'>
        <h1 className='text-yellow'>Draw</h1>
        <h2>and</h2>
        <h1 className='text-yellow'>Share</h1>
        <h2>with</h2>
        <h1 className='text-orange text-right'>Friends!</h1>
        <br></br>
        <h2>Start drawing...</h2>
        <div className='align-right-abs'>
        <Link to="/draw">
        <button className="btn col-12 col-md-3">
         Go!
        </button>
        </Link>
        </div>
        </div>
        <div className = 'heroimg mt-2 mr-1' data-aos="fade-left"></div>
      </div>
      <div className = 'heroborder'></div>
      <div className="mx-1 my-5">
      <h1 id="about" data-aos="fade-up" className='text-center mb-4'>What is Drawfish?</h1>
  
      <img data-aos="fade-right" src={cardImage} className="left abt-image"alt="cover" />
      <h3 data-aos="fade-left">Collaborative drawing, and a place to share work!</h3>
        <p data-aos="fade-left">Drawfish allows users to draw together in real time, and share their work to other users as a community. 
        </p>
  
      </div>
      <br></br>
      <h3 data-aos="fade-left">Latest Posts!</h3>
      <p data-aos="fade-left">Check out the latest drawings submitted by Drawfish users! 
        </p>
      <div className="flex-row justify-space-between" data-aos="zoom-in">
          <div className={`col-12 mb-3`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title=" " />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
