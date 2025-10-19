import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Home,
  Bed,
  UtensilsCrossed,
  Sofa,
  Car,
  Users,
  Zap,
  Activity,
  Plus,
  Settings,
  Mic,
} from 'lucide-react';
import { useDeviceStore, selectAllRooms, selectAllDevices } from './device-store';
import { DeviceCard } from './device-card';
import { cn } from '@/lib/utils';

const roomIcons: Record<string, any> = {
  'living-room': Sofa,
  'bedroom': Bed,
  'kitchen': UtensilsCrossed,
  'garage': Car,
  'home': Home,
};

export function Dashboard() {
  const [activeView, setActiveView] = useState<'rooms' | 'devices' | 'energy'>('rooms');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const rooms = useDeviceStore(selectAllRooms);
  const devices = useDeviceStore(selectAllDevices);
  const selectedRoom = useDeviceStore((state) => state.selectedRoom);
  const setSelectedRoom = useDeviceStore((state) => state.setSelectedRoom);
  const connectionStatus = useDeviceStore((state) => state.connectionStatus);
  
  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const totalDevices = devices.length;
  
  const activeDevices = devices.filter(
    (d) => d.status === 'online' && (d.state?.on || d.state?.active)
  ).length;
  
  // Calculate energy usage (mock data for now)
  const energyUsage = activeDevices * 0.5; // kW
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Home className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">SmartHome</h1>
            </div>
            
            {/* Connection status */}
            <div className="flex items-center gap-2 ml-4">
              <motion.div
                className={cn(
                  "w-2 h-2 rounded-full",
                  connectionStatus === 'connected' && "bg-success",
                  connectionStatus === 'connecting' && "bg-warning",
                  connectionStatus === 'disconnected' && "bg-destructive"
                )}
                animate={connectionStatus === 'connecting' ? {
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-sm text-muted-foreground capitalize">
                {connectionStatus}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Voice button */}
            <motion.button
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={cn(
                "p-2.5 rounded-full transition-colors",
                isVoiceActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-5 h-5" />
            </motion.button>
            
            <button className="p-2.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Stats bar */}
      <div className="border-b bg-card">
        <div className="container px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                Devices Online
              </div>
              <div className="text-2xl font-bold">
                {onlineDevices}/{totalDevices}
              </div>
            </motion.div>
            
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                Active Now
              </div>
              <div className="text-2xl font-bold">{activeDevices}</div>
            </motion.div>
            
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-warning" />
                Energy Usage
              </div>
              <div className="text-2xl font-bold">{energyUsage.toFixed(1)} kW</div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="border-b bg-background">
        <div className="container px-4">
          <div className="flex gap-6">
            {(['rooms', 'devices', 'energy'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={cn(
                  "relative py-4 text-sm font-medium transition-colors",
                  activeView === view
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="capitalize">{view}</span>
                {activeView === view && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="container px-4 py-6">
        <AnimatePresence mode="wait">
          {activeView === 'rooms' && (
            <motion.div
              key="rooms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Rooms grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Rooms</h2>
                  <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Plus className="w-4 h-4" />
                    Add Room
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => {
                    const Icon = roomIcons[room.id] || Home;
                    const roomDevices = devices.filter((d) => d.room === room.id);
                    const activeInRoom = roomDevices.filter(
                      (d) => d.status === 'online' && (d.state?.on || d.state?.active)
                    ).length;
                    
                    return (
                      <motion.button
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={cn(
                          "relative p-6 rounded-xl border text-left",
                          "transition-colors hover:border-primary/50",
                          selectedRoom === room.id && "border-primary bg-primary/5"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          {activeInRoom > 0 && (
                            <motion.div
                              className="px-2 py-1 bg-success/20 text-success text-xs font-medium rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              {activeInRoom} active
                            </motion.div>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-1">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {room.deviceCount} devices
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              {/* Devices in selected room */}
              {selectedRoom && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h2 className="text-lg font-semibold mb-4">
                    Devices in {rooms.find((r) => r.id === selectedRoom)?.name}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {devices
                      .filter((d) => d.room === selectedRoom)
                      .map((device) => (
                        <DeviceCard
                          key={device.id}
                          deviceId={device.id}
                          variant="detailed"
                        />
                      ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {activeView === 'devices' && (
            <motion.div
              key="devices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-lg font-semibold mb-4">All Devices</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    deviceId={device.id}
                    variant="detailed"
                  />
                ))}
              </div>
            </motion.div>
          )}
          
          {activeView === 'energy' && (
            <motion.div
              key="energy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold">Energy Dashboard</h2>
              
              <div className="p-6 border rounded-xl">
                <p className="text-muted-foreground">
                  Energy monitoring visualizations will go here
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}