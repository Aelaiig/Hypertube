import Vue from 'vue';
import VueApollo from 'vue-apollo';

import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { enableExperimentalFragmentVariables } from 'graphql-tag';

import App from './App.vue';
import router from './router';
import store from './store';


import 'element-ui/lib/theme-chalk/index.css';

Vue.config.silent = true;
Vue.use(ElementUI, { locale });

Vue.mixin({
  methods: {
    ErrorHandler(error) {
      if (error.message.split(':')[0] === 'Network error') {
        this.$message({
          type: 'error',
          message: 'The server is offline, please retry later.',
        });
        this.$router.push('/offline');
      }
      if (error.graphQLErrors.length > 0) {
        const errMessage = error.graphQLErrors[0].message;
        if (errMessage === 'jwt malformed' || errMessage === 'invalid signature') {
          this.$message({
            type: 'error',
            message: 'You must be connected to access this page',
          });
          localStorage.removeItem('user-token');
          this.$router.push('signin');
        } else {
          this.$message({
            type: 'error',
            message: errMessage,
          });
        }
      }
    },
  },
});

Vue.config.productionTip = false;

const uri = `${process.env.VUE_APP_URI}/graphql`;
const httpLink = new HttpLink({ uri });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // DELETE THIS CONSOLE LOG BEFORE CORRECTION
    // graphQLErrors.map(({ message, locations, path }) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
  }
  if (networkError) {
    // console.log(`[Network error]: ${networkError}`);
  }
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('user-token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    authMiddleware,
    httpLink,
  ]),
  cache: new InMemoryCache({
    dataIdFromObject: o => (o._id ? `${o.__typename}:${o._id}`: null),
  }),
  connectToDevTools: true,
});

const apolloProvider = new VueApollo({
  defaultClient: client,
  defaultOptions: {
    $loadingKey: 'loading',
  },
});

Vue.use(VueApollo);

new Vue({
  router,
  apolloProvider,
  store,
  render: h => h(App),
}).$mount('#app');
