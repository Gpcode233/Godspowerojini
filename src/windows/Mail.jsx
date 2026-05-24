import { useState } from "react";
import emailjs from "@emailjs/browser";
import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";

// ─── EmailJS Config ──────────────────────────────────────────────────────────
// 1. Sign up at https://www.emailjs.com
// 2. Create an Email Service (connect Gmail)
// 3. Create a Template with variables:
//    {{name}}, {{email}}, {{title}}, {{message}}
// 4. Replace the three values below with yours

const EJS_SERVICE_ID  = "service_2x4eu2z";
const EJS_TEMPLATE_ID = "template_o3j111d";
const EJS_PUBLIC_KEY  = "OsVEsxZz-vxCI9AQT";

// ─── Sidebar Data ────────────────────────────────────────────────────────────

const SIDEBAR = [
  { label: "INBOXES",  items: ["All Inboxes", "Personal", "Work"] },
  { label: "FAVORITES", items: ["Inbox", "Sent", "Drafts"] },
  { label: "MAILBOXES", items: ["Inbox", "Drafts", "Sent", "Junk", "Trash"] },
];

// ─── Component ───────────────────────────────────────────────────────────────

const Mail = () => {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [active, setActive] = useState("All Inboxes");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await emailjs.send(
        EJS_SERVICE_ID,
        EJS_TEMPLATE_ID,
        {
          name:    form.name,
          email:   form.email,
          title:   form.subject,
          message: form.message,
        },
        EJS_PUBLIC_KEY,
      );
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const isLoading = status === "loading";

  return (
    <>
      <div id="window-header">
        <WindowControls target="mail" />
        <h2>Mail</h2>
      </div>

      <div className="mail-body">
        {/* ── Sidebar ── */}
        <aside className="mail-sidebar">
          {SIDEBAR.map(({ label, items }) => (
            <div key={label} className="mail-sidebar-group">
              <p className="mail-sidebar-label">{label}</p>
              {items.map((name) => (
                <button
                  key={label + name}
                  className={`mail-sidebar-item ${active === label + name ? "mail-sidebar-active" : ""}`}
                  onClick={() => setActive(label + name)}
                >
                  <span className="text-xs">📬</span>
                  {name}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* ── Message list ── */}
        <div className="mail-list">
          <div className="mail-list-header">Inbox: Primary</div>
          <div className="mail-list-empty">
            <p>No messages</p>
            <p className="text-xs mt-1 text-gray-300">Compose one →</p>
          </div>
        </div>

        {/* ── Compose pane ── */}
        <div className="mail-compose-pane">
          <div className="mail-compose-top">
            <h3>New Message</h3>
          </div>

          <form onSubmit={handleSubmit} className="mail-form">
            <div className="mail-field">
              <label>From</label>
              <input name="email" type="email" placeholder="your@email.com"
                value={form.email} onChange={handleChange} required disabled={isLoading} />
            </div>

            <div className="mail-field">
              <label>Name</label>
              <input name="name" type="text" placeholder="Your name"
                value={form.name} onChange={handleChange} required disabled={isLoading} />
            </div>

            <div className="mail-field">
              <label>To</label>
              <input value="godspowerojini8@gmail.com" readOnly />
            </div>

            <div className="mail-field">
              <label>Subject</label>
              <input name="subject" type="text" placeholder="Subject"
                value={form.subject} onChange={handleChange} required disabled={isLoading} />
            </div>

            <textarea name="message" className="mail-textarea"
              placeholder="Write your message here..."
              value={form.message} onChange={handleChange}
              required disabled={isLoading}
            />

            <div className="mail-form-footer">
              {status === "success" && (
                <p className="mail-status-ok">✓ Message sent!</p>
              )}
              {status === "error" && (
                <p className="mail-status-err">✕ Failed to send. Try again.</p>
              )}
              <button type="submit" className="mail-send-btn" disabled={isLoading}>
                {isLoading ? "Sending…" : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const MailWindow = WindowWrapper(Mail, "mail");
export default MailWindow;
