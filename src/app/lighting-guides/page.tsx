import { LightingResourceIndex, resourceMetadata } from "@/components/lighting-resource-page";

import styles from "@/components/lighting-content.module.css";

export const metadata = resourceMetadata("guides");

export default function Page() {
  return (
    <div className={styles.guideIndex} data-testid="lighting-guide-index">
      <LightingResourceIndex kind="guides" />
    </div>
  );
}
