import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onCopied?: () => void;
}

export function CopyButton({
  textToCopy,
  label = '복사하기',
  variant = 'secondary',
  size = 'md',
  className = '',
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const baseStyle =
    'inline-flex items-center justify-center transition-all duration-200 font-medium rounded-lg cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-sm hover:shadow',
    secondary:
      'bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 border border-stone-200 shadow-xs',
    ghost:
      'text-stone-600 hover:text-stone-900 hover:bg-stone-100 active:bg-stone-200',
    'icon-only':
      'p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${baseStyle} ${variant === 'icon-only' ? variantStyles['icon-only'] : `${sizeStyles[size]} ${variantStyles[variant]}`} ${className}`}
      title={copied ? '복사되었습니다!' : '클립보드에 복사'}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in" />
          {variant !== 'icon-only' && (
            <span className="text-emerald-700 font-medium">복사 완료!</span>
          )}
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 opacity-75" />
          {variant !== 'icon-only' && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
