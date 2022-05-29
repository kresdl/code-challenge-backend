export interface SRMessage {
  $: {
    priority: string;
  };
  createddate: string;
  title: string;
  exactlocation: string;
  description: string;
}

export interface SRResponse {
  sr: {
    messages: [
      {
        message: SRMessage[];
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
