import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Kbd } from "@/components/ui/kbd";
import { useRef } from "react";
import { useStore } from "@nanostores/react";
import { Circle, CircleDot, FileText, Globe, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import Confetti from "@/components/ui/Confetti";
import {
  handleMarkStatus,
  handleToggleContent,
  handleToggleStar,
} from "@/handlers/articleHandlers.js";
import {
  loadingOriginContent,
  pendingArticleMutations,
} from "@/stores/articlesStore.js";
import ArticleAiAction from "./ArticleAiAction.jsx";
import ArticleExternalActions from "./ArticleExternalActions.jsx";
import ArticleViewportControl from "./ArticleViewportControl.jsx";
import { settingsState } from "@/stores/settingsStore.js";
import {
  toggleArticleWebView,
  webViewOverrides,
} from "@/stores/webViewStore.js";
import { isWebView, webViewUrl } from "@/domain/articles/webView.js";
export default function ArticleStateActions({
  article,
  canExpand,
  isExpanded,
  onToggleExpanded,
}) {
  const { t } = useTranslation();
  const starButtonRef = useRef(null);
  const fetchLoading = useStore(loadingOriginContent);
  const pending = useStore(pendingArticleMutations);
  const statusPending = article ? `${article.id}:status` in pending : false;
  const starPending = article ? `${article.id}:starred` in pending : false;
  const { webViewFeeds } = useStore(settingsState);
  const overrides = useStore(webViewOverrides);
  const webView = article ? isWebView(article, webViewFeeds, overrides) : false;
  const webViewLabel = webView
    ? t("articleView.hideWebView")
    : t("articleView.showWebView");
  return (
    <LiquidGlass
      role="group"
      aria-label={`${t("common.read")} / ${t("common.star")} / ${t("common.share")}`}
      className="ml-auto gap-1 p-0.5"
    >
      <Tooltip>
        <TooltipTrigger
          closeOnClick={false}
          render={
            <Button
              variant="ghost"
              aria-label={
                article?.status === "read"
                  ? t("common.unread")
                  : t("common.read")
              }
              onClick={() => handleMarkStatus(article)}
              disabled={!article || statusPending}
              focusableWhenDisabled={Boolean(article)}
              className="rounded-full data-disabled:opacity-50"
              aria-busy={statusPending}
              size="icon-sm"
            >
              {article?.status === "unread" ? (
                <CircleDot className="size-4 text-muted-foreground p-0.5 fill-current" />
              ) : (
                <Circle className="size-4 text-muted-foreground p-0.5" />
              )}
            </Button>
          }
          delay={0}
        />
        <TooltipContent>
          {article?.status === "read" ? t("common.unread") : t("common.read")}
          <Kbd>M</Kbd>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          closeOnClick={false}
          render={
            <Button
              ref={starButtonRef}
              disabled={!article || starPending}
              focusableWhenDisabled={Boolean(article)}
              className="rounded-full data-disabled:opacity-50"
              aria-busy={starPending}
              variant="ghost"
              aria-label={
                article?.starred === 1 ? t("common.unstar") : t("common.star")
              }
              onClick={() => {
                if (starPending) return;
                if (article?.starred === 0) Confetti(starButtonRef);
                handleToggleStar(article);
              }}
              size="icon-sm"
            >
              <Star
                className={`size-4 text-muted-foreground ${article?.starred === 1 ? "fill-current" : ""}`}
              />
            </Button>
          }
          delay={0}
        />
        <TooltipContent>
          {article?.starred === 1 ? t("common.unstar") : t("common.star")}
          <Kbd>S</Kbd>
        </TooltipContent>
      </Tooltip>
      <ArticleExternalActions article={article} />
      <ArticleAiAction article={article} />
      <Tooltip>
        <TooltipTrigger
          closeOnClick={false}
          render={
            <Button
              variant="ghost"
              aria-label={
                article?.shownOriginal
                  ? t("articleView.showSummary")
                  : t("articleView.getFullText")
              }
              onClick={() => handleToggleContent(article)}
              disabled={!article || fetchLoading}
              focusableWhenDisabled={Boolean(article)}
              className="rounded-full data-disabled:opacity-50"
              aria-busy={fetchLoading}
              size="icon-sm"
            >
              {fetchLoading ? (
                <Spinner />
              ) : (
                <FileText
                  className={cn(
                    "size-4",
                    article?.shownOriginal
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
              )}
            </Button>
          }
          delay={0}
        />
        <TooltipContent>
          {article?.shownOriginal
            ? t("articleView.showSummary")
            : t("articleView.getFullText")}
          <Kbd>G</Kbd>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          closeOnClick={false}
          render={
            <Button
              variant="ghost"
              aria-label={webViewLabel}
              aria-pressed={webView}
              onClick={() => toggleArticleWebView(article)}
              disabled={!webViewUrl(article)}
              focusableWhenDisabled={Boolean(article)}
              className="rounded-full data-disabled:opacity-50"
              size="icon-sm"
            >
              <Globe
                className={cn(
                  "size-4",
                  webView ? "text-primary" : "text-muted-foreground",
                )}
              />
            </Button>
          }
          delay={0}
        />
        <TooltipContent>
          {webViewLabel}
          <Kbd>W</Kbd>
        </TooltipContent>
      </Tooltip>
      {(canExpand || isExpanded) && (
        <ArticleViewportControl
          isExpanded={isExpanded}
          onToggleExpanded={onToggleExpanded}
        />
      )}
    </LiquidGlass>
  );
}
