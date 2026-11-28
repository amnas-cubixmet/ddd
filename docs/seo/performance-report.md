# Core Web Vitals lab comparison

Measured on 28 November 2026 using the production build at main revision `e63a174` and the feature branch website commit. The mobile lab used Chromium 158, a 390 × 844 viewport, 2× device scale, 4× CPU throttling, 100 ms network latency and approximately 1.6 Mbps downstream. Each median uses three fresh browser contexts per route on the local production server. Resource transfer covers completed subresources through 2.4 seconds after page load.

| Route | Median LCP before | Median LCP after | Median CLS before / after | Median subresource transfer before / after |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 2.832 s | 2.684 s | 0 / 0 | 851,112 B / 775,655 B |
| Outdoor and infrastructure | 1.476 s | 1.760 s | 0 / 0 | 466,016 B / 409,992 B |
| Oreli OFL-ORON 30 W | 2.016 s | 1.048 s | 0.059 / 0.059 | 469,769 B / 423,404 B |

The branch removed an unused font preload, capped the intro overlay and prioritised the gallery lead image. The selected product page showed lower LCP in this test. Infrastructure LCP increased in the sampled runs while its resource transfer fell. Its after-build samples ranged from 1.424 to 1.988 seconds. The homepage median remains above the 2.5-second target in this lab setup.

The public PageSpeed Insights request returned a quota error. Field LCP, INP and CLS are unverified. Test on the deployed domain and review field data at the 75th percentile when available. These mobile lab results report neither device-wide nor production-wide performance.

- [Core Web Vitals thresholds](https://web.dev/articles/vitals)
