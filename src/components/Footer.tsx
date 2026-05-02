type Lang = "zh" | "en";

const T = {
  tagline: { zh: "海外主妇的东方养生指南", en: "Eastern Wellness for Modern Moms" },
  privacy: { zh: "隐私政策", en: "Privacy" },
  terms: { zh: "服务条款", en: "Terms" },
  contact: { zh: "联系我们", en: "Contact" },
  feedback: { zh: "反馈建议", en: "Feedback" },
  disclaimer: { zh: "养生指引，非医疗建议。", en: "Wellness guidance, not medical advice." },
};

export default function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="py-8 px-6 border-t border-mystic-700/50">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-400">
          <span className="font-semibold text-gold-300">DestinyBridge</span>
          {" · "}
          {T.tagline[lang]}
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <a href="#" className="hover:text-gold-300 transition-colors">
            {T.privacy[lang]}
          </a>
          <a href="#" className="hover:text-gold-300 transition-colors">
            {T.terms[lang]}
          </a>
          <a href="#" className="hover:text-gold-300 transition-colors">
            {T.contact[lang]}
          </a>
          <a href="/feedback" className="hover:text-gold-300 transition-colors">
            {T.feedback[lang]}
          </a>
        </div>
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} DestinyBridge. {T.disclaimer[lang]}
        </p>
      </div>
    </footer>
  );
}
