import Image from "next/image";
import styles from "./loading-screen.module.css";

export default function LoadingScreen({
  dismissed = false,
}: {
  dismissed?: boolean;
}) {
  return (
    <>
      <noscript><style>{`.${styles.screen}{display:none!important}`}</style></noscript>
      <div
        className={styles.screen}
        data-mode="overlay"
        data-dismissed={dismissed}
        data-testid="home-intro"
        role="status"
        aria-hidden={dismissed}
      >
        <Image
          className={styles.logo}
          src="/images/logo/bharat-lums-white.png"
          alt="Bharat Lums"
          width={432}
          height={237}
          sizes="(max-width: 600px) 180px, 260px"
          loading="eager"
          fetchPriority="high"
        />
        <span className={styles.track} aria-hidden="true" />
        <span className="sr-only">Loading page.</span>
      </div>
    </>
  );
}
