import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';
import ReactionList from '../components/ReactionList';
import ReactionForm from '../components/ReactionForm';

import Auth from '../utils/auth';

const SingleThought = props => {
  const { id: thoughtId } = useParams();

  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId }
  });
  
  const thought = data?.thought || {};
  
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
      <div>
        <div className="card mb-3" data-aos="zoom-in">
          <p className="card-header">
            <span style={{ fontWeight: 700 }} className="text-dark">
              {thought.username}
            </span>{' '}
             on {thought.createdAt}
          </p>
          <div className="card-body">
          {loading ? (
            <div>Loading...</div>
          ) : (
      <img key={Math.random().toString(36)} src = {`https://drawfish.s3.amazonaws.com/${thought.thoughtImage}.png`} alt= "Finished Drawing!"></img>)}
            <p>{thought.thoughtText}</p>
          </div>
        </div>

        {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
        <br></br>

        {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
        <br></br>
      </div>
  );
};

export default SingleThought;
