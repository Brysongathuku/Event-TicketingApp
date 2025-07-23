// import {
//   useGetVenuesQuery,
//   //   useDeleteVenueMutation,
//   //   useUpdateVenueMutation,
// } from "../../../features/Venue/VenueApi";

// const VenuesPage = () => {
//   const { data: venues, isLoading } = useGetVenuesQuery();
//   //   const [deleteVenue] = useDeleteVenueMutation();
//   //   const [updateVenue] = useUpdateVenueMutation();

//   //   const handleDelete = async (id: number) => {
//   //     await deleteVenue(id);
//   //   };

//   //   const handleUpdate = async () => {
//   //     await updateVenue();
//   //   };

//   return (
//     <div>
//       {isLoading ? (
//         <p>Loading venues...</p>
//       ) : (
//         venues?.map((venue) => (
//           <div key={venue.venueID}>
//             <h3>{venue.name}</h3>
//             {/* <button onClick={() => handleDelete(venue.venueID)}>Delete</button>
//             <button onClick={() => handleUpdate({ ...venue, name: "Updated Name" })}> */}
//             {/* Update
//             </button> */}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };
