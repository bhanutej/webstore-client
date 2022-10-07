import { gql } from "@apollo/client";

export const LOAD_PRODUCTS = gql`
  query Products {
    products {
      id
      name
      companyName
      email
      contactPerson
      contact
      description
      logo
    }
  }
`;

export const LOAD_HOME_PRODUCTS = gql`
  query Products {
    products(limit: 8) {
      id
      name
    }
  }
`;

export const LOAD_CATEGORIES = gql`
  query Categories {
    categories {
      id
      name
    }
  }
`;
