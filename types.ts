export interface Message {
  $: {
    priority: string;
  };
  createddate: string;
  title: string;
  exactlocation: string;
  description: string;
  category: string;
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
