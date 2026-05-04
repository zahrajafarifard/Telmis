const express = require("express");
const bodyParser = require("body-parser");
// const path = require("path");
// const fs = require("fs");

const sequelize = require("./db.js");

const productsRoutes = require("./routes/products-routes");
const adminRoutes = require("./routes/admin-routes");
const categorisRoutes = require("./routes/categories-routes");
const clientsRoutes = require("./routes/clients-routes.js");
const jobRoutes = require("./routes/job-routes.js");
const articleRoutes = require("./routes/article-routes.js");
const cartRoutes = require("./routes/cart-routes.js");
const factorRoutes = require("./routes/factor-routes.js");
const clientSideRoutes = require("./routes/exchange-client-side-routes.js");
const exchangeRoutes = require("./routes/admin-exchange-routes.js");
const militaryServiceRoutes = require("./routes/militaryService-routes.js");
const employmentTypeRoutes = require("./routes/employmentType-routes.js");
const articleJobCatRoutes = require("./routes/article-job-category.js");

const deliveryRoutes = require("./routes/daysOfYearRoute.js");
const resumeRoutes = require("./routes/resume-routes.js");
const contactUsRoutes = require("./routes/contactUs-routes.js");

const bannerRoutes = require("./routes/banner-routes.js");

const HttpError = require("./models/http-error");
const DaysOfYear = require("./models/daysOfYear");
const TimeSlot = require("./models/timeSlot");

const Job = require("./models/job.js");
const EmploymentType = require("./models/employment-type.js");
const MilitaryService = require("./models/military-service.js");
const Article = require("./models/article.js");
const ArticleType = require("./models/articleType.js");
const Exchange = require("./models/exchange.js");
const ExchangeFiles = require("./models/exchange-files.js");
const Receipt = require("./models/receipt.js");
const NewUserNotification = require("./models/new-user-notification.js");
const ProfileNotification = require("./models/profile-notification.js");
const FinancialNotification = require("./models/financial-notification.js");
const ClientShopNotification = require("./models/client-shop-notification.js");
const ExchangeNotification = require("./models/exchange-notification.js");
const Category = require("./models/category.js");
const Product = require("./models/product.js");
const Admin = require("./models/admin.js");
const Resume = require("./models/resume.js");
const Banner = require("./models/banner.js");
const Client = require("./models/client.js");
const ClientAddress = require("./models/client-address.js");
const Factor = require("./models/factor.js");
const FactorDetails = require("./models/factor-details.js");
const FactorDetailsMeta = require("./models/factor-details-meta.js");
const Cart = require("./models/cart.js");
const CartDetails = require("./models/cart-details.js");
const ProductImage = require("./models/product-image.js");
const ProductSpecifacation = require("./models/product-specification.js");
const ProductComment = require("./models/product-comment.js");
const StatusFactor = require("./models/status-factor.js");
const FavoriteProducts = require("./models/favorite-products.js");
const ExchangeLoginHistory = require("./models/login-history.js");
const ClientLoginHistory = require("./models/client-login-history.js");
const FileType = require("./models/fileType.js");
const ContactUs = require("./models/contact-us.js");
const ProductVariable = require("./models/product-variable.js");
const ProductVariableItem = require("./models/product-variable-items.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/uploadedFiles", express.static(process.cwd() + "/uploadedFiles"));
app.use("/uploads", express.static(process.cwd() + "/uploads"));
// app.use("/resume", express.static(process.cwd() + "/resume"));

