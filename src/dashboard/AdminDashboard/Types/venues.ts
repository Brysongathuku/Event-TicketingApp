export type TVenue = {
  venueID: number;
  venueName: string;
  address: string;
  description?: string;
  capacity: number;
  imageUrl?: string;
};

export type TCreateVenue = Omit<TVenue, "venueID">;
export type TUpdateVenue = Partial<TCreateVenue> & { venueID: number };
