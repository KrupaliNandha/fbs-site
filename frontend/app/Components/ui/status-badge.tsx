"use client";

import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Badge } from "./badge";
import { cn } from "@/app/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
  showIcon?: boolean;
  /** Compact pills for dense lists / diagram tiles */
  compact?: boolean;
  /**
   * Label style:
   * - review (default): "In Review"
   * - pending: "Pending Review" / compact "Pending" (client review portal)
   */
  pendingLabel?: "review" | "pending";
};

/**
 * Shared project/canvas review status pill used across designer, superadmin,
 * client portals, and the public share-token review page.
 */
export function StatusBadge({
  status,
  className,
  showIcon = true,
  compact = false,
  pendingLabel = "review",
}: StatusBadgeProps) {
  const iconSize = compact ? 13 : 14;
  const sizeClass = compact
    ? "px-2 py-0.5 text-xs font-bold leading-none"
    : undefined;

  switch (status) {
    case "approved":
      return (
        <Badge variant="success" className={cn(sizeClass, className)}>
          {showIcon && <CheckCircle2 size={iconSize} />}
          Approved
        </Badge>
      );
    case "changes_requested":
      return (
        <Badge variant="warning" className={cn(sizeClass, className)}>
          {showIcon && <AlertCircle size={iconSize} />}
          {compact ? "Changes" : "Changes Requested"}
        </Badge>
      );
    default:
      return (
        <Badge variant="info" className={cn(sizeClass, className)}>
          {showIcon && <Clock size={iconSize} />}
          {pendingLabel === "pending"
            ? compact
              ? "Pending"
              : "Pending Review"
            : "In Review"}
        </Badge>
      );
  }
}
