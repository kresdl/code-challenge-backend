export interface Message {
  $: {
    priority: string;
  };
  createddate: string;
  title: string;
  exactlocation: string;
  description: string;
}

export interface SRTrafficMessages {
  sr: {
    messages: [
      {
        message: Message[];
      }
    ];
  };
}

export interface SRTrafficAreas {
  sr: {
    area: [
      {
        $: {
          name: string;
        };
      }
    ];
  };
}

interface Position {
  latitude: number;
  longitude: number;
}

export interface User {
  phoneNumber: string;
  position?: Position;
  lastUpdateAt: string;
  lastArea?: string;
}
