
// Data processing utilities for flight data
export interface FlightData {
  id: number;
  YEAR: number;
  MONTH: number;
  DAY: number;
  DAY_OF_WEEK: number;
  AIRLINE: string;
  FLIGHT_NUMBER: number;
  ORIGIN_AIRPORT: string;
  DESTINATION_AIRPORT: string;
  SCHEDULED_DEPARTURE: number;
  DEPARTURE_TIME: number;
  DEPARTURE_DELAY: number;
  SCHEDULED_TIME: number;
  ELAPSED_TIME: number;
  DISTANCE: number;
  SCHEDULED_ARRIVAL: number;
  ARRIVAL_TIME: number;
  ARRIVAL_DELAY: number;
  // Computed fields
  route: string;
  day_of_week: string;
  hour: number;
  date: string;
  POS_DELAY: number;
  IS_DELAYED: number;
}

export const dayOfWeekNames = {
  1: 'Monday',
  2: 'Tuesday', 
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday'
};

export const extractHourFromTime = (timeInt: number): number => {
  if (!timeInt || timeInt < 0) return 0;
  // Convert time like 1430 to hour 14
  return Math.floor(timeInt / 100);
};

export const parseCsvToFlightData = (csvText: string): FlightData[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  console.log('CSV Headers:', headers);
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map((line, index) => {
      const values = line.split(',');
      
      // Map CSV columns to schema fields
      const getColumnValue = (columnName: string): string => {
        const columnIndex = headers.indexOf(columnName);
        return columnIndex >= 0 ? values[columnIndex]?.trim() || '' : '';
      };
      
      const year = parseInt(getColumnValue('YEAR')) || 2024;
      const month = parseInt(getColumnValue('MONTH')) || Math.floor(Math.random() * 12) + 1;
      const day = parseInt(getColumnValue('DAY')) || Math.floor(Math.random() * 28) + 1;
      const dayOfWeek = parseInt(getColumnValue('DAY_OF_WEEK')) || Math.floor(Math.random() * 7) + 1;
      const airline = getColumnValue('AIRLINE') || `Airline ${Math.floor(Math.random() * 10) + 1}`;
      const flightNumber = parseInt(getColumnValue('FLIGHT_NUMBER')) || Math.floor(Math.random() * 9999) + 1;
      const originAirport = getColumnValue('ORIGIN_AIRPORT') || 'NYC';
      const destinationAirport = getColumnValue('DESTINATION_AIRPORT') || 'LAX';
      const scheduledDeparture = parseInt(getColumnValue('SCHEDULED_DEPARTURE')) || Math.floor(Math.random() * 2400);
      const departureTime = parseInt(getColumnValue('DEPARTURE_TIME')) || scheduledDeparture;
      const departureDelay = parseInt(getColumnValue('DEPARTURE_DELAY')) || Math.random() * 120 - 20;
      const scheduledTime = parseInt(getColumnValue('SCHEDULED_TIME')) || Math.random() * 400 + 60;
      const elapsedTime = parseInt(getColumnValue('ELAPSED_TIME')) || scheduledTime;
      const distance = parseInt(getColumnValue('DISTANCE')) || Math.random() * 3000 + 200;
      const scheduledArrival = parseInt(getColumnValue('SCHEDULED_ARRIVAL')) || Math.floor(Math.random() * 2400);
      const arrivalTime = parseInt(getColumnValue('ARRIVAL_TIME')) || scheduledArrival;
      const arrivalDelay = parseInt(getColumnValue('ARRIVAL_DELAY')) || Math.random() * 150 - 30;
      
      // Computed fields
      const route = `${originAirport}-${destinationAirport}`;
      const dayOfWeekName = dayOfWeekNames[dayOfWeek as keyof typeof dayOfWeekNames] || 'Monday';
      const hour = extractHourFromTime(scheduledDeparture);
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const posDelay = Math.max(departureDelay, 0);
      const isDelayed = departureDelay > 15 ? 1 : 0;
      
      return {
        id: index,
        YEAR: year,
        MONTH: month,
        DAY: day,
        DAY_OF_WEEK: dayOfWeek,
        AIRLINE: airline,
        FLIGHT_NUMBER: flightNumber,
        ORIGIN_AIRPORT: originAirport,
        DESTINATION_AIRPORT: destinationAirport,
        SCHEDULED_DEPARTURE: scheduledDeparture,
        DEPARTURE_TIME: departureTime,
        DEPARTURE_DELAY: departureDelay,
        SCHEDULED_TIME: scheduledTime,
        ELAPSED_TIME: elapsedTime,
        DISTANCE: distance,
        SCHEDULED_ARRIVAL: scheduledArrival,
        ARRIVAL_TIME: arrivalTime,
        ARRIVAL_DELAY: arrivalDelay,
        route: route,
        day_of_week: dayOfWeekName,
        hour: hour,
        date: date,
        POS_DELAY: posDelay,
        IS_DELAYED: isDelayed
      };
    });
};

export const generateSampleFlightData = (): FlightData[] => {
  const airlines = ['Delta', 'American', 'United', 'Southwest', 'JetBlue', 'Alaska', 'Spirit'];
  const airports = ['NYC', 'LAX', 'CHI', 'MIA', 'SF', 'DEN', 'ATL', 'DFW', 'SEA', 'BOS'];
  
  return Array.from({ length: 1000 }, (_, i) => {
    const originAirport = airports[Math.floor(Math.random() * airports.length)];
    let destinationAirport = airports[Math.floor(Math.random() * airports.length)];
    while (destinationAirport === originAirport) {
      destinationAirport = airports[Math.floor(Math.random() * airports.length)];
    }
    
    const scheduledDeparture = Math.floor(Math.random() * 2400);
    const departureDelay = Math.random() * 120 - 20;
    const arrivalDelay = Math.random() * 150 - 30;
    const dayOfWeek = Math.floor(Math.random() * 7) + 1;
    
    return {
      id: i,
      YEAR: 2024,
      MONTH: Math.floor(Math.random() * 12) + 1,
      DAY: Math.floor(Math.random() * 28) + 1,
      DAY_OF_WEEK: dayOfWeek,
      AIRLINE: airlines[Math.floor(Math.random() * airlines.length)],
      FLIGHT_NUMBER: Math.floor(Math.random() * 9999) + 1,
      ORIGIN_AIRPORT: originAirport,
      DESTINATION_AIRPORT: destinationAirport,
      SCHEDULED_DEPARTURE: scheduledDeparture,
      DEPARTURE_TIME: scheduledDeparture + departureDelay,
      DEPARTURE_DELAY: departureDelay,
      SCHEDULED_TIME: Math.random() * 400 + 60,
      ELAPSED_TIME: Math.random() * 400 + 60,
      DISTANCE: Math.random() * 3000 + 200,
      SCHEDULED_ARRIVAL: Math.floor(Math.random() * 2400),
      ARRIVAL_TIME: Math.floor(Math.random() * 2400),
      ARRIVAL_DELAY: arrivalDelay,
      route: `${originAirport}-${destinationAirport}`,
      day_of_week: dayOfWeekNames[dayOfWeek as keyof typeof dayOfWeekNames],
      hour: extractHourFromTime(scheduledDeparture),
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      POS_DELAY: Math.max(departureDelay, 0),
      IS_DELAYED: departureDelay > 15 ? 1 : 0
    };
  });
};
