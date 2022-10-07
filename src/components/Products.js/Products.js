import { useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Spin } from "antd";

import { LOAD_HOME_PRODUCTS } from "../../GraphQL/Queries";
import { ProductCard } from "./ProductCard/ProductCard";
import './Products.css';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const {loading, data, error} = useQuery(LOAD_HOME_PRODUCTS);
  
  useEffect(() => {
    if (data && data.products) {
      setProducts(data.products);
    }
  }, [data]);

  return <>
    <div className="products-cards-container">
      {loading && <Spin />}
      {products.map((product, index) => {
        return <ProductCard key={`${product.name}_${index}`} product={product}/>
      })}
    </div>
  </>
};
