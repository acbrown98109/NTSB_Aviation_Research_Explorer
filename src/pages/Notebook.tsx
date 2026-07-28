import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookmarkIcon,
  PencilSquareIcon,
  FolderIcon,
  TrashIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { useNotebookStore } from '@/store/notebookStore';
import { useAllInvestigations } from '@/hooks/useInvestigations';
import { Card, SectionHeader, StatCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { InvestigationCard } from '@/components/investigation/InvestigationCard';
import { generateCitation } from '@/services/citation.service';
import { generateBibliography } from '@/services/citation.service';
import type { CitationFormat } from '@/types';

type TabId = 'bookmarks' | 'notes' | 'projects' | 'bibliography';

export function NotebookPage() {
  const navigate = useNavigate();
  const { data: allInvestigations = [] } = useAllInvestigations();
  const {
    entries,
    projects,
    getBookmarkedIds,
    removeBookmark,
    removeNote,
    createProject,
    deleteProject,
  } = useNotebookStore();

  const [activeTab, setActiveTab] = useState<TabId>('bookmarks');
  const [citFormat, setCitFormat] = useState<CitationFormat>('APA');
  const [newProjectName, setNewProjectName] = useState('');
  const [copied, setCopied] = useState(false);

  const bookmarkedIds = getBookmarkedIds();
  const bookmarkedInvestigations = allInvestigations.filter((inv) =>
    bookmarkedIds.includes(inv.id)
  );

  const notes = entries.filter((e) => e.type === 'note');
  const highlights = entries.filter((e) => e.type === 'highlight');

  const bibliography = generateBibliography(bookmarkedInvestigations, citFormat);

  const handleCopyBiblio = async () => {
    await navigator.clipboard.writeText(bibliography);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim());
      setNewProjectName('');
    }
  };

  const TABS: { id: TabId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'bookmarks', label: 'Bookmarks', icon: BookmarkIcon, count: bookmarkedIds.length },
    { id: 'notes', label: 'Notes', icon: PencilSquareIcon, count: notes.length },
    { id: 'projects', label: 'Projects', icon: FolderIcon, count: projects.length },
    { id: 'bibliography', label: 'Bibliography', icon: TagIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#003b75' }}>Research Notebook</h1>
        <p className="text-sm text-[#666666]">
          Your saved investigations, research notes, and citation library
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Bookmarks" value={bookmarkedIds.length} variant="info" />
        <StatCard label="Notes" value={notes.length} variant="default" />
        <StatCard label="Highlights" value={highlights.length} variant="warning" />
        <StatCard label="Projects" value={projects.length} variant="success" />
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-[#e0e0e0] overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-[#003b75] border-[#0063a6]'
                  : 'text-[#666666] hover:text-[#333333] border-transparent'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 inline-flex items-center justify-center h-4 min-w-4 px-1 bg-[#e1f0fa] text-[#003b75] text-[10px] font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {/* Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-3">
              {bookmarkedInvestigations.length === 0 ? (
                <EmptyState
                  icon={<BookmarkIcon className="h-12 w-12" />}
                  title="No bookmarks yet"
                  description="Bookmark investigations from the investigation list or detail page to save them here."
                  action={
                    <Button variant="primary" size="sm" onClick={() => navigate('/investigations')}>
                      Browse Investigations
                    </Button>
                  }
                />
              ) : (
                bookmarkedInvestigations.map((inv) => (
                  <div key={inv.id} className="relative">
                    <InvestigationCard investigation={inv} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmark(inv.id);
                      }}
                      className="absolute top-3 right-10 p-1.5 text-[#aaaaaa] hover:text-red-500 transition-colors z-10"
                      title="Remove bookmark"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Notes */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              {notes.length === 0 ? (
                <EmptyState
                  icon={<PencilSquareIcon className="h-12 w-12" />}
                  title="No notes yet"
                  description="Add notes from the investigation detail page while reviewing events."
                  action={
                    <Button variant="primary" size="sm" onClick={() => navigate('/investigations')}>
                      Browse Investigations
                    </Button>
                  }
                />
              ) : (
                notes.map((note) => {
                  const inv = allInvestigations.find((i) => i.id === note.investigationId);
                  return (
                    <Card key={note.id} padding="md">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <button
                            onClick={() => navigate(`/investigations/${note.investigationId}`)}
                            className="font-mono text-sm font-bold text-[#0063a6] hover:text-[#003b75]"
                          >
                            {note.investigationId}
                          </button>
                          {inv && (
                            <span className="text-xs text-[#888888] ml-2">
                              — {inv.location.city}, {inv.location.stateAbbr}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeNote(note.id)}
                          className="text-[#aaaaaa] hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-[#444444] leading-relaxed">{note.content}</p>
                      <p className="text-xs text-[#aaaaaa] mt-2">{note.createdAt}</p>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <Card padding="md">
                <SectionHeader title="New Research Project" className="mb-3" />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                    placeholder="Project name…"
                    className="flex-1 bg-white border border-[#cccccc] px-3 py-2 text-sm text-[#333333]
                      placeholder:text-[#999999] focus:outline-none focus:border-[#0063a6]"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!newProjectName.trim()}
                    onClick={handleCreateProject}
                  >
                    Create
                  </Button>
                </div>
              </Card>

              {projects.length === 0 ? (
                <EmptyState
                  icon={<FolderIcon className="h-12 w-12" />}
                  title="No projects yet"
                  description="Create a project to organize related investigations for your research."
                />
              ) : (
                projects.map((project) => {
                  const projInvestigations = allInvestigations.filter((inv) =>
                    project.investigationIds.includes(inv.id)
                  );
                  return (
                    <Card key={project.id} padding="md">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#333333]">{project.name}</h3>
                          {project.description && (
                            <p className="text-xs text-[#888888] mt-0.5">{project.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="text-[#aaaaaa] hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#888888] mb-3">
                        <span>{projInvestigations.length} investigation{projInvestigations.length !== 1 ? 's' : ''}</span>
                        <span>·</span>
                        <span>Created {project.createdAt.slice(0, 10)}</span>
                      </div>
                      {projInvestigations.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {projInvestigations.map((inv) => (
                            <button
                              key={inv.id}
                              onClick={() => navigate(`/investigations/${inv.id}`)}
                              className="font-mono text-xs text-[#0063a6] hover:text-[#003b75] bg-[#f5f7f9] border border-[#e0e0e0] px-2 py-0.5"
                            >
                              {inv.id}
                            </button>
                          ))}
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* Bibliography */}
          {activeTab === 'bibliography' && (
            <div className="space-y-4">
              <Card padding="md">
                <div className="flex items-center justify-between mb-4">
                  <SectionHeader
                    title="Citation Bibliography"
                    subtitle={`${bookmarkedInvestigations.length} bookmarked investigation${bookmarkedInvestigations.length !== 1 ? 's' : ''}`}
                  />
                  <div className="flex gap-1">
                    {(['APA', 'MLA', 'Chicago', 'IEEE'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setCitFormat(fmt)}
                        className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                          citFormat === fmt
                            ? 'bg-[#e1f0fa] text-[#003b75]'
                            : 'text-[#666666] hover:text-[#333333]'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {bookmarkedInvestigations.length === 0 ? (
                  <EmptyState
                    title="No bookmarks"
                    description="Bookmark investigations to generate a bibliography."
                    action={
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveTab('bookmarks')}
                      >
                        Go to Bookmarks
                      </Button>
                    }
                  />
                ) : (
                  <>
                    <div className="bg-[#f5f7f9] border border-[#e0e0e0] p-4 font-mono text-xs text-[#444444] leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto mb-3">
                      {bibliography}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleCopyBiblio}
                    >
                      {copied ? '✓ Copied!' : `Copy ${citFormat} Bibliography`}
                    </Button>
                  </>
                )}
              </Card>

              {bookmarkedInvestigations.length > 0 && (
                <div className="space-y-2">
                  {bookmarkedInvestigations.map((inv) => {
                    const cit = generateCitation(inv, citFormat);
                    return (
                      <Card key={inv.id} padding="sm">
                        <span className="font-mono text-xs text-[#0063a6] mb-1 block">{inv.id}</span>
                        <p className="text-xs text-[#444444] leading-relaxed font-mono">{cit.text}</p>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
