export type TVenue = {
  venueID: number;
  name: string;
  address: string;
  capacity: number;
  contactNumber?: string | null;
};

export type TCreateVenue = Omit<TVenue, "venueID">;
export type TUpdateVenue = Partial<TCreateVenue> & { venueID: number };
