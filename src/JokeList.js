import React, {useState, useEffect} from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";


/** List of jokes. */

function JokeList ({numJokestoGet = 5}) {
  
  const [jokes,setJokes] = useState([]);
  const [isLoading,setIsLoading] = useState(true);

  useEffect(function(){
    async function getJokes(){
      let jk = [...jokes];
      let seenJokes = new Set();

      try {
        while (jk.length < numJokestoGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { ...joke } = res.data;
  
          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            jk.push({ ...joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }
        setJokes(jk)
        setIsLoading(false)
    }catch(err){
      console.error(err);
     }
  }
    if(jokes.length === 0) getJokes();
  }, [jokes,numJokestoGet]);

   

  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    setJokes([]);
    setIsLoading(true);
  }

  /* change vote for this id by delta (+1 or -1) */

 function vote(id, delta) {
    setJokes(allJokes => (
      allJokes.map(j => j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  let sortedJokes = [...jokes].sort((a,b) => b.votes - a.votes);
    return (
      <div className="JokeList">
        <button className="JokeList-getmore"  onClick={generateNewJokes}>
          Get New Jokes
        </button>

        {sortedJokes.map(({joke, id, votes}) => (
          <Joke
            text={joke}
            key={id}
            id={id}
            votes={votes}
            vote={vote}
          />
        ))}
      </div>
    );
  }

export default JokeList;
