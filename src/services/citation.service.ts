import type { Investigation, CitationFormat, Citation } from '@/types';
import { format } from 'date-fns';

// ============================================================
// Citation generation service
// ============================================================

function formatDate(dateString: string, citFormat: CitationFormat): string {
  const date = new Date(dateString);
  switch (citFormat) {
    case 'APA':
      return format(date, 'MMMM d, yyyy');
    case 'MLA':
      return format(date, 'd MMM. yyyy');
    case 'Chicago':
      return format(date, 'MMMM d, yyyy');
    case 'IEEE':
      return format(date, 'MMM. d, yyyy');
  }
}

function generateAPA(inv: Investigation): string {
  const year = new Date(inv.eventDate).getFullYear();
  const location = `${inv.location.city}, ${inv.location.stateAbbr}`;
  const airport = inv.location.airport ? ` at ${inv.location.airport}` : '';

  return (
    `National Transportation Safety Board. (${year}). ` +
    `Aviation accident/incident report: ${inv.id}${airport}${location ? ', ' + location : ''}` +
    ` (NTSB Report No. ${inv.id}). ` +
    `https://www.ntsb.gov/investigations/Pages/${inv.id}.aspx`
  );
}

function generateMLA(inv: Investigation): string {
  const location = `${inv.location.city}, ${inv.location.stateAbbr}`;
  const airport = inv.location.airport ? ` at ${inv.location.airport}` : '';

  return (
    `National Transportation Safety Board. ` +
    `"Aviation Accident/Incident Report: ${inv.id}${airport}${location ? ', ' + location : ''}." ` +
    `NTSB, ${formatDate(inv.eventDate, 'MLA')}, ` +
    `www.ntsb.gov/investigations/Pages/${inv.id}.aspx.`
  );
}

function generateChicago(inv: Investigation): string {
  const year = new Date(inv.eventDate).getFullYear();
  const location = `${inv.location.city}, ${inv.location.stateAbbr}`;
  const airport = inv.location.airport ? ` at ${inv.location.airport}` : '';

  return (
    `National Transportation Safety Board. "${inv.id}: Aviation Accident/Incident Report` +
    `${airport}${location ? ', ' + location : ''}." Washington, DC: NTSB, ${year}. ` +
    `Accessed ${format(new Date(), 'MMMM d, yyyy')}. ` +
    `https://www.ntsb.gov/investigations/Pages/${inv.id}.aspx.`
  );
}

function generateIEEE(inv: Investigation): string {
  const year = new Date(inv.eventDate).getFullYear();
  const airport = inv.location.airport ? ` at ${inv.location.airport}` : '';
  const location = `${inv.location.city}, ${inv.location.stateAbbr}`;

  return (
    `[1] National Transportation Safety Board, ` +
    `"Aviation Accident/Incident Report ${inv.id}${airport}${location ? ', ' + location : ''}," ` +
    `Washington, DC, NTSB Report No. ${inv.id}, ${year}. ` +
    `[Online]. Available: https://www.ntsb.gov/investigations/Pages/${inv.id}.aspx`
  );
}

export function generateCitation(inv: Investigation, format: CitationFormat): Citation {
  let text: string;
  switch (format) {
    case 'APA':
      text = generateAPA(inv);
      break;
    case 'MLA':
      text = generateMLA(inv);
      break;
    case 'Chicago':
      text = generateChicago(inv);
      break;
    case 'IEEE':
      text = generateIEEE(inv);
      break;
  }
  return { investigation: inv, format, text };
}

export function generateBibliography(
  investigations: Investigation[],
  citFormat: CitationFormat
): string {
  return investigations.map((inv) => generateCitation(inv, citFormat).text).join('\n\n');
}
