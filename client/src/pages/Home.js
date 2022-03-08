import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import cardImage from '../assets/roulette.svg'
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
        <div className='mt-5'>
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
        <div className = 'heroimg mt-2 mr-1'></div>
      </div>
      <div>
      <h1 id="about" className='text-center mb-4'>What is Drawfish?</h1>
      <div className="my-2">
      <img src={cardImage} className=" left abt-image"alt="cover" />
      <h3>I'm Jacob, but you can call me Toomey!</h3>
        <p className='text-right'>I aim to bring a 'full house' to your business with simple designs that stand out. Primarily a front-end developer (and hobbyist HTML5 game developer), but I've been trained in full stack practices. You can keep up with all my endeavors using the social media links at the bottom of the page. Don't take the gamble, reach out any time!
        </p>
      </div>
      </div>
      <div className="flex-row justify-space-between">
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
