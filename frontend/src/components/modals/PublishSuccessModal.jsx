import { X, Copy, ExternalLink, Check, Home } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PublishSuccessModal({ isOpen, onClose, portfolioUrl, subdomain }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Format link as path-based Vercel URL
  const getCleanVercelUrl = () => {
    let cleanSub = (subdomain || '').replace(/\.portiqqo\.me$/i, '').trim();
    if (!cleanSub && portfolioUrl) {
      cleanSub = portfolioUrl
        .replace(/^https?:\/\//, '')
        .replace(/\.portiqqo\.me.*$/, '')
        .split('/')
        .pop();
    }
    const origin = window.location.origin.includes('localhost') 
      ? window.location.origin 
      : 'https://portiqqo.vercel.app';
    return cleanSub ? `${origin}/${cleanSub}` : (portfolioUrl || origin);
  };

  const finalUrl = getCleanVercelUrl();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 animate-fadeIn">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-950/80 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-pink-600 dark:text-pink-400 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">Portfolio Published!</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">Your portfolio is now live 🎉</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-stone-700 dark:text-stone-300 block mb-2">
              Your Portfolio Link:
            </label>
            <div className="flex items-center space-x-2 bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl p-3">
              <input
                type="text"
                value={finalUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-stone-900 dark:text-stone-100 font-medium outline-none select-all"
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={copyToClipboard}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#f472b6] hover:bg-[#ec4899] text-stone-950'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-xs font-bold">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-pink-50/80 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/40 rounded-xl p-4">
            <p className="text-sm text-pink-950 dark:text-pink-200 font-bold">
              Share this link anywhere:
            </p>
            <ul className="text-sm text-stone-700 dark:text-stone-300 mt-2 space-y-1 list-disc list-inside font-medium">
              <li>On your resume and LinkedIn</li>
              <li>In job applications</li>
              <li>On social media</li>
              <li>Via email or messaging</li>
            </ul>
          </div>

          <div className="space-y-3 pt-1">
            <a
              href={finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 bg-[#f472b6] hover:bg-[#ec4899] text-stone-950 font-extrabold px-4 py-3.5 rounded-xl shadow-lg shadow-pink-500/25 hover:scale-[1.02] transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Live Portfolio</span>
            </a>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/dashboard');
                }}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors font-bold text-xs sm:text-sm cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 sm:px-6 py-3 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors font-bold text-xs sm:text-sm cursor-pointer"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
