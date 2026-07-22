'use client';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EventSeatRoundedIcon from '@mui/icons-material/EventSeatRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

interface AdminMenuContentProps {
  selectedSection: string;
  onSelectSection: (section: string) => void;
}

type MenuItemConfig = {
  text: string;
  icon: JSX.Element;
};

const mainListItems: MenuItemConfig[] = [
  { text: 'Home', icon: <HomeRoundedIcon /> },
  { text: 'Reservation', icon: <EventSeatRoundedIcon /> },
  { text: 'History', icon: <HistoryRoundedIcon /> },
  { text: 'Payment', icon: <PaymentsRoundedIcon /> },
];

const managementListItems: MenuItemConfig[] = [
  { text: 'User Management', icon: <PeopleAltRoundedIcon /> },
  { text: 'Staff Management', icon: <BadgeRoundedIcon /> },
  { text: 'Roles & Permissions', icon: <VerifiedUserRoundedIcon /> },
];

const secondaryListItems: MenuItemConfig[] = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

function SectionList({
  items,
  selectedSection,
  onSelectSection,
}: {
  items: MenuItemConfig[];
  selectedSection: string;
  onSelectSection: (section: string) => void;
}) {
  return (
    <List dense sx={{ px: 0.5, py: 0.25 }}>
      {items.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.25 }}>
          <ListItemButton
            selected={selectedSection === item.text}
            onClick={() => onSelectSection(item.text)}
            sx={{
              borderRadius: 2,
              minHeight: 42,
              px: 1.25,
              gap: 0.75,
            }}
          >
            <ListItemIcon sx={{ minWidth: 34 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default function AdminMenuContent({ selectedSection, onSelectSection }: AdminMenuContentProps) {
  return (
    <Stack sx={{ flexGrow: 1, p: 1.25, justifyContent: 'space-between' }}>
      <Stack spacing={1.25}>
        <SectionList
          items={mainListItems}
          selectedSection={selectedSection}
          onSelectSection={onSelectSection}
        />
        <SectionList
          items={managementListItems}
          selectedSection={selectedSection}
          onSelectSection={onSelectSection}
        />
      </Stack>
      <SectionList
        items={secondaryListItems}
        selectedSection={selectedSection}
        onSelectSection={onSelectSection}
      />
    </Stack>
  );
}
