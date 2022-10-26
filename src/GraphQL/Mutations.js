import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login(
    $email: String!
    $password: String!
  ) {
    login( input: {
      email: $email
      password: $password  
    }
    ) {
      id
      name
      token
      role
    }
  }
`;

export const ADD_NEWS_SUBSCRIBER_MUTATION = gql`
  mutation addNewsSubscriber(
    $email: String!
  ) {
    addNewsSubscriber( input: {
      email: $email
    }
    ) {
      message
    }
  }
`;

export const PUBLISH = gql`
  mutation publish(
    $productId: Int!
  ) {
    publish( input: {
      productId: $productId
    }
    ) {
      message
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct($input: ProductInput!) {
    addProduct(input: $input) {
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
      # attachments
      categoryId
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
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
      # attachments
      categoryId
    }
  }
`;
