import React from 'react';
import { Link } from 'react-router-dom';

const ThoughtList = ({ thoughts, title }) => {
  if (!thoughts.length) {
    return <h3>No Thoughts Yet</h3>;
  }

  return (
    <div className="gallery">
      {thoughts &&
        thoughts.map(thought => (
          <div key={thought._id} >
            <div className="item">
              <Link to={`/thought/${thought._id}`}>
              <img key={thought._id} src = {`https://drawfish.s3.amazonaws.com/${thought.thoughtImage}.png`} alt= "Finished Drawing!"></img>
              <span className="caption">{thought.thoughtText}</span>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;