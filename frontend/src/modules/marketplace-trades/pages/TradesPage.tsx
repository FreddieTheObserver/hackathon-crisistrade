import { useEffect, useMemo, useState } from "react";
import {
  fetchTrades,
  createTrade,
  updateTrade,
  deleteTrade,
} from "../api/marketplace-trades.api";
import type { Trade, TradeFilters, Status } from "../types/marketplace-trades.types";
import { PageHeader } from "../components/PageHeader";
import { TradeFilters as TradeFiltersBar } from "../components/TradeFilters";
import { AddTradeForm } from "../components/AddTradeForm";
import { TradeGrid } from "../components/TradeGrid";
import { ConfirmDeleteDialog } from "../components/ConfirmDeleteDialog";
import { CompleteTradeDialog } from "../components/CompleteTradeDialog";
import { useDebouncedValue } from "../lib/useDebouncedValue";
import { LoadingState, EmptyState, ErrorState } from "../../../components/StateViews";
import { useAuth } from "../../../auth/AuthContext";

const EMPTY_FILTERS: TradeFilters = {
  search: "",
  area: "",
  itemType: "",
  urgency: "",
  status: "",
};

/** Pull a message out of an unknown error, falling back to a default. */
function apiErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const data = (err as { response?: { data?: { message?: unknown } } }).response?.data;
    if (data && typeof data.message === "string") return data.message;
  }
  return fallback;
}

export function TradesPage() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TradeFilters>(EMPTY_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Trade | null>(null);
  const [completeTarget, setCompleteTarget] = useState<Trade | null>(null);
  const [completeSubmitting, setCompleteSubmitting] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);

  // Dropdown filters apply immediately; the free-text search is debounced so we
  // don't refetch on every keystroke.
  const { area, itemType, urgency, status } = filters;
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  // Fetch on mount and whenever an applied filter changes. The `active` flag
  // drops a stale response if filters changed again before this one resolved.
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchTrades({ search: debouncedSearch, area, itemType, urgency, status })
      .then((data) => {
        if (!active) return;
        setTrades(data);
        setLoadError(null);
      })
      .catch((err) => {
        if (active) setLoadError(apiErrorMessage(err, "Failed to load trades"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [area, itemType, urgency, status, debouncedSearch]);

  // Distinct locations for the filter dropdown, derived from loaded trades.
  const areaOptions = useMemo(
    () => [...new Set(trades.map((t) => t.area))].sort(),
    [trades]
  );

  function handleToggleForm() {
    setEditingTrade(null);
    setFormError(null);
    setFormOpen((open) => !open);
  }

  function handleEdit(trade: Trade) {
    setEditingTrade(trade);
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingTrade) {
        const updated = await updateTrade(editingTrade.id, formData);
        setTrades((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await createTrade(formData);
        setTrades((prev) => [created, ...prev]);
        setHighlightId(created.id);
      }
      setFormOpen(false);
      setEditingTrade(null);
    } catch (err) {
      setFormError(apiErrorMessage(err, "Could not save the trade"));
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    try {
      await deleteTrade(id);
      setTrades((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setLoadError(apiErrorMessage(err, "Could not delete the trade"));
    } finally {
      setDeleteTarget(null);
    }
  }

  function handleStatusChange(trade: Trade, status: Status) {
    if (status === trade.status) return;
    // Completing requires a counterparty — collect it via the dialog first.
    if (status === "completed") {
      setCompleteError(null);
      setCompleteTarget(trade);
      return;
    }
    void patchStatus(trade, status);
  }

  async function patchStatus(trade: Trade, status: Status) {
    const fd = new FormData();
    fd.append("status", status);
    try {
      const updated = await updateTrade(trade.id, fd);
      setTrades((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setLoadError(apiErrorMessage(err, "Could not update status"));
    }
  }

  async function confirmComplete(counterparty: string) {
    if (!completeTarget) return;
    setCompleteSubmitting(true);
    setCompleteError(null);
    const fd = new FormData();
    fd.append("status", "completed");
    fd.append("counterparty", counterparty);
    try {
      const updated = await updateTrade(completeTarget.id, fd);
      setTrades((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setCompleteTarget(null);
    } catch (err) {
      setCompleteError(apiErrorMessage(err, "Could not complete the trade"));
    } finally {
      setCompleteSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader formOpen={formOpen} onToggleForm={handleToggleForm} />

      <div className="mt-6 space-y-4">
        <AddTradeForm
          open={formOpen}
          editingTrade={editingTrade}
          submitting={submitting}
          error={formError}
          initialArea={user?.location ?? ""}
          initialContact={user?.phone || user?.email || ""}
          initialOwnerName={user?.displayName ?? ""}
          onCancel={() => {
            setFormOpen(false);
            setEditingTrade(null);
          }}
          onSubmit={handleSubmit}
        />

        <TradeFiltersBar
          filters={filters}
          areaOptions={areaOptions}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />

        {loading ? (
          <LoadingState label="Loading trades…" />
        ) : loadError ? (
          <ErrorState message={loadError} />
        ) : trades.length === 0 ? (
          <EmptyState title="No trades yet" description="Add the first one." />
        ) : (
          <TradeGrid
            trades={trades}
            highlightId={highlightId}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <CompleteTradeDialog
        open={completeTarget !== null}
        submitting={completeSubmitting}
        error={completeError}
        onCancel={() => setCompleteTarget(null)}
        onConfirm={confirmComplete}
      />
    </div>
  );
}
