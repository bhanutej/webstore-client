import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';


import { Navbar } from './components/NavBar/NavBar';
import { Home } from './components/Home';
import { About } from './components/About';
import { Login } from './components/Authentications/Login';
import { AuthProvider } from './auth-context/auth';
import { NewProductForm } from './components/Products.js/ProductForm/ProductForm';
import Protected from './auth-context/Protected';
import { ProductView } from './components/Products.js/ProductView/ProductView';

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if ( graphqlErrors ) {
    graphqlErrors.map(({ message, location, path }) => {
      alert(`Graphql error ${message}`);
      return message;
    });
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: "http://localhost:3300/api" })
]);

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const storageAuthUser = JSON.parse(localStorage.getItem("authUser"));
  let authToken = "";
  if(storageAuthUser) {
    authToken = storageAuthUser.token;
  }
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: authToken
    }
  });
  // Call the next link in the middleware chain.
  return forward(operation);
});


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link), // Chain it with the HttpLink
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='about' element={<About />} />
            <Route path='login' element={<Login />} />
            <Route path='/addProduct' element={
              <Protected>
                <NewProductForm />
              </Protected>
            } />
            <Route path='/productView/:PRODUCT_ID' element={
              <Protected>
                <ProductView />
              </Protected>
            } />
          </Routes>
        </AuthProvider>
      </ApolloProvider>
    </>
  );
}

export default App;
