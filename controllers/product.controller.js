const { Product, sequelize } = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    // Using Sequelize with association
    const products = await Product.findAll({
      include: [
        {
          model: sequelize.models.User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Using raw query for demonstration
    const [result] = await sequelize.query(
      "INSERT INTO products (name, price, description, userId) VALUES (?, ?, ?, ?)",
      {
        replacements: [name, price, description, req.userId],
      }
    );

    const product = await Product.findByPk(result.insertId);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Check if product belongs to user (unless admin)
    if (req.userRole !== "admin") {
      const product = await Product.findOne({
        where: { id: req.params.id, userId: req.userId },
      });

      if (!product) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this product" });
      }
    }

    const [updated] = await Product.update(
      { name, price, description },
      { where: { id: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    // Check if product belongs to user (unless admin)
    if (req.userRole !== "admin") {
      const product = await Product.findOne({
        where: { id: req.params.id, userId: req.userId },
      });

      if (!product) {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete this product" });
      }
    }

    const deleted = await Product.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
