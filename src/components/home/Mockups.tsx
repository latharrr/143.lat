// Device frames for real project screens (services stack). aria-hidden by their parents.
import Image from 'next/image';

export function Browser({ src, url, className = '' }: { src: string; url: string; className?: string }) {
  return (
    <div className={`mk mk-browser ${className}`}>
      <div className="mk-bar"><i /><i /><i /><span>{url}</span></div>
      <div className="mk-screen"><Image src={src} alt="" fill sizes="(max-width: 767px) 80vw, 40vw" /></div>
    </div>
  );
}

export function Phone({ src, className = '', children }: { src?: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`mk mk-phone ${className}`}>
      <div className="mk-notch" />
      <div className="mk-screen">{src ? <Image src={src} alt="" fill sizes="240px" /> : children}</div>
    </div>
  );
}
