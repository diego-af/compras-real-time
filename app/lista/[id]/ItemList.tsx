'use client';

import { useState, useEffect } from 'react';
import { List, Item } from '@/lib/types';
import { toggleItem } from '@/app/actions';
import { createClient } from '@supabase/supabase-js';
import AddItemForm from '@/app/components/AddItemForm';

interface ItemListProps {
  list: List;
  initialItems: Item[];
}

export default function ItemList({ list, initialItems }: ItemListProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
    )
  );

  useEffect(() => {
    setMounted(true);
    
    const channel = supabase
      .channel(`items-${list.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `list_id=eq.${list.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev.map((item) =>
                item.id === payload.new.id
                  ? { ...item, checked: payload.new.checked }
                  : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, list.id]);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(async () => {
      const { data: updatedItems } = await supabase
        .from('items')
        .select('*')
        .eq('list_id', list.id)
        .order('created_at');

      if (updatedItems) {
        setItems(updatedItems as Item[]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [mounted, supabase, list.id]);

  const handleToggle = async (itemId: string, checked: boolean) => {
    setLoading(true);
    try {
      await toggleItem(itemId, checked);
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, checked } : item
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const uncheckedItems = items.filter((item) => !item.checked);
  const checkedItems = items.filter((item) => item.checked);

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{list.name}</h1>
          <button
            onClick={copyLink}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
          >
            {copied ? 'Copiado!' : 'Copiar link'}
          </button>
        </div>

        <div className="mb-6">
          <AddItemForm listId={list.id} />
        </div>

        {items.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">Nenhum item na lista</p>
        ) : (
          <div className="space-y-6">
            {uncheckedItems.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wide">
                  A comprar ({uncheckedItems.length})
                </h2>
                <ul className="space-y-2">
                  {uncheckedItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 p-3 bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-zinc-800/50 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={mounted ? item.checked : false}
                        onChange={(e) => handleToggle(item.id, e.target.checked)}
                        disabled={loading || !mounted}
                        className="w-5 h-5 rounded border-zinc-700/50 bg-black/50 text-zinc-300 focus:ring-zinc-500/50 focus:ring-offset-zinc-900 cursor-pointer transition-colors duration-200"
                      />
                      <span className="text-white">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {checkedItems.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wide">
                  Comprados ({checkedItems.length})
                </h2>
                <ul className="space-y-2">
                  {checkedItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 p-3 bg-zinc-900/30 backdrop-blur-sm rounded-lg border border-zinc-800/30 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={mounted ? item.checked : false}
                        onChange={(e) => handleToggle(item.id, e.target.checked)}
                        disabled={loading || !mounted}
                        className="w-5 h-5 rounded border-zinc-700/50 bg-black/50 text-zinc-300 focus:ring-zinc-500/50 focus:ring-offset-zinc-900 cursor-pointer transition-colors duration-200"
                      />
                      <span className="text-zinc-600 line-through">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}