import type { Investigation, ExportOptions } from '@/types';
import { generateBibliography } from './citation.service';
import { format } from 'date-fns';
import Papa from 'papaparse';

// ============================================================
// Export service — CSV, JSON, PDF, Markdown
// ============================================================

export function exportToCSV(investigations: Investigation[]): void {
  const rows = investigations.map((inv) => ({
    'NTSB ID': inv.id,
    'Date': inv.eventDate,
    'Time': inv.eventTime,
    'City': inv.location.city,
    'State': inv.location.stateAbbr,
    'Airport': inv.location.airport ?? '',
    'Airport ICAO': inv.location.airportId ?? '',
    'Event Type': inv.eventType,
    'Sub Type': inv.subType,
    'Severity': inv.severity,
    'Status': inv.status,
    'RI Category': inv.runwayIncursion?.category ?? '',
    'Runway': inv.runwayIncursion?.runway ?? '',
    'Aircraft 1': `${inv.aircraft[0]?.manufacturer ?? ''} ${inv.aircraft[0]?.model ?? ''}`.trim(),
    'Operator 1': inv.aircraft[0]?.operator ?? '',
    'Aircraft 2': `${inv.aircraft[1]?.manufacturer ?? ''} ${inv.aircraft[1]?.model ?? ''}`.trim(),
    'Weather': inv.weather.flightCategory,
    'Visibility': inv.weather.visibility,
    'Ceiling': inv.weather.ceiling ?? '',
    'Nighttime': inv.weather.nighttime ? 'Yes' : 'No',
    'Fatalities': inv.injuries.fatal,
    'Serious Injuries': inv.injuries.serious,
    'Synopsis': inv.synopsis,
    'Probable Cause': inv.probableCause,
    'Report URL': inv.reportUrl ?? '',
  }));

  const csv = Papa.unparse(rows);
  downloadFile(csv, `ntsb-investigations-${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv');
}

export function exportToJSON(investigations: Investigation[]): void {
  const json = JSON.stringify(investigations, null, 2);
  downloadFile(
    json,
    `ntsb-investigations-${format(new Date(), 'yyyy-MM-dd')}.json`,
    'application/json'
  );
}

export function exportToMarkdown(investigations: Investigation[], options: ExportOptions): void {
  const lines: string[] = [
    `# NTSB Aviation Research Export`,
    ``,
    `Generated: ${format(new Date(), 'MMMM d, yyyy')}  `,
    `Investigations: ${investigations.length}`,
    ``,
    `---`,
    ``,
  ];

  for (const inv of investigations) {
    lines.push(`## ${inv.id} — ${inv.location.city}, ${inv.location.stateAbbr}`);
    lines.push(`**Date:** ${inv.eventDate} at ${inv.eventTime} local  `);
    lines.push(`**Airport:** ${inv.location.airport ?? 'N/A'} (${inv.location.airportId ?? 'N/A'})  `);
    lines.push(`**Type:** ${inv.subType.replace(/_/g, ' ')}  `);
    lines.push(`**Severity:** ${inv.severity}  `);
    if (inv.runwayIncursion) {
      lines.push(`**Runway Incursion:** Category ${inv.runwayIncursion.category} — Runway ${inv.runwayIncursion.runway}  `);
    }
    lines.push(`**Weather:** ${inv.weather.flightCategory} — ${inv.weather.visibility} SM visibility  `);
    lines.push(``);
    lines.push(`**Synopsis:** ${inv.synopsis}`);
    lines.push(``);

    if (options.includeNarrative) {
      lines.push(`### Narrative`);
      lines.push(``);
      lines.push(inv.narrative);
      lines.push(``);
    }

    lines.push(`### Probable Cause`);
    lines.push(``);
    lines.push(inv.probableCause);
    lines.push(``);

    if (options.includeHumanFactors && inv.humanFactors.length > 0) {
      lines.push(`### Human Factors`);
      lines.push(``);
      for (const hf of inv.humanFactors) {
        lines.push(`- **${hf.category.replace(/_/g, ' ')}** (${hf.confidence}%): ${hf.description}`);
      }
      lines.push(``);
    }

    if (options.includeRecommendations && inv.recommendations.length > 0) {
      lines.push(`### Recommendations`);
      lines.push(``);
      for (const rec of inv.recommendations) {
        lines.push(`- **${rec.id}** [${rec.status}]: ${rec.text}`);
      }
      lines.push(``);
    }

    if (options.includeTimeline && inv.timeline.length > 0) {
      lines.push(`### Timeline`);
      lines.push(``);
      for (const event of inv.timeline) {
        lines.push(`- **${event.time}**: ${event.description}`);
      }
      lines.push(``);
    }

    if (inv.reportUrl) {
      lines.push(`**NTSB Report:** ${inv.reportUrl}`);
      lines.push(``);
    }

    lines.push(`---`);
    lines.push(``);
  }

  if (options.citationFormat) {
    lines.push(`## Bibliography (${options.citationFormat})`);
    lines.push(``);
    lines.push(generateBibliography(investigations, options.citationFormat));
  }

  downloadFile(
    lines.join('\n'),
    `ntsb-research-${format(new Date(), 'yyyy-MM-dd')}.md`,
    'text/markdown'
  );
}

export async function exportToPDF(
  investigations: Investigation[],
  _options: ExportOptions
): Promise<void> {
  // Dynamic import for bundle splitting
  const [{ default: jsPDF }] = await Promise.all([import('jspdf')]);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const margin = 20;
  const pageWidth = 210;
  const usableWidth = pageWidth - margin * 2;
  let y = margin;

  const addText = (
    text: string,
    fontSize = 10,
    bold = false,
    color: [number, number, number] = [30, 30, 30]
  ) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setTextColor(...color);

    const lines = pdf.splitTextToSize(text, usableWidth);
    if (y + lines.length * (fontSize * 0.4) > 280) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(lines, margin, y);
    y += lines.length * (fontSize * 0.4) + 2;
  };

  const addSpacer = (h = 4) => { y += h; };

  // Title
  addText('NTSB Aviation Research Export', 18, true, [10, 40, 80]);
  addText(`Generated: ${format(new Date(), 'MMMM d, yyyy')} | Investigations: ${investigations.length}`, 9, false, [100, 100, 100]);
  addSpacer(6);

  for (const inv of investigations) {
    addText(`${inv.id} — ${inv.location.city}, ${inv.location.stateAbbr}`, 13, true, [10, 40, 80]);
    addText(`${inv.eventDate} at ${inv.eventTime} | ${inv.location.airport ?? 'Unknown Airport'}`, 9, false, [80, 80, 80]);
    addSpacer(2);
    addText(`Type: ${inv.subType.replace(/_/g, ' ')} | Severity: ${inv.severity} | Weather: ${inv.weather.flightCategory}`, 9);
    if (inv.runwayIncursion) {
      addText(`Runway Incursion Category ${inv.runwayIncursion.category} — Runway ${inv.runwayIncursion.runway}`, 9, false, [200, 50, 50]);
    }
    addSpacer(2);
    addText('Synopsis', 10, true);
    addText(inv.synopsis, 9);
    addSpacer(2);
    addText('Probable Cause', 10, true);
    addText(inv.probableCause, 9);
    addSpacer(6);
  }

  pdf.save(`ntsb-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
