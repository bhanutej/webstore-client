
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import { LOAD_PRODUCT } from "../../../GraphQL/Queries";

import './ProductView.css';

export const ProductView = () => {
  const { PRODUCT_ID } = useParams();

  const [product, setProduct] = useState(null);
  const [productId, setProductId] = useState(null);
  const {loading, data, error} = useQuery(LOAD_PRODUCT, {
    variables: { productId }
  });

  useEffect(() => {
    if (PRODUCT_ID) {
      setProductId(Number(PRODUCT_ID));
    }
  }, [PRODUCT_ID]);

  useEffect(() => {
    if (data && data.product) {
      setProduct(data.product);
    }
  }, [data, productId]);
  return <h1>View: {productId}======{product.name}</h1>
}
