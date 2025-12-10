// Google Sheets Integration for MDRRMO Pio Duran
// Using the google-sheet connector blueprint

import { google } from 'googleapis';
import type { InventoryItem, CalendarEvent, CalendarTask, Contact } from '@shared/schema';

const DEMO_MODE = process.env.DEMO_MODE === 'true' || process.env.NODE_ENV === 'development';
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '11uutE9iZ2BjddbFkeX9cQVFOouphdvyP000vh1lGOo4';

let connectionSettings: any = null;
let lastFetchTime = 0;
const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  
  if (connectionSettings && 
      connectionSettings.settings?.expires_at && 
      new Date(connectionSettings.settings.expires_at).getTime() > now + 60000) {
    return connectionSettings.settings.access_token;
  }

  if (now - lastFetchTime < 5000) {
    throw new Error('Token fetch rate limited');
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken || !hostname) {
    throw new Error('Replit connector environment not available');
  }

  lastFetchTime = now;
  
  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Connector fetch failed: ${response.status}`);
  }
  
  const data = await response.json();
  connectionSettings = data.items?.[0];

  const accessToken = connectionSettings?.settings?.access_token || 
                      connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet connector not configured. Please connect your Google Sheet in the integrations panel.');
  }
  
  return accessToken;
}

async function getGoogleSheetsClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

const sampleInventoryItems: InventoryItem[] = [
  { id: 'inv-1', itemName: 'Life Vests', itemDescription: 'Adult size orange life vests for water rescue', itemCategory: 'Rescue Equipment', itemLocation: 'MDRRMO Storage Room A', currentStock: 150, itemUnit: 'pcs', itemStatus: 'In Stock' },
  { id: 'inv-2', itemName: 'First Aid Kits', itemDescription: 'Complete emergency first aid kit with medications', itemCategory: 'Medical Supplies', itemLocation: 'MDRRMO Medical Storage', currentStock: 45, itemUnit: 'kits', itemStatus: 'In Stock' },
  { id: 'inv-3', itemName: 'Emergency Blankets', itemDescription: 'Thermal emergency blankets for evacuees', itemCategory: 'Relief Goods', itemLocation: 'Warehouse B', currentStock: 12, itemUnit: 'pcs', itemStatus: 'Low Stock' },
  { id: 'inv-4', itemName: 'Flashlights', itemDescription: 'Heavy duty LED flashlights with batteries', itemCategory: 'Equipment', itemLocation: 'MDRRMO Storage Room A', currentStock: 0, itemUnit: 'pcs', itemStatus: 'Out of Stock' },
  { id: 'inv-5', itemName: 'Rope (50m)', itemDescription: 'Heavy duty rescue rope for operations', itemCategory: 'Rescue Equipment', itemLocation: 'Vehicle Storage', currentStock: 25, itemUnit: 'rolls', itemStatus: 'In Stock' },
  { id: 'inv-6', itemName: 'Rice Sacks (25kg)', itemDescription: 'NFA rice for relief distribution', itemCategory: 'Relief Goods', itemLocation: 'Warehouse A', currentStock: 200, itemUnit: 'sacks', itemStatus: 'In Stock' },
  { id: 'inv-7', itemName: 'Water Containers', itemDescription: '20L water containers for distribution', itemCategory: 'Relief Goods', itemLocation: 'Warehouse B', currentStock: 8, itemUnit: 'pcs', itemStatus: 'Low Stock' },
  { id: 'inv-8', itemName: 'Megaphones', itemDescription: 'Battery-powered megaphones for announcements', itemCategory: 'Communication', itemLocation: 'MDRRMO Office', currentStock: 10, itemUnit: 'pcs', itemStatus: 'In Stock' },
];

const sampleCalendarEvents: CalendarEvent[] = [
  { id: 'evt-1', eventName: 'Monthly MDRRMC Meeting', date: '2024-12-15', time: '09:00 AM', location: 'Municipal Hall Conference Room', notes: 'Regular monthly coordination meeting with all DRRM stakeholders', priority: 'High' },
  { id: 'evt-2', eventName: 'Barangay Evacuation Drill - Caguscos', date: '2024-12-18', time: '08:00 AM', location: 'Barangay Caguscos', notes: 'Flood evacuation drill for high-risk areas', priority: 'High' },
  { id: 'evt-3', eventName: 'First Aid Training', date: '2024-12-20', time: '01:00 PM', location: 'MDRRMO Training Center', notes: 'Basic first aid and CPR training for BDRRMC volunteers', priority: 'Medium' },
  { id: 'evt-4', eventName: 'Equipment Maintenance Check', date: '2024-12-22', time: '10:00 AM', location: 'MDRRMO Storage Facility', notes: 'Quarterly inspection of all rescue equipment', priority: 'Low' },
];

const sampleCalendarTasks: CalendarTask[] = [
  { id: 'task-1', taskName: 'Submit Monthly Situational Report', dateTime: '2024-12-10', deadlineDateTime: '2024-12-15', description: 'Compile and submit monthly report to PDRRMO', status: 'Upcoming' },
  { id: 'task-2', taskName: 'Update Hazard Maps', dateTime: '2024-12-05', deadlineDateTime: '2024-12-08', description: 'Review and update barangay hazard maps', status: 'Overdue' },
  { id: 'task-3', taskName: 'Inventory Restock Order', dateTime: '2024-12-12', deadlineDateTime: '2024-12-20', description: 'Order replacement for low stock items', status: 'Upcoming' },
  { id: 'task-4', taskName: 'Complete ICS Training Documentation', dateTime: '2024-11-28', deadlineDateTime: '2024-12-01', description: 'Finalize training certificates', status: 'Complete' },
];

const sampleContacts: Contact[] = [
  { id: 'contact-1', name: 'Hon. Mayor Juan Dela Cruz', agency: 'LGU Pio Duran', designation: 'Municipal Mayor', phoneNumber: '09171234567', email: 'mayor@pioduran.gov.ph', address: 'Municipal Hall, Pio Duran, Albay' },
  { id: 'contact-2', name: 'Engr. Maria Santos', agency: 'MDRRMO', designation: 'MDRRMO Chief', phoneNumber: '09181234567', email: 'mdrrmo@pioduran.gov.ph', address: 'MDRRMO Office, Pio Duran' },
  { id: 'contact-3', name: 'Dr. Roberto Reyes', agency: 'Rural Health Unit', designation: 'Municipal Health Officer', phoneNumber: '09191234567', email: 'mho@pioduran.gov.ph', address: 'RHU Pio Duran' },
  { id: 'contact-4', name: 'PSI Antonio Cruz', agency: 'PNP Pio Duran', designation: 'Chief of Police', phoneNumber: '09201234567', email: 'pnp.pioduran@pnp.gov.ph', address: 'PNP Station, Pio Duran' },
  { id: 'contact-5', name: 'SFO2 Pedro Bautista', agency: 'BFP Pio Duran', designation: 'Fire Marshal', phoneNumber: '09211234567', email: 'bfp.pioduran@bfp.gov.ph', address: 'Fire Station, Pio Duran' },
  { id: 'contact-6', name: 'Engr. Sofia Garcia', agency: 'PDRRMO Albay', designation: 'Provincial DRRM Officer', phoneNumber: '09221234567', email: 'pdrrmo@albay.gov.ph', address: 'Provincial Capitol, Legazpi City' },
  { id: 'contact-7', name: 'Cpt. Miguel Torres', agency: 'Philippine Army', designation: '9IB Disaster Response Unit', phoneNumber: '09231234567', email: 'army.9ib@army.mil.ph', address: 'Camp Ola, Legazpi City' },
  { id: 'contact-8', name: 'Engr. Rosa Mendoza', agency: 'PHIVOLCS', designation: 'Resident Volcanologist', phoneNumber: '09241234567', email: 'phivolcs.mayon@phivolcs.dost.gov.ph', address: 'Mayon Volcano Observatory' },
];

export async function getInventoryItems(): Promise<InventoryItem[]> {
  if (DEMO_MODE) {
    console.log('[DEMO] Returning sample inventory data');
    return sampleInventoryItems;
  }
  
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A2:G',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      console.warn('Google Sheet returned empty inventory data');
      return [];
    }
    
    return rows.map((row, index) => ({
      id: `inv-${index + 1}`,
      itemName: row[0] || '',
      itemDescription: row[1] || '',
      itemCategory: row[2] || '',
      itemLocation: row[3] || '',
      currentStock: parseInt(row[4]) || 0,
      itemUnit: row[5] || 'pcs',
      itemStatus: (row[6] as InventoryItem['itemStatus']) || 'In Stock',
    }));
  } catch (error) {
    console.error('Error fetching inventory from Google Sheets:', error);
    if (DEMO_MODE) {
      return sampleInventoryItems;
    }
    throw error;
  }
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  if (DEMO_MODE) {
    console.log('[DEMO] Returning sample calendar events');
    return sampleCalendarEvents;
  }
  
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet2!A2:F',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      console.warn('Google Sheet returned empty calendar events');
      return [];
    }
    
    return rows.map((row, index) => ({
      id: `evt-${index + 1}`,
      eventName: row[0] || '',
      date: row[1] || '',
      time: row[2] || '',
      location: row[3] || '',
      notes: row[4] || '',
      priority: (row[5] as CalendarEvent['priority']) || 'Medium',
    }));
  } catch (error) {
    console.error('Error fetching calendar events from Google Sheets:', error);
    if (DEMO_MODE) {
      return sampleCalendarEvents;
    }
    throw error;
  }
}

export async function getCalendarTasks(): Promise<CalendarTask[]> {
  if (DEMO_MODE) {
    console.log('[DEMO] Returning sample calendar tasks');
    return sampleCalendarTasks;
  }
  
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet2!H2:L',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      console.warn('Google Sheet returned empty calendar tasks');
      return [];
    }
    
    return rows.map((row, index) => {
      const deadline = new Date(row[2]);
      const now = new Date();
      let status: CalendarTask['status'] = row[4] as CalendarTask['status'] || 'Upcoming';
      if (!row[4] && deadline < now && status !== 'Complete') {
        status = 'Overdue';
      }
      
      return {
        id: `task-${index + 1}`,
        taskName: row[0] || '',
        dateTime: row[1] || '',
        deadlineDateTime: row[2] || '',
        description: row[3] || '',
        status,
      };
    });
  } catch (error) {
    console.error('Error fetching calendar tasks from Google Sheets:', error);
    if (DEMO_MODE) {
      return sampleCalendarTasks;
    }
    throw error;
  }
}

export async function getContacts(): Promise<Contact[]> {
  if (DEMO_MODE) {
    console.log('[DEMO] Returning sample contacts');
    return sampleContacts;
  }
  
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet3!A2:F',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      console.warn('Google Sheet returned empty contacts');
      return [];
    }
    
    return rows.map((row, index) => ({
      id: `contact-${index + 1}`,
      name: row[0] || '',
      agency: row[1] || '',
      designation: row[2] || '',
      phoneNumber: row[3] || '',
      email: row[4] || '',
      address: row[5] || '',
    }));
  } catch (error) {
    console.error('Error fetching contacts from Google Sheets:', error);
    if (DEMO_MODE) {
      return sampleContacts;
    }
    throw error;
  }
}
