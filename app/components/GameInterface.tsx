"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { testGameState } from "../mocks/testCards";
import { MonsterCard, AttackCard, SupportCard } from "../types/game";

export default function GameInterface() {
  const {
    initializeGame,
    players,
    currentTurn,
    selectedActions,
    isActionPhase,
    winner,
    actionLog,
    selectAction,
    startActionPhase,
    resetGame,
    makeAIDecisions,
  } = useGameStore();

  const [selectedCard, setSelectedCard] = useState<{
    card: AttackCard | SupportCard | null;
    playerId: string;
    monsterId: string;
    allowSelfTarget: boolean | null;
  } | null>(null);

  useEffect(() => {
    initializeGame(testGameState.players);
  }, [initializeGame]);

  useEffect(() => {
    // When it's a new turn and not the action phase, have AI make decisions
    if (!isActionPhase && !winner) {
      // Small delay to make it feel more natural
      const aiDecisionTimer = setTimeout(() => {
        makeAIDecisions();
      }, 4000);

      return () => clearTimeout(aiDecisionTimer);
    }
  }, [currentTurn, isActionPhase, winner, makeAIDecisions]);

  // Function to handle card selection
  // Modify the handleCardSelect function to set a flag for self-targeting allowed
  const handleCardSelect = (
    playerId: string,
    monsterId: string,
    card: AttackCard | SupportCard | null
  ) => {
    setSelectedCard({
      card,
      playerId,
      monsterId,
      allowSelfTarget: card && card.type === "SUPPORT", // Allow self-targeting for support cards
    });
  };

  // Function to handle target selection
  const handleTargetSelect = (
    targetPlayerId: string,
    targetMonsterId: string
  ) => {
    if (selectedCard) {
      selectAction(
        selectedCard.playerId,
        selectedCard.monsterId,
        selectedCard.card,
        { playerId: targetPlayerId, monsterId: targetMonsterId }
      );
      setSelectedCard(null);
    }
  };

  // Check if all players have selected actions
  const allPlayersSelected = players.every((player) =>
    player.monsters.some((monster) =>
      selectedActions.some(
        (action) =>
          action.playerId === player.id && action.monsterId === monster.id
      )
    )
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Card Battle Game</h1>
        <div>
          <p className="font-medium">Turn: {currentTurn}</p>
          {winner && (
            <p className="text-green-600 font-bold">Player {winner} wins!</p>
          )}
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset Game
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {players.map((player) => (
          <div key={player.id} className="border rounded p-4">
            <h2 className="font-bold text-xl mb-2">Player {player.id}</h2>

            <div className="mb-4">
              <h3 className="font-semibold">Monsters:</h3>
              {player.monsters.map((monster) => (
                <div
                  key={monster.id}
                  className={`p-3 border rounded mb-2 cursor-pointer ${
                    selectedCard &&
                    selectedCard.card === null &&
                    monster.id === selectedCard.monsterId
                      ? "bg-blue-100"
                      : ""
                  } ${
                    selectedCard &&
                    (selectedCard.playerId !== player.id ||
                      (selectedCard.allowSelfTarget &&
                        selectedCard.playerId === player.id))
                      ? "hover:bg-red-100"
                      : ""
                  }`}
                  onClick={() => {
                    if (
                      selectedCard &&
                      (selectedCard.playerId !== player.id ||
                        (selectedCard.allowSelfTarget &&
                          selectedCard.playerId === player.id))
                    ) {
                      handleTargetSelect(player.id, monster.id);
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{monster.name}</p>
                    <p className="text-sm">
                      HP: {monster.stats.HP} | AGI: {monster.stats.AGI}
                    </p>
                  </div>

                  <div className="mt-2">
                    <button
                      className={`px-3 py-1 bg-green-500 text-white rounded text-sm ${
                        selectedCard ||
                        selectedActions.some(
                          (action) =>
                            action.playerId === player.id &&
                            action.monsterId === monster.id
                        )
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-green-600"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          !selectedCard &&
                          !selectedActions.some(
                            (action) =>
                              action.playerId === player.id &&
                              action.monsterId === monster.id
                          )
                        ) {
                          handleCardSelect(player.id, monster.id, null);
                        }
                      }}
                      disabled={
                        !!selectedCard ||
                        selectedActions.some(
                          (action) =>
                            action.playerId === player.id &&
                            action.monsterId === monster.id
                        )
                      }
                    >
                      Use Active Skill: {monster.activeSkill.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Hand:</h3>
              <div className="grid grid-cols-2 gap-2">
                {player.hand.map((card) => (
                  <div
                    key={card.id}
                    className={`p-2 border rounded cursor-pointer ${
                      selectedCard && selectedCard.card === card
                        ? "bg-blue-100"
                        : ""
                    } ${
                      card.uses === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (
                        card.uses > 0 &&
                        !selectedCard &&
                        !selectedActions.some(
                          (action) =>
                            action.playerId === player.id &&
                            player.monsters.some(
                              (m) => m.id === action.monsterId
                            )
                        )
                      ) {
                        handleCardSelect(
                          player.id,
                          player.monsters[0]?.id || "",
                          card
                        );
                      }
                    }}
                  >
                    <p className="font-medium">{card.name}</p>
                    <p className="text-xs">{card.description}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs">Type: {card.type}</p>
                      <p className="text-xs">Uses: {card.uses}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        {selectedCard ? (
          <div className="bg-yellow-100 p-2 rounded">
            <p>
              Selected:{" "}
              {selectedCard.card ? selectedCard.card.name : "Active Skill"} -
              Now select a target
            </p>
          </div>
        ) : (
          <div className="bg-gray-100 p-2 rounded">
            <p>Select a card or active skill to use</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            allPlayersSelected && !isActionPhase
              ? "hover:bg-blue-600"
              : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!allPlayersSelected || isActionPhase}
          onClick={startActionPhase}
        >
          Execute Actions
        </button>
      </div>

      <div className="border rounded p-4 max-h-60 overflow-y-auto">
        <h3 className="font-semibold mb-2">Action Log:</h3>
        <ul className="space-y-1">
          {actionLog.map((log, index) => (
            <li key={index} className="text-sm">
              {log}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
