export interface NtsbEvent {
  id: string;
  eventDate: string;
  city: string;
  state: string;
  airport?: string;
  eventType: string;
  severity: string;
  narrative: string;
  probableCause: string;
}

export async function searchNtsb(params: {
  query?: string;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}): Promise<NtsbEvent[]> {
  const res = await fetch('/ntsb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error);

  // CAROL returns rows in data.Table or data.Results — normalize whichever shape comes back
  const rows: Record<string, string>[] = data?.Table ?? data?.Results ?? data?.rows ?? [];

  return rows.map((row) => ({
    id: row.ntsb_no ?? row.ev_id ?? row.EventId ?? '',
    eventDate: row.ev_date ?? row.EventDate ?? '',
    city: row.ev_city ?? row.City ?? '',
    state: row.ev_state ?? row.State ?? '',
    airport: row.apt_name ?? row.AirportName ?? undefined,
    eventType: row.ev_type ?? row.EventType ?? '',
    severity: row.inj_tot_f ? 'fatal' : row.inj_tot_s ? 'serious' : row.inj_tot_m ? 'minor' : 'none',
    narrative: row.narr_accp ?? row.Narrative ?? '',
    probableCause: row.narr_cause ?? row.ProbableCause ?? '',
  }));
}
