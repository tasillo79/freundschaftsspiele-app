import React, { useState } from 'react';

interface Props {
  onSubmit: (name: string) => void;
}

export default function NameGate({ onSubmit }: Props) {
  const [name, setName] = useState('');

  return (
    <div className="card name-gate">
      <h2>WM 2026 Tippspiel</h2>
      <p>Gib deinen Namen ein, um Tipps für die Deutschland-Spiele abzugeben.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = name.trim();
          if (trimmed) onSubmit(trimmed);
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
          autoFocus
        />
        <button type="submit">Weiter</button>
      </form>
    </div>
  );
}
