import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { webViewUrl } from "@/domain/articles/webView.js";

// The article's own page, filling the reading pane. Sites that forbid framing
// (X-Frame-Options / CSP frame-ancestors) stay blank, which a frame cannot
// detect, so the way out to a new tab is always visible.
export default function WebView({ article }) {
  const { t } = useTranslation();
  const url = webViewUrl(article);
  const [loadedUrl, setLoadedUrl] = useState(null);
  useEffect(() => setLoadedUrl(null), [url]);
  if (!url) return null;
  return (
    <div className="relative flex-1 min-h-0 w-full">
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
        className="web-view-frame block h-full w-full border-0"
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
