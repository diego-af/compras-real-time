'use server';

import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';

export async function createList(name: string, items: string[]) {
  const listId = nanoid(10);

  const { error: listError } = await supabase.from('lists').insert({
    id: listId,
    name,
  });

  if (listError) throw new Error(listError.message);

  const itemsData = items.map((item) => ({
    list_id: listId,
    name: item,
    checked: false,
  }));

  const { error: itemsError } = await supabase.from('items').insert(itemsData);

  if (itemsError) throw new Error(itemsError.message);

  return listId;
}

export async function toggleItem(itemId: string, checked: boolean) {
  const { error } = await supabase
    .from('items')
    .update({ checked })
    .eq('id', itemId);

  if (error) throw new Error(error.message);
}

export async function addItem(listId: string, itemName: string) {
  const { error } = await supabase.from('items').insert({
    list_id: listId,
    name: itemName,
    checked: false,
  });

  if (error) throw new Error(error.message);
}

export async function getAllLists() {
  const { data } = await supabase
    .from('lists')
    .select('*')
    .order('created_at', { ascending: false });
  return data;
}

export async function deleteList(listId: string) {
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId);

  if (error) throw new Error(error.message);
}