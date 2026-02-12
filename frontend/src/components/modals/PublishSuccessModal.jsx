import { X, Copy, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';

export default function PublishSuccessModal({ isOpen, onClose, portfolioUrl, subdomain }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Portfolio Published!</h2>
              <p className="text-sm text-gray-500">Your portfolio is now live 🎉</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Your Portfolio Link:
            </label>
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-300 rounded-lg p-3">
              <input
                type="text"
                value={portfolioUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none select-all"
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={copyToClipboard}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-xs font-medium">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Share this link anywhere:</strong>
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>On your resume and LinkedIn</li>
              <li>In job applications</li>
              <li>On social media</li>
              <li>Via email or messaging</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="font-medium">View Live Portfolio</span>
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
