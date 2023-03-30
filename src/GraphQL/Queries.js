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

export const LOAD_PRODUCT = gql`
  query Product($productId: Int!) {
    product(productId: $productId) {
      id
      name
      companyName
      email
      contactPerson
      contact
      description
      logo
      companyUrl
      status
      publishedAt
      keyWords
      features
      category {
        id
        name
      }
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

export const LOAD_NEWS_LETTER_EMAILS = gql`
  query NewsLetterEmails($limit: Int!) {
    newsLetterEmails(limit: $limit) {
      id
      email
    }
  }
`;
