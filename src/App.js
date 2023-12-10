import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  const [characters, setCharacters] = useState([]);

  const [playerMap, setPlayerMap] = useState({});
  const [playerCharMap, setPlayerCharMap] = useState({});
  const [playerGamesMap, setPlayerGamesMap] = useState({});
  const [characterStageMap, setCharacterStageMap] = useState({});

  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player1Id, setPlayer1Id] = useState('')

  const [character1, setCharacter1] = useState('Character 1');

  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [player2Id, setPlayer2Id] = useState('')

  const [character2, setCharacter2] = useState('Character 2');

  const stages = ['Pokémon Stadium 2',
                  'Final Destination',
                  'Battlefield',
                  'Town and City',
                  'Smashville',
                  'Kalos Pokémon League',
                  'Small Battlefield',
                  'Northern Cave']

  const [stage, setStage] = useState('Stage')

  const setPlayer1 = (name, id) => {
    setPlayer1Name(name);
    setPlayer1Id(id)
  }

  const setPlayer2 = (name, id) => {
    setPlayer2Name(name);
    setPlayer2Id(id)
  }

  const chanceOfPlayer1Winning = () => {
    const defaultWinRate = 0.5;
    const coefficients = [7.266094, -7.246712, -0.615217, 0.746385, -0.558872, 0.557348]

    const char_a_winrate = playerCharMap.hasOwnProperty(player1Id) && playerCharMap[player1Id].hasOwnProperty(character1) ?
    playerCharMap[player1Id][character1] : defaultWinRate;

    const char_b_winrate = playerCharMap.hasOwnProperty(player2Id) && playerCharMap[player2Id].hasOwnProperty(character2) ?
    playerCharMap[player2Id][character2] : defaultWinRate;

    const player_a_total_games = playerGamesMap[player1Id];
    const player_b_total_games = playerGamesMap[player2Id];

    const character_a_stage_winrate = characterStageMap.hasOwnProperty(character1) && characterStageMap[character1].hasOwnProperty(stage) ?
    characterStageMap[character1][stage] : defaultWinRate;

    const character_b_stage_winrate = characterStageMap.hasOwnProperty(character2) && characterStageMap[character2].hasOwnProperty(stage) ?
    characterStageMap[character2][stage] : defaultWinRate;

    const values = [char_a_winrate, char_b_winrate, player_a_total_games, player_b_total_games, character_a_stage_winrate, character_b_stage_winrate]
    
    let dotProduct = 0;
    for (let i = 0; i < coefficients.length; i++) {
      dotProduct += coefficients[i] * values[i];
    }
    
    // Calculate the probability of predicting 0
    const probability_0 = 1 / (1 + Math.exp(-dotProduct))

    return probability_0;
  }

  useEffect(() => {
    async function fetchData() {
      try {

        const charactersResponse = await fetch('/characters.json');
        const charactersData = await charactersResponse.json();
        setCharacters(charactersData);

        const playerMapResponse = await fetch('/player_map.json');
        const playerMapData = await playerMapResponse.json();
        const playerMapEntries = Object.entries(playerMapData);

        // Sort the array in descending order of keys
        playerMapEntries.sort((a, b) => a[0].localeCompare(b[0]));

        // Convert the sorted array back to an object
        const sortedPlayerMap = Object.fromEntries(playerMapEntries);
        setPlayerMap(sortedPlayerMap);

        const playerCharMapResponse = await fetch('/player_char_map.json');
        const playerCharMapData = await playerCharMapResponse.json();
        setPlayerCharMap(playerCharMapData);

        const playerGamesMapResponse = await fetch('/player_games_map.json');
        const playerGamesMapData = await playerGamesMapResponse.json();
        setPlayerGamesMap(playerGamesMapData);

        const characterStageMapResponse = await fetch('/character_stage_map.json');
        const characterStageMapData = await characterStageMapResponse.json();
        console.log(characterStageMapData)
        setCharacterStageMap(characterStageMapData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="topApp-header">
      <h1 className="app-title">Smash Ultimate Match Predictor</h1>
      </header>
      <header className="App-header">
        <div className="dropdowns-container">
          {/* Left side */}
          <div className="dropdown-group">
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-player1">
                {player1Name}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {Object.entries(playerMap).filter(([playerName]) => playerName !== player2Name).map(([playerName, playerId], index) => (
                  <Dropdown.Item key={playerName} onClick={() => setPlayer1(playerName, playerId)}>
                    {playerName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-character1">
                {character1}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {characters.map((character, index) => (
                  <Dropdown.Item key={character} onClick={() => setCharacter1(character)}>
                    {character}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          
          {/* Right side */}
          <div className="dropdown-group">
          <Dropdown>
              <Dropdown.Toggle variant="danger" id="dropdown-player1">
                {player2Name}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {Object.entries(playerMap).filter(([playerName]) => playerName !== player1Name).map(([playerName, playerId], index) => (
                  <Dropdown.Item key={playerName} onClick={() => setPlayer2(playerName, playerId)}>
                    {playerName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="danger" id="dropdown-character1">
                {character2}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {characters.map((character, index) => (
                  <Dropdown.Item key={character} onClick={() => setCharacter2(character)}>
                    {character}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          
        </div>

        <div className="centered-dropdown">
          <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-character1">
                {stage}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {stages.map((stageOption, index) => (
                  <Dropdown.Item key={stageOption} onClick={() => setStage(stageOption)}>
                    {stageOption}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
      </header>

      <footer className="footer">
        {player1Name === 'Player 1' || player2Name === 'Player 2' || character1 === 'Character 1' 
        || character2 === 'Character 2' || stage === 'Stage' ? (
          <h2>Please select all fields above first!</h2>
        ) : (
          <h2>{player1Name} has a <span style={{color: '#011332'}}>{chanceOfPlayer1Winning() * 100}%</span> chance of winning.</h2>
        )}
      </footer>
    </div>
  );
}

export default App;