
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { FlightData } from '@/utils/dataProcessing';

interface DataFiltersProps {
  data: FlightData[];
  onFilterChange: (filters: any) => void;
}

const DataFilters = ({ data, onFilterChange }: DataFiltersProps) => {
  const [selectedAirline, setSelectedAirline] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [delayRange, setDelayRange] = useState([-50, 200]);

  const airlines = [...new Set(data.map(flight => flight.AIRLINE))].sort();
  const routes = [...new Set(data.map(flight => flight.route))].sort();

  const handleFilterUpdate = (filterType: string, value: any) => {
    let newFilters = {
      airline: selectedAirline,
      route: selectedRoute,
      delayRange: delayRange
    };

    if (filterType === 'airline') {
      setSelectedAirline(value);
      newFilters.airline = value;
    } else if (filterType === 'route') {
      setSelectedRoute(value);
      newFilters.route = value;
    } else if (filterType === 'delayRange') {
      setDelayRange(value);
      newFilters.delayRange = value;
    }

    onFilterChange(newFilters);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="airline-select" className="text-sm font-medium text-slate-200">
          Filter by Airline
        </Label>
        <Select value={selectedAirline} onValueChange={(value) => handleFilterUpdate('airline', value)}>
          <SelectTrigger className="bg-slate-700/80 backdrop-blur-sm border-slate-600 text-slate-200">
            <SelectValue placeholder="All Airlines" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800/95 backdrop-blur-sm border-slate-600 text-slate-200">
            <SelectItem value="all">All Airlines</SelectItem>
            {airlines.map(airline => (
              <SelectItem key={airline} value={airline}>{airline}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="route-select" className="text-sm font-medium text-slate-200">
          Filter by Route
        </Label>
        <Select value={selectedRoute} onValueChange={(value) => handleFilterUpdate('route', value)}>
          <SelectTrigger className="bg-slate-700/80 backdrop-blur-sm border-slate-600 text-slate-200">
            <SelectValue placeholder="All Routes" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800/95 backdrop-blur-sm border-slate-600 text-slate-200">
            <SelectItem value="all">All Routes</SelectItem>
            {routes.map(route => (
              <SelectItem key={route} value={route}>{route}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-slate-200">
          Delay Range (minutes): {delayRange[0]} to {delayRange[1]}
        </Label>
        <Slider
          value={delayRange}
          onValueChange={(value) => handleFilterUpdate('delayRange', value)}
          max={200}
          min={-50}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>-50 min</span>
          <span>200 min</span>
        </div>
      </div>
    </div>
  );
};

export default DataFilters;
