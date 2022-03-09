import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_THOUGHTS} from '../utils/queries';
import Auth from '../utils/auth';
import ThoughtForm from '../components/ThoughtForm';

const Post = () => {
  // use useQuery hook to make query request

  const {data } = useQuery(QUERY_THOUGHTS);
  const {image: thoughtImage} = useParams();
  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const thoughts = data?.thoughts || [];
  console.log(thoughts);
  const loggedIn = Auth.loggedIn();

  return ( 
    <main>
  
 
      <img key={Math.random().toString(36)} src = {`https://drawfish.s3.amazonaws.com/${thoughtImage}.png`} alt= "Finished Drawing!"></img>

        
        
        {loggedIn && (
          <div className="col-12 mb-3">
            <ThoughtForm />
          </div>
        )}
          
    </main>
  );
};

export default Post;
