
const destination = "http://localhost:9001";

export const sendCreateTableRequest = async (data: string) => {
    return await fetch(`http://localhost:9001/createTable`, {
      method: "POST",
      mode: "cors",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
            nickName: data
        }
      )
    })
      .then((res) => res)
      .catch((error) => error);
  };

//   export const sendJoinTable = async ({nickName, channelID}) => {
//     return await fetch(`${destination}/createTable`, {
//       method: "POST",
//       mode: "cors",
//       body: JSON.stringify(
//         {
//             name: data
//         }
//       )
//     })
//       .then((res) => res)
//       .catch((error) => error);
//   };