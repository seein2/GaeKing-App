interface Schedule {
    type: 'walk' | 'snack' | 'meal';
    time: string;
    dogId: number;
  }
  
  interface MarkedDates {
    [date: string]: {
      dots: Array<{ key: string; color: string }>;
      selected?: boolean;
      selectedColor?: string;
    };
  }