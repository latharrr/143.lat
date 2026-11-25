import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="inner paper">
      <header className="inner-head">
        <p className="display-word">404</p>
        <h1 className="inner-h1">This page does not exist</h1>
        <p className="btn-row"><Link className="btn btn-dark" href="/" data-title="Home">Back home</Link></p>
      </header>
    </div>
  );
}
