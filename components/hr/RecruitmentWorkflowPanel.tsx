// @ts-nocheck
"use client";

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const ui = {
  green: '#107927',
  greenDark: '#0b5d1e',
  greenSoft: '#edf7ea',
  black: '#111827',
  muted: '#4b5563',
  white: '#ffffff',
  border: 'rgba(17, 24, 39, 0.12)',
};

const cardStyle = {
  borderRadius: 3,
  border: `1px solid ${ui.border}`,
  backgroundColor: ui.white,
  boxShadow: '0 12px 28px rgba(17, 24, 39, 0.06)',
};

const sectionDividerSx = { mb: 1.5, borderColor: 'rgba(16, 121, 39, 0.18)' };

const tableHeadCellSx = {
  color: ui.black,
  bgcolor: ui.greenSoft,
  fontWeight: 800,
  borderBottom: `1px solid ${ui.border}`,
};

const primaryButtonSx = {
  textTransform: 'none',
  color: ui.white,
  fontWeight: 800,
  bgcolor: ui.green,
  borderRadius: 2,
  '&:hover': { bgcolor: ui.greenDark },
};

const darkButtonSx = {
  textTransform: 'none',
  color: ui.white,
  fontWeight: 700,
  bgcolor: ui.black,
  borderRadius: 2,
  '&:hover': { bgcolor: '#000000' },
};

const compactActionButtonSx = {
  minWidth: 0,
  px: 1,
  py: 0.35,
  fontSize: 12,
  lineHeight: 1.2,
};

const tableContainerSx = {
  overflowX: 'auto',
  '&::-webkit-scrollbar': { height: 8 },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(17,24,39,0.25)',
    borderRadius: 999,
  },
};

const recruitmentStageSequence = ['sourcing', 'screening', 'interview_1', 'interview_2', 'final_interview', 'offer', 'onboarding'] as const;
const recruitmentStageLabels = {
  sourcing: 'Sourcing',
  screening: 'Screening',
  interview_1: 'Interview 1',
  interview_2: 'Interview 2',
  final_interview: 'Final Interview',
  offer: 'Job Offer',
  onboarding: 'Onboarding',
  hired: 'Hired',
  rejected: 'Rejected',
} as const;

