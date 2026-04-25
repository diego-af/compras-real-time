'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addItem } from '@/app/actions';

interface AddItemFormProps {
  listId: string;
}

export default function AddItemForm({ listId }: AddItemFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await addItem(listId, name.trim());
      setName('');
      router.refresh();
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Adicionar novo item..."
        className="flex-1 px-4 py-3 bg-black/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500/50 transition-all duration-200"
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="px-5 py-3 bg-zinc-800/50 text-white rounded-lg border border-zinc-700/50 hover:bg-zinc-700/50 disabled:opacity-50 transition-all duration-200"
      >
        {loading ? '...' : '+'}
      </button>
    </form>
  );
}