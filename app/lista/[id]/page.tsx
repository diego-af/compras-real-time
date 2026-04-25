import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { List, Item } from '@/lib/types';
import ItemList from './ItemList';

async function getList(id: string) {
  const { data: list } = await supabase.from('lists').select('*').eq('id', id).single();
  return list as List | null;
}

async function getItems(listId: string) {
  const { data: items } = await supabase.from('items').select('*').eq('list_id', listId).order('created_at');
  return items as Item[] | null;
}

export default async function ListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = await getList(id);

  if (!list) {
    notFound();
  }

  const items = await getItems(id);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <ItemList list={list} initialItems={items || []} />
      </div>
    </div>
  );
}