"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="shell page-intro status-page">
      <h1>Something went wrong.</h1>
      <p className="intro-copy">Try loading this page again.</p>
      <div className="hero-actions">
        <button className="button button-primary" onClick={reset}>
          Try again
        </button>
        <Link className="button button-outline" href="/">
          Back to home
        </Link>
      </div>
    </div>
  );
}
