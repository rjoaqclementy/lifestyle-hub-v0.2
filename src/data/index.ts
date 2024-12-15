interface Location {
  id: string;
  name: string;
}

export const countries: Location[] = [
  { id: 'PE', name: 'Peru' },
  { id: 'US', name: 'United States' },
  { id: 'GB', name: 'United Kingdom' },
  { id: 'ES', name: 'Spain' },
  { id: 'FR', name: 'France' },
  { id: 'DE', name: 'Germany' },
  { id: 'IT', name: 'Italy' },
  { id: 'BR', name: 'Brazil' },
  { id: 'AR', name: 'Argentina' },
  { id: 'MX', name: 'Mexico' },
  { id: 'CO', name: 'Colombia' },
  { id: 'CL', name: 'Chile' },
  // Add more countries as needed
];

export const cities: Location[] = [
  // Peru
  { id: 'LIM', name: 'Lima' },
  { id: 'AQP', name: 'Arequipa' },
  { id: 'CUZ', name: 'Cusco' },
  { id: 'TRU', name: 'Trujillo' },
  { id: 'PIU', name: 'Piura' },
  // United States
  { id: 'NYC', name: 'New York City' },
  { id: 'LAX', name: 'Los Angeles' },
  { id: 'CHI', name: 'Chicago' },
  { id: 'HOU', name: 'Houston' },
  { id: 'PHX', name: 'Phoenix' },
  // Add more cities as needed
];