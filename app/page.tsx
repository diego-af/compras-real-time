'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createList } from './actions';

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [items, setItems] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = () => setItems([...items, '']);

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validItems = items.filter((item) => item.trim());
    if (!name.trim()) {
      setError('Nome da lista é obrigatório');
      return;
    }
    if (validItems.length === 0) {
      setError('Adicione pelo menos um item');
      return;
    }

    setLoading(true);
    try {
      const listId = await createList(name, validItems);
      router.push(`/lista/${listId}`);
    } catch (err) {
      setError('Erro ao criar lista. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Criar Nova Lista</h1>

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Nome da lista
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Supermercado"
                className="w-full px-4 py-3 bg-black/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500/50 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Itens</label>
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    placeholder={`Item ${index + 1}`}
                    className="flex-1 px-4 py-3 bg-black/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500/50 transition-all duration-200"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-3 py-3 text-zinc-500 hover:text-red-400 transition-colors duration-200"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
              >
                + Adicionar item
              </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-zinc-800/50 text-white rounded-lg hover:bg-zinc-700/50 disabled:opacity-50 transition-all duration-200 border border-zinc-700/50"
            >
              {loading ? 'Criando...' : 'Criar lista'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}