import { getAllLists } from '@/app/actions';
import Link from 'next/link';

export default async function ListasPage() {
  const lists = await getAllLists();

  return (
    <div className="p-6 pt-16 md:pt-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Todas as Listas</h1>

        {lists && lists.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/lista/${list.id}`}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-5 hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-all duration-200 block"
              >
                <h2 className="text-lg font-semibold text-white mb-1">{list.name}</h2>
                <p className="text-sm text-zinc-500">
                  {new Date(list.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500 mb-4">Você ainda não tem nenhuma lista.</p>
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Criar sua primeira lista →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}