export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-cream-300">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-earth-500">
          <span className="font-semibold text-indigo-900">DestinyBridge</span>
          {" · "}
          Eastern Wellness for Modern Moms
        </div>
        <div className="flex gap-4 text-xs text-indigo-800/50">
          <a href="#" className="hover:text-indigo-800 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-indigo-800 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-indigo-800 transition-colors">
            Contact
          </a>
        </div>
        <p className="text-xs text-indigo-800/40">
          &copy; {new Date().getFullYear()} DestinyBridge. This is wellness guidance, not professional advice.
        </p>
      </div>
    </footer>
  );
}
