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
    areas: [
      {
        area: {
          $: {
            name: string;
          };
        };
      }
    ];
  };
}

export interface User {
  phoneNumber: string;
  latitude: number;
  longitude: number;
  lastUpdateAt: string;
}
