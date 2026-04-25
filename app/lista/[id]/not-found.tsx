export default function NotFound() {
  return (
    <div className="p-6 pt-16 md:pt-6">
      <div className="max-w-lg mx-auto text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-zinc-500 mb-6">Lista não encontrada</p>
        <a
          href="/"
          className="text-zinc-400 hover:text-white transition-colors duration-200"
        >
          Voltar para início
        </a>
      </div>
    </div>
  );
}