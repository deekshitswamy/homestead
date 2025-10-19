import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
export type DeviceType = 'light' | 'sensor' | 'camera' | 'switch' | 'climate' | 'lock' | 'speaker';
export type DeviceStatus = 'online' | 'offline' | 'error';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  status: DeviceStatus;
  state: Record<string, any>; // Flexible state for different device types
  lastUpdated: Date;
  battery?: number;
  capabilities: string[];
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  deviceCount: number;
}

interface DeviceState {
  // State
  devices: Record<string, Device>;
  rooms: Record<string, Room>;
  selectedRoom: string | null;
  selectedDevice: string | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  
  // Actions
  addDevice: (device: Device) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  removeDevice: (id: string) => void;
  toggleDevice: (id: string) => void;
  
  setDeviceState: (id: string, state: Record<string, any>) => void;
  
  addRoom: (room: Room) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  
  setSelectedRoom: (roomId: string | null) => void;
  setSelectedDevice: (deviceId: string | null) => void;
  
  setConnectionStatus: (status: 'connected' | 'connecting' | 'disconnected') => void;
  
  // Computed
  getDevicesByRoom: (roomId: string) => Device[];
  getDevicesByType: (type: DeviceType) => Device[];
  getOnlineDevices: () => Device[];
}

export const useDeviceStore = create<DeviceState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        devices: {},
        rooms: {},
        selectedRoom: null,
        selectedDevice: null,
        connectionStatus: 'disconnected',
        
        // Actions
        addDevice: (device) =>
          set((state) => {
            state.devices[device.id] = device;
          }),
        
        updateDevice: (id, updates) =>
          set((state) => {
            if (state.devices[id]) {
              Object.assign(state.devices[id], updates);
              state.devices[id].lastUpdated = new Date();
            }
          }),
        
        removeDevice: (id) =>
          set((state) => {
            delete state.devices[id];
          }),
        
        toggleDevice: (id) =>
          set((state) => {
            const device = state.devices[id];
            if (device && device.state) {
              // Toggle based on device type
              if (device.type === 'light') {
                device.state.on = !device.state.on;
              } else if (device.type === 'switch') {
                device.state.active = !device.state.active;
              }
              device.lastUpdated = new Date();
            }
          }),
        
        setDeviceState: (id, newState) =>
          set((state) => {
            if (state.devices[id]) {
              state.devices[id].state = newState;
              state.devices[id].lastUpdated = new Date();
            }
          }),
        
        addRoom: (room) =>
          set((state) => {
            state.rooms[room.id] = room;
          }),
        
        updateRoom: (id, updates) =>
          set((state) => {
            if (state.rooms[id]) {
              Object.assign(state.rooms[id], updates);
            }
          }),
        
        setSelectedRoom: (roomId) =>
          set((state) => {
            state.selectedRoom = roomId;
          }),
        
        setSelectedDevice: (deviceId) =>
          set((state) => {
            state.selectedDevice = deviceId;
          }),
        
        setConnectionStatus: (status) =>
          set((state) => {
            state.connectionStatus = status;
          }),
        
        // Computed selectors
        getDevicesByRoom: (roomId) => {
          const state = get();
          return Object.values(state.devices).filter(
            (device) => device.room === roomId
          );
        },
        
        getDevicesByType: (type) => {
          const state = get();
          return Object.values(state.devices).filter(
            (device) => device.type === type
          );
        },
        
        getOnlineDevices: () => {
          const state = get();
          return Object.values(state.devices).filter(
            (device) => device.status === 'online'
          );
        },
      })),
      {
        name: 'device-storage',
        partialize: (state) => ({
          devices: state.devices,
          rooms: state.rooms,
        }),
      }
    )
  )
);

// Selectors for better performance (memoized)
export const selectDevice = (id: string) => (state: DeviceState) =>
  state.devices[id];

export const selectRoom = (id: string) => (state: DeviceState) =>
  state.rooms[id];

export const selectAllDevices = (state: DeviceState) =>
  Object.values(state.devices);

export const selectAllRooms = (state: DeviceState) =>
  Object.values(state.rooms);