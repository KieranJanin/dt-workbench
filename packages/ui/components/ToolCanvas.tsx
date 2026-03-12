import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, Loader2, Save, FilePlus, Edit2 } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { usePhaseStore } from '../../../apps/web/store/usePhaseStore';

export interface PDFExportBlock {
  type: 'section_header' | 'text' | 'grid' | 'key-value' | 'list';
  title?: string;
  content: any;
}

export interface PDFExportData {
  title: string;
  blocks: PDFExportBlock[];
}

interface ToolCanvasProps {
  emoji: string;
  title: string;
  description: string;
  exportData?: PDFExportData;
  onSaveFn?: () => void;
  onSaveAsNewFn?: () => void;
  isSaving?: boolean;
  children: React.ReactNode;
}

export function ToolCanvas({ emoji, title, description, exportData, onSaveFn, onSaveAsNewFn, isSaving, children }: ToolCanvasProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { language, activeArtifactId, artifacts, renameArtifact, settings } = usePhaseStore();
  const { t } = useTranslation(language);

  // Title Editing State
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  const activeArtifact = activeArtifactId ? artifacts.find(a => a.id === activeArtifactId) : null;
  const displayTitle = activeArtifact?.customTitle || activeArtifact?.title || t(title);

  const handleStartEdit = () => {
    if (!activeArtifactId) return;
    setIsEditingTitle(true);
    setTempTitle(activeArtifact?.customTitle || activeArtifact?.title || t(title));
  };

  const handleSaveTitle = () => {
    if (activeArtifactId && tempTitle.trim() !== '') {
      renameArtifact(activeArtifactId, tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveTitle();
    if (e.key === 'Escape') setIsEditingTitle(false);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);

    // Yield to the event loop to show the loader
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      const checkPageBreak = (needed: number) => {
        if (yPos + needed > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
      };

      // 1. Document Header (Project & Team info)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 30, 30);
      const projName = settings.projectName || t("Design Thinking Project");
      const projLines = doc.splitTextToSize(projName, pageWidth - margin * 2);
      doc.text(projLines, margin, yPos);
      yPos += (projLines.length * 8) + 2;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`${t("Team Members")}: ${settings.teamMembers || t("Not specified")}`, margin, yPos);
      yPos += 5;
      doc.text(`${t("Export Date")}: ${new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}  |  ${t("Tool")}: ${t(title)}`, margin, yPos);
      yPos += 8;

      // Draw Separator Line
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 15;

      // 2. Artifact Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(50, 50, 50);
      const titleLines = doc.splitTextToSize(displayTitle, pageWidth - margin * 2);
      doc.text(titleLines, margin, yPos);
      yPos += (titleLines.length * 7) + 8;

      if (!exportData) {
        // Fallback for tools not yet migrated to structured exportData
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text(t("Structured PDF export is not yet implemented for this tool."), margin, yPos);
      } else {
        // 3. Render Structured Blocks
        for (const block of exportData.blocks) {
          if (block.title) {
            checkPageBreak(15);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(40, 40, 40);
            doc.text(t(block.title), margin, yPos);
            yPos += 8;
          }

          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          doc.setTextColor(60, 60, 60);

          if (block.type === 'text') {
            const textContent = block.content?.toString() || "";
            if (textContent.trim() === "") continue;
            
            const lines = doc.splitTextToSize(textContent, pageWidth - margin * 2);
            checkPageBreak(lines.length * 6);
            doc.text(lines, margin, yPos);
            yPos += (lines.length * 6) + 4;
          } 
          else if (block.type === 'section_header') {
            yPos += 4; // Add a bit of space before headers
            checkPageBreak(12);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(30, 30, 30);
            doc.text(t(block.content?.toString() || ""), margin, yPos);
            yPos += 10;
            // Draw brief underline
            doc.setDrawColor(240, 240, 240);
            doc.line(margin, yPos - 6, pageWidth - margin, yPos - 6);
          }
           else if (block.type === 'list') {
            const items = Array.isArray(block.content) ? block.content : [];
            for (const item of items) {
              const lines = doc.splitTextToSize(`• ${item}`, pageWidth - margin * 2 - 5);
              checkPageBreak(lines.length * 6);
              doc.text(lines, margin + 5, yPos);
              yPos += (lines.length * 6) + 2;
            }
            yPos += 4;
          } 
          else if (block.type === 'key-value') {
            const pairs = Array.isArray(block.content) ? block.content : [];
            for (const pair of pairs) {
              checkPageBreak(10);
              doc.setFont("helvetica", "bold");
              doc.text(`${t(pair.key)}:`, margin, yPos);
              
              doc.setFont("helvetica", "normal");
              const valueLines = doc.splitTextToSize(pair.value?.toString() || "", pageWidth - margin * 2 - 40);
              doc.text(valueLines, margin + 40, yPos);
              
              yPos += Math.max(6, valueLines.length * 6) + 2;
            }
            yPos += 4;
          }
          else if (block.type === 'grid') {
            // Very simple grid rendering: just print rows
            const rows = Array.isArray(block.content) ? block.content : [];
            for (const row of rows) {
              if (Array.isArray(row)) {
                // If it's a 2-column map
                const colW = (pageWidth - margin * 2) / row.length;
                let maxLines = 1;
                const rowData = row.map(cell => {
                   const cellLines = doc.splitTextToSize(t(cell?.toString() || ""), colW - 5);
                   maxLines = Math.max(maxLines, cellLines.length);
                   return cellLines;
                });
                
                checkPageBreak(maxLines * 6 + 4);
                
                rowData.forEach((lines, i) => {
                  doc.text(lines, margin + (i * colW), yPos);
                });
                yPos += (maxLines * 6) + 4;
              } else {
                 // Fallback if not an array of arrays
                 const lines = doc.splitTextToSize(row?.toString() || "", pageWidth - margin * 2);
                 checkPageBreak(lines.length * 6);
                 doc.text(lines, margin, yPos);
                 yPos += (lines.length * 6) + 2;
              }
            }
            yPos += 4;
          }
        }
      }

      doc.save(`${title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating document PDF:', error);
      alert("Failed to export formatted PDF. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 overflow-y-auto">
      <div 
        ref={contentRef}
        className="bg-card rounded-2xl border border-border flex flex-col shadow-sm w-full min-h-full"
      >
        {/* Tool Header */}
        <div className="p-6 md:p-8 border-b border-border flex justify-between items-start bg-muted-bg/50 rounded-t-2xl shrink-0">
          <div className="flex-1 mr-4">
            <div className="inline-flex items-center gap-3 mb-3 w-full group/title">
              <span className="text-4xl shrink-0">{emoji}</span>
              {isEditingTitle ? (
                <input 
                  autoFocus
                  type="text"
                  value={tempTitle}
                  onChange={e => setTempTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={handleKeyDown}
                  className="text-3xl font-extrabold bg-background border border-border focus:border-primary rounded-lg px-2 py-1 w-full max-w-xl"
                />
              ) : (
                <h2 
                  className={`text-3xl font-extrabold text-foreground truncate ${activeArtifactId ? 'cursor-pointer group-hover/title:text-primary transition-colors' : ''}`}
                  onClick={activeArtifactId ? handleStartEdit : undefined}
                  title={activeArtifactId ? t("Click to edit title") : undefined}
                >
                  {displayTitle}
                </h2>
              )}
              {activeArtifactId && !isEditingTitle && (
                <button 
                  onClick={handleStartEdit}
                  className="opacity-0 group-hover/title:opacity-100 p-2 text-muted-fg hover:text-primary transition-opacity shrink-0"
                  title={t("Rename Artifact")}
                >
                  <Edit2 size={20} />
                </button>
              )}
            </div>
            <p className="text-muted-fg leading-relaxed text-lg max-w-4xl">{t(description)}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 ml-4">
            {onSaveFn && (
              <button 
                data-html2canvas-ignore="true"
                onClick={onSaveFn}
                disabled={isExporting || isSaving}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-fg px-4 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {t("Save")}
              </button>
            )}

            {onSaveAsNewFn && (
              <button 
                data-html2canvas-ignore="true"
                onClick={onSaveAsNewFn}
                disabled={isExporting || isSaving}
                className="inline-flex items-center gap-2 bg-background border border-border text-foreground px-4 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-muted-bg transition-colors disabled:opacity-50"
                title={t("Save as New Version")}
              >
                <FilePlus size={16} />
                <span className="sr-only">{t("Save as New")}</span>
              </button>
            )}

            <button 
              data-html2canvas-ignore="true"
              onClick={handleExportPDF}
              disabled={isExporting || isSaving}
              className="inline-flex items-center gap-2 bg-primary text-black px-5 py-2.5 rounded-lg font-bold text-sm shadow-md hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 group"
            >
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} className="group-hover:animate-bounce" />}
              {isExporting ? t("Exporting...") : t("Export PDF")}
            </button>
          </div>
        </div>

        {/* Tool Content Form */}
        <div className="p-6 md:p-8 bg-background rounded-b-2xl flex-1 flex flex-col items-center">
            <div className="w-full max-w-6xl mx-auto h-full flex flex-col">
              {children}
            </div>
        </div>
      </div>
    </div>
  );
}