function stageChipSx(stage: keyof typeof recruitmentStageLabels) {
  if (stage === 'hired') return { bgcolor: ui.green, color: ui.white, fontWeight: 800 };
  if (stage === 'rejected') return { bgcolor: ui.black, color: ui.white, fontWeight: 800 };
  return { bgcolor: ui.greenSoft, color: ui.greenDark, fontWeight: 800 };
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function RecruitmentWorkflowPanel({ onHireEmployee }: { onHireEmployee?: (employee: { name: string; position: string }) => void }) {
  const [snack, setSnack] = React.useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [jobPostings, setJobPostings] = React.useState([
    {
      id: 1,
      title: 'Parking Operations Coordinator',
      department: 'Operations',
      headcount: 2,
      sourceChannels: 'Careers Site, LinkedIn, Referral Program',
      status: 'published',
      openedAt: '2026-07-21T08:00:00.000Z',
    },
  ]);
  const [candidates, setCandidates] = React.useState([
    {
      id: 101,
      postingId: 1,
      postingTitle: 'Parking Operations Coordinator',
      position: 'Parking Operations Coordinator',
      name: 'Maria Cruz',
      source: 'LinkedIn',
      stage: 'screening',
      status: 'active',
      notes: 'Meets minimum qualifications and has coordination experience.',
      appliedAt: '2026-07-21T09:15:00.000Z',
      updatedAt: '2026-07-21T11:30:00.000Z',
    },
    {
      id: 102,
      postingId: 1,
      postingTitle: 'Parking Operations Coordinator',
      position: 'Parking Operations Coordinator',
      name: 'James Tan',
      source: 'Referral',
      stage: 'offer',
      status: 'active',
      notes: 'Completed final interview; pending offer approval.',
      appliedAt: '2026-07-20T08:40:00.000Z',
      updatedAt: '2026-07-21T12:10:00.000Z',
    },
    {
      id: 103,
      postingId: 1,
      postingTitle: 'Parking Operations Coordinator',
      position: 'Parking Operations Coordinator',
      name: 'Kyla Santos',
      source: 'Careers Site',
      stage: 'rejected',
      status: 'rejected',
      notes: 'Did not meet interview criteria.',
      appliedAt: '2026-07-19T10:05:00.000Z',
      updatedAt: '2026-07-20T14:25:00.000Z',
    },
  ]);

  const [candidateForm, setCandidateForm] = React.useState({
    postingId: 1,
    name: '',
    source: 'Careers Site',
    notes: '',
  });

  const [postingForm, setPostingForm] = React.useState({
    title: 'Parking Operations Coordinator',
    department: 'Operations',
    headcount: '1',
    sourceChannels: 'Careers Site, LinkedIn, Referral Program',
    status: 'published',
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawPostings = window.localStorage.getItem('parkhr.hrDashboard.recruitment.postings');
      const rawCandidates = window.localStorage.getItem('parkhr.hrDashboard.recruitment.candidates');
      if (rawPostings) setJobPostings(JSON.parse(rawPostings));
      if (rawCandidates) setCandidates(JSON.parse(rawCandidates));
    } catch {
      // ignore invalid state
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('parkhr.hrDashboard.recruitment.postings', JSON.stringify(jobPostings));
  }, [jobPostings]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('parkhr.hrDashboard.recruitment.candidates', JSON.stringify(candidates));
  }, [candidates]);

  const recruitmentStats = React.useMemo(() => ({
    publishedJobs: jobPostings.filter((posting) => posting.status === 'published').length,
    activeApplicants: candidates.filter((candidate) => candidate.status === 'active').length,
    hired: candidates.filter((candidate) => candidate.status === 'hired').length,
    rejected: candidates.filter((candidate) => candidate.status === 'rejected').length,
  }), [jobPostings, candidates]);

  const candidateCountsByStage = React.useMemo(() => recruitmentStageSequence.reduce((counts, stage) => {
    counts[stage] = candidates.filter((candidate) => candidate.stage === stage).length;
    return counts;
  }, {} as Record<string, number>), [candidates]);

  const showSnack = (message: string) => setSnack({ open: true, message });

  const createEmployee = (candidate: any) => {
    onHireEmployee?.({ name: candidate.name, position: candidate.postingTitle });
  };

  const handleCreateJobPosting = (event: React.FormEvent) => {
    event.preventDefault();
    if (!postingForm.title.trim() || !postingForm.department.trim()) return;

    const nextPosting = {
      id: Date.now(),
      title: postingForm.title.trim(),
      department: postingForm.department.trim(),
      headcount: Math.max(1, Number(postingForm.headcount) || 1),
      sourceChannels: postingForm.sourceChannels.trim() || 'Careers Site',
      status: postingForm.status,
      openedAt: new Date().toISOString(),
    };

    setJobPostings((prev) => [nextPosting, ...prev]);
    setCandidateForm((prev) => ({ ...prev, postingId: nextPosting.id }));
    setPostingForm({
      title: '',
      department: 'Operations',
      headcount: '1',
      sourceChannels: 'Careers Site, LinkedIn, Referral Program',
      status: 'published',
    });
    showSnack('Job posting published and ready for sourcing.');
  };

  const handleRegisterApplicant = (event: React.FormEvent) => {
    event.preventDefault();
    const posting = jobPostings.find((item) => item.id === candidateForm.postingId);
    if (!candidateForm.name.trim() || !posting) return;

    const next = {
      id: Date.now(),
      postingId: posting.id,
      postingTitle: posting.title,
      position: posting.title,
      name: candidateForm.name.trim(),
      source: candidateForm.source.trim() || 'Careers Site',
      stage: 'sourcing',
      status: 'active',
      notes: candidateForm.notes.trim() || 'Newly sourced candidate',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCandidates((prev) => [next, ...prev]);
    setCandidateForm((prev) => ({ ...prev, name: '', notes: '' }));
    showSnack('Applicant registered and started in sourcing stage.');
  };

  const advanceCandidateStage = (candidateId: number) => {
    setCandidates((prev) => prev.map((candidate) => {
      if (candidate.id !== candidateId || candidate.status !== 'active') return candidate;
      const currentIndex = recruitmentStageSequence.indexOf(candidate.stage);
      const nextStage = currentIndex >= 0 && currentIndex < recruitmentStageSequence.length - 1 ? recruitmentStageSequence[currentIndex + 1] : 'hired';

      if (nextStage === 'hired') {
        createEmployee(candidate);
        showSnack(`${candidate.name} marked as hired and moved to employee records.`);
        return { ...candidate, stage: 'hired', status: 'hired', updatedAt: new Date().toISOString() };
      }

      showSnack(`${candidate.name} moved to ${recruitmentStageLabels[nextStage]}.`);
      return { ...candidate, stage: nextStage, updatedAt: new Date().toISOString() };
    }));
  };

  const rejectCandidate = (candidateId: number) => {
    setCandidates((prev) => prev.map((candidate) => candidate.id === candidateId ? { ...candidate, stage: 'rejected', status: 'rejected', updatedAt: new Date().toISOString() } : candidate));
    showSnack('Applicant marked as rejected.');
  };

  return (
    <Stack spacing={2}>
      <Paper sx={{ ...cardStyle, p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { lg: 'center' } }}>
          <Stack spacing={0.75}>
            <Typography sx={{ color: ui.black, fontWeight: 900, fontSize: { xs: 24, md: 30 } }}>
              Recruitment & Hiring Workflow
            </Typography>
            <Typography sx={{ color: ui.muted, maxWidth: 760 }}>
              Create a posting, source applicants, screen candidates, run interview stages, issue a job offer, and complete onboarding before marking the hire as final.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
            <Chip label={`Open Postings: ${recruitmentStats.publishedJobs}`} sx={{ bgcolor: ui.greenSoft, color: ui.greenDark, fontWeight: 800 }} />
            <Chip label={`Active Applicants: ${recruitmentStats.activeApplicants}`} sx={{ bgcolor: ui.greenSoft, color: ui.greenDark, fontWeight: 800 }} />
            <Chip label={`Hired: ${recruitmentStats.hired}`} sx={{ bgcolor: ui.green, color: ui.white, fontWeight: 800 }} />
            <Chip label={`Rejected: ${recruitmentStats.rejected}`} sx={{ bgcolor: ui.black, color: ui.white, fontWeight: 800 }} />
          </Stack>
        </Stack>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) minmax(0, 1.25fr)' }, gap: 2 }}>
        <Stack spacing={2}>
          <Paper sx={{ ...cardStyle, p: 2 }} component="form" onSubmit={handleCreateJobPosting}>
            <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Create Job Posting</Typography>
            <Divider sx={sectionDividerSx} />
            <Stack spacing={1.5}>
              <TextField label="Job Title" value={postingForm.title} onChange={(e) => setPostingForm((prev) => ({ ...prev, title: e.target.value }))} size="small" required fullWidth />
              <TextField label="Department" value={postingForm.department} onChange={(e) => setPostingForm((prev) => ({ ...prev, department: e.target.value }))} size="small" required fullWidth />
              <TextField
                label="Headcount"
                type="number"
                value={postingForm.headcount}
                onChange={(e) => setPostingForm((prev) => ({ ...prev, headcount: e.target.value }))}
                size="small"
                slotProps={{ htmlInput: { min: 1 } }}
                fullWidth
              />
              <TextField label="Source Channels" value={postingForm.sourceChannels} onChange={(e) => setPostingForm((prev) => ({ ...prev, sourceChannels: e.target.value }))} size="small" helperText="Example: Careers site, LinkedIn, referrals" fullWidth />
              <FormControl size="small" fullWidth>
                <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Posting Status</FormLabel>
                <Select value={postingForm.status} onChange={(e) => setPostingForm((prev) => ({ ...prev, status: e.target.value }))}>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" sx={primaryButtonSx}>
                Save Posting
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ ...cardStyle, p: 2 }}>
            <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Job Postings</Typography>
            <Divider sx={sectionDividerSx} />
            <TableContainer sx={tableContainerSx}>
              <Table size="small" sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeadCellSx}>Role</TableCell>
                  <TableCell sx={tableHeadCellSx}>Department</TableCell>
                  <TableCell sx={tableHeadCellSx}>Headcount</TableCell>
                  <TableCell sx={tableHeadCellSx}>Status</TableCell>
                  <TableCell sx={tableHeadCellSx}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobPostings.map((posting) => (
                  <TableRow key={posting.id} hover>
                    <TableCell>{posting.title}</TableCell>
                    <TableCell>{posting.department}</TableCell>
                    <TableCell>{posting.headcount}</TableCell>
                    <TableCell>
                      <Chip label={posting.status} size="small" sx={stageChipSx(posting.status === 'published' ? 'hired' : posting.status === 'closed' ? 'rejected' : 'screening')} />
                    </TableCell>
                    <TableCell>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75}>
                        {posting.status !== 'published' ? (
                          <Button size="small" sx={{ ...primaryButtonSx, ...compactActionButtonSx }} onClick={() => setJobPostings((prev) => prev.map((item) => (item.id === posting.id ? { ...item, status: 'published' } : item)))}>
                            Publish
                          </Button>
                        ) : null}
                        {posting.status !== 'closed' ? (
                          <Button size="small" sx={{ ...darkButtonSx, ...compactActionButtonSx }} onClick={() => setJobPostings((prev) => prev.map((item) => (item.id === posting.id ? { ...item, status: 'closed' } : item)))}>
                            Close
                          </Button>
                        ) : null}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ ...cardStyle, p: 2 }}>
            <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Workflow Stages</Typography>
            <Divider sx={sectionDividerSx} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, gap: 1 }}>
              {recruitmentStageSequence.map((stage) => (
                <Paper key={stage} sx={{ border: `1px solid ${ui.border}`, borderRadius: 2, p: 1.25, bgcolor: ui.white }}>
                  <Typography sx={{ color: ui.muted, fontSize: 12 }}>{recruitmentStageLabels[stage]}</Typography>
                  <Typography sx={{ color: ui.black, fontWeight: 900, fontSize: 22 }}>{candidateCountsByStage[stage] || 0}</Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Stack>

        <Stack spacing={2}>
          <Paper sx={{ ...cardStyle, p: 2 }} component="form" onSubmit={handleRegisterApplicant}>
            <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Applicant Intake</Typography>
            <Divider sx={sectionDividerSx} />
            <Stack spacing={1.5}>
              <FormControl size="small" fullWidth>
                <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Job Posting</FormLabel>
                <Select value={candidateForm.postingId} onChange={(e) => setCandidateForm((prev) => ({ ...prev, postingId: Number(e.target.value) }))}>
                  {jobPostings.map((posting) => (
                    <MenuItem key={posting.id} value={posting.id}>
                      {posting.title} - {posting.department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Applicant Name" value={candidateForm.name} onChange={(e) => setCandidateForm((prev) => ({ ...prev, name: e.target.value }))} size="small" required fullWidth />
              <TextField label="Source Channel" value={candidateForm.source} onChange={(e) => setCandidateForm((prev) => ({ ...prev, source: e.target.value }))} size="small" helperText="Sourcing source such as referral, careers site, or LinkedIn" fullWidth />
              <TextField label="Screening Notes" value={candidateForm.notes} onChange={(e) => setCandidateForm((prev) => ({ ...prev, notes: e.target.value }))} size="small" multiline minRows={3} fullWidth />
              <Button type="submit" sx={primaryButtonSx}>
                Register Applicant
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ ...cardStyle, p: 2 }}>
            <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Applicant Tracking Pipeline</Typography>
            <Divider sx={sectionDividerSx} />
            <TableContainer sx={tableContainerSx}>
              <Table size="small" sx={{ minWidth: 980 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeadCellSx}>Applicant</TableCell>
                  <TableCell sx={tableHeadCellSx}>Posting</TableCell>
                  <TableCell sx={tableHeadCellSx}>Source</TableCell>
                  <TableCell sx={tableHeadCellSx}>Stage</TableCell>
                  <TableCell sx={tableHeadCellSx}>Status</TableCell>
                  <TableCell sx={tableHeadCellSx}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>No applicants recorded yet.</TableCell>
                  </TableRow>
                ) : (
                  candidates.map((item) => {
                    const nextStageIndex = recruitmentStageSequence.indexOf(item.stage);
                    const nextStage = nextStageIndex >= 0 && nextStageIndex < recruitmentStageSequence.length - 1 ? recruitmentStageSequence[nextStageIndex + 1] : 'hired';
                    const actionLabel = item.stage === 'onboarding' ? 'Mark Hired' : `Move to ${recruitmentStageLabels[nextStage]}`;

                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Stack spacing={0.25}>
                            <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                            <Typography sx={{ color: ui.muted, fontSize: 12 }}>{item.notes}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{item.postingTitle}</TableCell>
                        <TableCell>{item.source}</TableCell>
                        <TableCell>
                          <Chip size="small" label={recruitmentStageLabels[item.stage]} sx={stageChipSx(item.stage)} />
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label={item.status} sx={stageChipSx(item.status === 'hired' ? 'hired' : item.status === 'rejected' ? 'rejected' : 'screening')} />
                        </TableCell>
                        <TableCell>
                          {item.status === 'active' ? (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75}>
                              <Button size="small" sx={{ ...primaryButtonSx, ...compactActionButtonSx }} onClick={() => advanceCandidateStage(item.id)}>
                                {actionLabel}
                              </Button>
                              <Button size="small" sx={{ ...darkButtonSx, ...compactActionButtonSx }} onClick={() => rejectCandidate(item.id)}>
                                Reject
                              </Button>
                            </Stack>
                          ) : (
                            <Chip size="small" label={item.status === 'hired' ? 'Converted to Employee' : 'Closed'} sx={item.status === 'hired' ? stageChipSx('hired') : stageChipSx('rejected')} />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Stack>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={2200} onClose={() => setSnack({ open: false, message: '' })}>
        <Alert severity="success" sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
    </Stack>
  );
}
