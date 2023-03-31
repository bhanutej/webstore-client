import { Image } from "antd";
import React from "react";
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  return <div className="product-card-container">
    <Image
      width={100}
      src={product.logo}
    />
    {product.name}
  </div>
};