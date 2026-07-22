// @ts-nocheck
"use client";

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
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
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/store';
import RecruitmentWorkflowPanel from '../../components/hr/RecruitmentWorkflowPanel';
import AppTheme from '../../theme/AppTheme';

type HRModule = 'dashboard' | 'records' | 'recruitment' | 'attendance' | 'leave' | 'payroll' | 'performance';
type RecruitmentStage = 'sourcing' | 'screening' | 'interview_1' | 'interview_2' | 'final_interview' | 'offer' | 'onboarding' | 'hired' | 'rejected';
type JobPostingStatus = 'draft' | 'published' | 'closed';
 type RecruitmentApplicantStatus = 'active' | 'hired' | 'rejected';
type PerformanceStatus = 'Goals Set' | 'Self Evaluation Submitted' | 'Manager Evaluation Submitted' | 'Finalized';

interface EmployeeRecord {
  id: number;
  userId: string;
  employeeName: string;
  position: string;
  dailyRate: number;
  status: 'Active' | 'Inactive';
  dateHired: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    mobile: string;
    address: string;
  };
  employmentDetails: {
    department: string;
    employmentType: string;
    manager: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    mobile: string;
  };
  documents: {
    govId: string;
    contract: string;
    certificates: string;
  };
  latestPerformance?: {
    period: string;
    finalRating: number;
    finalizedAt: string;
    managerEvaluation: string;
    kpiGoals: string;
  };
}

function normalizeEmployeeRecord(raw: any): EmployeeRecord {
  const nameText = String(raw?.employeeName || '').trim();
  const parsed = nameText.includes(',') ? nameText.split(',') : nameText.split(/\s+/);
  const fallbackLastName = (parsed[0] || '').trim() || '-';
  const fallbackFirstName = (parsed[1] || '').trim() || nameText || '-';

  return {
    id: Number(raw?.id) || Date.now(),
    userId: String(raw?.userId || 'N/A'),
    employeeName: String(raw?.employeeName || `${fallbackLastName}, ${fallbackFirstName}`),
    position: String(raw?.position || 'Unassigned'),
    dailyRate: Number(raw?.dailyRate) || 0,
    status: raw?.status === 'Inactive' ? 'Inactive' : 'Active',
    dateHired: String(raw?.dateHired || new Date().toISOString().slice(0, 10)),
    personalInfo: {
      firstName: String(raw?.personalInfo?.firstName || fallbackFirstName),
      lastName: String(raw?.personalInfo?.lastName || fallbackLastName),
      middleName: String(raw?.personalInfo?.middleName || ''),
      email: String(raw?.personalInfo?.email || ''),
      mobile: String(raw?.personalInfo?.mobile || ''),
      address: String(raw?.personalInfo?.address || ''),
    },
    employmentDetails: {
      department: String(raw?.employmentDetails?.department || 'Operations'),
      employmentType: String(raw?.employmentDetails?.employmentType || 'Regular'),
      manager: String(raw?.employmentDetails?.manager || ''),
    },
    emergencyContact: {
      name: String(raw?.emergencyContact?.name || ''),
      relationship: String(raw?.emergencyContact?.relationship || 'Parent'),
      mobile: String(raw?.emergencyContact?.mobile || ''),
    },
    documents: {
      govId: String(raw?.documents?.govId || 'Pending'),
      contract: String(raw?.documents?.contract || 'Pending'),
      certificates: String(raw?.documents?.certificates || ''),
    },
    latestPerformance: raw?.latestPerformance
      ? {
          period: String(raw.latestPerformance.period || '-'),
          finalRating: Number(raw.latestPerformance.finalRating) || 0,
          finalizedAt: String(raw.latestPerformance.finalizedAt || ''),
          managerEvaluation: String(raw.latestPerformance.managerEvaluation || ''),
          kpiGoals: String(raw.latestPerformance.kpiGoals || ''),
        }
      : undefined,
  };
}

 interface RecruitmentApplicant {
  id: number;
  postingId: number;
  postingTitle: string;
  position: string;
  name: string;
  source: string;
  stage: RecruitmentStage;
  status: RecruitmentApplicantStatus;
  notes: string;
  appliedAt: string;
  updatedAt: string;
}

interface JobPosting {
  id: number;
  title: string;
  department: string;
  headcount: number;
  sourceChannels: string;
  status: JobPostingStatus;
  openedAt: string;
}

interface AttendanceRow {
  id: number;
  workDate: string;
  employeeName: string;
  position: string;
  clockIn: string;
  clockOut: string;
  workedMinutes: number;
  lateMinutes: number;
  undertimeMinutes: number;
  overtimeMinutes: number;
  officialBusinessMinutes: number;
  status: 'Open' | 'Completed' | 'Late' | 'Undertime' | 'With Overtime' | 'Official Business';
}

interface OvertimeRequest {
  id: number;
  employeeName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  minutes: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface OfficialBusinessRequest {
  id: number;
  employeeName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  minutes: number;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface LeaveRow {
  id: number;
  employeeId: number;
  employeeName: string;
  position: string;
  type: string;
  startDate: string;
  endDate: string;
  requestedDays: number;
  reason: string;
  managerDecision: 'Pending' | 'Approved' | 'Rejected';
  hrDecision: 'Pending' | 'Approved' | 'Rejected' | 'Not Required';
  status: 'Pending Manager Approval' | 'Pending HR Approval' | 'Approved' | 'Rejected by Manager' | 'Rejected by HR';
  creditsCharged: number;
  creditBalanceAfterApproval: number;
  submittedAt: string;
  decidedAt?: string;
}

interface LeaveCredits {
  sick: number;
  vacation: number;
  emergency: number;
}

interface PayrollRow {
  id: number;
  payslipNo: string;
  generatedAt: string;
  employeeId: number;
  employeeName: string;
  position: string;
  dailyRateUsed: number;
  monthlyRateEstimate: number;
  roleAllowance: number;
  periodStart: string;
  periodEnd: string;
  period: string;
  attendanceDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  payableDays: number;
  basicPay: number;
  overtimePay: number;
  grossPay: number;
  tax: number;
  sss: number;
  philHealth: number;
  pagIbig: number;
  loans: number;
  otherDeductions: number;
  totalDeductions: number;
  bonus: number;
  netSalary: number;
  status: 'Generated' | 'Confirmed' | 'Edited';
}

interface PerformanceRow {
  id: number;
  employeeId: number;
  employeeName: string;
  position: string;
  period: string;
  kpiGoals: string;
  selfEvaluation: string;
  managerEvaluation: string;
  selfRating: number | null;
  managerRating: number | null;
  finalRating: number | null;
  status: PerformanceStatus;
  linkedToRecord: boolean;
  createdAt: string;
  finalizedAt?: string;
}

const menuItems: Array<{ id: HRModule; label: string; icon: React.ReactNode }> = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon fontSize="small" /> },
  { id: 'records', label: 'Employee Records', icon: <ManageAccountsRoundedIcon fontSize="small" /> },
  { id: 'recruitment', label: 'Recruitment & Hiring', icon: <GroupsRoundedIcon fontSize="small" /> },
  { id: 'attendance', label: 'Attendance Gate', icon: <ScheduleRoundedIcon fontSize="small" /> },
  { id: 'leave', label: 'Leave Requests', icon: <AssignmentRoundedIcon fontSize="small" /> },
  { id: 'payroll', label: 'Payroll System', icon: <MonetizationOnRoundedIcon fontSize="small" /> },
  { id: 'performance', label: 'Performance Evaluation', icon: <QueryStatsRoundedIcon fontSize="small" /> },
];

const moduleTitles: Record<HRModule, string> = {
  dashboard: 'HR Summary Dashboard',
  records: 'Human Resources - Manage Employees',
  recruitment: 'Recruitment & Hiring Management',
  attendance: 'Employee Attendance Terminal',
  leave: 'Human Resources - Leave Requests',
  payroll: 'Human Resources - Payroll System',
  performance: 'Performance Evaluation Dashboard',
};

const recruitmentStageSequence: Exclude<RecruitmentStage, 'hired' | 'rejected'>[] = [
  'sourcing',
  'screening',
  'interview_1',
  'interview_2',
  'final_interview',
  'offer',
  'onboarding',
];

const recruitmentStageLabels: Record<RecruitmentStage, string> = {
  sourcing: 'Sourcing',
  screening: 'Screening',
  interview_1: 'Interview 1',
  interview_2: 'Interview 2',
  final_interview: 'Final Interview',
  offer: 'Job Offer',
  onboarding: 'Onboarding',
  hired: 'Hired',
  rejected: 'Rejected',
};

const recruitmentStageChipSx = (stage: RecruitmentStage) => {
  if (stage === 'hired') {
    return { bgcolor: ui.green, color: ui.white, fontWeight: 800 };
  }
  if (stage === 'rejected') {
    return { bgcolor: ui.black, color: ui.white, fontWeight: 800 };
  }
  return { bgcolor: ui.greenSoft, color: ui.greenDark, fontWeight: 800 };
};

