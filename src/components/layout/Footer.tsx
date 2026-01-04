export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-gray-500">
        © {new Date().getFullYear()} GoWithPorto — Embrace the Soul of Porto
      </div>
    </footer>
  );
}
