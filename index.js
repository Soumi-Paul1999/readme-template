const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create product schema
const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "product title is required"],
    minlength: [3, "munimum length of the product title should be 3"],
    maxlength: [100, "maximum length of the product title should be 10"],
    trim: true,
    // validate: {
    //   validator: function (v) {
    //     return v.length === 10;
    //   },
    //   message: (props) => `${props.value} is not a valid title`,
    // },
    enum: {
      values: ["iphone", "samsung"],
      message: "{VALUE} is not supported",
    },
  },
  rating: {
    type: Number,
  },
  price: {
    type: Number,
    min: 20,
    max: 20000,
    required: true,
  },
  phone: {
    type: String,
    required: [true, "phone number is required"],
    validate: {
      validator: function (v) {
        const phoneRegex = /\d{3}-\d{3}-\d{4}/;
        return phoneRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//create product model
const Product = mongoose.model("Product", productsSchema);
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Soumi:soumi1234@atlascluster.81pwmyq.mongodb.net/anisulcrud"
    );
    console.log("db is connected");
  } catch (error) {
    console.log(error.message);
  }
};

app.get("/", (req, res) => {
  res.send("welcome");
});

//CRUD - Create , Read, Update , Delete
//Create
app.post("/products", async (req, res) => {
  try {
    //get data from request body

    const newProduct = new Product({
      title: req.body.title,
      price: req.body.price,
      rating: req.body.rating,
      description: req.body.description,
      phone: req.body.phone,
    });

    const productData = await newProduct.save();
    //    const productData=await Product.insertMany([
    //     {
    //         title: "iphone 5",
    //         price : 70,
    //         description :'beautiful phone'
    //     },
    //     {
    //         title: "iphone 8",
    //         price : 70,
    //         description :'beautiful phone'
    //     }
    //    ]);
    res.status(500).send(productData);
  } catch (error) {
    console.log(error);
  }
});

app.get("/products", async (req, res) => {
  try {
    const price = req.query.price;
    const rating = req.query.rating;
    let products;
    if (price && rating) {
      products = await Product.find({
        $or: [{ price: { $gt: price } }, { rating: { $gt: rating } }],
      })
        .sort({ price: -1 })
        .select({ title: 1, _id: 0 });
    } else {
      products = await Product.find().sort({ price: -1 }).select({ title: 1 });
    }

    if (products) {
      console.log(products);
      res.status(200).send({
        success: true,
        products,
        // message: "return all product",
      });
    } else {
      res.status(404).send({
        message: "products not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const products = await Product.findOne({ _id: id }).select({
      title: 1,
      price: 1,
      _id: 0,
    });
    res.send(products);

    if (products) {
      res.status(200).send({
        success: true,
        message: "return single product",
        data: products,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "products not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.listen(port, async () => {
  console.log(`server is running in http://localhost:${port}`);
  await connectDB();
});

//database => collection => document
//get : /products => return all the products
//get :/products/:id => rturn a specific product
//post:/products=>create a product
//put: /products/:id -> update a product based on id
//delete : / products/:id => delete a product based on id

app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete({ _id: id });
    if (product) {
      res.status(200).send({
        success: true,
        message: "deleted single product",
        data: product,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "product was not deleted with this id",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          rating: req.body.rating,
        },
      },
      { new: true }
    );
    if (product) {
      res.status(200).send({
        success: true,
        message: "updated single product",
        data: product,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "product was not updated with this id",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