const ui = {
  green: '#107927',
  greenDark: '#0b5d1e',
  greenSoft: '#edf7ea',
  black: '#111827',
  muted: '#0b5d1e',
  white: '#ffffff',
  page: '#ffffff',
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

const readableFormSx = {
  '& .MuiFormLabel-root': {
    color: ui.black,
    opacity: 1,
  },
  '& .MuiInputLabel-root': {
    color: ui.black,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: ui.greenDark,
  },
  '& .MuiInputBase-input': {
    color: ui.black,
  },
  '& .MuiSelect-select': {
    color: ui.black,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: ui.green,
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: ui.greenDark,
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: ui.greenDark,
    borderWidth: 2,
  },
};

const softPanelSx = {
  border: `1px solid ${ui.border}`,
  borderRadius: 2,
  bgcolor: ui.greenSoft,
  p: 1.25,
};

const highlightedSectionSx = {
  border: `2px solid ${ui.green}`,
  background: `linear-gradient(135deg, ${ui.greenSoft} 0%, ${ui.white} 55%)`,
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

const formCardPaddingSx = { p: { xs: 2, md: 2.5 } };

const formGridSpacingSx = {
  display: 'grid',
  gap: 1.75,
};

const money = (value: number) => `P${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

const formatTime = (value: Date) =>
  value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const SHIFT_START_MINUTES = 8 * 60;
const SHIFT_END_MINUTES = 17 * 60;
const SHIFT_BREAK_MINUTES = 60;
const SHIFT_GRACE_MINUTES = 10;

const toMinutesFromHHMM = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

const toMinutesFromClockLabel = (value: string) => {
  if (!value || value === '--:--') return null;
  const [timePart, suffixRaw] = value.trim().split(' ');
  if (!timePart || !suffixRaw) return null;
  const [hourRaw, minuteRaw] = timePart.split(':').map(Number);
  if (Number.isNaN(hourRaw) || Number.isNaN(minuteRaw)) return null;
  const suffix = suffixRaw.toUpperCase();
  let hour = hourRaw % 12;
  if (suffix === 'PM') hour += 12;
  return hour * 60 + minuteRaw;
};

const formatMinutesToHours = (minutes: number) => {
  const safe = Math.max(0, minutes || 0);
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
};

const computeLateMinutes = (clockInMinutes: number) => Math.max(0, clockInMinutes - (SHIFT_START_MINUTES + SHIFT_GRACE_MINUTES));

const computeUndertimeMinutes = (clockOutMinutes: number, officialBusinessMinutes: number) =>
  Math.max(0, SHIFT_END_MINUTES - (clockOutMinutes + Math.max(0, officialBusinessMinutes || 0)));

const leaveCreditFieldByType: Record<string, keyof LeaveCredits | null> = {
  'Sick Leave': 'sick',
  'Vacation Leave': 'vacation',
  'Emergency Leave': 'emergency',
  'Unpaid Leave': null,
};

const defaultLeaveCredits: LeaveCredits = {
  sick: 5,
  vacation: 10,
  emergency: 3,
};

const roleSalaryCatalog: Record<string, { dailyRate: number; monthlyEstimate: number; allowance: number }> = {
  'Parking Attendant': { dailyRate: 500, monthlyEstimate: 13000, allowance: 1500 },
  'Parking Operations Coordinator': { dailyRate: 700, monthlyEstimate: 18200, allowance: 2200 },
  'Operations Supervisor': { dailyRate: 900, monthlyEstimate: 23400, allowance: 3000 },
  'HR Assistant': { dailyRate: 650, monthlyEstimate: 16900, allowance: 2000 },
  'HR Manager': { dailyRate: 1200, monthlyEstimate: 31200, allowance: 4500 },
};

const countLeaveDaysInclusive = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
};

const toDateOnly = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isDateWithinRange = (dateValue: string, startDate: string, endDate: string) => {
  const date = toDateOnly(dateValue);
  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);
  if (!date || !start || !end) return false;
  return date >= start && date <= end;
};

const countWeekdaysInclusive = (startDate: string, endDate: string) => {
  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);
  if (!start || !end || end < start) return 0;

  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
};

const countOverlapDaysInclusive = (rangeStart: string, rangeEnd: string, filterStart: string, filterEnd: string) => {
  const aStart = toDateOnly(rangeStart);
  const aEnd = toDateOnly(rangeEnd);
  const bStart = toDateOnly(filterStart);
  const bEnd = toDateOnly(filterEnd);
  if (!aStart || !aEnd || !bStart || !bEnd) return 0;

  const start = aStart > bStart ? aStart : bStart;
  const end = aEnd < bEnd ? aEnd : bEnd;
  if (end < start) return 0;

  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const computeMonthlyWithholdingTax = (monthlyTaxable: number) => {
  if (monthlyTaxable <= 20833) return 0;
  if (monthlyTaxable <= 33333) return (monthlyTaxable - 20833) * 0.15;
  if (monthlyTaxable <= 66667) return 1875 + (monthlyTaxable - 33333) * 0.2;
  if (monthlyTaxable <= 166667) return 8541.8 + (monthlyTaxable - 66667) * 0.25;
  if (monthlyTaxable <= 666667) return 33541.8 + (monthlyTaxable - 166667) * 0.3;
  return 183541.8 + (monthlyTaxable - 666667) * 0.35;
};

const computeSssEmployeeShareMonthly = (monthlyCompensation: number) => {
  const msc = Math.max(4000, Math.min(30000, monthlyCompensation));
  return msc * 0.045;
};

const computePhilHealthEmployeeShareMonthly = (monthlyCompensation: number) => {
  const base = Math.max(10000, Math.min(100000, monthlyCompensation));
  return base * 0.025;
};

const computePagIbigEmployeeShareMonthly = (monthlyCompensation: number) => {
  if (monthlyCompensation <= 1500) return monthlyCompensation * 0.01;
  return Math.min(monthlyCompensation * 0.02, 200);
};

function normalizeLeaveRow(raw: any): LeaveRow {
  const startDate = String(raw?.startDate || new Date().toISOString().slice(0, 10));
  const endDate = String(raw?.endDate || startDate);
  const requestedDays = Number(raw?.requestedDays) || countLeaveDaysInclusive(startDate, endDate) || 1;

  return {
    id: Number(raw?.id) || Date.now(),
    employeeId: Number(raw?.employeeId) || 0,
    employeeName: String(raw?.employeeName || 'Unknown Employee'),
    position: String(raw?.position || 'Unassigned'),
    type: String(raw?.type || 'Sick Leave'),
    startDate,
    endDate,
    requestedDays,
    reason: String(raw?.reason || '-'),
    managerDecision: raw?.managerDecision || (raw?.status === 'Approved' ? 'Approved' : raw?.status === 'Rejected' ? 'Rejected' : 'Pending'),
    hrDecision: raw?.hrDecision || (raw?.status === 'Approved' ? 'Approved' : raw?.status === 'Rejected' ? 'Rejected' : 'Pending'),
    status:
      raw?.status === 'Rejected by Manager' || raw?.status === 'Rejected by HR' || raw?.status === 'Pending Manager Approval' || raw?.status === 'Pending HR Approval' || raw?.status === 'Approved'
        ? raw.status
        : raw?.status === 'Rejected'
          ? 'Rejected by HR'
          : raw?.status === 'Approved'
            ? 'Approved'
            : 'Pending Manager Approval',
    creditsCharged: Number(raw?.creditsCharged) || (raw?.status === 'Approved' ? requestedDays : 0),
    creditBalanceAfterApproval: Number(raw?.creditBalanceAfterApproval) || 0,
    submittedAt: String(raw?.submittedAt || new Date().toISOString()),
    decidedAt: raw?.decidedAt ? String(raw.decidedAt) : undefined,
  };
}

function normalizeAttendanceRow(raw: any): AttendanceRow {
  return {
    id: Number(raw?.id) || Date.now(),
    workDate: String(raw?.workDate || new Date().toISOString().slice(0, 10)),
    employeeName: String(raw?.employeeName || 'Unknown Employee'),
    position: String(raw?.position || 'Unassigned'),
    clockIn: String(raw?.clockIn || '--:--'),
    clockOut: String(raw?.clockOut || '--:--'),
    workedMinutes: Number(raw?.workedMinutes) || 0,
    lateMinutes: Number(raw?.lateMinutes) || 0,
    undertimeMinutes: Number(raw?.undertimeMinutes) || 0,
    overtimeMinutes: Number(raw?.overtimeMinutes) || 0,
    officialBusinessMinutes: Number(raw?.officialBusinessMinutes) || 0,
    status: raw?.status || 'Open',
  };
}

function normalizePayrollRow(raw: any): PayrollRow {
  const id = Number(raw?.id) || Date.now();
  const position = String(raw?.position || 'Unassigned');
  const catalog = roleSalaryCatalog[position];
  const grossFallback = Number(raw?.grossPay ?? raw?.gross) || 0;
  const deductionsFallback = Number(raw?.totalDeductions ?? raw?.deductions) || 0;
  const bonus = Number(raw?.bonus) || 0;

  return {
    id,
    payslipNo: String(raw?.payslipNo || `PS-LEGACY-${id}`),
    generatedAt: String(raw?.generatedAt || new Date().toISOString()),
    employeeId: Number(raw?.employeeId) || 0,
    employeeName: String(raw?.employeeName || 'Unknown Employee'),
    position,
    dailyRateUsed: Number(raw?.dailyRateUsed) || Number(raw?.basicPay ?? raw?.gross) || catalog?.dailyRate || 0,
    monthlyRateEstimate: Number(raw?.monthlyRateEstimate) || catalog?.monthlyEstimate || 0,
    roleAllowance: Number(raw?.roleAllowance) || catalog?.allowance || 0,
    periodStart: String(raw?.periodStart || ''),
    periodEnd: String(raw?.periodEnd || ''),
    period: String(raw?.period || '-'),
    attendanceDays: Number(raw?.attendanceDays ?? raw?.daysWorked) || 0,
    paidLeaveDays: Number(raw?.paidLeaveDays) || 0,
    unpaidLeaveDays: Number(raw?.unpaidLeaveDays) || 0,
    payableDays: Number(raw?.payableDays ?? raw?.daysWorked) || 0,
    basicPay: Number(raw?.basicPay ?? raw?.gross) || 0,
    overtimePay: Number(raw?.overtimePay) || 0,
    grossPay: grossFallback,
    tax: Number(raw?.tax) || 0,
    sss: Number(raw?.sss) || 0,
    philHealth: Number(raw?.philHealth) || 0,
    pagIbig: Number(raw?.pagIbig) || 0,
    loans: Number(raw?.loans) || 0,
    otherDeductions: Number(raw?.otherDeductions) || 0,
    totalDeductions: deductionsFallback,
    bonus,
    netSalary: Number(raw?.netSalary) || roundMoney(grossFallback - deductionsFallback + bonus),
    status: raw?.status === 'Confirmed' || raw?.status === 'Edited' ? raw.status : 'Generated',
  };
}

function normalizePerformanceRow(raw: any): PerformanceRow {
  const id = Number(raw?.id) || Date.now();
  const legacyRating = Number(raw?.rating);
  const finalRating = Number(raw?.finalRating);
  const hasLegacyRating = !Number.isNaN(legacyRating) && legacyRating > 0;
  const normalizedFinal = !Number.isNaN(finalRating) && finalRating > 0 ? finalRating : hasLegacyRating ? legacyRating : null;
  const normalizedStatus: PerformanceStatus =
    raw?.status === 'Goals Set' ||
    raw?.status === 'Self Evaluation Submitted' ||
    raw?.status === 'Manager Evaluation Submitted' ||
    raw?.status === 'Finalized'
      ? raw.status
      : normalizedFinal
        ? 'Finalized'
        : 'Goals Set';

  return {
    id,
    employeeId: Number(raw?.employeeId) || 0,
    employeeName: String(raw?.employeeName || 'Unknown Employee'),
    position: String(raw?.position || 'Unassigned'),
    period: String(raw?.period || '-'),
    kpiGoals: String(raw?.kpiGoals || 'No KPI goals provided.'),
    selfEvaluation: String(raw?.selfEvaluation || raw?.remarks || ''),
    managerEvaluation: String(raw?.managerEvaluation || raw?.remarks || ''),
    selfRating: Number(raw?.selfRating) > 0 ? Number(raw.selfRating) : null,
    managerRating: Number(raw?.managerRating) > 0 ? Number(raw.managerRating) : null,
    finalRating: normalizedFinal,
    status: normalizedStatus,
    linkedToRecord: Boolean(raw?.linkedToRecord || normalizedStatus === 'Finalized'),
    createdAt: String(raw?.createdAt || new Date().toISOString()),
    finalizedAt: raw?.finalizedAt ? String(raw.finalizedAt) : undefined,
  };
}

export default function HRDashboardPage(props: { disableCustomTheme?: boolean }) {
  const router = useRouter();
  const user = useAppSelector((s) => s.user.user);

  const [activeModule, setActiveModule] = React.useState<HRModule>('dashboard');
  const [search, setSearch] = React.useState('');
  const [snack, setSnack] = React.useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const [employeeRecords, setEmployeeRecords] = React.useState<EmployeeRecord[]>([
    {
      id: 4,
      userId: '12',
      employeeName: 'Employee #4',
      position: 'Parking Attendant',
      dailyRate: 500,
      status: 'Active',
      dateHired: '2026-07-15',
      personalInfo: {
        firstName: 'Employee',
        lastName: '#4',
        middleName: '',
        email: 'employee4@parkhr.local',
        mobile: '09170000004',
        address: 'Quezon City',
      },
      employmentDetails: {
        department: 'Operations',
        employmentType: 'Regular',
        manager: 'Operations Supervisor',
      },
      emergencyContact: {
        name: 'Contact 4',
        relationship: 'Sibling',
        mobile: '09179990004',
      },
      documents: {
        govId: 'Complete',
        contract: 'Signed',
        certificates: 'Basic Training Certificate',
      },
    },
    {
      id: 3,
      userId: '12',
      employeeName: 'Employee #3',
      position: 'Parking Attendant',
      dailyRate: 500,
      status: 'Active',
      dateHired: '2026-07-15',
      personalInfo: {
        firstName: 'Employee',
        lastName: '#3',
        middleName: '',
        email: 'employee3@parkhr.local',
        mobile: '09170000003',
        address: 'Quezon City',
      },
      employmentDetails: {
        department: 'Operations',
        employmentType: 'Regular',
        manager: 'Operations Supervisor',
      },
      emergencyContact: {
        name: 'Contact 3',
        relationship: 'Parent',
        mobile: '09179990003',
      },
      documents: {
        govId: 'Complete',
        contract: 'Signed',
        certificates: 'Safety Orientation',
      },
    },
    {
      id: 2,
      userId: 'N/A',
      employeeName: 'Employee #2',
      position: 'Parking Attendant',
      dailyRate: 500,
      status: 'Active',
      dateHired: '2026-07-15',
      personalInfo: {
        firstName: 'Employee',
        lastName: '#2',
        middleName: '',
        email: 'employee2@parkhr.local',
        mobile: '09170000002',
        address: 'Quezon City',
      },
      employmentDetails: {
        department: 'Operations',
        employmentType: 'Probationary',
        manager: 'Operations Supervisor',
      },
      emergencyContact: {
        name: 'Contact 2',
        relationship: 'Spouse',
        mobile: '09179990002',
      },
      documents: {
        govId: 'Partial',
        contract: 'Pending Signature',
        certificates: 'N/A',
      },
    },
  ]);

  const [jobPostings, setJobPostings] = React.useState<JobPosting[]>([
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

  const [candidates, setCandidates] = React.useState<RecruitmentApplicant[]>([
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
  const [attendanceRows, setAttendanceRows] = React.useState<AttendanceRow[]>([
    {
      id: 1,
      workDate: '2026-07-22',
      employeeName: 'Employee #3',
      position: 'Parking Attendant',
      clockIn: '08:28 PM',
      clockOut: '08:30 PM',
      workedMinutes: 0,
      lateMinutes: 740,
      undertimeMinutes: 0,
      overtimeMinutes: 0,
      officialBusinessMinutes: 0,
      status: 'Late',
    },
    {
      id: 2,
      workDate: '2026-07-22',
      employeeName: 'Employee #2',
      position: 'Parking Attendant',
      clockIn: '08:27 PM',
      clockOut: '08:27 PM',
      workedMinutes: 0,
      lateMinutes: 737,
      undertimeMinutes: 0,
      overtimeMinutes: 0,
      officialBusinessMinutes: 0,
      status: 'Late',
    },
  ]);
  const [overtimeRequests, setOvertimeRequests] = React.useState<OvertimeRequest[]>([]);
  const [officialBusinessRequests, setOfficialBusinessRequests] = React.useState<OfficialBusinessRequest[]>([]);
  const [overtimeForm, setOvertimeForm] = React.useState({
    employeeName: '',
    workDate: new Date().toISOString().slice(0, 10),
    startTime: '17:00',
    endTime: '18:00',
    reason: '',
  });
  const [officialBusinessForm, setOfficialBusinessForm] = React.useState({
    employeeName: '',
    workDate: new Date().toISOString().slice(0, 10),
    startTime: '09:00',
    endTime: '10:00',
    purpose: '',
  });

  const [leaveRows, setLeaveRows] = React.useState<LeaveRow[]>([
    {
      id: 1,
      employeeId: 2,
      employeeName: 'Employee #2',
      position: 'Parking Attendant',
      type: 'Vacation Leave',
      startDate: '2026-07-20',
      endDate: '2026-07-21',
      requestedDays: 2,
      reason: 'Family trip',
      managerDecision: 'Approved',
      hrDecision: 'Approved',
      status: 'Approved',
      creditsCharged: 2,
      creditBalanceAfterApproval: 8,
      submittedAt: '2026-07-19T08:00:00.000Z',
      decidedAt: '2026-07-19T11:30:00.000Z',
    },
  ]);
  const [leaveCredits, setLeaveCredits] = React.useState<Record<number, LeaveCredits>>({
    2: { sick: 5, vacation: 8, emergency: 3 },
    3: { sick: 5, vacation: 10, emergency: 3 },
    4: { sick: 5, vacation: 10, emergency: 3 },
  });

  const [payrollRows, setPayrollRows] = React.useState<PayrollRow[]>([]);
  const [performanceRows, setPerformanceRows] = React.useState<PerformanceRow[]>([]);

  const [recordForm, setRecordForm] = React.useState({
    userId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: '',
    position: 'Parking Attendant',
    department: 'Operations',
    employmentType: 'Regular',
    manager: '',
    dailyRate: '500',
    status: 'Active' as 'Active' | 'Inactive',
    dateHired: '2026-07-15',
    emergencyName: '',
    emergencyRelationship: 'Parent',
    emergencyMobile: '',
    documentGovId: 'Complete',
    documentContract: 'Signed',
    documentCertificates: '',
  });

  const [selectedAttendanceEmployee, setSelectedAttendanceEmployee] = React.useState('');

  const [leaveForm, setLeaveForm] = React.useState({
    employeeId: '',
    type: 'Sick Leave',
    startDate: '2026-07-15',
    endDate: '2026-07-15',
    reason: '',
  });

  const [payrollForm, setPayrollForm] = React.useState({
    employeeId: '',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    loanDeduction: '0',
    otherDeductions: '0',
    bonus: '0',
  });
  const [editingPayrollId, setEditingPayrollId] = React.useState<number | null>(null);
  const [payrollHistorySearch, setPayrollHistorySearch] = React.useState('');

  const [performanceSetupForm, setPerformanceSetupForm] = React.useState({
    employeeId: '',
    period: 'Q3-2026',
    kpiGoals: '',
  });
  const [selfEvaluationForm, setSelfEvaluationForm] = React.useState({
    appraisalId: '',
    selfRating: '3',
    selfEvaluation: '',
  });
  const [managerEvaluationForm, setManagerEvaluationForm] = React.useState({
    appraisalId: '',
    managerRating: '3',
    managerEvaluation: '',
  });

  const [liveTime, setLiveTime] = React.useState(new Date());

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('parkhr.hrDashboard.state');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.jobPostings)) setJobPostings(parsed.jobPostings);
      if (Array.isArray(parsed.employeeRecords)) {
        setEmployeeRecords(parsed.employeeRecords.map((item: any) => normalizeEmployeeRecord(item)));
      }
      if (Array.isArray(parsed.candidates)) setCandidates(parsed.candidates);
      if (Array.isArray(parsed.attendanceRows)) {
        setAttendanceRows(parsed.attendanceRows.map((item: any) => normalizeAttendanceRow(item)));
      }
      if (Array.isArray(parsed.overtimeRequests)) setOvertimeRequests(parsed.overtimeRequests);
      if (Array.isArray(parsed.officialBusinessRequests)) setOfficialBusinessRequests(parsed.officialBusinessRequests);
      if (Array.isArray(parsed.leaveRows)) setLeaveRows(parsed.leaveRows.map((item: any) => normalizeLeaveRow(item)));
      if (parsed.leaveCredits && typeof parsed.leaveCredits === 'object') setLeaveCredits(parsed.leaveCredits);
      if (Array.isArray(parsed.payrollRows)) setPayrollRows(parsed.payrollRows.map((item: any) => normalizePayrollRow(item)));
      if (Array.isArray(parsed.performanceRows)) {
        setPerformanceRows(parsed.performanceRows.map((item: any) => normalizePerformanceRow(item)));
      }
    } catch {
      // ignore invalid saved state
    }
  }, []);

  React.useEffect(() => {
    setLeaveCredits((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const employee of employeeRecords) {
        if (!next[employee.id]) {
          next[employee.id] = { ...defaultLeaveCredits };
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [employeeRecords]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = {
      jobPostings,
      employeeRecords,
      candidates,
      attendanceRows,
      overtimeRequests,
      officialBusinessRequests,
      leaveRows,
      leaveCredits,
      payrollRows,
      performanceRows,
    };
    window.localStorage.setItem('parkhr.hrDashboard.state', JSON.stringify(payload));
  }, [jobPostings, employeeRecords, candidates, attendanceRows, overtimeRequests, officialBusinessRequests, leaveRows, leaveCredits, payrollRows, performanceRows]);

  const getCookie = React.useCallback((name: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }, []);

  React.useEffect(() => {
    const id = getCookie('userId');
    if (!user && !id) {
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    }
  }, [getCookie, user]);

  React.useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredEmployees = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employeeRecords;
    return employeeRecords.filter((item) =>
      [
        item.userId,
        item.employeeName,
        item.position,
        item.status,
        item.personalInfo.firstName,
        item.personalInfo.lastName,
        item.personalInfo.email,
        item.employmentDetails.department,
        item.emergencyContact.name,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [employeeRecords, search]);

  const recruitmentStats = React.useMemo(() => {
    return {
      publishedJobs: jobPostings.filter((posting) => posting.status === 'published').length,
      activeApplicants: candidates.filter((candidate) => candidate.status === 'active').length,
      hired: candidates.filter((candidate) => candidate.status === 'hired').length,
      rejected: candidates.filter((candidate) => candidate.status === 'rejected').length,
    };
  }, [jobPostings, candidates]);

  const candidateCountsByStage = React.useMemo(() => {
    return recruitmentStageSequence.reduce<Record<string, number>>((counts, stage) => {
      counts[stage] = candidates.filter((candidate) => candidate.stage === stage).length;
      return counts;
    }, {});
  }, [candidates]);

  const showSnack = (message: string) => setSnack({ open: true, message });

  const handleRecruitmentHire = (employee: { name: string; position: string }) => {
    const nextId = (employeeRecords[0]?.id ?? 0) + 1;
    const nameParts = employee.name.trim().split(/\s+/);
    const firstName = nameParts[0] || employee.name;
    const lastName = nameParts.slice(1).join(' ') || '-';
    const next: EmployeeRecord = {
      id: nextId,
      userId: `REC-${nextId}`,
      employeeName: employee.name,
      position: employee.position,
      dailyRate: 500,
      status: 'Active',
      dateHired: new Date().toISOString().slice(0, 10),
      personalInfo: {
        firstName,
        lastName,
        middleName: '',
        email: '',
        mobile: '',
        address: '',
      },
      employmentDetails: {
        department: 'Operations',
        employmentType: 'Probationary',
        manager: '',
      },
      emergencyContact: {
        name: '',
        relationship: 'Parent',
        mobile: '',
      },
      documents: {
        govId: 'Pending',
        contract: 'Pending',
        certificates: '',
      },
    };
    setEmployeeRecords((prev) => [next, ...prev]);
    showSnack(`${employee.name} added to employee records.`);
  };

  const createEmployeeFromCandidate = (candidate: RecruitmentApplicant) => {
    const nextId = (employeeRecords[0]?.id ?? 0) + 1;
    const nameParts = candidate.name.trim().split(/\s+/);
    const firstName = nameParts[0] || candidate.name;
    const lastName = nameParts.slice(1).join(' ') || '-';
    const nextEmployee: EmployeeRecord = {
      id: nextId,
      userId: String(candidate.id),
      employeeName: candidate.name,
      position: candidate.postingTitle,
      dailyRate: 500,
      status: 'Active',
      dateHired: new Date().toISOString().slice(0, 10),
      personalInfo: {
        firstName,
        lastName,
        middleName: '',
        email: '',
        mobile: '',
        address: '',
      },
      employmentDetails: {
        department: 'Operations',
        employmentType: 'Probationary',
        manager: '',
      },
      emergencyContact: {
        name: '',
        relationship: 'Parent',
        mobile: '',
      },
      documents: {
        govId: 'Pending',
        contract: 'Pending',
        certificates: '',
      },
    };
    setEmployeeRecords((prev) => [nextEmployee, ...prev]);
  };

  const handleCreateJobPosting = (event: React.FormEvent) => {
    event.preventDefault();

    if (!postingForm.title.trim() || !postingForm.department.trim()) return;

    const nextPosting: JobPosting = {
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
    setPostingForm((prev) => ({
      ...prev,
      title: '',
      department: 'Operations',
      headcount: '1',
      sourceChannels: 'Careers Site, LinkedIn, Referral Program',
      status: 'published',
    }));
    showSnack('Job posting published and ready for sourcing.');
  };

  const handleAddEmployee = (event: React.FormEvent) => {
    event.preventDefault();
    if (!recordForm.firstName.trim() || !recordForm.lastName.trim() || !recordForm.position.trim()) {
      showSnack('First name, last name, and position are required.');
      return;
    }

    const employeeName = `${recordForm.lastName.trim()}, ${recordForm.firstName.trim()}${recordForm.middleName.trim() ? ` ${recordForm.middleName.trim()}` : ''}`;
    const nextId = (employeeRecords[0]?.id ?? 0) + 1;
    const next: EmployeeRecord = {
      id: nextId,
      userId: recordForm.userId.trim() || 'N/A',
      employeeName,
      position: recordForm.position.trim(),
      dailyRate: Number(recordForm.dailyRate) || 0,
      status: recordForm.status,
      dateHired: recordForm.dateHired,
      personalInfo: {
        firstName: recordForm.firstName.trim(),
        middleName: recordForm.middleName.trim(),
        lastName: recordForm.lastName.trim(),
        email: recordForm.email.trim(),
        mobile: recordForm.mobile.trim(),
        address: recordForm.address.trim(),
      },
      employmentDetails: {
        department: recordForm.department.trim(),
        employmentType: recordForm.employmentType.trim(),
        manager: recordForm.manager.trim(),
      },
      emergencyContact: {
        name: recordForm.emergencyName.trim(),
        relationship: recordForm.emergencyRelationship.trim(),
        mobile: recordForm.emergencyMobile.trim(),
      },
      documents: {
        govId: recordForm.documentGovId.trim(),
        contract: recordForm.documentContract.trim(),
        certificates: recordForm.documentCertificates.trim(),
      },
    };
    setEmployeeRecords((prev) => [next, ...prev]);
    setRecordForm((prev) => ({
      ...prev,
      userId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      mobile: '',
      address: '',
      manager: '',
      emergencyName: '',
      emergencyMobile: '',
      documentCertificates: '',
    }));
    showSnack('Employee record added to Personal Info, Employment Details, Emergency Contacts, and Documents.');
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployeeRecords((prev) => prev.filter((item) => item.id !== id));
    showSnack('Employee removed.');
  };

  const handleRegisterApplicant = (event: React.FormEvent) => {
    event.preventDefault();
    const posting = jobPostings.find((item) => item.id === candidateForm.postingId);
    if (!candidateForm.name.trim() || !posting) return;
    const next: RecruitmentApplicant = {
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
    setCandidateForm((prev) => ({ ...prev, name: '', notes: '', position: '', status: 'active' }));
    showSnack('Applicant registered and started in sourcing stage.');
  };

  const advanceCandidateStage = (candidateId: number) => {
    setCandidates((prev) =>
      prev.map((candidate) => {
        if (candidate.id !== candidateId || candidate.status !== 'active') return candidate;

        const currentIndex = recruitmentStageSequence.indexOf(candidate.stage as Exclude<RecruitmentStage, 'hired' | 'rejected'>);
        const nextStage = currentIndex >= 0 && currentIndex < recruitmentStageSequence.length - 1
          ? recruitmentStageSequence[currentIndex + 1]
          : 'hired';

        if (nextStage === 'hired') {
          createEmployeeFromCandidate(candidate);
          showSnack(`${candidate.name} marked as hired and moved to employee records.`);
          return {
            ...candidate,
            stage: 'hired',
            status: 'hired',
            updatedAt: new Date().toISOString(),
          };
        }

        showSnack(`${candidate.name} moved to ${recruitmentStageLabels[nextStage]}.`);
        return {
          ...candidate,
          stage: nextStage,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const rejectCandidate = (candidateId: number) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              stage: 'rejected',
              status: 'rejected',
              updatedAt: new Date().toISOString(),
            }
          : candidate,
      ),
    );
    showSnack('Applicant marked as rejected.');
  };

  const handleClockAction = (action: 'in' | 'out') => {
    const selected = employeeRecords.find((item) => String(item.id) === selectedAttendanceEmployee);
    if (!selected) {
      showSnack('Select an employee first.');
      return;
    }

    const now = new Date();
    const time = formatTime(now);
    const today = new Date().toISOString().slice(0, 10);

    if (action === 'in') {
      setAttendanceRows((prev) => {
        const existingOpenRow = prev.find(
          (item) => item.employeeName === selected.employeeName && item.workDate === today && item.clockOut === '--:--'
        );
        if (existingOpenRow) {
          showSnack('Employee already has an open attendance record today.');
          return prev;
        }

        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const lateMinutes = computeLateMinutes(nowMinutes);

        const next: AttendanceRow = {
          id: Date.now(),
          workDate: today,
          employeeName: selected.employeeName,
          position: selected.position,
          clockIn: time,
          clockOut: '--:--',
          workedMinutes: 0,
          lateMinutes,
          undertimeMinutes: 0,
          overtimeMinutes: 0,
          officialBusinessMinutes: 0,
          status: lateMinutes > 0 ? 'Late' : 'Open',
        };

        showSnack(`Clock in saved${lateMinutes > 0 ? ` (${lateMinutes} min late).` : '.'}`);
        return [next, ...prev];
      });
      return;
    }

    setAttendanceRows((prev) => {
      const index = prev.findIndex(
        (item) => item.employeeName === selected.employeeName && item.workDate === today && item.clockOut === '--:--'
      );
      if (index === -1) {
        showSnack('No open attendance record for clock out.');
        return prev;
      }

      const row = prev[index];
      const clockInMinutes = toMinutesFromClockLabel(row.clockIn);
      const clockOutMinutes = now.getHours() * 60 + now.getMinutes();
      const workedMinutes = Math.max(0, clockInMinutes === null ? 0 : clockOutMinutes - clockInMinutes - SHIFT_BREAK_MINUTES);
      const undertimeMinutes = computeUndertimeMinutes(clockOutMinutes, row.officialBusinessMinutes);
      const overtimeMinutes = Math.max(0, clockOutMinutes - SHIFT_END_MINUTES);

      let status: AttendanceRow['status'] = 'Completed';
      if (row.officialBusinessMinutes > 0) status = 'Official Business';
      else if (overtimeMinutes > 0) status = 'With Overtime';
      else if (undertimeMinutes > 0) status = 'Undertime';
      else if (row.lateMinutes > 0) status = 'Late';

      const updated = [...prev];
      updated[index] = {
        ...row,
        clockOut: time,
        workedMinutes,
        undertimeMinutes,
        overtimeMinutes,
        status,
      };
      showSnack('Clock out saved with automatic attendance metrics.');
      return updated;
    });
  };

  const handleFileOvertime = (event: React.FormEvent) => {
    event.preventDefault();
    if (!overtimeForm.employeeName || !overtimeForm.reason.trim()) {
      showSnack('Employee and overtime reason are required.');
      return;
    }

    const start = toMinutesFromHHMM(overtimeForm.startTime);
    const end = toMinutesFromHHMM(overtimeForm.endTime);
    if (end <= start) {
      showSnack('Overtime end time must be after start time.');
      return;
    }

    const next: OvertimeRequest = {
      id: Date.now(),
      employeeName: overtimeForm.employeeName,
      workDate: overtimeForm.workDate,
      startTime: overtimeForm.startTime,
      endTime: overtimeForm.endTime,
      minutes: end - start,
      reason: overtimeForm.reason.trim(),
      status: 'Pending',
    };

    setOvertimeRequests((prev) => [next, ...prev]);
    setOvertimeForm((prev) => ({ ...prev, reason: '' }));
    showSnack('Overtime request filed.');
  };

  const handleOvertimeDecision = (requestId: number, decision: 'Approved' | 'Rejected') => {
    const target = overtimeRequests.find((item) => item.id === requestId);
    if (!target) return;

    setOvertimeRequests((prev) => prev.map((item) => (item.id === requestId ? { ...item, status: decision } : item)));

    if (decision === 'Approved') {
      setAttendanceRows((prev) =>
        prev.map((row) => {
          if (row.employeeName !== target.employeeName || row.workDate !== target.workDate) return row;
          const overtimeMinutes = Math.max(row.overtimeMinutes, target.minutes);
          return {
            ...row,
            overtimeMinutes,
            status: 'With Overtime',
          };
        })
      );
    }

    showSnack(`Overtime request ${decision.toLowerCase()}.`);
  };

  const handleFileOfficialBusiness = (event: React.FormEvent) => {
    event.preventDefault();
    if (!officialBusinessForm.employeeName || !officialBusinessForm.purpose.trim()) {
      showSnack('Employee and official business purpose are required.');
      return;
    }

    const start = toMinutesFromHHMM(officialBusinessForm.startTime);
    const end = toMinutesFromHHMM(officialBusinessForm.endTime);
    if (end <= start) {
      showSnack('Official business end time must be after start time.');
      return;
    }

    const next: OfficialBusinessRequest = {
      id: Date.now(),
      employeeName: officialBusinessForm.employeeName,
      workDate: officialBusinessForm.workDate,
      startTime: officialBusinessForm.startTime,
      endTime: officialBusinessForm.endTime,
      minutes: end - start,
      purpose: officialBusinessForm.purpose.trim(),
      status: 'Pending',
    };

    setOfficialBusinessRequests((prev) => [next, ...prev]);
    setOfficialBusinessForm((prev) => ({ ...prev, purpose: '' }));
    showSnack('Official business request filed.');
  };

  const handleOfficialBusinessDecision = (requestId: number, decision: 'Approved' | 'Rejected') => {
    const target = officialBusinessRequests.find((item) => item.id === requestId);
    if (!target) return;

    setOfficialBusinessRequests((prev) => prev.map((item) => (item.id === requestId ? { ...item, status: decision } : item)));

    if (decision === 'Approved') {
      setAttendanceRows((prev) =>
        prev.map((row) => {
          if (row.employeeName !== target.employeeName || row.workDate !== target.workDate) return row;
          const officialBusinessMinutes = row.officialBusinessMinutes + target.minutes;
          const clockOutMinutes = toMinutesFromClockLabel(row.clockOut);
          const undertimeMinutes = clockOutMinutes === null ? row.undertimeMinutes : computeUndertimeMinutes(clockOutMinutes, officialBusinessMinutes);
          return {
            ...row,
            officialBusinessMinutes,
            undertimeMinutes,
            status: 'Official Business',
          };
        })
      );
    }

    showSnack(`Official business request ${decision.toLowerCase()}.`);
  };

  const handleLeaveRequest = (event: React.FormEvent) => {
    event.preventDefault();
    const employeeId = Number(leaveForm.employeeId);
    const employee = employeeRecords.find((item) => item.id === employeeId);
    if (!employee) {
      showSnack('Please choose an employee for leave filing.');
      return;
    }

    const requestedDays = countLeaveDaysInclusive(leaveForm.startDate, leaveForm.endDate);
    if (requestedDays <= 0) {
      showSnack('End date must be the same as or after start date.');
      return;
    }

    const creditField = leaveCreditFieldByType[leaveForm.type] ?? null;
    const employeeCredits = leaveCredits[employee.id] || { ...defaultLeaveCredits };
    const availableCredits = creditField ? employeeCredits[creditField] : Number.POSITIVE_INFINITY;
    if (creditField && requestedDays > availableCredits) {
      showSnack(`Insufficient ${leaveForm.type.toLowerCase()} credits. Available: ${availableCredits} day(s).`);
      return;
    }

    const next: LeaveRow = {
      id: Date.now(),
      employeeId: employee.id,
      employeeName: employee.employeeName,
      position: employee.position,
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      requestedDays,
      reason: leaveForm.reason || '-',
      managerDecision: 'Pending',
      hrDecision: 'Not Required',
      status: 'Pending Manager Approval',
      creditsCharged: 0,
      creditBalanceAfterApproval: creditField ? employeeCredits[creditField] : 0,
      submittedAt: new Date().toISOString(),
    };

    setLeaveRows((prev) => [next, ...prev]);
    setLeaveForm((prev) => ({ ...prev, reason: '' }));
    showSnack('Leave request filed and queued for manager approval.');
  };

  const handleLeaveDecision = (leaveId: number, reviewer: 'manager' | 'hr', decision: 'Approved' | 'Rejected') => {
    let nextMessage = '';
    setLeaveRows((prev) =>
      prev.map((row) => {
        if (row.id !== leaveId) return row;

        if (reviewer === 'manager') {
          if (row.status !== 'Pending Manager Approval') return row;

          if (decision === 'Rejected') {
            nextMessage = `${row.employeeName} leave rejected by manager.`;
            return {
              ...row,
              managerDecision: 'Rejected',
              hrDecision: 'Not Required',
              status: 'Rejected by Manager',
              decidedAt: new Date().toISOString(),
            };
          }

          nextMessage = `${row.employeeName} leave endorsed by manager and sent to HR.`;
          return {
            ...row,
            managerDecision: 'Approved',
            hrDecision: 'Pending',
            status: 'Pending HR Approval',
          };
        }

        if (row.status !== 'Pending HR Approval') return row;

        if (decision === 'Rejected') {
          nextMessage = `${row.employeeName} leave rejected by HR.`;
          return {
            ...row,
            hrDecision: 'Rejected',
            status: 'Rejected by HR',
            decidedAt: new Date().toISOString(),
          };
        }

        const creditField = leaveCreditFieldByType[row.type] ?? null;
        const employeeCredits = leaveCredits[row.employeeId] || { ...defaultLeaveCredits };
        const available = creditField ? employeeCredits[creditField] : Number.POSITIVE_INFINITY;

        if (creditField && available < row.requestedDays) {
          nextMessage = `Cannot approve ${row.employeeName}: leave credits are no longer enough.`;
          return row;
        }

        if (creditField) {
          setLeaveCredits((prevCredits) => {
            const current = prevCredits[row.employeeId] || { ...defaultLeaveCredits };
            return {
              ...prevCredits,
              [row.employeeId]: {
                ...current,
                [creditField]: Math.max(0, current[creditField] - row.requestedDays),
              },
            };
          });
        }

        const balanceAfter = creditField ? Math.max(0, available - row.requestedDays) : 0;
        nextMessage = `${row.employeeName} leave approved. Credits updated in real time.`;

        return {
          ...row,
          hrDecision: 'Approved',
          status: 'Approved',
          creditsCharged: creditField ? row.requestedDays : 0,
          creditBalanceAfterApproval: balanceAfter,
          decidedAt: new Date().toISOString(),
        };
      })
    );

    if (nextMessage) showSnack(nextMessage);
  };

  const validatePayrollForm = (employee: EmployeeRecord | undefined) => {
    if (!employee) return 'Choose an employee first.';

    const start = toDateOnly(payrollForm.startDate);
    const end = toDateOnly(payrollForm.endDate);
    if (!start || !end) return 'Payroll period dates are invalid.';
    if (end < start) return 'Cut-off end date must be on or after start date.';

    const loanDeduction = Number(payrollForm.loanDeduction);
    const otherDeductions = Number(payrollForm.otherDeductions);
    const bonus = Number(payrollForm.bonus);

    if (Number.isNaN(loanDeduction) || loanDeduction < 0) return 'Loan deduction must be a non-negative number.';
    if (Number.isNaN(otherDeductions) || otherDeductions < 0) return 'Other deductions must be a non-negative number.';
    if (Number.isNaN(bonus) || bonus < 0) return 'Bonus must be a non-negative number.';

    return null;
  };

  const buildPayrollComputation = (employee: EmployeeRecord) => {
    const periodStart = payrollForm.startDate;
    const periodEnd = payrollForm.endDate;
    const periodDays = countLeaveDaysInclusive(periodStart, periodEnd);
    const periodFactor = Math.max(0.1, periodDays / 30);
    const regularWorkDays = countWeekdaysInclusive(periodStart, periodEnd);

    const roleRate = roleSalaryCatalog[employee.position];
    const dailyRateUsed = roleRate?.dailyRate || employee.dailyRate;
    const monthlyRateEstimate = roleRate?.monthlyEstimate || roundMoney(dailyRateUsed * 26);
    const roleAllowance = roleRate?.allowance || 0;

    const employeeAttendance = attendanceRows.filter(
      (row) => row.employeeName === employee.employeeName && isDateWithinRange(row.workDate, periodStart, periodEnd)
    );

    const attendanceDaySet = new Set(
      employeeAttendance
        .filter((row) => row.clockIn !== '--:--' && row.clockOut !== '--:--')
        .map((row) => row.workDate)
    );
    const attendanceDays = attendanceDaySet.size;
    const overtimeMinutes = employeeAttendance.reduce((sum, row) => sum + Math.max(0, row.overtimeMinutes || 0), 0);

    const approvedLeaves = leaveRows.filter(
      (row) => row.employeeId === employee.id && row.status === 'Approved'
    );

    const paidLeaveDays = approvedLeaves
      .filter((row) => row.type !== 'Unpaid Leave')
      .reduce((sum, row) => sum + countOverlapDaysInclusive(row.startDate, row.endDate, periodStart, periodEnd), 0);

    const unpaidLeaveDays = approvedLeaves
      .filter((row) => row.type === 'Unpaid Leave')
      .reduce((sum, row) => sum + countOverlapDaysInclusive(row.startDate, row.endDate, periodStart, periodEnd), 0);

    const payableDays = Math.max(0, Math.min(regularWorkDays, attendanceDays + paidLeaveDays));
    const hourlyRate = dailyRateUsed / 8;
    const basicPay = roundMoney(dailyRateUsed * payableDays);
    const overtimePay = roundMoney((overtimeMinutes / 60) * hourlyRate * 1.25);
    const bonus = roundMoney(Number(payrollForm.bonus) || 0);
    const grossPay = roundMoney(basicPay + overtimePay + roleAllowance + bonus);

    const monthlyEquivalent = grossPay / periodFactor;
    const tax = roundMoney(computeMonthlyWithholdingTax(monthlyEquivalent) * periodFactor);
    const sss = roundMoney(computeSssEmployeeShareMonthly(monthlyEquivalent) * periodFactor);
    const philHealth = roundMoney(computePhilHealthEmployeeShareMonthly(monthlyEquivalent) * periodFactor);
    const pagIbig = roundMoney(computePagIbigEmployeeShareMonthly(monthlyEquivalent) * periodFactor);
    const loans = roundMoney(Number(payrollForm.loanDeduction) || 0);
    const otherDeductions = roundMoney(Number(payrollForm.otherDeductions) || 0);
    const totalDeductions = roundMoney(tax + sss + philHealth + pagIbig + loans + otherDeductions);
    const netSalary = roundMoney(grossPay - totalDeductions);

    return {
      periodStart,
      periodEnd,
      attendanceDays,
      paidLeaveDays,
      unpaidLeaveDays,
      payableDays,
      dailyRateUsed,
      monthlyRateEstimate,
      roleAllowance,
      basicPay,
      overtimePay,
      grossPay,
      tax,
      sss,
      philHealth,
      pagIbig,
      loans,
      otherDeductions,
      totalDeductions,
      bonus,
      netSalary,
    };
  };

  const handlePayrollCalculate = (event: React.FormEvent) => {
    event.preventDefault();

    const selected = employeeRecords.find((item) => String(item.id) === payrollForm.employeeId);
    const validationError = validatePayrollForm(selected);
    if (validationError) {
      showSnack(validationError);
      return;
    }

    const computed = buildPayrollComputation(selected);

    if (computed.netSalary < 0) {
      showSnack('Net salary cannot be negative. Please review deductions and loan amount.');
      return;
    }

    if (computed.attendanceDays === 0 && computed.paidLeaveDays === 0 && computed.unpaidLeaveDays === 0) {
      showSnack('No attendance or approved leave data found for this period.');
      return;
    }

    const generatedAt = new Date().toISOString();

    if (editingPayrollId) {
      setPayrollRows((prev) =>
        prev.map((row) =>
          row.id === editingPayrollId
            ? {
                ...row,
                employeeId: selected.id,
                employeeName: selected.employeeName,
                position: selected.position,
                periodStart: computed.periodStart,
                periodEnd: computed.periodEnd,
                period: `${computed.periodStart} to ${computed.periodEnd}`,
                attendanceDays: computed.attendanceDays,
                paidLeaveDays: computed.paidLeaveDays,
                unpaidLeaveDays: computed.unpaidLeaveDays,
                payableDays: computed.payableDays,
                dailyRateUsed: computed.dailyRateUsed,
                monthlyRateEstimate: computed.monthlyRateEstimate,
                roleAllowance: computed.roleAllowance,
                basicPay: computed.basicPay,
                overtimePay: computed.overtimePay,
                grossPay: computed.grossPay,
                tax: computed.tax,
                sss: computed.sss,
                philHealth: computed.philHealth,
                pagIbig: computed.pagIbig,
                loans: computed.loans,
                otherDeductions: computed.otherDeductions,
                totalDeductions: computed.totalDeductions,
                bonus: computed.bonus,
                netSalary: computed.netSalary,
                generatedAt,
                status: 'Edited',
              }
            : row
        )
      );
      setEditingPayrollId(null);
      showSnack('Payslip updated and marked as Edited.');
      return;
    }

    const next: PayrollRow = {
      id: Date.now(),
      payslipNo: `PS-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      generatedAt,
      employeeId: selected.id,
      employeeName: selected.employeeName,
      position: selected.position,
      dailyRateUsed: computed.dailyRateUsed,
      monthlyRateEstimate: computed.monthlyRateEstimate,
      roleAllowance: computed.roleAllowance,
      periodStart: computed.periodStart,
      periodEnd: computed.periodEnd,
      period: `${computed.periodStart} to ${computed.periodEnd}`,
      attendanceDays: computed.attendanceDays,
      paidLeaveDays: computed.paidLeaveDays,
      unpaidLeaveDays: computed.unpaidLeaveDays,
      payableDays: computed.payableDays,
      basicPay: computed.basicPay,
      overtimePay: computed.overtimePay,
      grossPay: computed.grossPay,
      tax: computed.tax,
      sss: computed.sss,
      philHealth: computed.philHealth,
      pagIbig: computed.pagIbig,
      loans: computed.loans,
      otherDeductions: computed.otherDeductions,
      totalDeductions: computed.totalDeductions,
      bonus: computed.bonus,
      netSalary: computed.netSalary,
      status: 'Generated',
    };

    setPayrollRows((prev) => [next, ...prev]);
    showSnack(`Payslip ${next.payslipNo} generated successfully.`);
  };

  const handleConfirmPayroll = (id: number) => {
    setPayrollRows((prev) => prev.map((row) => (row.id === id ? { ...row, status: 'Confirmed' } : row)));
    showSnack('Payslip confirmed.');
  };

  const handleEditPayroll = (id: number) => {
    const target = payrollRows.find((row) => row.id === id);
    if (!target) return;
    setPayrollForm({
      employeeId: String(target.employeeId),
      startDate: target.periodStart,
      endDate: target.periodEnd,
      loanDeduction: String(target.loans),
      otherDeductions: String(target.otherDeductions),
      bonus: String(target.bonus),
    });
    setEditingPayrollId(id);
    showSnack(`Editing ${target.payslipNo}. Recompute to save changes.`);
  };

  const handleDeletePayroll = (id: number) => {
    setPayrollRows((prev) => prev.filter((row) => row.id !== id));
    if (editingPayrollId === id) setEditingPayrollId(null);
    showSnack('Payslip deleted from history.');
  };

  const handleDownloadPayslip = (row: PayrollRow) => {
    if (typeof window === 'undefined') return;
    const content = [
      'PARK HR PAYSLIP',
      `Payslip No: ${row.payslipNo}`,
      `Generated: ${new Date(row.generatedAt).toLocaleString('en-US')}`,
      `Employee: ${row.employeeName}`,
      `Position: ${row.position}`,
      `Period: ${row.period}`,
      '',
      `Daily Rate Used: ${money(row.dailyRateUsed)}`,
      `Monthly Rate Estimate: ${money(row.monthlyRateEstimate)}`,
      `Role Allowance: ${money(row.roleAllowance)}`,
      `Attendance Days: ${row.attendanceDays}`,
      `Paid Leave Days: ${row.paidLeaveDays}`,
      `Unpaid Leave Days: ${row.unpaidLeaveDays}`,
      `Payable Days: ${row.payableDays}`,
      `Basic Pay: ${money(row.basicPay)}`,
      `Overtime Pay: ${money(row.overtimePay)}`,
      `Bonus: ${money(row.bonus)}`,
      `Gross Pay: ${money(row.grossPay)}`,
      '',
      `Tax: ${money(row.tax)}`,
      `SSS: ${money(row.sss)}`,
      `PhilHealth: ${money(row.philHealth)}`,
      `Pag-IBIG: ${money(row.pagIbig)}`,
      `Loans: ${money(row.loans)}`,
      `Other Deductions: ${money(row.otherDeductions)}`,
      `Total Deductions: ${money(row.totalDeductions)}`,
      '',
      `Final Salary (Net Pay): ${money(row.netSalary)}`,
      `Status: ${row.status}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${row.payslipNo}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    showSnack(`Downloaded ${row.payslipNo}.txt`);
  };

  const handleSetPerformanceGoals = (event: React.FormEvent) => {
    event.preventDefault();
    const employee = employeeRecords.find((item) => String(item.id) === performanceSetupForm.employeeId);
    if (!employee) {
      showSnack('Select an employee before creating an appraisal.');
      return;
    }
    if (!performanceSetupForm.kpiGoals.trim()) {
      showSnack('Please define KPI/Goal details before saving.');
      return;
    }

    const next: PerformanceRow = {
      id: Date.now(),
      employeeId: employee.id,
      employeeName: employee.employeeName,
      position: employee.position,
      period: performanceSetupForm.period.trim() || 'Current Period',
      kpiGoals: performanceSetupForm.kpiGoals.trim(),
      selfEvaluation: '',
      managerEvaluation: '',
      selfRating: null,
      managerRating: null,
      finalRating: null,
      status: 'Goals Set',
      linkedToRecord: false,
      createdAt: new Date().toISOString(),
    };

    setPerformanceRows((prev) => [next, ...prev]);
    setPerformanceSetupForm((prev) => ({ ...prev, kpiGoals: '' }));
    setSelfEvaluationForm((prev) => ({ ...prev, appraisalId: String(next.id) }));
    showSnack('KPI/Goals saved. Appraisal moved to self-evaluation step.');
  };

  const handleSubmitSelfEvaluation = (event: React.FormEvent) => {
    event.preventDefault();
    const appraisalId = Number(selfEvaluationForm.appraisalId);
    if (!appraisalId) {
      showSnack('Select an appraisal for self-evaluation.');
      return;
    }
    if (!selfEvaluationForm.selfEvaluation.trim()) {
      showSnack('Self-evaluation comments are required.');
      return;
    }

    const score = Number(selfEvaluationForm.selfRating);
    if (Number.isNaN(score) || score < 1 || score > 5) {
      showSnack('Self-rating must be between 1 and 5.');
      return;
    }

    let updated = false;
    setPerformanceRows((prev) =>
      prev.map((row) => {
        if (row.id !== appraisalId || row.status !== 'Goals Set') return row;
        updated = true;
        return {
          ...row,
          selfEvaluation: selfEvaluationForm.selfEvaluation.trim(),
          selfRating: score,
          status: 'Self Evaluation Submitted',
        };
      })
    );

    if (!updated) {
      showSnack('Selected appraisal is not ready for self-evaluation.');
      return;
    }

    setSelfEvaluationForm((prev) => ({ ...prev, selfEvaluation: '' }));
    setManagerEvaluationForm((prev) => ({ ...prev, appraisalId: String(appraisalId) }));
    showSnack('Self-evaluation submitted and routed to manager evaluation.');
  };

  const handleSubmitManagerEvaluation = (event: React.FormEvent) => {
    event.preventDefault();
    const appraisalId = Number(managerEvaluationForm.appraisalId);
    if (!appraisalId) {
      showSnack('Select an appraisal for manager evaluation.');
      return;
    }
    if (!managerEvaluationForm.managerEvaluation.trim()) {
      showSnack('Manager evaluation comments are required.');
      return;
    }

    const score = Number(managerEvaluationForm.managerRating);
    if (Number.isNaN(score) || score < 1 || score > 5) {
      showSnack('Manager rating must be between 1 and 5.');
      return;
    }

    let updated = false;
    setPerformanceRows((prev) =>
      prev.map((row) => {
        if (row.id !== appraisalId || row.status !== 'Self Evaluation Submitted') return row;
        updated = true;
        return {
          ...row,
          managerEvaluation: managerEvaluationForm.managerEvaluation.trim(),
          managerRating: score,
          status: 'Manager Evaluation Submitted',
        };
      })
    );

    if (!updated) {
      showSnack('Selected appraisal is not ready for manager evaluation.');
      return;
    }

    setManagerEvaluationForm((prev) => ({ ...prev, managerEvaluation: '' }));
    showSnack('Manager evaluation submitted. Appraisal is ready for final rating.');
  };

  const handleFinalizePerformance = (id: number) => {
    const appraisal = performanceRows.find((row) => row.id === id);
    if (!appraisal) return;
    if (appraisal.status !== 'Manager Evaluation Submitted') {
      showSnack('Only appraisals with completed manager evaluation can be finalized.');
      return;
    }
    if (appraisal.selfRating === null || appraisal.managerRating === null) {
      showSnack('Self and manager ratings are both required before finalizing.');
      return;
    }

    const finalRating = roundMoney((appraisal.selfRating * 0.4) + (appraisal.managerRating * 0.6));
    const finalizedAt = new Date().toISOString();

    setPerformanceRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              finalRating,
              status: 'Finalized',
              linkedToRecord: true,
              finalizedAt,
            }
          : row
      )
    );

    setEmployeeRecords((prev) =>
      prev.map((employee) =>
        employee.id === appraisal.employeeId
          ? {
              ...employee,
              latestPerformance: {
                period: appraisal.period,
                finalRating,
                finalizedAt,
                managerEvaluation: appraisal.managerEvaluation,
                kpiGoals: appraisal.kpiGoals,
              },
            }
          : employee
      )
    );

    showSnack('Final rating completed and synced to employee HR record.');
  };

  const totalPayroll = payrollRows.reduce((sum, row) => sum + row.netSalary, 0);
  const pendingLeaves = leaveRows.filter((item) => item.status === 'Pending Manager Approval' || item.status === 'Pending HR Approval').length;
  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = attendanceRows.filter((row) => row.workDate === today);
  const openAttendanceCount = todayAttendance.filter((row) => row.clockOut === '--:--').length;
  const lateCount = todayAttendance.filter((row) => row.lateMinutes > 0).length;
  const undertimeCount = todayAttendance.filter((row) => row.undertimeMinutes > 0).length;
  const pendingOvertimeCount = overtimeRequests.filter((row) => row.status === 'Pending').length;
  const pendingOfficialBusinessCount = officialBusinessRequests.filter((row) => row.status === 'Pending').length;
  const leavePendingManager = leaveRows.filter((row) => row.status === 'Pending Manager Approval').length;
  const leavePendingHr = leaveRows.filter((row) => row.status === 'Pending HR Approval').length;
  const leaveApprovedCount = leaveRows.filter((row) => row.status === 'Approved').length;
  const leaveRejectedCount = leaveRows.filter((row) => row.status === 'Rejected by Manager' || row.status === 'Rejected by HR').length;
  const leaveFormEmployeeId = Number(leaveForm.employeeId || 0);
  const leaveFormEmployeeCredits = leaveCredits[leaveFormEmployeeId] || defaultLeaveCredits;
  const leaveDaysPreview = countLeaveDaysInclusive(leaveForm.startDate, leaveForm.endDate);
  const leaveCreditField = leaveCreditFieldByType[leaveForm.type] ?? null;
  const leaveAvailableDays = leaveCreditField ? leaveFormEmployeeCredits[leaveCreditField] : Number.POSITIVE_INFINITY;
  const leaveRemainingIfApproved = leaveCreditField ? Math.max(0, leaveAvailableDays - Math.max(0, leaveDaysPreview)) : 0;
  const payrollSelectedEmployee = employeeRecords.find((item) => String(item.id) === payrollForm.employeeId);
  const payrollRoleSalary = payrollSelectedEmployee ? roleSalaryCatalog[payrollSelectedEmployee.position] : null;
  const payrollDailyRatePreview = payrollSelectedEmployee ? (payrollRoleSalary?.dailyRate || payrollSelectedEmployee.dailyRate) : 0;
  const payrollMonthlyRatePreview = payrollSelectedEmployee ? (payrollRoleSalary?.monthlyEstimate || roundMoney(payrollDailyRatePreview * 26)) : 0;
  const payrollAllowancePreview = payrollSelectedEmployee ? (payrollRoleSalary?.allowance || 0) : 0;
  const payrollValidationPreviewError = payrollSelectedEmployee ? validatePayrollForm(payrollSelectedEmployee) : null;
  const payrollPreview = payrollSelectedEmployee && !payrollValidationPreviewError ? buildPayrollComputation(payrollSelectedEmployee) : null;
  const filteredPayrollRows = React.useMemo(() => {
    const query = payrollHistorySearch.trim().toLowerCase();
    if (!query) return payrollRows;
    return payrollRows.filter((row) =>
      [
        row.payslipNo,
        row.employeeName,
        row.position,
        row.period,
        row.status,
      ].join(' ').toLowerCase().includes(query)
    );
  }, [payrollRows, payrollHistorySearch]);

  const performanceGoalSetupCount = performanceRows.filter((row) => row.status === 'Goals Set').length;
  const performanceSelfEvalCount = performanceRows.filter((row) => row.status === 'Self Evaluation Submitted').length;
  const performanceManagerEvalCount = performanceRows.filter((row) => row.status === 'Manager Evaluation Submitted').length;
  const performanceFinalizedCount = performanceRows.filter((row) => row.status === 'Finalized').length;
  const performanceSelfQueue = performanceRows.filter((row) => row.status === 'Goals Set');
  const performanceManagerQueue = performanceRows.filter((row) => row.status === 'Self Evaluation Submitted');

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ minHeight: '100vh', bgcolor: ui.page, color: ui.black }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, minHeight: '100vh' }}>
          <Box
            sx={{
              bgcolor: ui.white,
              borderRight: `1px solid ${ui.border}`,
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '12px 0 32px rgba(17, 24, 39, 0.05)',
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <Image
                src="/logo_2.png"
                alt="ParkHR logo"
                width={140}
                height={56}
                style={{ width: '140px', height: 'auto' }}
                priority
              />
              <Typography sx={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, color: ui.black }}>
                PARK <Box component="span" sx={{ color: ui.green }}>HR</Box>
              </Typography>
            </Stack>
            <Typography sx={{ mt: 1, color: ui.muted, fontSize: 13 }}>
              Operations dashboard for employee, payroll, and attendance workflows.
            </Typography>

            <Typography sx={{ mt: 3, mb: 1.5, color: ui.muted, fontSize: 12, letterSpacing: '0.08em' }}>
              HR MODULES
            </Typography>

            <Stack spacing={0.5}>
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  startIcon={item.icon}
                  variant="text"
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    color: activeModule === item.id ? ui.white : ui.black,
                    bgcolor: activeModule === item.id ? ui.green : ui.white,
                    border: `1px solid ${activeModule === item.id ? ui.green : ui.border}`,
                    borderRadius: 2,
                    py: 1.1,
                    px: 1.4,
                    '&:hover': { bgcolor: activeModule === item.id ? ui.greenDark : ui.greenSoft },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button
                fullWidth
                onClick={() => router.push('/login')}
                sx={darkButtonSx}
              >
                Log Out
              </Button>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 2, md: 3 }, overflowX: 'auto', ...readableFormSx }}>
            {activeModule === 'dashboard' ? (
              <Paper sx={{ ...cardStyle, p: { xs: 2, md: 3 }, mb: 2 }}>
                <Stack
                  direction={{ xs: 'column', lg: 'row' }}
                  spacing={2}
                  sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}
                >
                  <Stack spacing={0.75}>
                    <Button
                      onClick={() => router.push('/admin-dashboard')}
                      sx={{
                        alignSelf: 'flex-start',
                        textTransform: 'none',
                        color: ui.green,
                        p: 0,
                        minWidth: 0,
                        fontWeight: 700,
                      }}
                    >
                      ← Back to Admin Dashboard
                    </Button>
                    <Typography sx={{ fontSize: { xs: 26, md: 34 }, fontWeight: 900, color: ui.black }}>
                      HR Operations Dashboard
                    </Typography>
                    <Typography sx={{ color: ui.muted }}>
                      {moduleTitles[activeModule]}
                    </Typography>
                  </Stack>

                  <Stack spacing={1.5} sx={{ width: { xs: '100%', lg: 'auto' }, alignItems: { lg: 'flex-end' } }}>
                    <Chip
                      label={`Role: ${user?.userType || 'staff'}`}
                      sx={{ bgcolor: ui.greenSoft, color: ui.greenDark, fontWeight: 800, borderRadius: 999 }}
                    />
                    <Typography sx={{ color: ui.muted, fontSize: 14 }}>{formatDate(liveTime)}</Typography>
                    <TextField
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search employees, status, or roles"
                      size="small"
                      sx={{
                        width: { xs: '100%', lg: 360 },
                        '& .MuiInputBase-root': {
                          bgcolor: ui.white,
                          color: ui.black,
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Stack>
                </Stack>
              </Paper>
            ) : null}

            {activeModule === 'dashboard' ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0,1fr))', xl: 'repeat(4, minmax(0,1fr))' },
                  gap: 1.5,
                  mb: 2,
                }}
              >
                {[
                  { label: 'Employees', value: employeeRecords.length },
                  { label: 'Applicants', value: candidates.length },
                  { label: 'Pending Leaves', value: pendingLeaves },
                  { label: 'Payroll Total', value: money(totalPayroll) },
                ].map((item) => (
                  <Paper key={item.label} sx={{ ...cardStyle, p: 2 }}>
                    <Typography sx={{ color: ui.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</Typography>
                    <Typography sx={{ mt: 0.75, fontWeight: 800, color: ui.black, fontSize: 28 }}>{item.value}</Typography>
                  </Paper>
                ))}
              </Box>
            ) : null}

            {activeModule === 'dashboard' ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.2fr) minmax(0, 1fr)' }, gap: 2 }}>
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

                <Stack spacing={2}>
                  <Paper sx={{ ...cardStyle, p: 2 }}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Attendance Snapshot ({today})</Typography>
                    <Divider sx={sectionDividerSx} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}>
                      {[
                        { label: 'Open Time Logs', value: openAttendanceCount },
                        { label: 'Late Today', value: lateCount },
                        { label: 'Undertime Today', value: undertimeCount },
                        { label: 'Pending OT', value: pendingOvertimeCount },
                      ].map((item) => (
                        <Paper key={item.label} sx={{ border: `1px solid ${ui.border}`, borderRadius: 2, p: 1.25, bgcolor: ui.white }}>
                          <Typography sx={{ color: ui.muted, fontSize: 12 }}>{item.label}</Typography>
                          <Typography sx={{ color: ui.black, fontWeight: 900, fontSize: 24 }}>{item.value}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Paper>

                  <Paper sx={{ ...cardStyle, p: 2 }}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Quick Actions</Typography>
                    <Divider sx={sectionDividerSx} />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <Button fullWidth sx={primaryButtonSx} onClick={() => setActiveModule('records')}>Manage Employees</Button>
                      <Button fullWidth sx={primaryButtonSx} onClick={() => setActiveModule('recruitment')}>Open Recruitment</Button>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
                      <Button fullWidth sx={darkButtonSx} onClick={() => setActiveModule('attendance')}>Review Attendance</Button>
                      <Button fullWidth sx={darkButtonSx} onClick={() => setActiveModule('leave')}>Review Leave Queue ({pendingLeaves})</Button>
                    </Stack>
                    <Typography sx={{ mt: 1.25, color: ui.muted, fontSize: 12 }}>
                      Recruitment active: {recruitmentStats.activeApplicants} applicants. Pending official business: {pendingOfficialBusinessCount}.
                    </Typography>
                  </Paper>
                </Stack>
              </Box>
            ) : null}

            {activeModule === 'records' ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) minmax(0, 1.9fr)' }, gap: 2 }}>
                <Paper sx={{ ...cardStyle, p: 2 }} component="form" onSubmit={handleAddEmployee}>
                  <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Add New Employee</Typography>
                  <Divider sx={sectionDividerSx} />
                  <Stack spacing={1.5}>
                    <Typography sx={{ fontWeight: 700, color: ui.green }}>Personal Info</Typography>
                    <TextField label="User ID (Optional)" value={recordForm.userId} onChange={(e) => setRecordForm((prev) => ({ ...prev, userId: e.target.value }))} size="small" />
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                      <TextField label="First Name" value={recordForm.firstName} onChange={(e) => setRecordForm((prev) => ({ ...prev, firstName: e.target.value }))} size="small" required fullWidth />
                      <TextField label="Middle Name" value={recordForm.middleName} onChange={(e) => setRecordForm((prev) => ({ ...prev, middleName: e.target.value }))} size="small" fullWidth />
                      <TextField label="Last Name" value={recordForm.lastName} onChange={(e) => setRecordForm((prev) => ({ ...prev, lastName: e.target.value }))} size="small" required fullWidth />
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                      <TextField label="Email" type="email" value={recordForm.email} onChange={(e) => setRecordForm((prev) => ({ ...prev, email: e.target.value }))} size="small" fullWidth />
                      <TextField label="Mobile" value={recordForm.mobile} onChange={(e) => setRecordForm((prev) => ({ ...prev, mobile: e.target.value }))} size="small" fullWidth />
                    </Stack>
                    <TextField label="Address" value={recordForm.address} onChange={(e) => setRecordForm((prev) => ({ ...prev, address: e.target.value }))} size="small" />

                    <Divider sx={sectionDividerSx} />
                    <Typography sx={{ fontWeight: 700, color: ui.green }}>Employment Details</Typography>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                      <TextField label="Position" value={recordForm.position} onChange={(e) => setRecordForm((prev) => ({ ...prev, position: e.target.value }))} size="small" required fullWidth />
                      <TextField label="Department" value={recordForm.department} onChange={(e) => setRecordForm((prev) => ({ ...prev, department: e.target.value }))} size="small" fullWidth />
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                      <TextField label="Employment Type" value={recordForm.employmentType} onChange={(e) => setRecordForm((prev) => ({ ...prev, employmentType: e.target.value }))} size="small" fullWidth />
                      <TextField label="Manager" value={recordForm.manager} onChange={(e) => setRecordForm((prev) => ({ ...prev, manager: e.target.value }))} size="small" fullWidth />
                    </Stack>
                    <TextField label="Daily Rate (P)" type="number" value={recordForm.dailyRate} onChange={(e) => setRecordForm((prev) => ({ ...prev, dailyRate: e.target.value }))} size="small" />
                    <FormControl size="small">
                      <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Status</FormLabel>
                      <Select
                        value={recordForm.status}
                        onChange={(e) => setRecordForm((prev) => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Date Hired"
                      type="date"
                      value={recordForm.dateHired}
                      onChange={(e) => setRecordForm((prev) => ({ ...prev, dateHired: e.target.value }))}
                      size="small"
                      slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <Divider sx={sectionDividerSx} />
                    <Typography sx={{ fontWeight: 700, color: ui.green }}>Emergency Contacts</Typography>
                    <TextField label="Contact Name" value={recordForm.emergencyName} onChange={(e) => setRecordForm((prev) => ({ ...prev, emergencyName: e.target.value }))} size="small" />
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                      <TextField label="Relationship" value={recordForm.emergencyRelationship} onChange={(e) => setRecordForm((prev) => ({ ...prev, emergencyRelationship: e.target.value }))} size="small" fullWidth />
                      <TextField label="Contact Mobile" value={recordForm.emergencyMobile} onChange={(e) => setRecordForm((prev) => ({ ...prev, emergencyMobile: e.target.value }))} size="small" fullWidth />
                    </Stack>

                    <Divider sx={sectionDividerSx} />
                    <Typography sx={{ fontWeight: 700, color: ui.green }}>Documents</Typography>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                      <TextField label="Government IDs" value={recordForm.documentGovId} onChange={(e) => setRecordForm((prev) => ({ ...prev, documentGovId: e.target.value }))} size="small" fullWidth />
                      <TextField label="Contract" value={recordForm.documentContract} onChange={(e) => setRecordForm((prev) => ({ ...prev, documentContract: e.target.value }))} size="small" fullWidth />
                    </Stack>
                    <TextField label="Certificates" value={recordForm.documentCertificates} onChange={(e) => setRecordForm((prev) => ({ ...prev, documentCertificates: e.target.value }))} size="small" helperText="Comma-separated certificate names" />

                    <Button type="submit" sx={{ mt: 0.5, ...primaryButtonSx }}>
                      Add Employee
                    </Button>
                  </Stack>
                </Paper>

                <Paper sx={{ ...cardStyle, ...formCardPaddingSx }}>
                  <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Employee Directory</Typography>
                  <Divider sx={sectionDividerSx} />
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={tableHeadCellSx}>ID</TableCell>
                          <TableCell sx={tableHeadCellSx}>User ID</TableCell>
                          <TableCell sx={tableHeadCellSx}>Personal Info</TableCell>
                          <TableCell sx={tableHeadCellSx}>Employment Details</TableCell>
                          <TableCell sx={tableHeadCellSx}>Emergency Contact</TableCell>
                          <TableCell sx={tableHeadCellSx}>Documents</TableCell>
                          <TableCell sx={tableHeadCellSx}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredEmployees.map((row) => (
                          <TableRow key={row.id} hover>
                            <TableCell sx={{ color: ui.black }}>{row.id}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.userId}</TableCell>
                            <TableCell sx={{ color: ui.black }}>
                              <Typography sx={{ fontWeight: 700 }}>{row.personalInfo.lastName}, {row.personalInfo.firstName}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>{row.personalInfo.email || 'No email'}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>{row.personalInfo.mobile || 'No mobile'}</Typography>
                            </TableCell>
                            <TableCell sx={{ color: ui.black }}>
                              <Typography sx={{ fontWeight: 700 }}>{row.position}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>{row.employmentDetails.department} - {row.employmentDetails.employmentType}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>Rate: {money(row.dailyRate)} | {row.status}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>Hired: {row.dateHired}</Typography>
                              {row.latestPerformance ? (
                                <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>
                                  Latest Appraisal: {row.latestPerformance.period} | {row.latestPerformance.finalRating}/5
                                </Typography>
                              ) : null}
                            </TableCell>
                            <TableCell sx={{ color: ui.black }}>
                              <Typography sx={{ fontWeight: 700 }}>{row.emergencyContact.name || 'No contact'}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>{row.emergencyContact.relationship || '-'}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>{row.emergencyContact.mobile || '-'}</Typography>
                            </TableCell>
                            <TableCell sx={{ color: ui.black }}>
                              <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>Gov IDs: {row.documents.govId || 'Pending'}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>Contract: {row.documents.contract || 'Pending'}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', color: ui.muted }}>Certificates: {row.documents.certificates || 'N/A'}</Typography>
                            </TableCell>
                            <TableCell>
                              <Button size="small" onClick={() => handleDeleteEmployee(row.id)} sx={darkButtonSx}>
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            ) : null}

            {activeModule === 'recruitment' ? <RecruitmentWorkflowPanel onHireEmployee={handleRecruitmentHire} /> : null}

            {activeModule === 'attendance' ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) minmax(0, 2fr)' }, gap: 2.25 }}>
                <Stack spacing={2.25}>
                  <Paper sx={{ ...cardStyle, ...formCardPaddingSx }}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Attendance Gate</Typography>
                    <Divider sx={sectionDividerSx} />
                    <Typography sx={{ fontSize: 42, fontWeight: 900, textAlign: 'center', color: ui.green }}>
                      {liveTime.toLocaleTimeString('en-US')}
                    </Typography>
                    <Typography sx={{ textAlign: 'center', color: ui.muted, mb: 2 }}>{formatDate(liveTime)}</Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                      <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Select Employee Name</FormLabel>
                      <Select value={selectedAttendanceEmployee} onChange={(e) => setSelectedAttendanceEmployee(e.target.value)}>
                        <MenuItem value="">-- Choose employee --</MenuItem>
                        {employeeRecords.map((item) => (
                          <MenuItem key={item.id} value={String(item.id)}>{item.employeeName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Stack direction="row" spacing={1.75}>
                      <Button fullWidth onClick={() => handleClockAction('in')} sx={primaryButtonSx}>
                        Time In
                      </Button>
                      <Button fullWidth onClick={() => handleClockAction('out')} sx={darkButtonSx}>
                        Time Out
                      </Button>
                    </Stack>
                    <Typography sx={{ mt: 1.5, color: ui.muted, fontSize: 12 }}>
                      Shift setup: 8:00 AM to 5:00 PM, 1-hour break, 10-minute grace period.
                    </Typography>
                  </Paper>

                  <Paper sx={{ ...cardStyle, ...formCardPaddingSx }} component="form" onSubmit={handleFileOvertime}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>File Overtime</Typography>
                    <Divider sx={sectionDividerSx} />
                    <Stack spacing={1.5}>
                      <FormControl size="small" fullWidth>
                        <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Employee</FormLabel>
                        <Select
                          value={overtimeForm.employeeName}
                          onChange={(e) => setOvertimeForm((prev) => ({ ...prev, employeeName: e.target.value }))}
                        >
                          <MenuItem value="">-- Choose employee --</MenuItem>
                          {employeeRecords.map((item) => (
                            <MenuItem key={item.id} value={item.employeeName}>{item.employeeName}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Work Date"
                        type="date"
                        value={overtimeForm.workDate}
                        onChange={(e) => setOvertimeForm((prev) => ({ ...prev, workDate: e.target.value }))}
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <TextField
                          label="Start"
                          type="time"
                          value={overtimeForm.startTime}
                          onChange={(e) => setOvertimeForm((prev) => ({ ...prev, startTime: e.target.value }))}
                          size="small"
                          slotProps={{ inputLabel: { shrink: true } }}
                          fullWidth
                        />
                        <TextField
                          label="End"
                          type="time"
                          value={overtimeForm.endTime}
                          onChange={(e) => setOvertimeForm((prev) => ({ ...prev, endTime: e.target.value }))}
                          size="small"
                          slotProps={{ inputLabel: { shrink: true } }}
                          fullWidth
                        />
                      </Stack>
                      <TextField
                        label="Reason"
                        value={overtimeForm.reason}
                        onChange={(e) => setOvertimeForm((prev) => ({ ...prev, reason: e.target.value }))}
                        size="small"
                        multiline
                        minRows={2}
                      />
                      <Button type="submit" sx={primaryButtonSx}>Submit Overtime</Button>
                    </Stack>
                  </Paper>

                  <Paper sx={{ ...cardStyle, ...formCardPaddingSx }} component="form" onSubmit={handleFileOfficialBusiness}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>File Official Business</Typography>
                    <Divider sx={sectionDividerSx} />
                    <Stack spacing={1.5}>
                      <FormControl size="small" fullWidth>
                        <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Employee</FormLabel>
                        <Select
                          value={officialBusinessForm.employeeName}
                          onChange={(e) => setOfficialBusinessForm((prev) => ({ ...prev, employeeName: e.target.value }))}
                        >
                          <MenuItem value="">-- Choose employee --</MenuItem>
                          {employeeRecords.map((item) => (
                            <MenuItem key={item.id} value={item.employeeName}>{item.employeeName}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Work Date"
                        type="date"
                        value={officialBusinessForm.workDate}
                        onChange={(e) => setOfficialBusinessForm((prev) => ({ ...prev, workDate: e.target.value }))}
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <TextField
                          label="Start"
                          type="time"
                          value={officialBusinessForm.startTime}
                          onChange={(e) => setOfficialBusinessForm((prev) => ({ ...prev, startTime: e.target.value }))}
                          size="small"
                          slotProps={{ inputLabel: { shrink: true } }}
                          fullWidth
                        />
                        <TextField
                          label="End"
                          type="time"
                          value={officialBusinessForm.endTime}
                          onChange={(e) => setOfficialBusinessForm((prev) => ({ ...prev, endTime: e.target.value }))}
                          size="small"
                          slotProps={{ inputLabel: { shrink: true } }}
                          fullWidth
                        />
                      </Stack>
                      <TextField
                        label="Purpose"
                        value={officialBusinessForm.purpose}
                        onChange={(e) => setOfficialBusinessForm((prev) => ({ ...prev, purpose: e.target.value }))}
                        size="small"
                        multiline
                        minRows={2}
                      />
                      <Button type="submit" sx={darkButtonSx}>Submit Official Business</Button>
                    </Stack>
                  </Paper>
                </Stack>

                <Stack spacing={2.25}>
                  <Paper sx={{ ...cardStyle, ...formCardPaddingSx }}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Attendance Sheet</Typography>
                    <Divider sx={sectionDividerSx} />
                    <TableContainer sx={tableContainerSx}>
                      <Table size="small" sx={{ minWidth: 980 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={tableHeadCellSx}>Date</TableCell>
                          <TableCell sx={tableHeadCellSx}>Employee</TableCell>
                          <TableCell sx={tableHeadCellSx}>Time In</TableCell>
                          <TableCell sx={tableHeadCellSx}>Time Out</TableCell>
                          <TableCell sx={tableHeadCellSx}>Worked</TableCell>
                          <TableCell sx={tableHeadCellSx}>Late</TableCell>
                          <TableCell sx={tableHeadCellSx}>Undertime</TableCell>
                          <TableCell sx={tableHeadCellSx}>OT</TableCell>
                          <TableCell sx={tableHeadCellSx}>OB</TableCell>
                          <TableCell sx={tableHeadCellSx}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {attendanceRows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} sx={{ color: ui.black }}>No attendance records yet.</TableCell>
                          </TableRow>
                        ) : attendanceRows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell sx={{ color: ui.black }}>{row.workDate}</TableCell>
                            <TableCell sx={{ color: ui.black }}>
                              <Typography sx={{ fontWeight: 700 }}>{row.employeeName}</Typography>
                              <Typography variant="caption" sx={{ color: ui.muted }}>{row.position}</Typography>
                            </TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.clockIn}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.clockOut}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{formatMinutesToHours(row.workedMinutes)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{formatMinutesToHours(row.lateMinutes)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{formatMinutesToHours(row.undertimeMinutes)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{formatMinutesToHours(row.overtimeMinutes)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{formatMinutesToHours(row.officialBusinessMinutes)}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={row.status}
                                sx={{
                                  fontWeight: 700,
                                  color: row.status === 'Open' || row.status === 'Undertime' ? ui.black : ui.white,
                                  bgcolor:
                                    row.status === 'Late' || row.status === 'Undertime'
                                      ? ui.greenSoft
                                      : row.status === 'Open'
                                        ? ui.white
                                        : ui.green,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  </Paper>

                  <Paper sx={{ ...cardStyle, ...formCardPaddingSx }}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Overtime Requests</Typography>
                    <Divider sx={sectionDividerSx} />
                    <TableContainer sx={tableContainerSx}>
                      <Table size="small" sx={{ minWidth: 900 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={tableHeadCellSx}>Employee</TableCell>
                          <TableCell sx={tableHeadCellSx}>Date</TableCell>
                          <TableCell sx={tableHeadCellSx}>Range</TableCell>
                          <TableCell sx={tableHeadCellSx}>Duration</TableCell>
                          <TableCell sx={tableHeadCellSx}>Reason</TableCell>
                          <TableCell sx={tableHeadCellSx}>Status</TableCell>
                          <TableCell sx={tableHeadCellSx}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {overtimeRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} sx={{ color: ui.black }}>No overtime requests yet.</TableCell>
                          </TableRow>
                        ) : overtimeRequests.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell sx={{ color: ui.black }}>{row.employeeName}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.workDate}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.startTime} - {row.endTime}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{formatMinutesToHours(row.minutes)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.reason}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={row.status}
                                sx={{
                                  color: row.status === 'Pending' ? ui.black : ui.white,
                                  bgcolor: row.status === 'Approved' ? ui.green : row.status === 'Rejected' ? ui.black : ui.greenSoft,
                                  fontWeight: 700,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {row.status === 'Pending' ? (
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75}>
                                  <Button size="small" onClick={() => handleOvertimeDecision(row.id, 'Approved')} sx={{ ...primaryButtonSx, ...compactActionButtonSx }}>Approve</Button>
                                  <Button size="small" onClick={() => handleOvertimeDecision(row.id, 'Rejected')} sx={{ ...darkButtonSx, ...compactActionButtonSx }}>Reject</Button>
                                </Stack>
                              ) : (
                                <Typography variant="caption" sx={{ color: ui.muted }}>Resolved</Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>

                  <Paper sx={{ ...cardStyle, ...formCardPaddingSx }}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Official Business Requests</Typography>
                    <Divider sx={sectionDividerSx} />
                    <TableContainer sx={tableContainerSx}>
                      <Table size="small" sx={{ minWidth: 900 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={tableHeadCellSx}>Employee</TableCell>
                          <TableCell sx={tableHeadCellSx}>Date</TableCell>
                          <TableCell sx={tableHeadCellSx}>Range</TableCell>
                          <TableCell sx={tableHeadCellSx}>Duration</TableCell>
                          <TableCell sx={tableHeadCellSx}>Purpose</TableCell>
                          <TableCell sx={tableHeadCellSx}>Status</TableCell>
                          <TableCell sx={tableHeadCellSx}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {officialBusinessRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} sx={{ color: ui.black }}>No official business requests yet.</TableCell>
                          </TableRow>
                        ) : officialBusinessRequests.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell sx={{ color: ui.black }}>{row.employeeName}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.workDate}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.startTime} - {row.endTime}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{formatMinutesToHours(row.minutes)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.purpose}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={row.status}
                                sx={{
                                  color: row.status === 'Pending' ? ui.black : ui.white,
                                  bgcolor: row.status === 'Approved' ? ui.green : row.status === 'Rejected' ? ui.black : ui.greenSoft,
                                  fontWeight: 700,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {row.status === 'Pending' ? (
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75}>
                                  <Button size="small" onClick={() => handleOfficialBusinessDecision(row.id, 'Approved')} sx={{ ...primaryButtonSx, ...compactActionButtonSx }}>Approve</Button>
                                  <Button size="small" onClick={() => handleOfficialBusinessDecision(row.id, 'Rejected')} sx={{ ...darkButtonSx, ...compactActionButtonSx }}>Reject</Button>
                                </Stack>
                              ) : (
                                <Typography variant="caption" sx={{ color: ui.muted }}>Resolved</Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Stack>
              </Box>
            ) : null}

            {activeModule === 'leave' ? (
              <Stack spacing={2.25}>
                <Paper
                  sx={{
                    ...cardStyle,
                    ...formCardPaddingSx,
                    ...highlightedSectionSx,
                  }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, mb: 1.5 }}>
                    <Box>
                      <Typography sx={{ color: ui.greenDark, fontWeight: 900, fontSize: 22 }}>Leave Approval Counters</Typography>
                      <Typography sx={{ color: ui.muted, fontSize: 13 }}>Live summary from manager and HR leave workflow decisions.</Typography>
                    </Box>
                    <Chip label="Live Workflow Status" sx={{ bgcolor: ui.green, color: ui.white, fontWeight: 800 }} />
                  </Stack>
                  <Divider sx={sectionDividerSx} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, minmax(0, 1fr))' }, gap: 1.25 }}>
                    {[
                      { label: 'Pending Manager', value: leavePendingManager, accent: ui.black },
                      { label: 'Pending HR', value: leavePendingHr, accent: ui.greenDark },
                      { label: 'Approved', value: leaveApprovedCount, accent: ui.green },
                      { label: 'Rejected', value: leaveRejectedCount, accent: ui.black },
                    ].map((item) => (
                      <Paper key={item.label} sx={{ border: `1px solid ${ui.border}`, borderTop: `3px solid ${item.accent}`, borderRadius: 2, p: 1.5, bgcolor: ui.white }}>
                        <Typography sx={{ color: ui.muted, fontSize: 12 }}>{item.label}</Typography>
                        <Typography sx={{ color: ui.black, fontWeight: 900, fontSize: 24, mt: 0.25 }}>{item.value}</Typography>
                      </Paper>
                    ))}
                  </Box>
                </Paper>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) minmax(0, 1.9fr)' }, gap: 2.25 }}>
                <Paper sx={{ ...cardStyle, ...formCardPaddingSx }} component="form" onSubmit={handleLeaveRequest}>
                  <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Employee Leave Filing</Typography>
                  <Divider sx={sectionDividerSx} />
                  <Box sx={{ ...formGridSpacingSx, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
                    <FormControl size="small" fullWidth sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                      <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Employee</FormLabel>
                      <Select value={leaveForm.employeeId} onChange={(e) => setLeaveForm((prev) => ({ ...prev, employeeId: e.target.value }))}>
                        <MenuItem value="">-- Choose employee --</MenuItem>
                        {employeeRecords.map((item) => (
                          <MenuItem key={item.id} value={String(item.id)}>
                            {item.employeeName} ({item.position})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" fullWidth>
                      <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Leave Type</FormLabel>
                      <Select value={leaveForm.type} onChange={(e) => setLeaveForm((prev) => ({ ...prev, type: e.target.value }))}>
                        <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                        <MenuItem value="Vacation Leave">Vacation Leave</MenuItem>
                        <MenuItem value="Emergency Leave">Emergency Leave</MenuItem>
                        <MenuItem value="Unpaid Leave">Unpaid Leave</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField label="Start Date" type="date" value={leaveForm.startDate} onChange={(e) => setLeaveForm((prev) => ({ ...prev, startDate: e.target.value }))} size="small" slotProps={{ inputLabel: { shrink: true } }} fullWidth />
                    <TextField label="End Date" type="date" value={leaveForm.endDate} onChange={(e) => setLeaveForm((prev) => ({ ...prev, endDate: e.target.value }))} size="small" slotProps={{ inputLabel: { shrink: true } }} fullWidth />

                    <TextField label="Reason for Leave" value={leaveForm.reason} onChange={(e) => setLeaveForm((prev) => ({ ...prev, reason: e.target.value }))} size="small" multiline minRows={3} fullWidth sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }} />

                    <Box sx={{ ...softPanelSx, gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
                      <Typography sx={{ color: ui.black, fontWeight: 800, fontSize: 13, mb: 0.25 }}>
                        Leave Credit Preview
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Typography sx={{ color: ui.muted, fontSize: 12 }}>Requested days: {leaveDaysPreview || 0}</Typography>
                        <Typography sx={{ color: ui.muted, fontSize: 12 }}>
                          Available {leaveForm.type}: {leaveCreditField ? leaveAvailableDays : 'N/A (Unpaid Leave)'}
                        </Typography>
                        <Typography sx={{ color: leaveCreditField && leaveDaysPreview > leaveAvailableDays ? ui.black : ui.muted, fontSize: 12, fontWeight: 700 }}>
                          {leaveCreditField
                            ? `Remaining if approved: ${leaveRemainingIfApproved}`
                            : 'No credit deduction for unpaid leave.'}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ ...softPanelSx, gridColumn: { xs: '1 / -1', md: 'span 1' }, bgcolor: ui.white }}>
                      <Typography sx={{ color: ui.black, fontWeight: 800, fontSize: 13, mb: 0.25 }}>Process Flow</Typography>
                      <Typography sx={{ color: ui.muted, fontSize: 12 }}>
                        Employee filing to manager review to HR final review to auto leave credit deduction
                      </Typography>
                    </Box>

                    <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                      <Button type="submit" sx={{ ...primaryButtonSx, px: 2.5 }}>
                        Submit Leave Request
                      </Button>
                    </Box>
                  </Box>
                </Paper>

                <Stack spacing={2.25}>
                  <Paper sx={{ ...cardStyle, ...formCardPaddingSx }}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Real-Time Leave Credit Balances</Typography>
                    <Divider sx={sectionDividerSx} />
                    <TableContainer sx={tableContainerSx}>
                      <Table size="small" sx={{ minWidth: 760 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={tableHeadCellSx}>Employee</TableCell>
                            <TableCell sx={tableHeadCellSx}>Position</TableCell>
                            <TableCell sx={tableHeadCellSx}>Sick Leave</TableCell>
                            <TableCell sx={tableHeadCellSx}>Vacation Leave</TableCell>
                            <TableCell sx={tableHeadCellSx}>Emergency Leave</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {employeeRecords.map((row) => {
                            const credits = leaveCredits[row.id] || defaultLeaveCredits;
                            return (
                              <TableRow key={row.id} hover>
                                <TableCell sx={{ color: ui.black, fontWeight: 700 }}>{row.employeeName}</TableCell>
                                <TableCell sx={{ color: ui.black }}>{row.position}</TableCell>
                                <TableCell sx={{ color: ui.black }}>{credits.sick}</TableCell>
                                <TableCell sx={{ color: ui.black }}>{credits.vacation}</TableCell>
                                <TableCell sx={{ color: ui.black }}>{credits.emergency}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>

                  <Paper sx={{ ...cardStyle, ...formCardPaddingSx }}>
                  <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Leave Approval Workflow Log</Typography>
                  <Divider sx={sectionDividerSx} />
                  <TableContainer sx={tableContainerSx}>
                  <Table size="small" sx={{ minWidth: 1180 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableHeadCellSx}>ID</TableCell>
                        <TableCell sx={tableHeadCellSx}>Employee</TableCell>
                        <TableCell sx={tableHeadCellSx}>Type</TableCell>
                        <TableCell sx={tableHeadCellSx}>Dates</TableCell>
                        <TableCell sx={tableHeadCellSx}>Days</TableCell>
                        <TableCell sx={tableHeadCellSx}>Reason</TableCell>
                        <TableCell sx={tableHeadCellSx}>Manager</TableCell>
                        <TableCell sx={tableHeadCellSx}>HR</TableCell>
                        <TableCell sx={tableHeadCellSx}>Credits Charged</TableCell>
                        <TableCell sx={tableHeadCellSx}>Balance After</TableCell>
                        <TableCell sx={tableHeadCellSx}>Status</TableCell>
                        <TableCell sx={tableHeadCellSx}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={12} sx={{ color: ui.black }}>No leave applications filed yet.</TableCell>
                        </TableRow>
                      ) : leaveRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell sx={{ color: ui.black }}>{row.id}</TableCell>
                          <TableCell sx={{ color: ui.black }}>
                            <Typography sx={{ fontWeight: 700 }}>{row.employeeName}</Typography>
                            <Typography variant="caption" sx={{ color: ui.muted }}>{row.position}</Typography>
                          </TableCell>
                          <TableCell sx={{ color: ui.black }}>{row.type}</TableCell>
                          <TableCell sx={{ color: ui.black }}>{row.startDate} to {row.endDate}</TableCell>
                          <TableCell sx={{ color: ui.black }}>{row.requestedDays}</TableCell>
                          <TableCell sx={{ color: ui.black }}>{row.reason}</TableCell>
                          <TableCell>
                            <Chip size="small" label={row.managerDecision} sx={{ color: row.managerDecision === 'Pending' ? ui.black : ui.white, bgcolor: row.managerDecision === 'Approved' ? ui.green : row.managerDecision === 'Rejected' ? ui.black : ui.greenSoft, fontWeight: 700, minWidth: 96 }} />
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={row.hrDecision} sx={{ color: row.hrDecision === 'Pending' ? ui.black : ui.white, bgcolor: row.hrDecision === 'Approved' ? ui.green : row.hrDecision === 'Rejected' ? ui.black : row.hrDecision === 'Not Required' ? ui.white : ui.greenSoft, fontWeight: 700, minWidth: 96 }} />
                          </TableCell>
                          <TableCell sx={{ color: ui.black }}>{row.creditsCharged}</TableCell>
                          <TableCell sx={{ color: ui.black }}>{row.creditBalanceAfterApproval}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={row.status}
                              sx={{
                                color: row.status.includes('Pending') ? ui.black : ui.white,
                                bgcolor:
                                  row.status === 'Approved'
                                    ? ui.green
                                    : row.status.includes('Pending')
                                      ? ui.greenSoft
                                      : ui.black,
                                fontWeight: 700,
                                minWidth: 170,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {row.status === 'Pending Manager Approval' ? (
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75}>
                                <Button size="small" sx={{ ...primaryButtonSx, ...compactActionButtonSx }} onClick={() => handleLeaveDecision(row.id, 'manager', 'Approved')}>Manager Approve</Button>
                                <Button size="small" sx={{ ...darkButtonSx, ...compactActionButtonSx }} onClick={() => handleLeaveDecision(row.id, 'manager', 'Rejected')}>Manager Reject</Button>
                              </Stack>
                            ) : row.status === 'Pending HR Approval' ? (
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75}>
                                <Button size="small" sx={{ ...primaryButtonSx, ...compactActionButtonSx }} onClick={() => handleLeaveDecision(row.id, 'hr', 'Approved')}>HR Approve</Button>
                                <Button size="small" sx={{ ...darkButtonSx, ...compactActionButtonSx }} onClick={() => handleLeaveDecision(row.id, 'hr', 'Rejected')}>HR Reject</Button>
                              </Stack>
                            ) : (
                              <Typography variant="caption" sx={{ color: ui.muted }}>
                                Finalized
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </TableContainer>
                </Paper>
                </Stack>
                </Box>
              </Stack>
            ) : null}

            {activeModule === 'payroll' ? (
              <Stack spacing={2.25}>
                <Paper
                  sx={{
                    ...cardStyle,
                    ...formCardPaddingSx,
                    ...highlightedSectionSx,
                  }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, mb: 1.5 }}>
                    <Box>
                      <Typography sx={{ color: ui.greenDark, fontWeight: 900, fontSize: 22 }}>Role Salary Matrix</Typography>
                      <Typography sx={{ color: ui.muted, fontSize: 13 }}>Primary salary reference used for payroll auto-computation by employee position.</Typography>
                    </Box>
                    <Chip label="Payroll Base Source" sx={{ bgcolor: ui.green, color: ui.white, fontWeight: 800 }} />
                  </Stack>
                  <Divider sx={sectionDividerSx} />
                  <TableContainer sx={tableContainerSx}>
                    <Table size="small" sx={{ minWidth: 640 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={tableHeadCellSx}>Role</TableCell>
                          <TableCell sx={tableHeadCellSx}>Daily Rate</TableCell>
                          <TableCell sx={tableHeadCellSx}>Monthly Estimate</TableCell>
                          <TableCell sx={tableHeadCellSx}>Allowance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(roleSalaryCatalog).map(([role, rate]) => (
                          <TableRow key={role} hover>
                            <TableCell sx={{ color: ui.black, fontWeight: 700 }}>{role}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(rate.dailyRate)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(rate.monthlyEstimate)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(rate.allowance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.2fr) minmax(0, 1.8fr)' }, gap: 2.25 }}>
                <Paper sx={{ ...cardStyle, ...formCardPaddingSx }} component="form" onSubmit={handlePayrollCalculate}>
                  <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Generate Payroll & Payslip</Typography>
                  <Divider sx={sectionDividerSx} />

                  <Box sx={{ ...formGridSpacingSx, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
                    <FormControl size="small" fullWidth sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                      <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Employee Name</FormLabel>
                      <Select value={payrollForm.employeeId} onChange={(e) => setPayrollForm((prev) => ({ ...prev, employeeId: e.target.value }))}>
                        <MenuItem value="">-- Choose employee --</MenuItem>
                        {employeeRecords.map((item) => (
                          <MenuItem key={item.id} value={String(item.id)}>{item.employeeName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField label="Cut-off Start Date" type="date" value={payrollForm.startDate} onChange={(e) => setPayrollForm((prev) => ({ ...prev, startDate: e.target.value }))} size="small" slotProps={{ inputLabel: { shrink: true } }} fullWidth />
                    <TextField label="Cut-off End Date" type="date" value={payrollForm.endDate} onChange={(e) => setPayrollForm((prev) => ({ ...prev, endDate: e.target.value }))} size="small" slotProps={{ inputLabel: { shrink: true } }} fullWidth />

                    <TextField label="Loan Deduction (P)" type="number" value={payrollForm.loanDeduction} onChange={(e) => setPayrollForm((prev) => ({ ...prev, loanDeduction: e.target.value }))} size="small" fullWidth slotProps={{ htmlInput: { min: 0 } }} />
                    <TextField label="Other Deductions (P)" type="number" value={payrollForm.otherDeductions} onChange={(e) => setPayrollForm((prev) => ({ ...prev, otherDeductions: e.target.value }))} size="small" fullWidth slotProps={{ htmlInput: { min: 0 } }} />

                    <TextField label="Bonus (P)" type="number" value={payrollForm.bonus} onChange={(e) => setPayrollForm((prev) => ({ ...prev, bonus: e.target.value }))} size="small" slotProps={{ htmlInput: { min: 0 } }} fullWidth sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }} />
                  </Box>

                  <Box sx={{ ...formGridSpacingSx, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, mt: 1.75 }}>
                    <Box sx={softPanelSx}>
                      <Typography sx={{ color: ui.black, fontWeight: 800, fontSize: 13, mb: 0.25 }}>Auto Salary by Employee Role</Typography>
                      <Typography sx={{ color: ui.muted, fontSize: 12 }}>
                        Employee: {payrollSelectedEmployee ? `${payrollSelectedEmployee.employeeName} (${payrollSelectedEmployee.position})` : 'No employee selected'}
                      </Typography>
                      <Typography sx={{ color: ui.muted, fontSize: 12 }}>Daily Rate: {money(payrollDailyRatePreview)}</Typography>
                      <Typography sx={{ color: ui.muted, fontSize: 12 }}>Monthly Estimate: {money(payrollMonthlyRatePreview)}</Typography>
                      <Typography sx={{ color: ui.muted, fontSize: 12 }}>Role Allowance: {money(payrollAllowancePreview)}</Typography>
                    </Box>

                    <Box sx={softPanelSx}>
                      <Typography sx={{ color: ui.black, fontWeight: 800, fontSize: 13, mb: 0.25 }}>Salary Preview</Typography>
                      {payrollValidationPreviewError ? (
                        <Typography sx={{ color: ui.black, fontSize: 12, fontWeight: 700 }}>{payrollValidationPreviewError}</Typography>
                      ) : payrollPreview ? (
                        <>
                          <Typography sx={{ color: ui.muted, fontSize: 12 }}>Basic Pay: {money(payrollPreview.basicPay)}</Typography>
                          <Typography sx={{ color: ui.muted, fontSize: 12 }}>Overtime Pay: {money(payrollPreview.overtimePay)}</Typography>
                          <Typography sx={{ color: ui.muted, fontSize: 12 }}>Allowance: {money(payrollPreview.roleAllowance)}</Typography>
                          <Typography sx={{ color: ui.muted, fontSize: 12 }}>Gross Pay: {money(payrollPreview.grossPay)}</Typography>
                          <Typography sx={{ color: ui.muted, fontSize: 12 }}>Deductions: {money(payrollPreview.totalDeductions)}</Typography>
                          <Typography sx={{ color: ui.black, fontWeight: 900, fontSize: 14 }}>
                            Final Salary: {money(payrollPreview.netSalary)}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ color: ui.muted, fontSize: 12 }}>Select employee and period to preview final salary.</Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ ...softPanelSx, mt: 1.75 }}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, fontSize: 13, mb: 0.25 }}>Computation Source</Typography>
                    <Typography sx={{ color: ui.muted, fontSize: 12 }}>
                      Basic pay is based on attendance days plus approved paid leave days. Overtime pay is pulled from attendance overtime minutes.
                    </Typography>
                    <Typography sx={{ color: ui.muted, fontSize: 12 }}>
                      Statutory deductions are auto-computed: Tax, SSS, PhilHealth, Pag-IBIG. Loans and other deductions are applied from this form.
                    </Typography>
                  </Box>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ mt: 1.75 }}>
                    {editingPayrollId ? (
                      <Button
                        type="button"
                        sx={{ ...darkButtonSx, ...compactActionButtonSx }}
                        onClick={() => {
                          setEditingPayrollId(null);
                          setPayrollForm({
                            employeeId: '',
                            startDate: '2026-07-01',
                            endDate: '2026-07-31',
                            loanDeduction: '0',
                            otherDeductions: '0',
                            bonus: '0',
                          });
                        }}
                      >
                        Cancel Edit
                      </Button>
                    ) : null}
                    <Button type="submit" sx={primaryButtonSx}>
                      {editingPayrollId ? 'Recompute & Save Payslip' : 'Generate Payslip'}
                    </Button>
                  </Stack>
                </Paper>

                <Paper sx={{ ...cardStyle, ...formCardPaddingSx }}>
                  <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Payroll Distribution History</Typography>
                  <Divider sx={sectionDividerSx} />
                  <TextField
                    value={payrollHistorySearch}
                    onChange={(event) => setPayrollHistorySearch(event.target.value)}
                    placeholder="Search payslip, employee, period, status"
                    size="small"
                    sx={{ mb: 1.5, width: { xs: '100%', md: 360 } }}
                  />
                  <TableContainer sx={tableContainerSx}>
                  <Table size="small" sx={{ minWidth: 1600 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableHeadCellSx}>Payslip</TableCell>
                        <TableCell sx={tableHeadCellSx}>Generated</TableCell>
                        <TableCell sx={tableHeadCellSx}>Employee</TableCell>
                        <TableCell sx={tableHeadCellSx}>Rate Used</TableCell>
                        <TableCell sx={tableHeadCellSx}>Allowance</TableCell>
                        <TableCell sx={tableHeadCellSx}>Period</TableCell>
                        <TableCell sx={tableHeadCellSx}>Attendance</TableCell>
                        <TableCell sx={tableHeadCellSx}>Paid Leave</TableCell>
                        <TableCell sx={tableHeadCellSx}>Unpaid Leave</TableCell>
                        <TableCell sx={tableHeadCellSx}>Payable Days</TableCell>
                        <TableCell sx={tableHeadCellSx}>Basic Pay</TableCell>
                        <TableCell sx={tableHeadCellSx}>Overtime Pay</TableCell>
                        <TableCell sx={tableHeadCellSx}>Bonus</TableCell>
                        <TableCell sx={tableHeadCellSx}>Gross Pay</TableCell>
                        <TableCell sx={tableHeadCellSx}>Tax</TableCell>
                        <TableCell sx={tableHeadCellSx}>SSS</TableCell>
                        <TableCell sx={tableHeadCellSx}>PhilHealth</TableCell>
                        <TableCell sx={tableHeadCellSx}>Pag-IBIG</TableCell>
                        <TableCell sx={tableHeadCellSx}>Loans</TableCell>
                        <TableCell sx={tableHeadCellSx}>Other Ded.</TableCell>
                        <TableCell sx={tableHeadCellSx}>Total Ded.</TableCell>
                        <TableCell sx={tableHeadCellSx}>Net Salary</TableCell>
                        <TableCell sx={tableHeadCellSx}>Status</TableCell>
                        <TableCell sx={tableHeadCellSx}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPayrollRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={24} sx={{ color: ui.black }}>No payroll records found for your filter.</TableCell>
                        </TableRow>
                      ) : (
                        filteredPayrollRows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell sx={{ color: ui.black, fontWeight: 700 }}>{row.payslipNo}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{new Date(row.generatedAt).toLocaleString('en-US')}</TableCell>
                            <TableCell sx={{ color: ui.black }}>
                              <Typography sx={{ fontWeight: 700 }}>{row.employeeName}</Typography>
                              <Typography variant="caption" sx={{ color: ui.muted }}>{row.position}</Typography>
                            </TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.dailyRateUsed)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.roleAllowance)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.period}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.attendanceDays}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.paidLeaveDays}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.unpaidLeaveDays}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{row.payableDays}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.basicPay)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.overtimePay)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.bonus)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.grossPay)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.tax)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.sss)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.philHealth)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.pagIbig)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.loans)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.otherDeductions)}</TableCell>
                            <TableCell sx={{ color: ui.black }}>{money(row.totalDeductions)}</TableCell>
                            <TableCell sx={{ color: ui.black, fontWeight: 900 }}>{money(row.netSalary)}</TableCell>
                            <TableCell>
                              <Chip
                                label={row.status}
                                size="small"
                                sx={{
                                  bgcolor: row.status === 'Confirmed' ? ui.green : row.status === 'Edited' ? ui.black : ui.greenSoft,
                                  color: row.status === 'Generated' ? ui.greenDark : ui.white,
                                  fontWeight: 700,
                                  minWidth: 92,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75}>
                                <Button size="small" sx={{ ...primaryButtonSx, ...compactActionButtonSx }} onClick={() => handleConfirmPayroll(row.id)}>Confirm</Button>
                                <Button size="small" sx={{ ...darkButtonSx, ...compactActionButtonSx }} onClick={() => handleEditPayroll(row.id)}>Edit</Button>
                                <Button size="small" sx={{ ...darkButtonSx, ...compactActionButtonSx }} onClick={() => handleDeletePayroll(row.id)}>Delete</Button>
                                <Button size="small" sx={{ ...primaryButtonSx, ...compactActionButtonSx }} onClick={() => handleDownloadPayslip(row)}>Download</Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  </TableContainer>
                </Paper>
                </Box>
              </Stack>
            ) : null}

            {activeModule === 'performance' ? (
              <Stack spacing={2.25}>
                <Paper sx={{ ...cardStyle, ...formCardPaddingSx, ...highlightedSectionSx }}>
                  <Typography sx={{ color: ui.greenDark, fontWeight: 900, fontSize: 22 }}>Performance Appraisal Workflow</Typography>
                  <Typography sx={{ color: ui.muted, fontSize: 13, mt: 0.5 }}>
                    Process order: KPI/Goal Setting to Self-Evaluation to Manager Evaluation to Final Rating Sync to HR Records
                  </Typography>
                  <Divider sx={sectionDividerSx} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, minmax(0, 1fr))' }, gap: 1.25 }}>
                    {[
                      { label: 'Goals Set', value: performanceGoalSetupCount },
                      { label: 'Self-Evaluation', value: performanceSelfEvalCount },
                      { label: 'Manager Review', value: performanceManagerEvalCount },
                      { label: 'Finalized', value: performanceFinalizedCount },
                    ].map((item) => (
                      <Paper key={item.label} sx={{ border: `1px solid ${ui.border}`, borderRadius: 2, p: 1.5, bgcolor: ui.white }}>
                        <Typography sx={{ color: ui.muted, fontSize: 12 }}>{item.label}</Typography>
                        <Typography sx={{ color: ui.black, fontWeight: 900, fontSize: 24, mt: 0.25 }}>{item.value}</Typography>
                      </Paper>
                    ))}
                  </Box>
                </Paper>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) minmax(0, 2fr)' }, gap: 2.25 }}>
                  <Stack spacing={2.25}>
                    <Paper sx={{ ...cardStyle, ...formCardPaddingSx }} component="form" onSubmit={handleSetPerformanceGoals}>
                      <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Step 1: Set KPI/Goals</Typography>
                      <Divider sx={sectionDividerSx} />
                      <Stack spacing={1.5}>
                        <FormControl size="small" fullWidth>
                          <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Employee</FormLabel>
                          <Select
                            value={performanceSetupForm.employeeId}
                            onChange={(e) => setPerformanceSetupForm((prev) => ({ ...prev, employeeId: e.target.value }))}
                          >
                            <MenuItem value="">-- Choose employee --</MenuItem>
                            {employeeRecords.map((item) => (
                              <MenuItem key={item.id} value={String(item.id)}>
                                {item.employeeName} ({item.position})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <TextField
                          label="Appraisal Period"
                          value={performanceSetupForm.period}
                          onChange={(e) => setPerformanceSetupForm((prev) => ({ ...prev, period: e.target.value }))}
                          size="small"
                        />
                        <TextField
                          label="KPIs / Goals"
                          value={performanceSetupForm.kpiGoals}
                          onChange={(e) => setPerformanceSetupForm((prev) => ({ ...prev, kpiGoals: e.target.value }))}
                          size="small"
                          multiline
                          minRows={3}
                          placeholder="Example: Attendance 98%+, customer feedback 4.5+, safety incidents 0"
                        />
                        <Button type="submit" sx={primaryButtonSx}>Save Goals</Button>
                      </Stack>
                    </Paper>

                    <Paper sx={{ ...cardStyle, ...formCardPaddingSx }} component="form" onSubmit={handleSubmitSelfEvaluation}>
                      <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Step 2: Self-Evaluation</Typography>
                      <Divider sx={sectionDividerSx} />
                      <Stack spacing={1.5}>
                        <FormControl size="small" fullWidth>
                          <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Appraisal with Goals Set</FormLabel>
                          <Select
                            value={selfEvaluationForm.appraisalId}
                            onChange={(e) => setSelfEvaluationForm((prev) => ({ ...prev, appraisalId: e.target.value }))}
                          >
                            <MenuItem value="">-- Choose appraisal --</MenuItem>
                            {performanceSelfQueue.map((row) => (
                              <MenuItem key={row.id} value={String(row.id)}>
                                {row.employeeName} - {row.period}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <TextField
                          label="Self Rating (1-5)"
                          type="number"
                          value={selfEvaluationForm.selfRating}
                          onChange={(e) => setSelfEvaluationForm((prev) => ({ ...prev, selfRating: e.target.value }))}
                          size="small"
                          slotProps={{ htmlInput: { min: 1, max: 5, step: 0.1 } }}
                        />
                        <TextField
                          label="Self Evaluation"
                          value={selfEvaluationForm.selfEvaluation}
                          onChange={(e) => setSelfEvaluationForm((prev) => ({ ...prev, selfEvaluation: e.target.value }))}
                          size="small"
                          multiline
                          minRows={3}
                        />
                        <Button type="submit" sx={primaryButtonSx}>Submit Self-Evaluation</Button>
                      </Stack>
                    </Paper>

                    <Paper sx={{ ...cardStyle, ...formCardPaddingSx }} component="form" onSubmit={handleSubmitManagerEvaluation}>
                      <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Step 3: Manager Evaluation</Typography>
                      <Divider sx={sectionDividerSx} />
                      <Stack spacing={1.5}>
                        <FormControl size="small" fullWidth>
                          <FormLabel sx={{ color: ui.muted, mb: 0.75 }}>Appraisal with Self-Evaluation Done</FormLabel>
                          <Select
                            value={managerEvaluationForm.appraisalId}
                            onChange={(e) => setManagerEvaluationForm((prev) => ({ ...prev, appraisalId: e.target.value }))}
                          >
                            <MenuItem value="">-- Choose appraisal --</MenuItem>
                            {performanceManagerQueue.map((row) => (
                              <MenuItem key={row.id} value={String(row.id)}>
                                {row.employeeName} - {row.period}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <TextField
                          label="Manager Rating (1-5)"
                          type="number"
                          value={managerEvaluationForm.managerRating}
                          onChange={(e) => setManagerEvaluationForm((prev) => ({ ...prev, managerRating: e.target.value }))}
                          size="small"
                          slotProps={{ htmlInput: { min: 1, max: 5, step: 0.1 } }}
                        />
                        <TextField
                          label="Manager Evaluation"
                          value={managerEvaluationForm.managerEvaluation}
                          onChange={(e) => setManagerEvaluationForm((prev) => ({ ...prev, managerEvaluation: e.target.value }))}
                          size="small"
                          multiline
                          minRows={3}
                        />
                        <Button type="submit" sx={darkButtonSx}>Submit Manager Evaluation</Button>
                      </Stack>
                    </Paper>
                  </Stack>

                  <Paper sx={{ ...cardStyle, ...formCardPaddingSx }}>
                    <Typography sx={{ color: ui.black, fontWeight: 800, mb: 1.5 }}>Appraisal Tracker & Final Rating Sync</Typography>
                    <Divider sx={sectionDividerSx} />
                    <TableContainer sx={tableContainerSx}>
                      <Table size="small" sx={{ minWidth: 1400 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={tableHeadCellSx}>Employee</TableCell>
                            <TableCell sx={tableHeadCellSx}>Period</TableCell>
                            <TableCell sx={tableHeadCellSx}>KPI/Goals</TableCell>
                            <TableCell sx={tableHeadCellSx}>Self Evaluation</TableCell>
                            <TableCell sx={tableHeadCellSx}>Manager Evaluation</TableCell>
                            <TableCell sx={tableHeadCellSx}>Final Rating</TableCell>
                            <TableCell sx={tableHeadCellSx}>Status</TableCell>
                            <TableCell sx={tableHeadCellSx}>HR Link</TableCell>
                            <TableCell sx={tableHeadCellSx}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {performanceRows.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={9} sx={{ color: ui.black }}>
                                No appraisals yet. Start by setting KPI/Goals.
                              </TableCell>
                            </TableRow>
                          ) : (
                            performanceRows.map((row) => (
                              <TableRow key={row.id} hover>
                                <TableCell sx={{ color: ui.black }}>
                                  <Typography sx={{ fontWeight: 700 }}>{row.employeeName}</Typography>
                                  <Typography variant="caption" sx={{ color: ui.muted }}>{row.position}</Typography>
                                </TableCell>
                                <TableCell sx={{ color: ui.black }}>{row.period}</TableCell>
                                <TableCell sx={{ color: ui.black }}>{row.kpiGoals}</TableCell>
                                <TableCell sx={{ color: ui.black }}>
                                  <Typography sx={{ fontWeight: 700 }}>{row.selfRating !== null ? `${row.selfRating}/5` : '-'}</Typography>
                                  <Typography variant="caption" sx={{ color: ui.muted }}>{row.selfEvaluation || 'Pending self-evaluation'}</Typography>
                                </TableCell>
                                <TableCell sx={{ color: ui.black }}>
                                  <Typography sx={{ fontWeight: 700 }}>{row.managerRating !== null ? `${row.managerRating}/5` : '-'}</Typography>
                                  <Typography variant="caption" sx={{ color: ui.muted }}>{row.managerEvaluation || 'Pending manager evaluation'}</Typography>
                                </TableCell>
                                <TableCell sx={{ color: ui.black, fontWeight: 900 }}>
                                  {row.finalRating !== null ? `${row.finalRating}/5` : '-'}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    label={row.status}
                                    sx={{
                                      color: row.status === 'Finalized' ? ui.white : ui.black,
                                      bgcolor: row.status === 'Finalized' ? ui.green : ui.greenSoft,
                                      fontWeight: 700,
                                      minWidth: 160,
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ color: ui.black }}>
                                  {row.linkedToRecord ? 'Synced to employee HR record' : 'Pending sync'}
                                </TableCell>
                                <TableCell>
                                  {row.status === 'Manager Evaluation Submitted' ? (
                                    <Button size="small" sx={{ ...primaryButtonSx, ...compactActionButtonSx }} onClick={() => handleFinalizePerformance(row.id)}>
                                      Finalize & Sync
                                    </Button>
                                  ) : row.status === 'Finalized' ? (
                                    <Typography variant="caption" sx={{ color: ui.muted }}>Finalized</Typography>
                                  ) : (
                                    <Typography variant="caption" sx={{ color: ui.muted }}>Continue workflow</Typography>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>
              </Stack>
            ) : null}
          </Box>
        </Box>

        <Snackbar open={snack.open} autoHideDuration={2200} onClose={() => setSnack({ open: false, message: '' })}>
          <Alert severity="success" sx={{ width: '100%' }}>{snack.message}</Alert>
        </Snackbar>
      </Box>
    </AppTheme>
  );
}