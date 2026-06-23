"use client";
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdOutlineFileDownload } from "react-icons/md";

const TicketModal = ({ ticket, open, setOpen }) => {
  const resolveDate = (value) => {
    if (!value) return null;

    if (typeof value === "string" || typeof value === "number") {
      const parsedDate = new Date(value);
      return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    if (value instanceof Date) return value;

    if (typeof value === "object" && value._seconds) {
      return new Date(value._seconds * 1000);
    }

    return null;
  };

  const formatDate = (value) => {
    const parsedDate = resolveDate(value);

    if (!parsedDate) return "Date not available";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    const parsedDate = resolveDate(value);

    if (!parsedDate) return "Time not available";

    return parsedDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePrintTicket = () => {
    if (!ticket?.pdfURL) return;

    window.open(ticket.pdfURL, "_blank");
  };

  if (!ticket) return null;

  const event = ticket.event ?? {};
  const eventName = event.name ?? "Your Event";
  const venue = event.venue ?? "Venue not available";
  const ticketId = ticket.id ?? ticket.ticketId ?? "N/A";
  const eventEnd = resolveDate(event.endDate);
  const isExpired = eventEnd ? eventEnd < new Date() : false;
  const isUsed = Boolean(ticket.used);

  const status = isUsed
    ? {
        label: "Used",
        className: "border-sky-500/30 bg-sky-500/15 text-sky-300",
      }
    : isExpired
      ? {
          label: "Expired",
          className: "border-slate-500/30 bg-slate-500/15 text-slate-300",
        }
      : {
          label: "Active",
          className: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
        };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(100vw-1.25rem,48rem)] max-w-4xl border-slate-800/80 bg-[#020613] p-0 text-slate-100 shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
      >
        <div className="relative overflow-hidden rounded-xl bg-[#051330]">

          <div className="relative flex items-start justify-between gap-6 border-b border-white/10 px-6 py-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Event Ticket Preview
              </p>
              <DialogTitle className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {eventName}
              </DialogTitle>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Present this ticket at the venue. Your date, time, venue, and
                ticket ID are kept in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center"
              aria-label="Close ticket modal"
            >
              <span className="text-lg leading-none py-2 px-3 rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white">
                X
              </span>
            </button>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="px-6 py-4 sm:px-8">
              {/* <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${status.className}`}
                >
                  {status.label}
                </span>
              </div> */}

              <div className="w-full flex flex-col mt-2 rounded-md border border-white/10 bg-slate-950/35 px-4 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">Attendee</p>
                <p className="text-base font-medium text-white">{ticket.attendee.name}</p>
                <p className="text-xs text-slate-400">{ticket.attendee.email}</p>
              </div>

              <div className="mt-2 rounded-xl bg-white/5 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="flex flex-col justify-center items-center gap-2">
                  {/* <div className="w-full rounded-md border border-white/10 bg-slate-950/40 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Ticket ID
                    </p>
                    <p className="mt-1 text-sm font-medium text-white break-all">{ticketId}</p>
                  </div> */}

                  {/* <div className="w-full rounded-md border border-white/10 bg-slate-950/35 px-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Venue</p>
                    <p className="mt-2 text-base font-medium text-white">{venue}</p>
                  </div> */}

                  {/* <div className="w-full flex justify-center items-center gap-2">
                    <div className="w-1/2 rounded-md border border-white/10 bg-slate-950/35 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Date</p>
                      <p className="mt-2 text-base font-medium text-white">{formatDate(event.startDate)}</p>
                    </div>
                    <div className=" w-1/2 rounded-md border border-white/10 bg-slate-950/35 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Time</p>
                      <p className="mt-2 text-base font-medium text-white">{formatTime(event.startDate)}</p>
                    </div>
                  </div> */}

                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">SCAN AT ENTRANCE</p>

                  <div>
                    <img
                      src={ticket.qrURL}
                      alt="Ticket QR"
                      className="w-[290px] h-auto"
                    />
                  </div>

                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{ticket.id}</p>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    onClick={handlePrintTicket}
                    className="h-12 flex-1 gap-2 rounded-md bg-indigo-600 px-5 text-base font-semibold btnText transition hover:bg-indigo-700"
                  >
                    <MdOutlineFileDownload className="text-lg" />
                    Download Ticket
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
