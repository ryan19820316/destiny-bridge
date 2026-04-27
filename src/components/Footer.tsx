export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-mystic-700/50">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-400">
          <span className="font-semibold text-gold-300">DestinyBridge</span>
          {" · "}
          Eastern Wellness for Modern Moms
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <a href="#" className="hover:text-gold-300 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-gold-300 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-gold-300 transition-colors">
            Contact
          </a>
        </div>
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} DestinyBridge. Wellness guidance, not medical advice.
        </p>
      </div>
    </footer>
  );
}
