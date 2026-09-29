    if (pct > 0.2) return "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)]";
    return "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse";
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 transition-all duration-300 backdrop-blur-md select-none ${
        screenShake ? "animate-[shake_0.2s_ease-in-out_infinite]" : ""
      }`}
    >
      {/* Screen flash on hit */}
      {flashColor && (
        <div
          className="pointer-events-none absolute inset-0 z-50 transition-opacity duration-150"
          style={{ backgroundColor: flashColor }}
        />
      )}

      <div className="battle-shell relative flex flex-col w-full max-w-[820px] aspect-[4/3] bg-[#1a1410] border-4 border-amber-600/80 rounded-sm shadow-[0_0_35px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Top Header with Opponent Selector, Team Builder Button & Close */}
        <div className="battle-toolbar flex items-center justify-between gap-2 px-3 py-1.5 bg-[#2a1e16] border-b-2 border-amber-500/40 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold tracking-wide pixel-font text-[9px]">
              ⚔️ ARENA DE BATALHA POKÉMON
            </span>
            <span className="bg-amber-500/20 text-amber-200 border border-amber-500/40 px-1.5 py-0.5 rounded text-[8px] pixel-font">
              Vitórias: {totalWins}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Moves Customizer Button */}
            <button
              type="button"
              onClick={() => {
                setEditingMovesPokemonIdx(activeTeamIndex);
                setSelectedMoveSlot(0);
                sound.playInteract();
              }}
              className="bg-emerald-700 hover:bg-emerald-600 text-emerald-100 font-bold px-2 py-0.5 rounded text-[8px] pixel-font border border-emerald-400 flex items-center gap-1 shadow cursor-pointer transition-transform active:scale-95"
              title="Escolher e personalizar os golpes do seu Pokémon ativo"
            >
              <span>⚔️ Golpes</span>
            </button>

            {/* Team Builder Button */}
            <button
              type="button"
              onClick={() => setShowTeamBuilder(true)}
              className="bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold px-2 py-0.5 rounded text-[8px] pixel-font border border-amber-400 flex items-center gap-1 shadow cursor-pointer transition-transform active:scale-95"
              title="Gerenciar seu time e buscar Pokémon na PokéAPI"
            >
              <span>⭐ Time ({playerTeam.length}/6)</span>
            </button>

            {/* Random Opponent Button */}
            <button
              type="button"
              disabled={isBusy}
              onClick={handleGenerateRandomOpponent}
              className="bg-purple-800 hover:bg-purple-700 text-purple-100 px-2 py-0.5 rounded text-[8px] pixel-font border border-purple-400 shadow cursor-pointer disabled:opacity-50"
              title="Gerar um oponente aleatório da PokéAPI"
            >
              🎲 Oponente Aleatório
            </button>

            {/* Opponent Selector */}
            <select
              value={selectedOpponentIdx}
              onChange={(e) => handleSelectOpponent(Number(e.target.value))}
              disabled={isBusy}
              className="bg-[#18110c] text-amber-200 border border-amber-500/50 px-2 py-0.5 rounded text-[8px] pixel-font cursor-pointer focus:outline-none max-w-[130px] truncate"
            >
              {opponentsList.map((opp, idx) => (
                <option key={opp.id + idx} value={idx}>
                  {opp.name} ({opp.trainer})