app.use("/uploadedFiles", express.static("uploadedFiles"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", false);
  res.header("Access-Control-Expose-Headers", "Content-Disposition");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/delivery", deliveryRoutes);
app.use("/banner", bannerRoutes);
app.use("/apiClient", clientSideRoutes);
// app.use("/api", adminRoutes);
app.use("/products", productsRoutes);
app.use("/admin", adminRoutes); //change user to admin
app.use("/jobs", jobRoutes);
app.use("/articles", articleRoutes);
app.use("/clients", clientsRoutes);
app.use("/order", cartRoutes);
app.use("/factor", factorRoutes);
app.use("/categories", categorisRoutes);
app.use("/exchange", exchangeRoutes);
app.use("/military-service", militaryServiceRoutes);
app.use("/employment-type", employmentTypeRoutes);
app.use("/article-job-cat", articleJobCatRoutes);
app.use("/resume", resumeRoutes);
app.use("/contact-us", contactUsRoutes);

app.get("*", (req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  return res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

TimeSlot.belongsTo(DaysOfYear, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  allowNull: false,
});

DaysOfYear.hasMany(TimeSlot);

////////////////////

Category.hasMany(Category, {
  as: "subCategories",
  foreignKey: "parentId",
});
Category.belongsTo(Category, {
  foreignKey: {
    name: "parentId",
    allowNull: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    defaultValue: null,
  },
  as: "parent",
});

Category.hasMany(Product, {
  as: "products",
  foreignKey: {
    name: "categoryId",
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

EmploymentType.hasMany(Job, { onDelete: "RESTRICT" });
Job.belongsTo(EmploymentType, { onDelete: "RESTRICT" });

MilitaryService.hasMany(Job, { onDelete: "RESTRICT" });
Job.belongsTo(MilitaryService, { onDelete: "RESTRICT" });

ArticleType.hasMany(Job, { onDelete: "RESTRICT" });
Job.belongsTo(ArticleType, { onDelete: "RESTRICT" });

ArticleType.hasMany(Article, { onDelete: "RESTRICT" });
Article.belongsTo(ArticleType, { onDelete: "RESTRICT" });

FileType.hasMany(ExchangeFiles);
ExchangeFiles.belongsTo(FileType); //new

Product.hasMany(ProductImage, { onDelete: "CASCADE" });
ProductImage.belongsTo(Product, { onDelete: "CASCADE" }); //new

Product.hasMany(ProductSpecifacation, { onDelete: "CASCADE" }); //new
ProductSpecifacation.belongsTo(Product, { onDelete: "CASCADE" }); //new

Product.hasMany(ProductVariable, { onDelete: "CASCADE" }); //new
ProductVariable.belongsTo(Product, { onDelete: "CASCADE" }); //new

ProductVariable.hasMany(ProductVariableItem, { onDelete: "CASCADE" }); //new
ProductVariableItem.belongsTo(ProductVariable, { onDelete: "CASCADE" }); //new

Product.hasMany(ProductComment, { onDelete: "CASCADE" }); //new
Exchange.hasMany(ExchangeFiles);

ExchangeFiles.belongsTo(Exchange);

Exchange.hasMany(Receipt);
Receipt.belongsTo(Exchange);

Exchange.hasMany(ExchangeLoginHistory);
ExchangeLoginHistory.belongsTo(Exchange);
Client.hasMany(ClientLoginHistory); // new

Exchange.hasMany(NewUserNotification);
NewUserNotification.belongsTo(Exchange);

Exchange.hasMany(ProfileNotification);
ProfileNotification.belongsTo(Exchange);

Exchange.hasMany(FinancialNotification);
FinancialNotification.belongsTo(Exchange);

Client.hasMany(ClientShopNotification); //new
ClientShopNotification.belongsTo(Client); //new

Exchange.hasMany(ExchangeNotification);
ExchangeNotification.belongsTo(Exchange);

Factor.belongsTo(Client);
// Factor.belongsTo(Client, {
//   foreignKey: "ClientId",
//   onDelete: "CASCADE",
// });

Factor.belongsTo(ClientAddress); //new
Factor.belongsTo(TimeSlot); //new
Factor.belongsTo(StatusFactor);

Client.hasMany(FavoriteProducts, {
  foreignKey: {
    name: "ClientId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});
Product.hasMany(FavoriteProducts);
FavoriteProducts.belongsTo(Product); //new

FactorDetails.belongsTo(Factor, { onDelete: "CASCADE" });
Factor.hasMany(FactorDetails, { onDelete: "CASCADE" });

FactorDetailsMeta.belongsTo(FactorDetails, { onDelete: "CASCADE" });
FactorDetails.hasMany(FactorDetailsMeta, { onDelete: "CASCADE" });

FactorDetails.belongsTo(Product); //Only needed once for reporting purposes :)
Product.hasMany(FactorDetails);

Cart.belongsTo(Client, {
  foreignKey: {
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});
Cart.belongsTo(Factor, {
  foreignKey: {
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

CartDetails.belongsTo(Cart, {
  foreignKey: {
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});
CartDetails.belongsTo(Product, {
  foreignKey: {
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

//new

Client.hasMany(ClientAddress, {
  foreignKey: {
    name: "ClientId",
    allowNull: false,
    unique: "unique_address_per_client",
  },
  onDelete: "CASCADE",
});

ClientAddress.belongsTo(Client, {
  foreignKey: {
    name: "ClientId",
    allowNull: false,
    unique: "unique_address_per_client",
  },
});

sequelize
  .sync()
  // .sync({ force: true })
  .then(async () => {
    const server = app.listen(4000, () => {
      console.log("Server is up...");
    });

    const io = require("./socket.js").init(server);

    io.on("connection", (socket) => {
      //admin
      socket.on("markAsRead", async () => {
        try {
          await NewUserNotification.update(
            { status: "read" },
            { where: { status: "unread" } }
          );
        } catch (err) {
          console.error("Error updating notifications:", err);
        }
      });

      socket.on("markAsReadFinancialNotif", async () => {
        //admin
        try {
          await FinancialNotification.update(
            { status: "read" },
            { where: { status: "unread" } }
          );
        } catch (err) {
          console.error("Error updating financial notifications:", err);
        }
      });

      socket.on("markAsReadProfileNotif", async () => {
        //admin
        try {
          await ProfileNotification.update(
            { status: "read" },
            { where: { status: "unread" } }
          );
        } catch (err) {
          console.error("Error updating profile notifications:", err);
        }
      });

      ////////////////////////////////////
      socket.on("markAsReadClientShopNotif", async () => {
        try {
          await ClientShopNotification.update(
            { status: "read" },
            { where: { status: "unread" } }
          );
        } catch (err) {
          console.error("Error updating financial notifications:", err);
        }
      });

      socket.on("markAsReadExchangeNotif", async (exId) => {
        try {
          await ExchangeNotification.update(
            { status: "read" },
            { where: { status: "unread", ExchangeId: exId } }
          );
        } catch (err) {
          console.error("Error updating client notifications:", err);
        }
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
