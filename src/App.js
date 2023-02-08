import {useEffect, useState} from 'react';
import './App.scss';
import Species from './Species';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

function App() {
  const [characters, setCharacters] = useState([]);
  const [charactersWithImage, setCharactersWithImage] = useState(characters);
  const [loading, setLoading] = useState(false);
  useEffect(async () => {
    setLoading(true);
    await fetch(API_URL)
      //First api request, the response provides the urls of each species in an array of urls.
      .then(response => response.json())
      .then(data => {
        //Each species url is being fetched and then the response set to a useState array variable.
        data?.species.map(dataMapped => {
          console.log(dataMapped);
          fetch(dataMapped)
            .then(response => response.json())
            .then(charactersFetched => {
              setCharacters(prevCharacters => [
                ...prevCharacters,
                charactersFetched,
              ]);
              setLoading(false);
            });
        });
      });
  }, []);
  useEffect(() => {
    const imageChar = characters.map(char => {
      const newChar = {
        ...char,
        image:
          SPECIES_IMAGES[
            char.name.includes("Yoda's species")
              ? 'yoda'
              : char.name.toLowerCase()
          ],
      };
      return newChar;
    });
    setCharactersWithImage(imageChar);
  }, [characters]);
  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {charactersWithImage && !loading
          ? charactersWithImage.map(character => (
              <Species
                key={character.url}
                name={character.name}
                classification={character.classification}
                designation={character.designation}
                height={character.average_height}
                numFilms={character.films.length}
                language={character.language}
                image={character.image}
              />
            ))
          : 'Loading Characters...'}
      </div>
    </div>
  );
}

export default App;
