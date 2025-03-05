"use client";

import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { testGameState } from "../mocks/testCards";

export default function TestGame() {
  const initializeGame = useGameStore((state) => state.initializeGame);
  const players = useGameStore((state) => state.players);

  useEffect(() => {
    initializeGame(testGameState.players);
  }, [initializeGame]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Game Test</h1>
      {players.map((player) => (
        <div key={player.id} className="mb-4 p-4 border rounded">
          <h2 className="font-bold">Player {player.id}</h2>
          <div className="mt-2">
            <h3 className="font-semibold">Monster:</h3>
            {player.monsters.map((monster) => (
              <div key={monster.id} className="ml-4">
                <p>Name: {monster.name}</p>
                <p>HP: {monster.stats.HP}</p>
                <p>MP: {monster.stats.MP}</p>
                <p>STM: {monster.stats.STM}</p>
                <p>PATK: {monster.stats.PATK}</p>
                <p>MATK: {monster.stats.MATK}</p>
                <p>DEF: {monster.stats.DEF}</p>
                <p>RES: {monster.stats.RES}</p>
                <p>SKILL: {monster.stats.SKILL}</p>
                <p>LUCK: {monster.stats.LUCK}</p>
                <p>AGI: {monster.stats.AGI}</p>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <h3 className="font-semibold mb-4">
              Hand ({player.hand.length} cards):
            </h3>
            {player.hand.map((card) => (
              <div key={card.id} className="ml-4 flex flex-col mb-2">
                <p className="text-[1.2rem]">
                  {card.name} - {card.type}
                </p>
                <p className="text-[0.8rem] opacity-60">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
