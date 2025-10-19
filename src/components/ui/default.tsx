import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Power, 
  Thermometer, 
  Camera,
  Lock,
  Speaker,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow
} from 'lucide-react';
import { Device, useDeviceStore } from './device-store';
import { cn } from '@/lib/utils';

interface DeviceCardProps {
  deviceId: string;
  variant?: 'compact' | 'detailed';
}

const deviceIcons = {
  light: Lightbulb,
  sensor: Thermometer,
  camera: Camera,
  switch: Power,
  climate: Thermometer,
  lock: Lock,
  speaker: Speaker,
};

export function DeviceCard({ deviceId, variant = 'compact' }: DeviceCardProps) {
  const device = useDeviceStore((state) => state.devices[deviceId]);
  const toggleDevice = useDeviceStore((state) => state.toggleDevice);
  const setSelectedDevice = useDeviceStore((state) => state.setSelectedDevice);
  
  if (!device) return null;
  
  const Icon = deviceIcons[device.type];
  const isOn = device.state?.on || device.state?.active || false;
  const isOnline = device.status === 'online';
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOnline) {
      toggleDevice(deviceId);
    }
  };
  
  const handleCardClick = () => {
    setSelectedDevice(deviceId);
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={cn(
        "relative overflow-hidden rounded-xl border cursor-pointer",
        "transition-colors duration-200",
        isOnline ? "border-border" : "border-destructive/50",
        isOn && isOnline && "bg-primary/5 border-primary/50"
      )}
    >
      {/* Background glow effect when device is on */}
      {isOn && isOnline && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon with animation */}
            <motion.div
              className={cn(
                "p-2.5 rounded-lg",
                isOn && isOnline
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
              animate={isOn && isOnline ? {
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0)",
                  "0 0 0 8px rgba(59, 130, 246, 0)",
                ],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            
            <div className="flex-1">
              <h3 className="font-medium text-sm">{device.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">
                {device.type}
              </p>
            </div>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center gap-1">
            {device.battery !== undefined && (
              <div className="flex items-center gap-1">
                {device.battery < 20 ? (
                  <BatteryLow className="w-4 h-4 text-warning" />
                ) : (
                  <Battery className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground">
                  {device.battery}%
                </span>
              </div>
            )}
            
            {isOnline ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
          </div>
        </div>
        
        {/* State display for detailed variant */}
        {variant === 'detailed' && device.state && (
          <div className="space-y-2">
            {device.type === 'light' && device.state.brightness !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Brightness</span>
                  <span className="font-medium">{device.state.brightness}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${device.state.brightness}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
            
            {device.type === 'climate' && device.state.temperature !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Temperature</span>
                <span className="font-medium text-lg">
                  {device.state.temperature}°C
                </span>
              </div>
            )}
            
            {device.type === 'sensor' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(device.state).map(([key, value]) => (
                  <div key={key} className="space-y-0.5">
                    <div className="text-muted-foreground capitalize">
                      {key.replace('_', ' ')}
                    </div>
                    <div className="font-medium">
                      {typeof value === 'number' ? value.toFixed(1) : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Toggle button */}
        {(device.type === 'light' || device.type === 'switch') && (
          <motion.button
            onClick={handleToggle}
            disabled={!isOnline}
            className={cn(
              "w-full py-2 px-4 rounded-lg font-medium text-sm",
              "transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isOn && isOnline
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            whileTap={{ scale: 0.95 }}
          >
            {isOn ? 'Turn Off' : 'Turn On'}
          </motion.button>
        )}
        
        {/* Last updated */}
        <div className="text-xs text-muted-foreground text-center">
          Updated {formatRelativeTime(device.lastUpdated)}
        </div>
      </div>
    </motion.div>
  );
}

// Utility function for relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}