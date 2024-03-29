import { gql } from "@apollo/client";

export const LOAD_PRODUCTS = gql`
  query Products($limit: Int!, $status: String!) {
    products(limit: $limit, status: $status) {
      id
      name
      companyName
      email
      contactPerson
      contact
      description
      logo
      status
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
    products(limit: 8, status: "published") {
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
