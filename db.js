const mongoose = require("mongoose");
const mongoURI =
  //   "mongodb+srv://sumit24thakur:mern123@cluster0.xy8huqb.mongodb.net/gofoodmern?retryWrites=true&w=majority";
  "mongodb+srv://sumit24thakur:mern123@cluster0.xy8huqb.mongodb.net/gofoodmern";

// mongoose
//   .connect(mongoURI)
//   .then(() => {
//     console.log("DB connection success!!");
//     const fetched_data = mongoose.connection.db.collection("food_items");
//     fetched_data.find({}).toArray(function (err, data) {
//       if (err) console.log(err);
//       else {
//         global.food_items = data;
//         console.log(global.food_items);
//       }
//     });
//   })
// .catch((err) => console.error(err));

const connectDB = async () => {
  await mongoose.connect(
    mongoURI,
    { useNewUrlParser: true },
    async (err, result) => {
      if (err) console.log("---", err);
      else {
        console.log("db connected");
        const fetched_data = await mongoose.connection.db.collection(
          "food_items"
        );
        fetched_data.find({}).toArray(async function (err, data) {
          const foodCategory = await mongoose.connection.db.collection(
            "food_category"
          );
          foodCategory.find({}).toArray(async function (err, catData) {
            if (err) console.log(err);
            else {
              global.food_items = data;
              global.foodCategory = catData;
              // console.log(global.food_items);
            }
          });
          // if (err) console.log(err);
          // else {
          //   global.food_items = data;
          // console.log(global.food_items);
          // }
        });
      }
    }
  );
};

// module.exports = {};
module.exports = connectDB();
