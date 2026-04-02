import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../shared/api/client";
import PageHeader from "../../../shared/components/PageHeader";
import useConnectedCompanies from "../../../shared/hooks/useConnectedCompanies";
import { getCachedInvoicesSnapshot, setCachedInvoices } from "../../invoice/store/invoiceCache";

const STATUS_COLORS = {
  Paid: "text-bg-success",
  Draft: "text-bg-info",
  Sent: "text-bg-warning",
  Overdue: "text-bg-danger",
  Voided: "text-bg-danger",
};

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { companies, loadingCompanies, fetchCompanies } =
    useConnectedCompanies();
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [invoiceError, setInvoiceError] = useState("");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    const realmId = searchParams.get("realmId");

    if (connected === "true") {
      toast.success(
        realmId
          ? `QuickBooks connected successfully for realm ${realmId}.`
          : "QuickBooks connected successfully.",
      );
      navigate("/dashboard", { replace: true });
      fetchCompanies();
    } else if (connected === "false" || error) {
      toast.error(error || "QuickBooks connection failed.");
      navigate("/dashboard", { replace: true });
      fetchCompanies();
    }
  }, [fetchCompanies, navigate, searchParams]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (loadingCompanies) return;

      if (companies.length === 0) {
        setInvoices([]);
        setInvoiceError("");
        setLoadingInvoices(false);
        return;
      }

      const cachedSnapshot = getCachedInvoicesSnapshot(companies);
      if (cachedSnapshot.missingRealmIds.length === 0) {
        setInvoices(cachedSnapshot.invoices);
        setInvoiceError("");
        setLoadingInvoices(false);
        return;
      }

      setLoadingInvoices(true);
      setInvoiceError("");

      const results = await Promise.allSettled(
        companies
          .filter((company) => cachedSnapshot.missingRealmIds.includes(company.realmId))
          .map(async (company) => {
          const res = await api.get(
            `/invoices?realmId=${encodeURIComponent(company.realmId)}`,
          );
          const rows = res.data.data || [];
          const mapped = rows.map((invoice) => ({
            ...invoice,
            realmId: company.realmId,
            companyName: company.companyName,
          }));
          setCachedInvoices(company.realmId, mapped);
          return mapped;
        }),
      );

      const nextInvoices = getCachedInvoicesSnapshot(companies, { allowStale: true }).invoices
        .sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );

      const firstError = results.find((result) => result.status === "rejected");
      if (firstError?.reason) {
        setInvoiceError(
          firstError.reason.response?.data?.message ||
            firstError.reason.response?.data?.inner ||
            "Some invoices could not be loaded.",
        );
      }

      setInvoices(nextInvoices);
      setLoadingInvoices(false);
    };

    fetchInvoices();
  }, [companies, loadingCompanies]);


  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await api.get("/quickbooks/connect");
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.inner ||
          "Failed to initiate QuickBooks connection.",
      );
      setConnecting(false);
    }
  };

  const getQuickBooksInvoiceUrl = (invoice) =>
    invoice?.qbInvoiceId
      ? `https://app.qbo.intuit.com/app/invoice?txnId=${encodeURIComponent(invoice.qbInvoiceId)}&companyId=${encodeURIComponent(invoice.realmId || '')}`
      : null;

  const summary = useMemo(
    () => ({
      total: invoices.length,
      paid: invoices.filter((invoice) => invoice.status === "Paid").length,
      pending: invoices.filter((invoice) => invoice.status !== "Paid").length,
    }),
    [invoices],
  );

  const hasCompanies = companies.length > 0;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.firstName || "User"}`}
        subtitle="Here is a live overview of your connected QuickBooks companies"
      />

      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon text-primary">
              <i className="bi bi-building"></i>
            </span>
            <div className="stat-info">
              <h3>{loadingCompanies ? "..." : companies.length}</h3>
              <p>Companies</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon text-info">
              <i className="bi bi-receipt-cutoff"></i>
            </span>
            <div className="stat-info">
              <h3>{loadingInvoices ? "..." : summary.total}</h3>
              <p>Total Invoices</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon text-success">
              <i className="bi bi-check-circle-fill"></i>
            </span>
            <div className="stat-info">
              <h3>{loadingInvoices ? "..." : summary.paid}</h3>
              <p>Paid Invoices</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon text-warning">
              <i className="bi bi-hourglass-split"></i>
            </span>
            <div className="stat-info">
              <h3>{loadingInvoices ? "..." : summary.pending}</h3>
              <p>Pending Invoices</p>
            </div>
          </div>
        </div>
      </div>
      {/* <div ></div> */}
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="card-title d-flex align-items-center gap-2">
                <i className="bi bi-lightning-charge-fill text-warning"></i>
                <span>Quick Actions</span>
              </div>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConnect}
                  disabled={connecting}
                >
                  <i className="bi bi-plug-fill me-2"></i>
                  {connecting ? "Connecting..." : "Connect QuickBooks"}
                </button>
                <Link
                  to="/invoices/new"
                  className={`btn ${hasCompanies ? "btn-outline-primary" : "btn-outline-secondary disabled"}`}
                >
                  <i className="bi bi-file-earmark-plus me-2"></i>New Invoice
                </Link>
                <Link
                  to="/customers/new"
                  className={`btn ${hasCompanies ? "btn-outline-primary" : "btn-outline-secondary disabled"}`}
                >
                  <i className="bi bi-person-plus me-2"></i>New Customer
                </Link>
                <Link
                  to="/accounts/new"
                  className={`btn ${hasCompanies ? "btn-outline-primary" : "btn-outline-secondary disabled"}`}
                >
                  <i className="bi bi-wallet2 me-2"></i>New Account
                </Link>
                <Link
                  to="/items/new"
                  className={`btn ${hasCompanies ? "btn-outline-primary" : "btn-outline-secondary disabled"}`}
                >
                  <i className="bi bi-box-seam me-2"></i>New Item
                </Link>
              </div>
              {!loadingCompanies && !hasCompanies && (
                <div className="alert alert-warning mt-3 mb-0">
                  Connect at least one QuickBooks company to start working with
                  accounts, customers, items, and invoices.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="card-title d-flex align-items-center gap-2">
                <i className="bi bi-buildings-fill text-primary"></i>
                <span>Companies</span>
              </div>
              {loadingCompanies ? (
                <div className="loading">Loading companies...</div>
              ) : companies.length === 0 ? (
                <div className="empty-state">
                  <p>No companies connected yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Company</th>
                        <th>Realm ID</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((company) => (
                        <tr key={company.realmId}>
                          <td>{company.companyName || "Unnamed Company"}</td>
                          <td>
                            <code>{company.realmId}</code>
                          </td>
                          <td>
                            <span className="badge text-bg-success">
                              Connected
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">
          <div className="card-title d-flex align-items-center gap-2">
            <i className="bi bi-receipt text-info"></i>
            <span>Recent Invoices</span>
          </div>

          {invoiceError && (
            <div className="alert alert-danger mb-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {invoiceError}
            </div>
          )}

          {loadingInvoices ? (
            <div className="loading">Loading invoices...</div>
          ) : !hasCompanies ? (
            <div className="empty-state">
              <p>No connected companies, so no invoice data is shown.</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="empty-state">
              <p>No invoices found across your connected companies.</p>
              <Link to="/invoices/new" className="btn btn-primary mt-3">
                <i className="bi bi-file-earmark-plus me-2"></i>Create First
                Invoice
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Invoice #</th>
                    <th>Company</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 5).map((invoice) => (
                    <tr key={`${invoice.realmId}-${invoice.id}`}>
                      <td>
                        {getQuickBooksInvoiceUrl(invoice) ? (
                          <a
                            href={getQuickBooksInvoiceUrl(invoice)}
                            target="_blank"
                            rel="noreferrer"
                            className="link-primary text-decoration-none fw-semibold"
                            title="Open this invoice in QuickBooks"
                          >
                            {invoice.docNumber ||
                              invoice.qbInvoiceId ||
                              invoice.id}
                          </a>
                        ) : (
                          invoice.docNumber || invoice.qbInvoiceId || invoice.id
                        )}
                      </td>
                      <td>{invoice.companyName || "-"}</td>
                      <td>{invoice.customerName}</td>
                      <td>${Number(invoice.totalAmount || 0).toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge ${STATUS_COLORS[invoice.status] || "text-bg-info"}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
