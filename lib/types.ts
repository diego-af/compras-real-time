export interface List {
  id: string;
  name: string;
  created_at: string;
}

export interface Item {
  id: string;
  list_id: string;
  name: string;
  checked: boolean;
  created_at: string;
}