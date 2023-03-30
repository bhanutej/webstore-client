import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import { Home } from './components/Home';
import { About } from './components/About';
import { Login } from './components/Authentications/Login';
import { AuthProvider } from './auth-context/auth';
import { NewProductForm } from './components/Products.js/ProductForm/ProductForm';
import Protected from './auth-context/Protected';
import { ProductView } from './components/Products.js/ProductView/ProductView';
import { AdminLayout } from './components/Layouts/AdminLayout/AdminLayout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { SuperAdminLayout } from './components/Layouts/SuperAdminLayout/SuperAdminLayout';
import { PageNotFound } from './components/PageNotFound/PageNotFound';
import { NewsLetterEmail } from './components/NewsLetterSubscription/NewsLetterEmail/NewsLetterEmail';

const storageAuthUser = JSON.parse(localStorage.getItem("authUser"));

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
          <Routes>
            {storageAuthUser && storageAuthUser.role === 'superadmin' ? (
              <>
                <Route path='/' element={<SuperAdminLayout />}>
                  <Route index element={<Dashboard />}/>
                  <Route path='newsLetter' element={<NewsLetterEmail />} />
                </Route>
                <Route path='*' element={<PageNotFound />} />
              </>
            ) : storageAuthUser && storageAuthUser.role === 'admin' ? (
              <Route path='/admin' element={<AdminLayout />}>
                <Route index element={<Home />} />
                <Route path='about' element={<About />} />
                <Route path='login' element={<Login />} />
                <Route path='addProduct' element={
                  <Protected>
                    <NewProductForm />
                  </Protected>
                } />
                <Route path='productView/:PRODUCT_ID' element={
                  <Protected>
                    <ProductView />
                  </Protected>
                } />
              </Route> 
            ) : (
              <Route index element={<PageNotFound />}/>
            )} 
          </Routes>
        </AuthProvider>
      </ApolloProvider>
    </>
  );
}

export default App;
