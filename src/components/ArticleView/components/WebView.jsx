import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { fitToWidth, webViewUrl } from "@/domain/articles/webView.js";
import { useIsMedium } from "@/hooks/use-mobile";

// Narrower than this, many pages (email newsletters in particular, with their
// max-width ~600–740px media queries) switch to their phone layout. On larger
// screens the page is laid out at this width and scaled down to fit the pane,
// as mail apps do; on phones it uses the real width.
const DESKTOP_PAGE_WIDTH = 800;

// The article's own page, filling the reading pane. Sites that forbid framing
// (X-Frame-Options / CSP frame-ancestors) stay blank, which a frame cannot
// detect, so the way out to a new tab is always visible.
export default function WebView({ article }) {
  const { t } = useTranslation();
  const url = webViewUrl(article);
  const isMedium = useIsMedium();
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [loadedUrl, setLoadedUrl] = useState(null);
  useEffect(() => setLoadedUrl(null), [url]);
  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const update = () =>
      setSize({ width: node.clientWidth, height: node.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  if (!url) return null;
  const fit = fitToWidth(
    size.width,
    size.height,
    isMedium ? 0 : DESKTOP_PAGE_WIDTH,
  );
  return (
    <div
      ref={containerRef}
      className="relative flex-1 min-h-0 w-full overflow-hidden"
    >
      {loadedUrl !== url && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="size-5 text-muted-foreground" />
        </div>
      )}
      <iframe
        key={url}
        src={url}
        title={article.title}
        onLoad={() => setLoadedUrl(url)}
        className="web-view-frame block border-0"
        style={
          fit.scale < 1
            ? {
                width: `${fit.width}px`,
                height: `${fit.height}px`,
                transform: `scale(${fit.scale})`,
                transformOrigin: "0 0",
              }
            : { width: "100%", height: "100%" }
        }
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        referrerPolicy="no-referrer"
        allow="fullscreen; clipboard-write"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-popover/90 px-3 py-1 text-xs text-muted-foreground shadow-custom backdrop-blur hover:text-foreground"
      >
        {t("articleView.openInNewTab")}
        <ArrowUpRight className="size-3.5" />
      </a>
    </div>
  );
}
